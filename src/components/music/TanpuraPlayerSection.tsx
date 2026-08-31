"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Root note frequencies (Hz) — same as real Tanpura apps
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

// Tanpura string labels shown in the app
const STRING_INFO = [
  { label: "Pa",   desc: "Panchamam"   },
  { label: "Sa",   desc: "Madhyam Sa"  },
  { label: "Sa",   desc: "Madhyam Sa"  },
  { label: "Sa̱",  desc: "Mandra Sa"   },
];

// ──────────────────────────────────────────────
// Core Tanpura synthesis — authentic jawari tone
// Each pluck = fundamental + rich harmonic stack
// with natural sustain + exponential decay
// ──────────────────────────────────────────────
function synthesizePluck(
  ctx: AudioContext,
  master: GainNode,
  frequency: number,
  sustainSecs: number
) {
  const now = ctx.currentTime;

  // Voice gain envelope (attack → hold → decay)
  const voice = ctx.createGain();
  voice.gain.setValueAtTime(0.0001, now);
  voice.gain.exponentialRampToValueAtTime(0.9,   now + 0.04);  // fast attack
  voice.gain.exponentialRampToValueAtTime(0.4,   now + 0.25);  // settle
  voice.gain.exponentialRampToValueAtTime(0.18,  now + 1.0);   // sustain decay
  voice.gain.exponentialRampToValueAtTime(0.001, now + sustainSecs); // release
  voice.connect(master);

  // Bandpass filter for body resonance (simulates tanpura gourd)
  const body = ctx.createBiquadFilter();
  body.type = "bandpass";
  body.frequency.setValueAtTime(frequency * 2.2, now);
  body.Q.setValueAtTime(0.6, now);
  body.connect(voice);

  // Low-pass for warmth
  const warmth = ctx.createBiquadFilter();
  warmth.type = "lowpass";
  warmth.frequency.setValueAtTime(frequency * 14, now);
  warmth.Q.setValueAtTime(0.4, now);
  warmth.connect(body);

  // Jawari convolver — adds the characteristic buzz
  const jawari = ctx.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1;
    curve[i] = x + 0.06 * Math.sin(x * Math.PI * 12); // subtle harmonic distortion
  }
  jawari.curve = curve;
  jawari.oversample = "4x";
  jawari.connect(warmth);

  // Harmonic stack — tanpura has very rich overtones
  // Fundamental + partials with realistic amplitudes
  const harmonics = [
    { mult: 1,    gain: 0.85, detune: 0   },
    { mult: 2,    gain: 0.50, detune: 1.5 },
    { mult: 3,    gain: 0.32, detune: 2   },
    { mult: 4,    gain: 0.20, detune: -1  },
    { mult: 5,    gain: 0.13, detune: 2.5 },
    { mult: 6,    gain: 0.08, detune: -2  },
    { mult: 7,    gain: 0.05, detune: 3   },
    { mult: 8,    gain: 0.03, detune: -1.5},
    { mult: 0.5,  gain: 0.28, detune: 0   }, // sub-octave — tanpura warmth
  ];

  const oscs: OscillatorNode[] = [];

  harmonics.forEach(({ mult, gain: g, detune }) => {
    const osc = ctx.createOscillator();
    osc.type = mult === 1 || mult === 0.5 ? "triangle" : "sawtooth";
    osc.frequency.setValueAtTime(frequency * mult, now);
    osc.detune.setValueAtTime(detune + (Math.random() - 0.5) * 2, now); // micro-pitch variation

    const hg = ctx.createGain();
    hg.gain.setValueAtTime(g, now);

    // Each harmonic decays at slightly different rate — natural sound
    hg.gain.exponentialRampToValueAtTime(g * 0.3, now + sustainSecs * 0.6);
    hg.gain.exponentialRampToValueAtTime(0.0001,  now + sustainSecs);

    osc.connect(hg);
    hg.connect(jawari);
    osc.start(now);
    oscs.push(osc);
  });

  // Clean up after note ends
  const cleanupAt = (sustainSecs + 0.3) * 1000;
  setTimeout(() => {
    oscs.forEach(o => { try { o.stop(); o.disconnect(); } catch {} });
    try { voice.disconnect(); body.disconnect(); warmth.disconnect(); jawari.disconnect(); } catch {}
  }, cleanupAt);
}

