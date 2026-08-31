"use client";

import { useState, useEffect, useRef } from "react";

export interface SwaraMatch {
  name: string;
  swara: string;
  cents: number;
  centsOffset: number;
}

// 12-interval Swara definitions in Cents (Just Intonation - standard Carnatic shruti system)
const SWARAS = [
  { name: "Sa (Adhara Shadja)", swara: "S", cents: 0 },
  { name: "Suddha Rishabha", swara: "R1", cents: 90.22 },
  { name: "Chatusruti Rishabha / Suddha Gandhara", swara: "R2/G1", cents: 203.91 },
  { name: "Shatsruti Rishabha / Sadharana Gandhara", swara: "R3/G2", cents: 282.50 },
  { name: "Antara Gandhara", swara: "G3", cents: 386.31 },
  { name: "Suddha Madhyama", swara: "M1", cents: 498.04 },
  { name: "Prati Madhyama", swara: "M2", cents: 609.78 },
  { name: "Panchama", swara: "P", cents: 701.96 },
  { name: "Suddha Dhaivata", swara: "D1", cents: 792.18 },
  { name: "Chatusruti Dhaivata / Suddha Nishada", swara: "D2/N1", cents: 905.87 },
  { name: "Shatsruti Dhaivata / Kaisiki Nishada", swara: "D3/N2", cents: 984.45 },
  { name: "Kakali Nishada", swara: "N3", cents: 1088.27 },
  { name: "Tara Shadja (High Sa)", swara: "S'", cents: 1200 },
];

