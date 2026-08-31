"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Pitch frequencies (Hz) for root note (Sa)
const PITCHES = [
  { name: "A",  freq: 110.00 },
  { name: "A#", freq: 116.54 },
  { name: "B",  freq: 123.47 },
  { name: "C",  freq: 130.81 },
  { name: "C#", freq: 138.59 },
  { name: "D",  freq: 146.83 },
  { name: "D#", freq: 155.56 },
  { name: "E",  freq: 164.81 },
  { name: "F",  freq: 174.61 },
  { name: "F#", freq: 185.00 },
  { name: "G",  freq: 196.00 },
  { name: "G#", freq: 207.65 },
];

type TuningType = "Pa" | "Ma" | "Ni";

const STRING_LABELS = ["Pa / Ma / Ni", "Sa", "Sa", "Sa (low)"];

export function TanpuraPlayerSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState("C");
  const [tuning, setTuning] = useState<TuningType>("Pa");
  const [volume, setVolume] = useState(0.65);
  const [activeString, setActiveString] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const volumeNodeRef = useRef<GainNode | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const currentPluckRef = useRef(0);
  const TEMPO = 1.5; // seconds between plucks

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (volumeNodeRef.current && audioCtxRef.current) {
      volumeNodeRef.current.gain.linearRampToValueAtTime(
        volume, audioCtxRef.current.currentTime + 0.1
      );
    }
  }, [volume]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      volumeNodeRef.current = gain;
    }
  };

  const pluckString = (frequency: number, duration: number) => {
    const ctx = audioCtxRef.current;
    const master = volumeNodeRef.current;
    if (!ctx || !master) return;

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    voiceGain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.06);
    voiceGain.gain.exponentialRampToValueAtTime(0.10, ctx.currentTime + 0.5);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    voiceGain.connect(master);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(9000, ctx.currentTime);
    filter.Q.setValueAtTime(0.8, ctx.currentTime);
    filter.connect(voiceGain);

    const harmonics  = [1, 2, 3, 4, 5, 6];
    const gains      = [1.0, 0.4, 0.25, 0.12, 0.06, 0.02];
    const waveforms: OscillatorType[] = ["triangle","sawtooth","triangle","sawtooth","triangle","sawtooth"];

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      osc.type = waveforms[i];
      osc.frequency.setValueAtTime(frequency * h, ctx.currentTime);
      if (i > 0) osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);
      const hGain = ctx.createGain();
      hGain.gain.setValueAtTime(gains[i], ctx.currentTime);
      osc.connect(hGain);
      hGain.connect(filter);
      osc.start();
      setTimeout(() => { try { osc.stop(); osc.disconnect(); } catch {} }, duration * 1000 + 100);
    });

    setTimeout(() => { try { voiceGain.disconnect(); } catch {} }, duration * 1000 + 200);
  };

  const getFrequencies = () => {
    const root = PITCHES.find(p => p.name === selectedPitch)?.freq ?? 130.81;
    let str1 = root * 0.75;
    if (tuning === "Ma") str1 = (root * 4) / 3 / 2;
    if (tuning === "Ni") str1 = (root * 15) / 8 / 2;
    return [str1, root, root, root * 0.5];
  };

  const startPlaying = () => {
    initAudio();
    const ctx = audioCtxRef.current!;
    if (ctx.state === "suspended") ctx.resume();
    setIsPlaying(true);
    const freqs = getFrequencies();
    currentPluckRef.current = 0;
    const run = () => {
      const idx = currentPluckRef.current;
      setActiveString(idx);
      pluckString(freqs[idx], TEMPO * 1.8);
      currentPluckRef.current = (idx + 1) % 4;
    };
    run();
    intervalIdRef.current = setInterval(run, TEMPO * 1000);
  };

  const stopPlaying = () => {
    if (intervalIdRef.current) { clearInterval(intervalIdRef.current); intervalIdRef.current = null; }
    setIsPlaying(false);
    setActiveString(null);
  };

  // Restart when settings change while playing
  useEffect(() => {
    if (isPlaying) {
      stopPlaying();
      setTimeout(startPlaying, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPitch, tuning]);

  useEffect(() => () => { stopPlaying(); }, []);

  if (!mounted) return null;

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#800020]/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-kumkum mb-3 px-3 py-1 rounded-full bg-kumkum/10 border border-kumkum/20">
            🎵 Live Drone
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
            Tanpura Player
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Practise with the authentic Carnatic drone. Set your Sruthi and tune your strings.
          </p>
        </motion.div>

        {/* Main Player Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl border border-swara-gold/20 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Top golden band */}
          <div className="h-1.5 w-full bg-gradient-to-r from-kumkum via-swara-gold to-marigold" />

          <div className="p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-10 items-start">

              {/* LEFT — Tanpura visual + play */}
              <div className="flex flex-col items-center gap-6">

                {/* Tanpura SVG instrument */}
                <div className="relative">
                  <svg width="160" height="280" viewBox="0 0 160 280" fill="none" className="drop-shadow-xl">
                    {/* Body */}
                    <ellipse cx="80" cy="200" rx="58" ry="68" fill="url(#bodyGrad)" stroke="#c9973a" strokeWidth="2"/>
                    <ellipse cx="80" cy="200" rx="45" ry="55" fill="none" stroke="#c9973a" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5"/>
                    {/* Sound hole */}
                    <circle cx="80" cy="205" r="18" fill="#1a0a00" stroke="#c9973a" strokeWidth="1.5"/>
                    <circle cx="80" cy="205" r="12" fill="none" stroke="#e8b84b" strokeWidth="0.6" opacity="0.6"/>
                    {/* Neck */}
                    <rect x="70" y="80" width="20" height="125" rx="6" fill="url(#neckGrad)" stroke="#a0722a" strokeWidth="1.2"/>
                    {/* Frets */}
                    {[100, 115, 130, 145, 160, 175].map((y, i) => (
                      <line key={i} x1="70" y1={y} x2="90" y2={y} stroke="#d4af37" strokeWidth="1.2" opacity="0.7"/>
                    ))}
                    {/* Peg box */}
                    <rect x="66" y="42" width="28" height="42" rx="5" fill="url(#neckGrad)" stroke="#a0722a" strokeWidth="1.2"/>
                    {/* Pegs */}
                    {[55, 65, 73, 83].map((y, i) => (
                      <g key={i}>
                        <line x1={i % 2 === 0 ? 56 : 104} y1={y} x2={i % 2 === 0 ? 67 : 93} y2={y} stroke="#c9973a" strokeWidth="3" strokeLinecap="round"/>
                        <circle cx={i % 2 === 0 ? 54 : 106} cy={y} r="3.5" fill="#e8b84b" stroke="#a0722a" strokeWidth="1"/>
                      </g>
                    ))}
                    {/* Strings — 4 strings */}
                    {[74, 78, 82, 86].map((x, i) => (
                      <line
                        key={i}
                        x1={x} y1="62"
                        x2={x + (i === 0 ? -4 : i === 3 ? 4 : 0)} y2="258"
                        stroke={activeString === i ? "#f5d060" : "#d4af37"}
                        strokeWidth={activeString === i ? 2 : 1}
                        opacity={activeString === i ? 1 : 0.7}
                        className="transition-all duration-100"
                      />
                    ))}
                    {/* Gradients */}
                    <defs>
                      <radialGradient id="bodyGrad" cx="40%" cy="35%">
                        <stop offset="0%" stopColor="#a0522d"/>
                        <stop offset="60%" stopColor="#6b3a1f"/>
                        <stop offset="100%" stopColor="#3d1c0a"/>
                      </radialGradient>
                      <linearGradient id="neckGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#5c3317"/>
                        <stop offset="50%" stopColor="#8b4513"/>
                        <stop offset="100%" stopColor="#5c3317"/>
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* String vibration indicators */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {[0,1,2,3].map(i => (
                      <motion.div
                        key={i}
                        animate={activeString === i ? {
                          scaleY: [1, 1.8, 1],
                          backgroundColor: ["#d4af37", "#f5d060", "#d4af37"]
                        } : {}}
                        transition={{ duration: 0.3 }}
                        className="w-1.5 h-5 rounded-full bg-muted"
                        style={{ backgroundColor: activeString === i ? "#f5d060" : undefined }}
                      />
                    ))}
                  </div>
                </div>

                {/* BIG PLAY BUTTON */}
                <motion.button
                  onClick={isPlaying ? stopPlaying : startPlaying}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative w-48 h-14 rounded-2xl font-serif font-bold text-base tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl transition-all ${
                    isPlaying
                      ? "bg-kumkum text-white"
                      : "bg-gradient-to-r from-swara-gold to-marigold text-white"
                  }`}
                >
                  {isPlaying && (
                    <span className="absolute -inset-1 rounded-2xl bg-swara-gold/30 animate-ping pointer-events-none" />
                  )}
                  {isPlaying ? (
                    <>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <rect x="5" y="4" width="4" height="16" rx="1"/>
                        <rect x="15" y="4" width="4" height="16" rx="1"/>
                      </svg>
                      Stop
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Play Drone
                    </>
                  )}
                </motion.button>

                {/* Status */}
                <p className="text-sm text-muted-foreground text-center">
                  {isPlaying
                    ? <span className="text-swara-gold font-semibold animate-pulse">♪ Drone is playing...</span>
                    : "Press Play to start the drone"}
                </p>
              </div>

              {/* RIGHT — Controls */}
              <div className="flex flex-col gap-6">

                {/* Key / Sruthi */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Key — Sruthi (Sa)
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {PITCHES.map(p => (
                      <button
                        key={p.name}
                        onClick={() => setSelectedPitch(p.name)}
                        className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                          selectedPitch === p.name
                            ? "bg-kumkum text-white border-kumkum shadow-lg scale-105"
                            : "bg-background text-foreground border-border hover:border-swara-gold hover:text-swara-gold"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tuning */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    String 1 Tuning
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Pa", "Ma", "Ni"] as TuningType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setTuning(t)}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                          tuning === t
                            ? "bg-swara-gold/20 border-swara-gold text-swara-gold shadow"
                            : "bg-background border-border text-muted-foreground hover:border-swara-gold hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Volume</label>
                    <span className="text-xs font-semibold text-swara-gold">{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range" min={0} max={1} step={0.05} value={volume}
                    onChange={e => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-kumkum bg-muted"
                  />
                </div>

                {/* String labels */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Strings
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {STRING_LABELS.map((label, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                          activeString === i
                            ? "border-swara-gold bg-swara-gold/10"
                            : "border-border bg-muted/30"
                        }`}
                      >
                        <motion.div
                          animate={activeString === i ? { scale: [1, 1.4, 1] } : {}}
                          transition={{ duration: 0.3 }}
                          className={`w-2.5 h-2.5 rounded-full ${
                            activeString === i ? "bg-swara-gold" : "bg-muted-foreground/30"
                          }`}
                        />
                        <span className="text-xs font-semibold text-foreground">String {i + 1}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