export function TanpuraPlayerSection() {
  const [mounted,       setMounted]       = useState(false);
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [selectedPitch, setSelectedPitch] = useState("C");
  const [tuning,        setTuning]        = useState<TuningType>("Pa");
  const [volume,        setVolume]        = useState(0.72);
  const [tempo,         setTempo]         = useState(2.0); // seconds per string
  const [activeString,  setActiveString]  = useState<number | null>(null);
  const [pulseCount,    setPulseCount]    = useState(0);

  const audioCtxRef    = useRef<AudioContext | null>(null);
  const masterGainRef  = useRef<GainNode | null>(null);
  const schedulerRef   = useRef<NodeJS.Timeout | null>(null);
  const currentStrRef  = useRef(0);
  const isPlayingRef   = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  // Volume changes apply immediately
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(
        volume, audioCtxRef.current.currentTime + 0.05
      );
    }
  }, [volume]);

  const getStringFrequencies = useCallback(() => {
    const root = PITCHES.find(p => p.name === selectedPitch)?.freq ?? 130.81;
    let str1 = root * 0.75; // Pa (perfect 5th below)
    if (tuning === "Ma") str1 = (root * 4) / 6;   // Ma (perfect 4th below)
    if (tuning === "Ni") str1 = (root * 15) / 16;  // Ni (major 7th below)
    return [
      str1,         // String 1: Pa / Ma / Ni
      root,         // String 2: Sa (middle)
      root,         // String 3: Sa (middle)
      root * 0.5,   // String 4: Sa (lower octave)
    ];
  }, [selectedPitch, tuning]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();

      // Compressor to prevent clipping — real tanpura apps do this
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-18, ctx.currentTime);
      comp.knee.setValueAtTime(6, ctx.currentTime);
      comp.ratio.setValueAtTime(3, ctx.currentTime);
      comp.attack.setValueAtTime(0.005, ctx.currentTime);
      comp.release.setValueAtTime(0.25, ctx.currentTime);
      comp.connect(ctx.destination);

      const master = ctx.createGain();
      master.gain.setValueAtTime(volume, ctx.currentTime);
      master.connect(comp);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;
    }
  };

  const stopDrone = useCallback(() => {
    if (schedulerRef.current) {
      clearInterval(schedulerRef.current);
      schedulerRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    setActiveString(null);
  }, []);

  const startDrone = useCallback(() => {
    initAudio();
    const ctx = audioCtxRef.current!;
    if (ctx.state === "suspended") ctx.resume();

    isPlayingRef.current = true;
    setIsPlaying(true);
    currentStrRef.current = 0;

    const runCycle = () => {
      if (!isPlayingRef.current) return;
      const freqs = getStringFrequencies();
      const idx = currentStrRef.current;
      setActiveString(idx);
      setPulseCount(n => n + 1);
      // Each string sustains for 2× the tempo interval so notes overlap naturally
      synthesizePluck(ctx, masterGainRef.current!, freqs[idx], tempo * 2.2);
      currentStrRef.current = (idx + 1) % 4;
    };

    runCycle(); // immediate first pluck
    schedulerRef.current = setInterval(runCycle, tempo * 1000);
  }, [getStringFrequencies, tempo]);

  // Restart seamlessly when pitch/tuning/tempo changes mid-play
  useEffect(() => {
    if (isPlayingRef.current) {
      stopDrone();
      setTimeout(startDrone, 80);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPitch, tuning, tempo]);

  useEffect(() => () => { stopDrone(); }, [stopDrone]);

  if (!mounted) return null;

  return (
    <section className="relative py-24 px-4">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#800020]/5 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto">

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-kumkum mb-4 px-4 py-1.5 rounded-full bg-kumkum/10 border border-kumkum/20">
            <span className="relative flex h-2 w-2">
              {isPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kumkum opacity-75" />}
              <span className={`relative rounded-full h-2 w-2 ${isPlaying ? "bg-kumkum" : "bg-kumkum/40"}`} />
            </span>
            Live Carnatic Drone
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
            Tanpura Player
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Authentic Carnatic drone with real Jawari harmonics — just like a Tanpura Drone app.
          </p>
        </motion.div>

        {/* ── Main Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-swara-gold/25 bg-card/85 backdrop-blur-2xl shadow-2xl overflow-hidden"
        >
          {/* Gold accent bar */}
          <div className="h-1 bg-gradient-to-r from-kumkum via-swara-gold to-marigold" />

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-[220px_1fr] gap-12 items-start">

              {/* ── LEFT: Tanpura SVG + Play Button ── */}
              <div className="flex flex-col items-center gap-6">

                {/* Instrument illustration */}
                <div className="relative select-none">
                  <svg width="150" height="300" viewBox="0 0 150 300" className="drop-shadow-2xl">
                    <defs>
                      <radialGradient id="tBody" cx="38%" cy="30%">
                        <stop offset="0%"   stopColor="#c8885a"/>
                        <stop offset="55%"  stopColor="#7a3e10"/>
                        <stop offset="100%" stopColor="#3b1a06"/>
                      </radialGradient>
                      <radialGradient id="tNeck" cx="30%" cy="0%">
                        <stop offset="0%"   stopColor="#9c5a1e"/>
                        <stop offset="100%" stopColor="#4a2008"/>
                      </radialGradient>
                      <linearGradient id="tGold" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%"   stopColor="#c9973a"/>
                        <stop offset="50%"  stopColor="#f0c050"/>
                        <stop offset="100%" stopColor="#c9973a"/>
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>

                    {/* Body — gourd */}
                    <ellipse cx="75" cy="218" rx="54" ry="66" fill="url(#tBody)" stroke="#c9973a" strokeWidth="1.5"/>
                    {/* Body wood grain lines */}
                    <ellipse cx="75" cy="218" rx="40" ry="50" fill="none" stroke="#c9973a" strokeWidth="0.5" opacity="0.3"/>
                    <ellipse cx="75" cy="218" rx="26" ry="34" fill="none" stroke="#c9973a" strokeWidth="0.5" opacity="0.2"/>
                    {/* Sound hole */}
                    <circle cx="75" cy="222" r="20" fill="#1c0a00" stroke="url(#tGold)" strokeWidth="1.5"/>
                    <circle cx="75" cy="222" r="14" fill="none" stroke="#e8b84b" strokeWidth="0.6" opacity="0.5"/>
                    <circle cx="75" cy="222" r="7"  fill="none" stroke="#e8b84b" strokeWidth="0.4" opacity="0.3"/>

                    {/* Neck */}
                    <rect x="66" y="80" width="18" height="145" rx="7" fill="url(#tNeck)" stroke="#a0722a" strokeWidth="1"/>
                    {/* Frets */}
                    {[95,108,120,132,144,155,166].map((y,i) => (
                      <rect key={i} x="66" y={y} width="18" height="1.5" rx="0.5" fill="url(#tGold)" opacity="0.6"/>
                    ))}

                    {/* Peg box */}
                    <rect x="62" y="36" width="26" height="48" rx="6" fill="url(#tNeck)" stroke="#a0722a" strokeWidth="1"/>
                    {/* Peg box decoration */}
                    <rect x="65" y="39" width="20" height="42" rx="4" fill="none" stroke="#c9973a" strokeWidth="0.5" opacity="0.4"/>

                    {/* Tuning pegs — 4 pegs alternating sides */}
                    {[
                      { cx: 55, cy: 50,  side: "left"  },
                      { cx: 95, cy: 58,  side: "right" },
                      { cx: 55, cy: 67,  side: "left"  },
                      { cx: 95, cy: 75,  side: "right" },
                    ].map((peg, i) => (
                      <g key={i}>
                        <line
                          x1={peg.side === "left" ? 55 : 95} y1={peg.cy}
                          x2={peg.side === "left" ? 66 : 84} y2={peg.cy}
                          stroke="url(#tGold)" strokeWidth="3.5" strokeLinecap="round"
                        />
                        <circle cx={peg.cx} cy={peg.cy} r="5" fill="#d4af37" stroke="#a07820" strokeWidth="1"/>
                        <circle cx={peg.cx} cy={peg.cy} r="2.5" fill="#f0c050"/>
                      </g>
                    ))}

                    {/* 4 Strings — vibrate when active */}
                    {[69, 73, 77, 81].map((x, i) => {
                      const active = activeString === i;
                      return (
                        <g key={i}>
                          {/* String shadow */}
                          <line x1={x+0.5} y1="52" x2={x+0.5} y2="280"
                            stroke="#000" strokeWidth={0.5} opacity={0.3}/>
                          {/* String itself */}
                          <motion.line
                            x1={x} y1="52" x2={x} y2="280"
                            stroke={active ? "#f5d060" : "#c9a83a"}
                            strokeWidth={active ? 2.2 : 1.2}
                            opacity={active ? 1 : 0.65}
                            animate={active ? {
                              x1: [x, x + 2.5, x - 2.5, x + 1.5, x - 1, x],
                              x2: [x, x - 1.5, x + 1.5, x - 0.5, x + 0.5, x],
                            } : {}}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            filter={active ? "url(#glow)" : undefined}
                          />
                          {/* Active string glow */}
                          {active && (
                            <line x1={x} y1="52" x2={x} y2="280"
                              stroke="#f5d060" strokeWidth="5" opacity={0.18}
                              style={{ filter: "blur(3px)" }}/>
                          )}
                        </g>
                      );
                    })}

                    {/* Bridge at bottom */}
                    <rect x="62" y="272" width="26" height="5" rx="2.5" fill="url(#tGold)" opacity="0.8"/>
                    {/* Nut at top */}
                    <rect x="65" y="50" width="20" height="3" rx="1.5" fill="url(#tGold)" opacity="0.7"/>
                  </svg>

                  {/* Ripple rings when playing */}
                  <AnimatePresence>
                    {isPlaying && (
                      <>
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={`${pulseCount}-${i}`}
                            initial={{ scale: 0.6, opacity: 0.6 }}
                            animate={{ scale: 2.2, opacity: 0 }}
                            transition={{ duration: 1.8, delay: i * 0.35, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full border border-swara-gold/40 pointer-events-none"
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── BIG PLAY / STOP BUTTON ── */}
                <motion.button
                  onClick={isPlaying ? stopDrone : startDrone}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative w-44 h-14 rounded-2xl font-serif font-bold text-base tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl transition-all duration-200 ${
                    isPlaying
                      ? "bg-kumkum hover:bg-kumkum/90 text-white"
                      : "bg-gradient-to-r from-swara-gold to-marigold hover:from-marigold hover:to-swara-gold text-white"
                  }`}
                >
                  {isPlaying && (
                    <span className="absolute -inset-px rounded-2xl border-2 border-swara-gold/60 animate-pulse pointer-events-none" />
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
                      Play
                    </>
                  )}
                </motion.button>

                {/* Live status */}
                <p className="text-sm text-center h-5">
                  {isPlaying
                    ? <span className="text-swara-gold font-semibold animate-pulse">♪ Sa Pa Sa Sa — playing</span>
                    : <span className="text-muted-foreground">Tap Play to start drone</span>
                  }
                </p>
              </div>

              {/* ── RIGHT: Controls ── */}
              <div className="flex flex-col gap-7">

                {/* String pluck visualiser */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    String Sequence
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {STRING_INFO.map((s, i) => (
                      <motion.div
                        key={i}
                        animate={activeString === i ? {
                          borderColor: ["#d4af37","#f5d060","#d4af37"],
                          backgroundColor: ["rgba(212,175,55,0.08)","rgba(245,208,96,0.18)","rgba(212,175,55,0.08)"],
                        } : {}}
                        transition={{ duration: 0.5 }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors ${
                          activeString === i
                            ? "border-swara-gold bg-swara-gold/10"
                            : "border-border bg-muted/20"
                        }`}
                      >
                        {/* Pluck indicator */}
                        <motion.div
                          animate={activeString === i ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`w-3 h-3 rounded-full ${
                            activeString === i ? "bg-swara-gold shadow-[0_0_8px_#d4af37]" : "bg-muted-foreground/25"
                          }`}
                        />
                        <span className={`font-serif text-lg font-bold leading-none ${
                          activeString === i ? "text-swara-gold" : "text-muted-foreground"
                        }`}>
                          {s.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground text-center leading-tight">{s.desc}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Key selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Sruthi — Root Key (Sa)
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {PITCHES.map(p => (
                      <button
                        key={p.name}
                        onClick={() => setSelectedPitch(p.name)}
                        className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                          selectedPitch === p.name
                            ? "bg-kumkum text-white border-kumkum shadow-md scale-105"
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
                    {(["Pa","Ma","Ni"] as TuningType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setTuning(t)}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                          tuning === t
                            ? "bg-swara-gold/15 border-swara-gold text-swara-gold shadow"
                            : "bg-background border-border text-muted-foreground hover:border-swara-gold/60 hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speed + Volume row */}
                <div className="grid grid-cols-2 gap-5">
                  {/* Speed */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Speed</label>
                      <span className="text-xs text-swara-gold font-semibold">{tempo}s</span>
                    </div>
                    <input
                      type="range" min={1.0} max={3.5} step={0.25} value={tempo}
                      onChange={e => setTempo(parseFloat(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-kumkum bg-muted"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Fast</span><span>Slow</span>
                    </div>
                  </div>

                  {/* Volume */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Volume</label>
                      <span className="text-xs text-swara-gold font-semibold">{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range" min={0} max={1} step={0.05} value={volume}
                      onChange={e => setVolume(parseFloat(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-kumkum bg-muted"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Min</span><span>Max</span>
                    </div>
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
