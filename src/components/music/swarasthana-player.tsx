"use client";

import React, { useState, useRef } from "react";
import { Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SwarasthanaPlayerProps {
  ragaName: string;
  arohana: string;
  avarohana: string;
}

// Swara frequency ratios relative to Adhara Shadja C3 (130.81 Hz)
const SWARA_FREQS: Record<string, number> = {
  S: 130.81,
  R1: 138.59,
  R2: 146.83,
  G1: 146.83,
  R3: 155.56,
  G2: 155.56,
  G3: 164.81,
  M1: 174.61,
  M2: 185.0,
  P: 196.0,
  D1: 207.65,
  D2: 220.0,
  N1: 220.0,
  D3: 233.08,
  N2: 233.08,
  N3: 246.94,
  "S'": 261.63,
  "R1'": 277.18,
  "R2'": 293.66,
  "G3'": 329.63,
  "M1'": 349.23,
  "P'": 392.0,
};

export function SwarasthanaPlayer({ ragaName, arohana, avarohana }: SwarasthanaPlayerProps) {
  const [instrument, setInstrument] = useState<"veena" | "violin">("veena");
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [isPlayingScale, setIsPlayingScale] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Parse Swara strings (e.g. "S R1 G3 M1 P D1 N3 S'") into clean swara tokens
  const parseSwaras = (scaleStr: string): string[] => {
    if (!scaleStr) return ["S", "R1", "G3", "M1", "P", "D1", "N3", "S'"];
    return scaleStr
      .split(/\s+/)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
  };

  const arohanaSwaras = parseSwaras(arohana);
  const avarohanaSwaras = parseSwaras(avarohana);

  // Play audio tone with physical modeling for Veena vs. Violin
  const playSwaraTone = (swaraToken: string, durationSec: number = 0.8) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContextClass();
      if (ctx.state === "suspended") ctx.resume();
      audioCtxRef.current = ctx;

      const baseHz = SWARA_FREQS[swaraToken] || 130.81;
      setActiveSwara(swaraToken);

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      if (instrument === "veena") {
        // Veena Synthesis: Plucked string with metallic harmonics & body resonance decay
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();

        osc1.type = "sawtooth";
        osc2.type = "triangle";

        osc1.frequency.setValueAtTime(baseHz, now);
        osc2.frequency.setValueAtTime(baseHz * 2, now); // 2nd harmonic resonance

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(baseHz * 4, now);
        filter.frequency.exponentialRampToValueAtTime(baseHz * 1.5, now + durationSec);

        masterGain.gain.setValueAtTime(0.35, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + durationSec);
        osc2.stop(now + durationSec);
      } else {
        // Violin Synthesis: Bowed string with rich harmonics, warm lowpass, and vibrato
        const osc = ctx.createOscillator();
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(baseHz, now);

        // Subtle 5.5Hz Violin vibrato
        vibrato.frequency.setValueAtTime(5.5, now);
        vibratoGain.gain.setValueAtTime(baseHz * 0.015, now);
        vibrato.connect(osc.frequency);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(baseHz * 3.5, now);

        masterGain.gain.setValueAtTime(0.01, now);
        masterGain.gain.linearRampToValueAtTime(0.3, now + 0.1); // Bow attack
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

        vibrato.start(now);
        osc.connect(filter);
        filter.connect(masterGain);

        osc.start(now);
        vibrato.stop(now + durationSec);
        osc.stop(now + durationSec);
      }

      setTimeout(() => {
        setActiveSwara(null);
      }, durationSec * 1000);
    } catch (e) {
      console.warn("Audio play error:", e);
    }
  };

  // Play full scale sequence (Arohana or Avarohana)
  const playScaleSequence = async (swaraList: string[]) => {
    if (isPlayingScale) return;
    setIsPlayingScale(true);

    for (let i = 0; i < swaraList.length; i++) {
      playSwaraTone(swaraList[i], 0.6);
      await new Promise((res) => setTimeout(res, 650));
    }

    setIsPlayingScale(false);
  };

  return (
    <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 bg-card p-6 md:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
        <div>
          <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[10px] mb-1">
            Interactive Swarasthana Player
          </Badge>
          <h3 className="font-serif text-xl font-bold text-kumkum">{ragaName} Swara Audio</h3>
        </div>

        {/* Instrument Switcher */}
        <div className="flex items-center gap-2 rounded-xl bg-muted p-1 border border-border">
          <button
            onClick={() => setInstrument("veena")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              instrument === "veena"
                ? "bg-card text-kumkum font-bold shadow-sm border border-swara-gold/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🪕 Veena Sound
          </button>
          <button
            onClick={() => setInstrument("violin")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              instrument === "violin"
                ? "bg-card text-kumkum font-bold shadow-sm border border-swara-gold/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎻 Violin Sound
          </button>
        </div>
      </div>

      {/* Arohana Interactive Swara Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-kumkum uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="size-3.5 text-swara-gold" /> Arohana (Ascending Notes):
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={isPlayingScale}
            onClick={() => playScaleSequence(arohanaSwaras)}
            className="border-swara-gold/30 text-xs font-semibold text-kumkum hover:bg-kumkum hover:text-white gap-1"
          >
            <Play className="size-3" /> Play Arohana Scale
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {arohanaSwaras.map((s, idx) => (
            <button
              key={`aro-${idx}`}
              onClick={() => playSwaraTone(s)}
              className={`size-11 rounded-2xl font-serif text-sm font-bold border transition-all flex flex-col items-center justify-center ${
                activeSwara === s
                  ? "bg-kumkum text-white border-kumkum shadow-lg scale-110"
                  : "bg-card text-foreground border-swara-gold/30 hover:border-kumkum hover:bg-kumkum/10"
              }`}
            >
              <span>{s}</span>
              <span className="text-[8px] font-sans font-normal opacity-70">
                {instrument === "veena" ? "🪕" : "🎻"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Avarohana Interactive Swara Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-kumkum uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="size-3.5 text-swara-gold" /> Avarohana (Descending Notes):
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={isPlayingScale}
            onClick={() => playScaleSequence(avarohanaSwaras)}
            className="border-swara-gold/30 text-xs font-semibold text-kumkum hover:bg-kumkum hover:text-white gap-1"
          >
            <Play className="size-3" /> Play Avarohana Scale
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {avarohanaSwaras.map((s, idx) => (
            <button
              key={`ava-${idx}`}
              onClick={() => playSwaraTone(s)}
              className={`size-11 rounded-2xl font-serif text-sm font-bold border transition-all flex flex-col items-center justify-center ${
                activeSwara === s
                  ? "bg-kumkum text-white border-kumkum shadow-lg scale-110"
                  : "bg-card text-foreground border-swara-gold/30 hover:border-kumkum hover:bg-kumkum/10"
              }`}
            >
              <span>{s}</span>
              <span className="text-[8px] font-sans font-normal opacity-70">
                {instrument === "veena" ? "🪕" : "🎻"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
