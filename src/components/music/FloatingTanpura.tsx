"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X, Volume2, Sparkles } from "lucide-react";

// Standard pitch frequencies in Hz for the Adhara Shadja (Root Note)
const PITCHES = [
  { name: "A", freq: 110.00 },
  { name: "A#", freq: 116.54 },
  { name: "B", freq: 123.47 },
  { name: "C", freq: 130.81 },
  { name: "C#", freq: 138.59 },
  { name: "D", freq: 146.83 },
  { name: "D#", freq: 155.56 },
  { name: "E", freq: 164.81 },
  { name: "F", freq: 174.61 },
  { name: "F#", freq: 185.00 },
  { name: "G", freq: 196.00 },
  { name: "G#", freq: 207.65 },
];

type TuningType = "Pa" | "Ma" | "Ni";
type InstrumentType = "Tanpura" | "Veena" | "Violin";

const INSTRUMENTS: InstrumentType[] = ["Tanpura", "Veena", "Violin"];

export function FloatingTanpura() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState("C");
  const [tuning, setTuning] = useState<TuningType>("Pa");
  const [instrument, setInstrument] = useState<InstrumentType>("Tanpura");
  const [tempo, setTempo] = useState(1.5); // seconds per string pluck
  const [volume, setVolume] = useState(0.6);
  const [activeString, setActiveString] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const volumeNodeRef = useRef<GainNode | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const currentPluckRef = useRef(0);

  // Initialize Audio Context on demand (user interaction)
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.connect(ctx.destination);
      
      audioCtxRef.current = ctx;
      volumeNodeRef.current = gainNode;
    }
  };

  // Adjust volume dynamically
  useEffect(() => {
    if (volumeNodeRef.current && audioCtxRef.current) {
      volumeNodeRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 0.1);
    }
  }, [volume]);

  // Stop sound synthesis
  const stopTanpura = (shouldSetState = true) => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    if (shouldSetState) {
      setIsPlaying(false);
    }
    setActiveString(null);
  };

  // Synthesize a single string pluck with Jawari (buzzing) harmonics
  const pluckString = (frequency: number, duration: number) => {
    const ctx = audioCtxRef.current;
    const masterGain = volumeNodeRef.current;
    if (!ctx || !masterGain) return;

    // Create a voice gain node to prevent popping
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    voiceGain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.08); // plucking attack
    voiceGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.6); // decay
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration); // release
    voiceGain.connect(masterGain);

    const oscillators: OscillatorNode[] = [];
    const filter = ctx.createBiquadFilter();
    let harmonics = [1, 2, 3, 4, 5, 6];
    let harmonicGains = [1.0, 0.4, 0.25, 0.12, 0.06, 0.02];
    let waveforms: OscillatorType[] = ["triangle", "sawtooth", "triangle", "sawtooth", "triangle", "sawtooth"];
    let filterFreq = 9000;
    let filterQ = 0.8;

    if (instrument === "Veena") {
      harmonics = [1, 2, 3, 4];
      harmonicGains = [1.0, 0.35, 0.18, 0.08];
      waveforms = ["sawtooth", "triangle", "sawtooth", "triangle"];
      filter.type = "lowpass";
      filterFreq = Math.max(frequency * 6, 1200);
      filterQ = 0.9;
    } else if (instrument === "Violin") {
      harmonics = [1, 2, 3, 4, 5];
      harmonicGains = [0.85, 0.35, 0.22, 0.12, 0.06];
      waveforms = ["sawtooth", "sawtooth", "triangle", "sawtooth", "triangle"];
      filter.type = "bandpass";
      filterFreq = Math.max(frequency * 2.4, 1400);
      filterQ = 1.2;
    } else {
      filter.type = "lowpass";
    }

    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
    filter.Q.setValueAtTime(filterQ, ctx.currentTime);
    filter.connect(voiceGain);

    harmonics.forEach((h, index) => {
      const osc = ctx.createOscillator();
      osc.type = waveforms[index] || "triangle";
      osc.frequency.setValueAtTime(frequency * h, ctx.currentTime);

      const hGain = ctx.createGain();
      hGain.gain.setValueAtTime(harmonicGains[index], ctx.currentTime);

      if (index > 0) {
        osc.detune.setValueAtTime((Math.random() - 0.5) * (instrument === "Tanpura" ? 8 : 12), ctx.currentTime);
      }

      osc.connect(hGain);
      hGain.connect(filter);
      osc.start();
      oscillators.push(osc);
    });

    // Cleanup oscillators after decay cycle complete
    setTimeout(() => {
      oscillators.forEach(o => {
        try {
          o.stop();
          o.disconnect();
        } catch {
          // ignore
        }
      });
      voiceGain.disconnect();
    }, duration * 1000 + 100);
  };

  // Schedule string pluck sequence: 1 -> 2 -> 3 -> 4
  const startTanpura = (shouldSetState = true) => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (shouldSetState) {
      setIsPlaying(true);
    }
    const rootItem = PITCHES.find(p => p.name === selectedPitch) || PITCHES[3]; // Default to C
    const rootFreq = rootItem.freq;

    // Define frequencies for 4 strings:
    // String 1: Pa (0.75 * root) or Ma (0.667 * root) or Ni (0.9375 * root)
    // String 2: Sa middle (1.0 * root)
    // String 3: Sa middle (1.0 * root)
    // String 4: Sa low (0.5 * root)
    let str1Freq = rootFreq * 0.75;
    if (tuning === "Ma") str1Freq = rootFreq * (4 / 3) / 2; // Lower octave Ma
    if (tuning === "Ni") str1Freq = rootFreq * (15 / 8) / 2; // Lower octave Ni

    const frequencies = [
      str1Freq,
      rootFreq,
      rootFreq,
      rootFreq * 0.5
    ];

    currentPluckRef.current = 0;
    const runSequence = () => {
      const idx = currentPluckRef.current;
      setActiveString(idx);
      pluckString(frequencies[idx], tempo * 1.8);
      currentPluckRef.current = (idx + 1) % 4;
    };

    // Execute first pluck immediately
    runSequence();

    // Schedule subsequent plucks
    intervalIdRef.current = setInterval(runSequence, tempo * 1000);
  };

  const handleToggle = () => {
    if (isPlaying) {
      stopTanpura();
    } else {
      startTanpura();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        stopTanpura(false);
        startTanpura(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPitch, tuning, tempo, isPlaying, instrument]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end overflow-visible">
      {/* Expanded Controller Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[340px] rounded-2xl border border-swara-gold/25 bg-card/90 p-5 shadow-2xl backdrop-blur-xl dark:bg-card/95 traditional-glow"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-full bg-kumkum/15 text-kumkum">
                  <Sparkles className="size-3.5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-kumkum leading-none">Drone Settings</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Adhara Shadja background drone</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* String Pluck Indicators */}
            <div className="flex justify-center gap-1.5 mb-4 py-1.5 bg-kumkum/5 rounded-lg border border-kumkum/5">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-6 rounded-full transition-all duration-300 ${
                    activeString === idx
                      ? "bg-swara-gold scale-y-125 shadow-[0_0_8px_var(--color-swara-gold)]"
                      : isPlaying
                      ? "bg-kumkum/20"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="space-y-3.5">
              {/* Key Pitch Selection */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Key (Sruthi)
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {PITCHES.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => setSelectedPitch(p.name)}
                      className={`py-1 rounded text-xs font-semibold border transition-all ${
                        selectedPitch === p.name
                          ? "bg-kumkum text-white border-kumkum shadow-sm"
                          : "bg-background text-foreground border-border hover:border-swara-gold"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instrument Selection */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Instrument
                </label>
                <div className="flex bg-muted rounded-lg border border-border p-0.5">
                  {INSTRUMENTS.map((item) => (
                    <button
                      key={item}
                      onClick={() => setInstrument(item)}
                      className={`flex-1 py-1 rounded text-xs font-medium transition-all ${
                        instrument === item
                          ? "bg-background text-kumkum font-bold shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {/* Tuning String 1 */}
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Tuning
                  </label>
                  <div className="flex bg-muted rounded-lg border border-border p-0.5">
                    {(["Pa", "Ma", "Ni"] as TuningType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTuning(t)}
                        className={`flex-1 py-1 rounded text-xs font-medium transition-all ${
                          tuning === t
                            ? "bg-background text-kumkum font-bold shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pluck Tempo */}
                <div className="w-1/3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Interval
                  </label>
                  <select
                    value={tempo}
                    onChange={(e) => setTempo(parseFloat(e.target.value))}
                    className="w-full bg-muted rounded-lg border border-border p-1 text-xs font-medium text-foreground focus:outline-none focus:border-swara-gold"
                  >
                    <option value="1.0">Fast (1s)</option>
                    <option value="1.5">Med (1.5s)</option>
                    <option value="2.0">Slow (2s)</option>
                  </select>
                </div>
              </div>

              {/* Volume Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Volume</label>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="size-3.5 text-muted-foreground" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-kumkum"
                  />
                </div>
              </div>

              {/* Play / Pause Toggle */}
              <button
                onClick={handleToggle}
                className={`mt-1.5 w-full py-2.5 rounded-xl font-serif text-xs font-bold tracking-wider transition-all flex items-center justify-center space-x-2 ${
                  isPlaying
                    ? "bg-kumkum hover:bg-kumkum-light text-white shadow-md"
                    : "bg-gradient-to-r from-swara-gold to-marigold hover:from-marigold hover:to-swara-gold text-white shadow-lg"
                }`}
              >
                {isPlaying ? (
                  <>
                    <svg className="w-3.5 h-3.5 fill-current animate-pulse" viewBox="0 0 24 24">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                    <span>PAUSE DRONE</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>PLAY {instrument.toUpperCase()}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative size-14 rounded-full flex items-center justify-center border border-swara-gold/30 shadow-2xl transition-all outline-none overflow-visible ${
          isPlaying
            ? "bg-kumkum text-white border-swara-gold/50"
            : "bg-gradient-to-r from-swara-gold to-marigold text-white"
        }`}
      >
        {/* Animated Glow Rings when Playing */}
        {isPlaying && (
          <>
            <span className="absolute -inset-2 rounded-full bg-swara-gold/25 animate-ping pointer-events-none" style={{ zIndex: -1 }} />
            <span className="absolute -inset-4 rounded-full bg-kumkum/10 animate-pulse pointer-events-none" style={{ zIndex: -1 }} />
          </>
        )}
        
        {/* Floating notes when playing */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute text-[10px] text-swara-gold animate-[bounce_2s_infinite] left-1 top-[-8px]">♩</span>
            <span className="absolute text-[12px] text-swara-gold-light animate-[bounce_2.5s_infinite_0.5s] right-2 top-[-10px]">♪</span>
          </div>
        )}

        <Music className={`size-6 ${isPlaying ? "animate-pulse text-swara-gold" : "text-white"}`} />
      </motion.button>
    </div>
  );
}
