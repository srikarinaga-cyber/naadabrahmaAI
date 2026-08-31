"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Square, Volume2, Sliders, Music, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Base pitch names and fundamental frequencies (Hz)
const BASE_PITCHES = [
  { name: "C3 (1.0 Kattai)", freq: 130.81 },
  { name: "C#3 (1.5 Kattai)", freq: 138.59 },
  { name: "D3 (2.0 Kattai)", freq: 146.83 },
  { name: "D#3 (2.5 Kattai)", freq: 155.56 },
  { name: "E3 (3.0 Kattai)", freq: 164.81 },
  { name: "F3 (4.0 Kattai)", freq: 174.61 },
  { name: "F#3 (4.5 Kattai)", freq: 185.0 },
  { name: "G3 (5.0 Kattai)", freq: 196.0 },
  { name: "G#3 (5.5 Kattai)", freq: 207.65 },
  { name: "A3 (6.0 Kattai)", freq: 220.0 },
  { name: "A#3 (6.5 Kattai)", freq: 233.08 },
  { name: "B3 (7.0 Kattai)", freq: 246.94 },
];

export function TanpuraTablaPlayer() {
  const [selectedPitch, setSelectedPitch] = useState(BASE_PITCHES[0]);
  const [droneTuning, setDroneTuning] = useState<"Pa" | "Ma" | "Ni">("Pa");
  
  // Audio state
  const [isTanpura1Active, setIsTanpura1Active] = useState(false);
  const [isTanpura2Active, setIsTanpura2Active] = useState(false);
  const [isTablaActive, setIsTablaActive] = useState(false);

  // Volume Controls
  const [tanpura1Vol, setTanpura1Vol] = useState(0.4);
  const [tanpura2Vol, setTanpura2Vol] = useState(0.3);
  const [tablaVol, setTablaVol] = useState(0.5);
  const [bpm, setBpm] = useState(80);

  // Current beat step for Tabla visualizer
  const [currentBeatStep, setCurrentBeatStep] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const tanpura1TimerRef = useRef<NodeJS.Timeout | null>(null);
  const tanpura2TimerRef = useRef<NodeJS.Timeout | null>(null);
  const tablaTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getAudioContext = () => {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = audioCtxRef.current || new AudioContextClass();
    if (ctx.state === "suspended") ctx.resume();
    audioCtxRef.current = ctx;
    return ctx;
  };

  // Pluck a single Tanpura string with metallic Jivari acoustic resonance
  const pluckTanpuraString = (
    baseHz: number,
    stringRatio: number,
    volume: number,
    detuneCents: number = 0
  ) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const freq = baseHz * stringRatio;

      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      // Multi-harmonic additive synthesis for Jivari buzz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();

      osc1.type = "sawtooth";
      osc2.type = "triangle";
      osc3.type = "sine";

      osc1.frequency.setValueAtTime(freq, now);
      osc1.detune.setValueAtTime(detuneCents, now);

      osc2.frequency.setValueAtTime(freq * 2, now);
      osc3.frequency.setValueAtTime(freq * 3.01, now);

      // Jivari Metallic Buzz Filter
      const jivariFilter = ctx.createBiquadFilter();
      jivariFilter.type = "bandpass";
      jivariFilter.frequency.setValueAtTime(freq * 3, now);
      jivariFilter.Q.setValueAtTime(3.0, now);

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(volume * 0.35, now + 0.04); // Pluck attack
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8); // Long string decay

      osc1.connect(jivariFilter);
      osc2.connect(jivariFilter);
      osc3.connect(jivariFilter);
      jivariFilter.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + 2.8);
      osc2.stop(now + 2.8);
      osc3.stop(now + 2.8);
    } catch (e) {
      console.warn("Tanpura pluck error:", e);
    }
  };

  // Tanpura 1 Loop (Pa - Sa - Sa - Sa_low continuous strumming)
  useEffect(() => {
    if (isTanpura1Active) {
      let step = 0;
      const firstRatio = droneTuning === "Pa" ? 1.5 : droneTuning === "Ma" ? 1.3333 : 1.875;

      const strum = () => {
        const base = selectedPitch.freq;
        if (step === 0) pluckTanpuraString(base, firstRatio, tanpura1Vol, -2);
        else if (step === 1) pluckTanpuraString(base, 2.0, tanpura1Vol, 1);
        else if (step === 2) pluckTanpuraString(base, 2.0, tanpura1Vol, 0);
        else if (step === 3) pluckTanpuraString(base, 1.0, tanpura1Vol, -3);

        step = (step + 1) % 4;
      };

      strum();
      tanpura1TimerRef.current = setInterval(strum, 700);
    } else if (tanpura1TimerRef.current) {
      clearInterval(tanpura1TimerRef.current);
    }
    return () => {
      if (tanpura1TimerRef.current) clearInterval(tanpura1TimerRef.current);
    };
  }, [isTanpura1Active, selectedPitch, droneTuning, tanpura1Vol]);

  // Tanpura 2 Stereo Accompaniment Loop (Sa - Sa - Pa - Sa_low)
  useEffect(() => {
    if (isTanpura2Active) {
      let step = 0;
      const firstRatio = droneTuning === "Pa" ? 1.5 : droneTuning === "Ma" ? 1.3333 : 1.875;

      const strum2 = () => {
        const base = selectedPitch.freq;
        if (step === 0) pluckTanpuraString(base, 2.0, tanpura2Vol, 3);
        else if (step === 1) pluckTanpuraString(base, 2.0, tanpura2Vol, -1);
        else if (step === 2) pluckTanpuraString(base, firstRatio, tanpura2Vol, 2);
        else if (step === 3) pluckTanpuraString(base, 1.0, tanpura2Vol, 1);

        step = (step + 1) % 4;
      };

      // Offset by 350ms for natural stereo interplay
      const timeout = setTimeout(() => {
        strum2();
        tanpura2TimerRef.current = setInterval(strum2, 700);
      }, 350);

      return () => {
        clearTimeout(timeout);
        if (tanpura2TimerRef.current) clearInterval(tanpura2TimerRef.current);
      };
    } else if (tanpura2TimerRef.current) {
      clearInterval(tanpura2TimerRef.current);
    }
  }, [isTanpura2Active, selectedPitch, droneTuning, tanpura2Vol]);

  // Tabla / Mridangam Rhythm Pulse Generator
  const playTablaBeat = (isBayyanDha: boolean, isSyahiTin: boolean) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const baseHz = selectedPitch.freq;

      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      // Dayan (Treble drum head)
      const dayanOsc = ctx.createOscillator();
      dayanOsc.type = "sine";
      dayanOsc.frequency.setValueAtTime(isSyahiTin ? baseHz * 2.2 : baseHz * 1.5, now);
      dayanOsc.frequency.exponentialRampToValueAtTime(baseHz, now + 0.15);

      const dayanGain = ctx.createGain();
      dayanGain.gain.setValueAtTime(tablaVol * 0.4, now);
      dayanGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      dayanOsc.connect(dayanGain);
      dayanGain.connect(masterGain);
      dayanOsc.start(now);
      dayanOsc.stop(now + 0.18);

      // Bayyan (Bass drum head resonant stroke)
      if (isBayyanDha) {
        const bayyanOsc = ctx.createOscillator();
        bayyanOsc.type = "sine";
        bayyanOsc.frequency.setValueAtTime(baseHz * 0.75, now);
        bayyanOsc.frequency.exponentialRampToValueAtTime(baseHz * 0.5, now + 0.25);

        const bayyanGain = ctx.createGain();
        bayyanGain.gain.setValueAtTime(tablaVol * 0.5, now);
        bayyanGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        bayyanOsc.connect(bayyanGain);
        bayyanGain.connect(masterGain);
        bayyanOsc.start(now);
        bayyanOsc.stop(now + 0.3);
      }
    } catch (e) {
      console.warn("Tabla beat error:", e);
    }
  };

  // Tabla Rhythm Loop
  useEffect(() => {
    if (isTablaActive) {
      const intervalMs = (60 / bpm) * 1000;
      let step = 0;

      const beatLoop = () => {
        setCurrentBeatStep(step);
        // Play classic 8-beat Teentaal / Adi Theka (Dha Dhin Dhin Dha | Dha Dhin Dhin Dha)
        const isDha = step === 0 || step === 3 || step === 4 || step === 7;
        const isTin = step === 2 || step === 6;

        playTablaBeat(isDha, isTin);
        step = (step + 1) % 8;
      };

      beatLoop();
      tablaTimerRef.current = setInterval(beatLoop, intervalMs);
    } else if (tablaTimerRef.current) {
      clearInterval(tablaTimerRef.current);
    }
    return () => {
      if (tablaTimerRef.current) clearInterval(tablaTimerRef.current);
    };
  }, [isTablaActive, bpm, selectedPitch, tablaVol]);

  const toggleAll = () => {
    if (isTanpura1Active || isTanpura2Active || isTablaActive) {
      setIsTanpura1Active(false);
      setIsTanpura2Active(false);
      setIsTablaActive(false);
    } else {
      setIsTanpura1Active(true);
      setIsTanpura2Active(true);
      setIsTablaActive(true);
    }
  };

  return (
    <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 bg-card p-6 md:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
        <div>
          <Badge className="bg-kumkum/10 text-kumkum border-none text-[10px] mb-1">
            Studio Concert Accompaniment Engine
          </Badge>
          <h2 className="font-serif text-2xl font-bold text-kumkum">
            Rhythm with Tabla & Dual Tanpuras
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Acoustic Tanpura drones (Pa-Sa & Ma-Sa) paired with an interactive Tabla/Mridangam rhythm pulse.
          </p>
        </div>

        {/* Master Power Toggle */}
        <Button
          size="lg"
          onClick={toggleAll}
          className={`shrink-0 font-bold text-xs py-2.5 px-6 rounded-2xl gap-2 shadow-md transition-all ${
            isTanpura1Active || isTanpura2Active || isTablaActive
              ? "bg-kumkum hover:bg-kumkum-light text-white"
              : "bg-amber-600 hover:bg-amber-700 text-white"
          }`}
        >
          {isTanpura1Active || isTanpura2Active || isTablaActive ? (
            <>
              <Square className="size-4 fill-current animate-pulse" /> Stop All Accompaniment
            </>
          ) : (
            <>
              <Play className="size-4 fill-current" /> Play Master Accompaniment
            </>
          )}
        </Button>
      </div>

      {/* Sruthi Key & Tuning Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl bg-muted/40 p-4 border border-border/50">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Adhara Shadja Key (Sruthi):
          </label>
          <select
            value={selectedPitch.name}
            onChange={(e) => {
              const p = BASE_PITCHES.find((item) => item.name === e.target.value);
              if (p) setSelectedPitch(p);
            }}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold"
          >
            {BASE_PITCHES.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} ({p.freq.toFixed(1)} Hz)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Tanpura Drone Tuning (Panchama / Madhyama / Nishada):
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(["Pa", "Ma", "Ni"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setDroneTuning(t)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                  droneTuning === t
                    ? "bg-kumkum text-white shadow-sm"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {t} Tuning ({t === "Pa" ? "P-S-S-S" : t === "Ma" ? "M-S-S-S" : "N-S-S-S"})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Channels: Tanpura 1, Tanpura 2 & Tabla Controls */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Channel 1: Tanpura 1 */}
        <div className="glass-panel rounded-2xl border border-swara-gold/20 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🪕</span>
              <div>
                <h4 className="font-serif text-sm font-bold text-kumkum">Tanpura 1</h4>
                <p className="text-[10px] text-muted-foreground">Primary Drone (Left Channel)</p>
              </div>
            </div>

            <Button
              size="sm"
              variant={isTanpura1Active ? "default" : "outline"}
              onClick={() => setIsTanpura1Active(!isTanpura1Active)}
              className={isTanpura1Active ? "bg-kumkum text-white text-xs" : "text-xs border-swara-gold/30"}
            >
              {isTanpura1Active ? "On" : "Off"}
            </Button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-muted-foreground font-semibold">
              <span>Volume</span>
              <span>{Math.round(tanpura1Vol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={tanpura1Vol}
              onChange={(e) => setTanpura1Vol(parseFloat(e.target.value))}
              className="w-full accent-kumkum h-1.5 bg-muted rounded-lg"
            />
          </div>
        </div>

        {/* Channel 2: Tanpura 2 */}
        <div className="glass-panel rounded-2xl border border-swara-gold/20 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🪕</span>
              <div>
                <h4 className="font-serif text-sm font-bold text-kumkum">Tanpura 2</h4>
                <p className="text-[10px] text-muted-foreground">Stereo Drone (Right Channel)</p>
              </div>
            </div>

            <Button
              size="sm"
              variant={isTanpura2Active ? "default" : "outline"}
              onClick={() => setIsTanpura2Active(!isTanpura2Active)}
              className={isTanpura2Active ? "bg-kumkum text-white text-xs" : "text-xs border-swara-gold/30"}
            >
              {isTanpura2Active ? "On" : "Off"}
            </Button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-muted-foreground font-semibold">
              <span>Volume</span>
              <span>{Math.round(tanpura2Vol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={tanpura2Vol}
              onChange={(e) => setTanpura2Vol(parseFloat(e.target.value))}
              className="w-full accent-kumkum h-1.5 bg-muted rounded-lg"
            />
          </div>
        </div>

        {/* Channel 3: Tabla / Mridangam Rhythm */}
        <div className="glass-panel rounded-2xl border border-swara-gold/20 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🥁</span>
              <div>
                <h4 className="font-serif text-sm font-bold text-kumkum">Tabla / Mridangam</h4>
                <p className="text-[10px] text-muted-foreground">Rhythm Pulse & Theka</p>
              </div>
            </div>

            <Button
              size="sm"
              variant={isTablaActive ? "default" : "outline"}
              onClick={() => setIsTablaActive(!isTablaActive)}
              className={isTablaActive ? "bg-kumkum text-white text-xs" : "text-xs border-swara-gold/30"}
            >
              {isTablaActive ? "On" : "Off"}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-muted-foreground font-semibold">
                <span>Tempo BPM</span>
                <span className="font-bold text-kumkum">{bpm} BPM</span>
              </div>
              <input
                type="range"
                min="50"
                max="180"
                step="2"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                className="w-full accent-kumkum h-1.5 bg-muted rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-muted-foreground font-semibold">
                <span>Drum Volume</span>
                <span>{Math.round(tablaVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={tablaVol}
                onChange={(e) => setTablaVol(parseFloat(e.target.value))}
                className="w-full accent-kumkum h-1.5 bg-muted rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Beat Visualizer Bar */}
      {isTablaActive && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <span className="text-[11px] font-semibold text-muted-foreground">Rhythm Pulse Beat Counter:</span>
          <div className="grid grid-cols-8 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((beat, idx) => (
              <div
                key={idx}
                className={`py-2 rounded-xl text-center font-bold text-xs transition-all ${
                  currentBeatStep === idx
                    ? "bg-kumkum text-white scale-105 shadow-md ring-2 ring-swara-gold"
                    : idx === 0
                    ? "bg-swara-gold/20 text-kumkum border border-swara-gold/40"
                    : "bg-muted text-muted-foreground border border-border/50"
                }`}
              >
                {beat}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