// Fallback pitch detection using autocorrelation with strict vocal range filtering
function autoCorrelate(buf: Float32Array, sampleRate: number): { pitch: number; clarity: number } {
  const SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.02) return { pitch: -1, clarity: 0 }; // Ignore background room noise

  let r1 = 0;
  let r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < thres) {
      r2 = SIZE - i;
      break;
    }
  }

  const buf2 = buf.slice(r1, r2);
  const c = new Float32Array(buf2.length);
  for (let i = 0; i < buf2.length; i++) {
    for (let j = 0; j < buf2.length - i; j++) {
      c[i] = c[i] + buf2[j] * buf2[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < buf2.length; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  if (T0 <= 0 || T0 >= buf2.length) return { pitch: -1, clarity: 0 };

  // Parabolic interpolation
  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a !== 0) T0 = T0 - b / (2 * a);

  const pitch = sampleRate / T0;
  const clarity = maxval / c[0];

  // Strictly filter singing vocal range: 95 Hz to 1400 Hz
  if (pitch >= 95 && pitch <= 1400 && clarity > 0.55) {
    return { pitch, clarity };
  }
  return { pitch: -1, clarity: 0 };
}

export function usePitchTracker(baseFreq: number = 130.81) {
  const [isTuning, setIsTuning] = useState(false);
  const [pitch, setPitch] = useState<number>(-1);
  const [clarity, setClarity] = useState<number>(0);
  const [matchedSwara, setMatchedSwara] = useState<SwaraMatch | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPlayingSynth, setIsPlayingSynth] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const synthOscRef = useRef<OscillatorNode | null>(null);

  const bufferSize = 2048;

  // Convert Hz to relative Carnatic Swaras based on base frequency (Adhara Shadja)
  const mapHzToSwara = (hz: number): SwaraMatch | null => {
    if (hz < 95 || hz > 1400) return null;

    const ratio = hz / baseFreq;
    let normalizedRatio = ratio;

    // Shift octaves to normalize between [0.94, 2.06] relative ratio
    while (normalizedRatio < 0.94) {
      normalizedRatio *= 2;
    }
    while (normalizedRatio > 2.06) {
      normalizedRatio /= 2;
    }

    // Calculate cents offset relative to base frequency
    const cents = 1200 * Math.log2(normalizedRatio);

    // Find closest Swara interval
    let closest = SWARAS[0];
    let minDiff = 1e9;

    SWARAS.forEach((s) => {
      const diff = Math.abs(cents - s.cents);
      if (diff < minDiff) {
        minDiff = diff;
        closest = s;
      }
    });

    const centsOffset = cents - closest.cents;

    return {
      name: closest.name,
      swara: closest.swara,
      cents: closest.cents,
      centsOffset: Math.round(centsOffset),
    };
  };

  // Start capturing audio from microphone (mobile & desktop compatible with High-Pass filter)
  const startTracking = async () => {
    setErrorMsg(null);
    try {
      // 1. Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // 2. Initialize AudioContext
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      audioCtxRef.current = ctx;

      const sourceNode = ctx.createMediaStreamSource(stream);

      // 3. High-Pass Filter (85 Hz cutoff) to filter out ambient room hum & low sub-bass noise
      const highPassFilter = ctx.createBiquadFilter();
      highPassFilter.type = "highpass";
      highPassFilter.frequency.setValueAtTime(85, ctx.currentTime);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = bufferSize;

      sourceNode.connect(highPassFilter);
      highPassFilter.connect(analyser);
      analyserRef.current = analyser;

      // 4. Attempt Web Worker initialization with fallback
      try {
        const worker = new Worker("/workers/pitchWorker.js");
        workerRef.current = worker;
        worker.onmessage = (e) => {
          const { pitch: detectedPitch, clarity: detectedClarity } = e.data;
          if (detectedPitch >= 95 && detectedPitch <= 1400 && detectedClarity > 0.55) {
            setPitch(detectedPitch);
            setClarity(detectedClarity);
            setMatchedSwara(mapHzToSwara(detectedPitch));
          } else {
            setPitch(-1);
            setMatchedSwara(null);
          }
        };
      } catch (workerErr) {
        console.warn("Web worker inline fallback active:", workerErr);
        workerRef.current = null;
      }

      setIsTuning(true);

      const pcmData = new Float32Array(bufferSize);

      // 5. Processing Loop
      const process = () => {
        if (analyserRef.current) {
          analyserRef.current.getFloatTimeDomainData(pcmData);

          if (workerRef.current) {
            workerRef.current.postMessage({
              buffer: pcmData,
              sampleRate: ctx.sampleRate,
              threshold: 0.15,
            });
          } else {
            const { pitch: detectedPitch, clarity: detectedClarity } = autoCorrelate(
              pcmData,
              ctx.sampleRate
            );
            if (detectedPitch >= 95 && detectedPitch <= 1400) {
              setPitch(detectedPitch);
              setClarity(detectedClarity);
              setMatchedSwara(mapHzToSwara(detectedPitch));
            } else {
              setPitch(-1);
              setMatchedSwara(null);
            }
          }
        }
        animationFrameIdRef.current = requestAnimationFrame(process);
      };

      process();
    } catch (err) {
      console.error("Microphone capture failed:", err);
      const isNotAllowed = err instanceof Error && err.name === "NotAllowedError";
      setErrorMsg(
        isNotAllowed
          ? "Microphone permission denied. Please enable mic access in your mobile or browser settings."
          : "Audio input device not available or blocked."
      );
      stopTracking();
    }
  };

  // Play synthetic Tanpura / Swara tone to test system audio detection
  const playTestTone = (freqMultiplier: number = 1.0) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContextClass();
      if (ctx.state === "suspended") ctx.resume();

      if (synthOscRef.current) {
        synthOscRef.current.stop();
        synthOscRef.current = null;
        setIsPlayingSynth(false);
        return;
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(baseFreq * freqMultiplier, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 3.0);
      synthOscRef.current = osc;
      setIsPlayingSynth(true);

      setTimeout(() => setIsPlayingSynth(false), 3000);
    } catch (e) {
      console.warn("Synth play error:", e);
    }
  };

  const stopTracking = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    setIsTuning(false);
    setPitch(-1);
    setMatchedSwara(null);
    setClarity(0);
  };

  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      if (workerRef.current) workerRef.current.terminate();
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return {
    isTuning,
    pitch,
    clarity,
    matchedSwara,
    errorMsg,
    isPlayingSynth,
    startTracking,
    stopTracking,
    playTestTone,
  };
}
