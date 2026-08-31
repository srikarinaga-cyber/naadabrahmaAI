"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Square, Volume2, Sliders, Music, Sparkles, Activity, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Base pitch names and fundamental frequencies (Hz)
const BASE_PITCHES = [
  { name: "C (1.0 Kattai)", baseFreq: 130.81 },
  { name: "C# (1.5 Kattai)", baseFreq: 138.59 },
  { name: "D (2.0 Kattai)", baseFreq: 146.83 },
  { name: "D# (2.5 Kattai)", baseFreq: 155.56 },
  { name: "E (3.0 Kattai)", baseFreq: 164.81 },
  { name: "F (4.0 Kattai)", baseFreq: 174.61 },
  { name: "F# (4.5 Kattai)", baseFreq: 185.0 },
  { name: "G (5.0 Kattai)", baseFreq: 196.0 },
  { name: "G# (5.5 Kattai)", baseFreq: 207.65 },
  { name: "A (6.0 Kattai)", baseFreq: 220.0 },
  { name: "A# (6.5 Kattai)", baseFreq: 233.08 },
  { name: "B (7.0 Kattai)", baseFreq: 246.94 },
];

export function TanpuraTablaPlayer() {
  const [selectedPitch, setSelectedPitch] = useState(BASE_PITCHES[0]);
  const [octave, setOctave] = useState<"low" | "mid" | "high">("mid");
  const [droneTuning, setDroneTuning] = useState<"Pa" | "Ma" | "Ni" | "Sa">("Pa");
  const [strumSpeedMs, setStrumSpeedMs] = useState(700);
  const [jivariIntensity, setJivariIntensity] = useState(3.0);
  const [fineTuneCents, setFineTuneCents] = useState(0);

  // Audio state
  const [isTanpura1Active, setIsTanpura1Active] = useState(false);
  const [isTanpura2Active, setIsTanpura2Active] = useState(false);
  const [isTablaActive, setIsTablaActive] = useState(false);

  // String vibration state for visualizer
  const [activeStringIndex, setActiveStringIndex] = useState<number | null>(null);

  // Volume Controls
  const [tanpura1Vol, setTanpura1Vol] = useState(0.5);
  const [tanpura2Vol, setTanpura2Vol] = useState(0.4);
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

  // Calculate actual frequency considering Octave multiplier
  const octaveMultiplier = octave === "low" ? 0.5 : octave === "high" ? 2.0 : 1.0;
  const currentHz = selectedPitch.baseFreq * octaveMultiplier;

  // Pluck a single Tanpura Droid string with metallic Jivari acoustic resonance
  const pluckTanpuraString = (
    baseHz: number,
    stringRatio: number,
    volume: number,
    additionalCents: number = 0
  ) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const freq = baseHz * stringRatio;
      const totalDetune = fineTuneCents + additionalCents;

      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      // Multi-harmonic additive synthesis for Tanpura Droid Jivari cotton thread buzz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();

      osc1.type = "sawtooth";
      osc2.type = "triangle";
      osc3.type = "sine";

      osc1.frequency.setValueAtTime(freq, now);
      osc1.detune.setValueAtTime(totalDetune, now);

      osc2.frequency.setValueAtTime(freq * 2, now);
      osc2.detune.setValueAtTime(totalDetune, now);

      osc3.frequency.setValueAtTime(freq * 3.01, now);
      osc3.detune.setValueAtTime(totalDetune, now);

      // Jivari Metallic Cotton Thread Resonance Filter
      const jivariFilter = ctx.createBiquadFilter();
      jivariFilter.type = "bandpass";
      jivariFilter.frequency.setValueAtTime(freq * 3.2, now);
      jivariFilter.Q.setValueAtTime(jivariIntensity, now);

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.04);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc1.connect(jivariFilter);
      osc2.connect(jivariFilter);
      osc3.connect(jivariFilter);
      jivariFilter.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + 3.2);
      osc2.stop(now + 3.2);
      osc3.stop(now + 3.2);
    } catch (e) {
      console.warn("Tanpura Droid pluck error:", e);
    }
  };

  // Tanpura Droid 1 Strumming Loop
  useEffect(() => {
    if (isTanpura1Active) {
      let step = 0;
      const firstRatio =
        droneTuning === "Pa"
          ? 1.5
          : droneTuning === "Ma"
          ? 1.3333
          : droneTuning === "Ni"
          ? 1.875
          : 2.0;

      const strum = () => {
        setActiveStringIndex(step);

        if (step === 0) pluckTanpuraString(currentHz, firstRatio, tanpura1Vol, -2);
        else if (step === 1) pluckTanpuraString(currentHz, 2.0, tanpura1Vol, 1);
        else if (step === 2) pluckTanpuraString(currentHz, 2.0, tanpura1Vol, 0);
        else if (step === 3) pluckTanpuraString(currentHz, 1.0, tanpura1Vol, -3);

        step = (step + 1) % 4;
      };

      strum();
      tanpura1TimerRef.current = setInterval(strum, strumSpeedMs);
    } else if (tanpura1TimerRef.current) {
      clearInterval(tanpura1TimerRef.current);
    }
    return () => {
      if (tanpura1TimerRef.current) clearInterval(tanpura1TimerRef.current);
    };
  }, [isTanpura1Active, currentHz, droneTuning, tanpura1Vol, fineTuneCents, strumSpeedMs, jivariIntensity]);

  // Tanpura Droid 2 Stereo Accompaniment Loop
  useEffect(() => {
    if (isTanpura2Active) {
      let step = 0;
      const firstRatio =
        droneTuning === "Pa"
          ? 1.5
          : droneTuning === "Ma"
          ? 1.3333
          : droneTuning === "Ni"
          ? 1.875
          : 2.0;

      const strum2 = () => {
        if (step === 0) pluckTanpuraString(currentHz, 2.0, tanpura2Vol, 3);
        else if (step === 1) pluckTanpuraString(currentHz, 2.0, tanpura2Vol, -1);
        else if (step === 2) pluckTanpuraString(currentHz, firstRatio, tanpura2Vol, 2);
        else if (step === 3) pluckTanpuraString(currentHz, 1.0, tanpura2Vol, 1);

        step = (step + 1) % 4;
      };

      const timeout = setTimeout(() => {
        strum2();
        tanpura2TimerRef.current = setInterval(strum2, strumSpeedMs);
      }, strumSpeedMs / 2);

      return () => {
        clearTimeout(timeout);
        if (tanpura2TimerRef.current) clearInterval(tanpura2TimerRef.current);
      };
    } else if (tanpura2TimerRef.current) {
      clearInterval(tanpura2TimerRef.current);
    }
  }, [isTanpura2Active, currentHz, droneTuning, tanpura2Vol, fineTuneCents, strumSpeedMs, jivariIntensity]);

  // Tabla / Mridangam Rhythm Pulse Generator
  const playTablaBeat = (isBayyanDha: boolean, isSyahiTin: boolean) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      // Dayan
      const dayanOsc = ctx.createOscillator();
      dayanOsc.type = "sine";
      dayanOsc.frequency.setValueAtTime(isSyahiTin ? currentHz * 2.2 : currentHz * 1.5, now);
      dayanOsc.frequency.exponentialRampToValueAtTime(currentHz, now + 0.15);

      const dayanGain = ctx.createGain();
      dayanGain.gain.setValueAtTime(tablaVol * 0.4, now);
      dayanGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      dayanOsc.connect(dayanGain);
      dayanGain.connect(masterGain);
      dayanOsc.start(now);
      dayanOsc.stop(now + 0.18);

      // Bayyan
      if (isBayyanDha) {
        const bayyanOsc = ctx.createOscillator();
        bayyanOsc.type = "sine";
        bayyanOsc.frequency.setValueAtTime(currentHz * 0.75, now);
        bayyanOsc.frequency.exponentialRampToValueAtTime(currentHz * 0.5, now + 0.25);

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

  // Tabla Loop
  useEffect(() => {
    if (isTablaActive) {
      const intervalMs = (60 / bpm) * 1000;
      let step = 0;

      const beatLoop = () => {
        setCurrentBeatStep(step);
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
  }, [isTablaActive, bpm, currentHz, tablaVol]);

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
      {/* Tanpura Droid Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
        <div>
          <Badge className="bg-kumkum/10 text-kumkum border-none text-[10px] mb-1 font-bold">
            Tanpura Droid Acoustic Reference Engine
          </Badge>
          <h2 className="font-serif text-2xl font-bold text-kumkum flex items-center gap-2">
            🪕 Tanpura Droid & Rhythm Console
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Modelled after Tanpura Droid with Jivari cotton thread buzz physics, male/female octave modes, and 4-string tunings.
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
              <Square className="size-4 fill-current animate-pulse" /> Stop Tanpura Droid
            </>
          ) : (
            <>
              <Play className="size-4 fill-current" /> Start Tanpura Droid
            </>
          )}
        </Button>
      </div>

      {/* Sruthi Presets & Octave Switcher (Tanpura Droid Reference) */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl bg-muted/40 p-4 border border-border/50">
          {/* Base Sruthi Key */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Adhara Shadja Sruthi (Base Pitch):
            </label>
            <select
              value={selectedPitch.name}
              onChange={(e) => {
                const p = BASE_PITCHES.find((item) => item.name === e.target.value);
                if (p) setSelectedPitch(p);
              }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-kumkum"
            >
              {BASE_PITCHES.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({(p.baseFreq * octaveMultiplier).toFixed(1)} Hz)
                </option>
              ))}
            </select>
          </div>

          {/* Octave Mode Switcher (Male / Female / Tara) */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Octave Mode (Male / Female Vocal & Instrument Sruthi):
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "low", label: "Male (Low)" },
                { id: "mid", label: "Female (Mid)" },
                { id: "high", label: "Tara (High)" },
              ].map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOctave(o.id as "low" | "mid" | "high")}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    octave === o.id
                      ? "bg-kumkum text-white shadow-sm"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tanpura Droid Tuning & Performance Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl bg-muted/40 p-4 border border-border/50">
          {/* String 1 Tuning (Pa / Ma / Ni / Sa) */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              String 1 Tuning (Panchama / Madhyama / Nishada / Shadja):
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(["Pa", "Ma", "Ni", "Sa"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setDroneTuning(t)}
                  className={`py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                    droneTuning === t
                      ? "bg-kumkum text-white shadow-sm"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t} ({t === "Pa" ? "P-S-S-S" : t === "Ma" ? "M-S-S-S" : t === "Ni" ? "N-S-S-S" : "S-S-S-S"})
                </button>
              ))}
            </div>
          </div>

          {/* Strum Speed Controller */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
              <span>Strum Speed (Cycle Tempo):</span>
              <span className="font-mono text-kumkum">{strumSpeedMs} ms</span>
            </div>
            <input
              type="range"
              min="400"
              max="1200"
              step="50"
              value={strumSpeedMs}
              onChange={(e) => setStrumSpeedMs(parseInt(e.target.value, 10))}
              className="w-full accent-kumkum h-1.5 bg-background rounded-lg mt-2"
            />
          </div>

          {/* Jivari Cotton Thread Resonance Physics Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
              <span>Jivari Buzz Resonance:</span>
              <span className="font-mono text-kumkum">{jivariIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.2"
              value={jivariIntensity}
              onChange={(e) => setJivariIntensity(parseFloat(e.target.value))}
              className="w-full accent-kumkum h-1.5 bg-background rounded-lg mt-2"
            />
          </div>
        </div>
      </div>

      {/* Tanpura Droid String Strumming Visualizer */}
      {(isTanpura1Active || isTanpura2Active) && (
        <div className="rounded-2xl border border-swara-gold/25 bg-kumkum/5 p-4 flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-kumkum animate-pulse" />
            <span className="font-bold text-foreground">Tanpura Droid String Vibrator:</span>
          </div>
          <div className="flex items-center gap-3">
            {["1 (P/M/N)", "2 (Tara Sa)", "3 (Tara Sa)", "4 (Lower Sa)"].map((label, idx) => (
              <div
                key={label}
                className={`px-3 py-1 rounded-xl text-[10px] font-bold font-mono transition-all ${
                  activeStringIndex === idx
                    ? "bg-kumkum text-white scale-105 shadow-sm ring-2 ring-swara-gold"
                    : "bg-card text-muted-foreground border border-border/50"
                }`}
              >
                String {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Channels: Tanpura 1, Tanpura 2 & Tabla Controls */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Channel 1: Tanpura 1 */}
        <div className="glass-panel rounded-2xl border border-swara-gold/20 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🪕</span>
              <div>
                <h4 className="font-serif text-sm font-bold text-kumkum">Tanpura 1 (Left)</h4>
                <p className="text-[10px] text-muted-foreground">Primary Acoustic Drone</p>
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
                <h4 className="font-serif text-sm font-bold text-kumkum">Tanpura 2 (Right)</h4>
                <p className="text-[10px] text-muted-foreground">Stereo Acoustic Drone</p>
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
