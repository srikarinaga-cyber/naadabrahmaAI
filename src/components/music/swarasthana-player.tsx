"use client";

import React, { useState, useRef } from "react";
import { Play, Volume2, Music, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SwarasthanaPlayerProps {
  ragaName: string;
  arohana: string;
  avarohana: string;
}

// Exact Swara frequencies & names relative to Adhara Shadja C3 (130.81 Hz)
const SWARA_DETAILS: Record<
  string,
  { name: string; freq: number; cents: number }
> = {
  S: { name: "Adhara Shadja", freq: 130.81, cents: 0 },
  R1: { name: "Suddha Rishabha", freq: 138.59, cents: 90 },
  R2: { name: "Chatusruti Rishabha", freq: 146.83, cents: 204 },
  G1: { name: "Suddha Gandhara", freq: 146.83, cents: 204 },
  R3: { name: "Shatsruti Rishabha", freq: 155.56, cents: 283 },
  G2: { name: "Sadharana Gandhara", freq: 155.56, cents: 283 },
  G3: { name: "Antara Gandhara", freq: 164.81, cents: 386 },
  M1: { name: "Suddha Madhyama", freq: 174.61, cents: 498 },
  M2: { name: "Prati Madhyama", freq: 185.0, cents: 610 },
  P: { name: "Panchama", freq: 196.0, cents: 702 },
  D1: { name: "Suddha Dhaivata", freq: 207.65, cents: 792 },
  D2: { name: "Chatusruti Dhaivata", freq: 220.0, cents: 906 },
  N1: { name: "Suddha Nishada", freq: 220.0, cents: 906 },
  D3: { name: "Shatsruti Dhaivata", freq: 233.08, cents: 984 },
  N2: { name: "Kaisiki Nishada", freq: 233.08, cents: 984 },
  N3: { name: "Kakali Nishada", freq: 246.94, cents: 1088 },
  "S'": { name: "Tara Shadja (High Sa)", freq: 261.63, cents: 1200 },
  "R1'": { name: "Tara Suddha Rishabha", freq: 277.18, cents: 1290 },
  "R2'": { name: "Tara Chatusruti Rishabha", freq: 293.66, cents: 1404 },
  "G3'": { name: "Tara Antara Gandhara", freq: 329.63, cents: 1586 },
  "M1'": { name: "Tara Suddha Madhyama", freq: 349.23, cents: 1698 },
};

export function SwarasthanaPlayer({ ragaName, arohana, avarohana }: SwarasthanaPlayerProps) {
  const [instrument, setInstrument] = useState<"veena" | "violin">("veena");
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [selectedSwaraInfo, setSelectedSwaraInfo] = useState<{
    token: string;
    name: string;
    freq: number;
    cents: number;
  } | null>(null);
  const [isPlayingScale, setIsPlayingScale] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const parseSwaras = (scaleStr: string): string[] => {
    if (!scaleStr) return ["S", "R1", "G3", "M1", "P", "D1", "N3", "S'"];
    return scaleStr
      .split(/\s+/)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
  };

  const arohanaSwaras = parseSwaras(arohana);
  const avarohanaSwaras = parseSwaras(avarohana);

  // Advanced Web Audio Physical Modeling: Authentic Veena Pluck vs. Violin Bow Tone
  const playSwaraTone = (swaraToken: string, durationSec: number = 0.9) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContextClass();
      if (ctx.state === "suspended") ctx.resume();
      audioCtxRef.current = ctx;

      const details = SWARA_DETAILS[swaraToken] || {
        name: "Swara",
        freq: 130.81,
        cents: 0,
      };
      const baseHz = details.freq;

      setActiveSwara(swaraToken);
      setSelectedSwaraInfo({ token: swaraToken, ...details });

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      if (instrument === "veena") {
        // 🪕 VEENA SYNTHESIS: Additive string pluck + Kudam resonator body filter
        const fundamental = ctx.createOscillator();
        const harmonic2 = ctx.createOscillator();
        const metallicHarmonic = ctx.createOscillator();

        fundamental.type = "sawtooth";
        harmonic2.type = "triangle";
        metallicHarmonic.type = "sine";

        fundamental.frequency.setValueAtTime(baseHz, now);
        harmonic2.frequency.setValueAtTime(baseHz * 2, now);
        metallicHarmonic.frequency.setValueAtTime(baseHz * 3.01, now); // Metallic ring

        // Body Resonance Lowpass Filter (decaying envelope)
        const bodyFilter = ctx.createBiquadFilter();
        bodyFilter.type = "lowpass";
        bodyFilter.frequency.setValueAtTime(baseHz * 5, now);
        bodyFilter.frequency.exponentialRampToValueAtTime(baseHz * 1.6, now + durationSec);
        bodyFilter.Q.setValueAtTime(2.5, now); // Resonant wooden kudam peak

        // Pluck envelope: sharp attack (15ms) + natural exponential string decay
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.4, now + 0.015);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

        fundamental.connect(bodyFilter);
        harmonic2.connect(bodyFilter);
        metallicHarmonic.connect(bodyFilter);
        bodyFilter.connect(masterGain);

        fundamental.start(now);
        harmonic2.start(now);
        metallicHarmonic.start(now);

        fundamental.stop(now + durationSec);
        harmonic2.stop(now + durationSec);
        metallicHarmonic.stop(now + durationSec);
      } else {
        // 🎻 VIOLIN SYNTHESIS: Sawtooth + Dual Body Formant Filters + LFO Vibrato
        const bowOsc = ctx.createOscillator();
        const vibratoLfo = ctx.createOscillator();
        const vibratoGain = ctx.createGain();

        bowOsc.type = "sawtooth";
        bowOsc.frequency.setValueAtTime(baseHz, now);

        // 5.5 Hz Violin Vibrato
        vibratoLfo.frequency.setValueAtTime(5.5, now);
        vibratoGain.gain.setValueAtTime(baseHz * 0.018, now);
        vibratoLfo.connect(bowOsc.frequency);

        // Acoustic Violin Body Formant Filter 1 (Wood Cavity ~450Hz)
        const bodyFormant1 = ctx.createBiquadFilter();
        bodyFormant1.type = "bandpass";
        bodyFormant1.frequency.setValueAtTime(450, now);
        bodyFormant1.Q.setValueAtTime(1.8, now);

        // Acoustic Violin String Brilliance Filter 2 (High Formant ~2600Hz)
        const bodyFormant2 = ctx.createBiquadFilter();
        bodyFormant2.type = "lowpass";
        bodyFormant2.frequency.setValueAtTime(2800, now);

        // Bow Attack Envelope: 50ms smooth rise + steady sustain + soft release
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.35, now + 0.05); // Bow attack
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

        vibratoLfo.start(now);
        bowOsc.connect(bodyFormant1);
        bodyFormant1.connect(bodyFormant2);
        bodyFormant2.connect(masterGain);

        bowOsc.start(now);
        vibratoLfo.stop(now + durationSec);
        bowOsc.stop(now + durationSec);
      }

      setTimeout(() => {
        setActiveSwara(null);
      }, durationSec * 1000);
    } catch (e) {
      console.warn("Audio play error:", e);
    }
  };

  const playScaleSequence = async (swaraList: string[]) => {
    if (isPlayingScale) return;
    setIsPlayingScale(true);

    for (let i = 0; i < swaraList.length; i++) {
      playSwaraTone(swaraList[i], 0.7);
      await new Promise((res) => setTimeout(res, 750));
    }

    setIsPlayingScale(false);
  };

  return (
    <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 bg-card p-6 md:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
        <div>
          <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[10px] mb-1">
            Carnatic Swarasthana Audio Synthesizer
          </Badge>
          <h3 className="font-serif text-xl font-bold text-kumkum">{ragaName} Swara Player</h3>
        </div>

        {/* Instrument Sound Switcher */}
        <div className="flex items-center gap-2 rounded-xl bg-muted p-1 border border-border">
          <button
            onClick={() => setInstrument("veena")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              instrument === "veena"
                ? "bg-card text-kumkum font-bold shadow-sm border border-swara-gold/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🪕 Veena Sound
          </button>
          <button
            onClick={() => setInstrument("violin")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              instrument === "violin"
                ? "bg-card text-kumkum font-bold shadow-sm border border-swara-gold/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎻 Violin Sound
          </button>
        </div>
      </div>

      {/* Selected Swara Inspector */}
      {selectedSwaraInfo && (
        <div className="rounded-2xl bg-muted/40 border border-swara-gold/30 p-3.5 flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Badge className="bg-kumkum text-white font-serif font-bold text-sm px-2.5 py-0.5">
              {selectedSwaraInfo.token}
            </Badge>
            <div>
              <p className="font-bold text-foreground">{selectedSwaraInfo.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                Frequency: {selectedSwaraInfo.freq.toFixed(2)} Hz | Just Intonation: {selectedSwaraInfo.cents} Cents
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-kumkum flex items-center gap-1">
            <Sparkles className="size-3.5 text-swara-gold" /> {instrument === "veena" ? "Veena Tone" : "Violin Tone"}
          </span>
        </div>
      )}

      {/* Arohana Interactive Swara Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-kumkum uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="size-3.5 text-swara-gold" /> Arohana (Ascending Swaras):
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={isPlayingScale}
            onClick={() => playScaleSequence(arohanaSwaras)}
            className="border-swara-gold/30 text-xs font-semibold text-kumkum hover:bg-kumkum hover:text-white gap-1.5"
          >
            <Play className="size-3" /> Play Arohana Scale ({instrument === "veena" ? "Veena" : "Violin"})
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {arohanaSwaras.map((s, idx) => (
            <button
              key={`aro-${idx}`}
              onClick={() => playSwaraTone(s)}
              className={`size-12 rounded-2xl font-serif text-sm font-bold border transition-all flex flex-col items-center justify-center shadow-sm ${
                activeSwara === s
                  ? "bg-kumkum text-white border-kumkum shadow-lg scale-110 ring-2 ring-swara-gold"
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
            <Volume2 className="size-3.5 text-swara-gold" /> Avarohana (Descending Swaras):
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={isPlayingScale}
            onClick={() => playScaleSequence(avarohanaSwaras)}
            className="border-swara-gold/30 text-xs font-semibold text-kumkum hover:bg-kumkum hover:text-white gap-1.5"
          >
            <Play className="size-3" /> Play Avarohana Scale ({instrument === "veena" ? "Veena" : "Violin"})
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {avarohanaSwaras.map((s, idx) => (
            <button
              key={`ava-${idx}`}
              onClick={() => playSwaraTone(s)}
              className={`size-12 rounded-2xl font-serif text-sm font-bold border transition-all flex flex-col items-center justify-center shadow-sm ${
                activeSwara === s
                  ? "bg-kumkum text-white border-kumkum shadow-lg scale-110 ring-2 ring-swara-gold"
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
