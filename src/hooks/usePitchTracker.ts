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

export function usePitchTracker(baseFreq: number = 130.81) {
  const [isTuning, setIsTuning] = useState(false);
  const [pitch, setPitch] = useState<number>(-1);
  const [clarity, setClarity] = useState<number>(0);
  const [matchedSwara, setMatchedSwara] = useState<SwaraMatch | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const bufferSize = 2048;

  // Convert Hz to relative Carnatic Swaras based on base frequency (Adhara Shadja)
  const mapHzToSwara = (hz: number): SwaraMatch | null => {
    if (hz <= 0) return null;

    const ratio = hz / baseFreq;
    let normalizedRatio = ratio;

    // Shift octaves to normalize between [0.95, 2.05] relative ratio
    while (normalizedRatio < 0.94) {
      normalizedRatio *= 2;
    }
    while (normalizedRatio > 2.06) {
      normalizedRatio /= 2;
    }

    // Calculate cents offset relative to the base frequency
    const cents = 1200 * Math.log2(normalizedRatio);

    // Find the closest Swara interval
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

  // Start capturing audio from microphone
  const startTracking = async () => {
    setErrorMsg(null);
    try {
      // 1. Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      // 2. Initialize AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const sourceNode = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = bufferSize;
      sourceNode.connect(analyser);
      analyserRef.current = analyser;

      // 3. Initialize Web Worker
      const worker = new Worker("/workers/pitchWorker.js");
      workerRef.current = worker;

      const pcmData = new Float32Array(bufferSize);

      // Listen for background calculations from worker
      worker.onmessage = (e) => {
        const { pitch: detectedPitch, clarity: detectedClarity } = e.data;
        if (detectedPitch > 0 && detectedClarity > 0.6) {
          setPitch(detectedPitch);
          setClarity(detectedClarity);
          const swara = mapHzToSwara(detectedPitch);
          setMatchedSwara(swara);
        } else {
          setPitch(-1);
          setMatchedSwara(null);
        }
      };

      setIsTuning(true);

      // 4. Processing Loop
      const process = () => {
        if (analyserRef.current && workerRef.current) {
          analyserRef.current.getFloatTimeDomainData(pcmData);
          
          // Send Float32 PCM chunk to worker thread
          workerRef.current.postMessage({
            buffer: pcmData,
            sampleRate: ctx.sampleRate,
            threshold: 0.15,
          });
        }
        animationFrameIdRef.current = requestAnimationFrame(process);
      };

      process();
    } catch (err: any) {
      console.error("Microphone capture failed:", err);
      setErrorMsg(
        err.name === "NotAllowedError"
          ? "Microphone access denied. Please grant permissions to track pitch."
          : "Could not initialize microphone audio."
      );
      stopTracking();
    }
  };

  const stopTracking = () => {
    // Stop layout loops
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    // Terminate worker
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    // Stop all media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    setIsTuning(false);
    setPitch(-1);
    setMatchedSwara(null);
    setClarity(0);
  };

  // Cleanup on unmount
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
    startTracking,
    stopTracking,
  };
}
