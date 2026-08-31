"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Play, Square, Volume2, Music, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Swara note frequency ratios relative to Adhara Shadja (Sa = 1.0)
const CARNATIC_SWARA_RATIOS: Record<string, number> = {
  "S":   1.0,
  "R1":  256 / 243, // ~1.0535 (Shuddha Rishabha)
  "R2":  9 / 8,     // 1.125 (Chatusruti Rishabha)
  "R3":  32 / 27,   // ~1.1852 (Shatsruti Rishabha)
  "G1":  9 / 8,     // 1.125 (Shuddha Gandhara)
  "G2":  32 / 27,   // ~1.1852 (Sadharana Gandhara)
  "G3":  5 / 4,     // 1.25 (Antara Gandhara)
  "M1":  4 / 3,     // ~1.3333 (Shuddha Madhyama)
  "M2":  45 / 32,   // ~1.40625 (Prati Madhyama)
  "P":   3 / 2,     // 1.5 (Panchama)
  "D1":  128 / 81,  // ~1.5802 (Shuddha Dhaivata)
  "D2":  5 / 3,     // ~1.6667 (Chatusruti Dhaivata)
  "D3":  16 / 9,    // ~1.7778 (Shatsruti Dhaivata)
  "N1":  5 / 3,     // ~1.6667 (Shuddha Nishada)
  "N2":  16 / 9,    // ~1.7778 (Kaisiki Nishada)
  "N3":  15 / 8,    // 1.875 (Kakali Nishada)
  "S'":  2.0,       // Tara Sthayi Shadja
};

const BASE_KEYS = [
  { label: "C3 (1st Kattai)", freq: 130.81 },
  { label: "C#3 (1.5 Kattai)", freq: 138.59 },
  { label: "D3 (2nd Kattai)", freq: 146.83 },
  { label: "D#3 (2.5 Kattai)", freq: 155.56 },
  { label: "E3 (3rd Kattai)", freq: 164.81 },
  { label: "F3 (4th Kattai)", freq: 174.61 },
  { label: "G3 (5th Kattai)", freq: 196.00 },
];

const INSTRUMENT_VOICES = [
  { id: "veena",  label: "🪕 Saraswati Veena (Authentic Pluck)", desc: "Resonant brass-fret string pluck" },
  { id: "drone",  label: "🎵 Pure Swara Tone",                   desc: "Smooth acoustic sine wave" },
  { id: "violin", label: "🎻 Carnatic Violin",                   desc: "Sustained bowing timbre" },
];

const SWARA_COLORS: Record<string, string> = {
  S: "bg-kumkum/15 text-kumkum border-kumkum/40",
  R: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300",
  G: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300",
  M: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300",
  P: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300",
  D: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300",
  N: "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300",
};

interface MelakartaSwaraAudioPlayerProps {
  ragaName: string;
  ragaNumber: number;
  arohana: string;   // e.g. "S R1 G3 M1 P D1 N3 S"
  avarohana: string; // e.g. "S N3 D1 P M1 G3 R1 S"
}

export function MelakartaSwaraAudioPlayer({
  ragaName,
  ragaNumber,
  arohana,
  avarohana,
}: MelakartaSwaraAudioPlayerProps) {
  const [selectedKey, setSelectedKey] = useState(BASE_KEYS[0]);
  const [voiceMode, setVoiceMode] = useState<"veena" | "drone" | "violin">("veena");
  const [tempoSecs, setTempoSecs] = useState(0.5); // seconds per note
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Parse notes from string — Ensure first note of Avarohana is S' (higher pitch 2.0x)
  const arohanaNotes = arohana.split(" ").filter(Boolean);
  const rawAvarohana = avarohana.split(" ").filter(Boolean);
  const avarohanaNotes = rawAvarohana.map((note, idx) => {
    if (idx === 0 && note === "S") return "S'";
    return note;
  });
  const fullSequence = [...arohanaNotes, ...avarohanaNotes];

  // ──────────────────────────────────────────────
  // VEENA & SWARA AUDIO SYNTHESIZER ENGINE
  // ──────────────────────────────────────────────
  const playSwaraNote = useCallback((swara: string) => {
    const ctx = getAudioContext();
    const ratio = CARNATIC_SWARA_RATIOS[swara] || 1.0;
    const freq = selectedKey.freq * ratio;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();

    if (voiceMode === "veena") {
      // 🪕 VEENA SYNTHESIS ENGINE
      // Pluck attack envelope: Sharp metallic pluck transient → warm string decay
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.9, now + 0.008); // Instant crisp pluck
      masterGain.gain.exponentialRampToValueAtTime(0.4, now + 0.08);  // Initial decay
      masterGain.gain.exponentialRampToValueAtTime(0.2, now + 0.3);   // Sustain
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + tempoSecs * 0.95);

      // Veena Gourd & Fret Resonance Bandpass Filter
      const bodyFilter = ctx.createBiquadFilter();
      bodyFilter.type = "bandpass";
      bodyFilter.frequency.setValueAtTime(freq * 2.1, now);
      bodyFilter.Q.setValueAtTime(0.8, now);

      // Veena Warm Lowpass Filter
      const warmthFilter = ctx.createBiquadFilter();
      warmthFilter.type = "lowpass";
      warmthFilter.frequency.setValueAtTime(freq * 12, now);

      masterGain.connect(bodyFilter);
      bodyFilter.connect(warmthFilter);
      warmthFilter.connect(ctx.destination);

      // Veena Metallic String Pluck Transient (High Frequency Burst)
      const pluckOsc = ctx.createOscillator();
      pluckOsc.type = "triangle";
      pluckOsc.frequency.setValueAtTime(freq * 8, now);
      pluckOsc.frequency.exponentialRampToValueAtTime(freq, now + 0.02);
      const pluckGain = ctx.createGain();
      pluckGain.gain.setValueAtTime(0.3, now);
      pluckGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      pluckOsc.connect(pluckGain);
      pluckGain.connect(masterGain);
      pluckOsc.start(now);
      pluckOsc.stop(now + 0.025);

      // Veena Harmonics Stack (Fundamental + 5 Partial Overtones + Sub-octave)
      const harmonics = [
        { mult: 1,   gain: 0.85, type: "triangle" as OscillatorType },
        { mult: 2,   gain: 0.45, type: "sawtooth" as OscillatorType },
        { mult: 3,   gain: 0.25, type: "sawtooth" as OscillatorType },
        { mult: 4,   gain: 0.15, type: "sine" as OscillatorType },
        { mult: 5,   gain: 0.08, type: "sine" as OscillatorType },
        { mult: 0.5, gain: 0.20, type: "triangle" as OscillatorType }, // Sub-octave warmth
      ];

      harmonics.forEach(({ mult, gain: g, type }) => {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq * mult, now);

        const hGain = ctx.createGain();
        hGain.gain.setValueAtTime(g, now);
        hGain.gain.exponentialRampToValueAtTime(g * 0.2, now + tempoSecs * 0.6);
        hGain.gain.exponentialRampToValueAtTime(0.0001, now + tempoSecs * 0.95);

        osc.connect(hGain);
        hGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + tempoSecs);
      });
    } else if (voiceMode === "violin") {
      // 🎻 VIOLIN VOICE SYNTHESIS ENGINE
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.7, now + 0.08); // Bowed attack
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + tempoSecs * 0.95);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(freq * 5, now);

      masterGain.connect(filter);
      filter.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(freq, now);

      const osc2 = ctx.createOscillator();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(freq * 2, now);

      osc1.connect(masterGain);
      osc2.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + tempoSecs);
      osc2.stop(now + tempoSecs);
    } else {
      // 🎵 PURE SWARA TONE
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.6, now + 0.04);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + tempoSecs * 0.95);

      masterGain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + tempoSecs);
    }
  }, [getAudioContext, selectedKey, tempoSecs, voiceMode]);

  const stopPlayback = useCallback(() => {
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    setIsPlaying(false);
    setActiveNoteIndex(null);
  }, []);

  const startPlayback = useCallback(() => {
    stopPlayback();
    setIsPlaying(true);

    let idx = 0;
    const playNext = () => {
      if (idx >= fullSequence.length) {
        setIsPlaying(false);
        setActiveNoteIndex(null);
        return;
      }
      setActiveNoteIndex(idx);
      playSwaraNote(fullSequence[idx]);
      idx++;
      playbackTimeoutRef.current = setTimeout(playNext, tempoSecs * 1000);
    };

    playNext();
  }, [fullSequence, playSwaraNote, stopPlayback, tempoSecs]);

  useEffect(() => {
    return () => stopPlayback();
  }, [stopPlayback]);

  return (
    <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 p-6 md:p-8 bg-card/90 shadow-lg space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-swara-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-kumkum/15 text-kumkum font-black text-[10px]">
              🪕 Saraswati Veena Voice Engine
            </Badge>
            <span className="text-xs font-extrabold text-swara-gold">
              Raga #{ragaNumber}
            </span>
          </div>
          <h3 className="font-serif text-xl md:text-2xl font-black text-kumkum flex items-center gap-2">
            <Volume2 className="size-5 text-kumkum" /> Play Swarasthanas for {ragaName}
          </h3>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">
            Synthesizes authentic Veena voice string plucks for every Swarasthana. Press Play or tap any Swara badge!
          </p>
        </div>

        {/* Big Play / Stop Button */}
        <button
          onClick={isPlaying ? stopPlayback : startPlayback}
          className={`px-6 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md transition-all shrink-0 ${
            isPlaying
              ? "bg-kumkum text-white hover:bg-kumkum-light"
              : "bg-gradient-to-r from-swara-gold to-marigold text-white hover:scale-105"
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="size-4 fill-current animate-pulse" /> Stop Scale
            </>
          ) : (
            <>
              <Play className="size-4 fill-current" /> Play Veena Swaras
            </>
          )}
        </button>
      </div>

      {/* Controls: Instrument Voice, Sruthi Key & Speed */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-muted/30 border border-swara-gold/20">
        
        {/* Voice Selector */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1.5">
            Instrument Voice Mode
          </label>
          <select
            value={voiceMode}
            onChange={(e) => setVoiceMode(e.target.value as any)}
            disabled={isPlaying}
            className="w-full bg-background border border-border rounded-xl p-2.5 text-xs font-extrabold text-foreground focus:ring-2 focus:ring-kumkum/30 disabled:opacity-50"
          >
            {INSTRUMENT_VOICES.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Sruthi Key */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1.5">
            Adhara Shadja (Sruthi Key)
          </label>
          <select
            value={selectedKey.label}
            onChange={(e) => {
              const found = BASE_KEYS.find((k) => k.label === e.target.value);
              if (found) setSelectedKey(found);
            }}
            disabled={isPlaying}
            className="w-full bg-background border border-border rounded-xl p-2.5 text-xs font-extrabold text-foreground focus:ring-2 focus:ring-kumkum/30 disabled:opacity-50"
          >
            {BASE_KEYS.map((k) => (
              <option key={k.label} value={k.label}>{k.label}</option>
            ))}
          </select>
        </div>

        {/* Speed */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Playback Speed
            </label>
            <span className="text-xs font-black text-swara-gold">
              {(1 / tempoSecs).toFixed(1)} notes/sec
            </span>
          </div>
          <input
            type="range" min={0.25} max={1.0} step={0.05} value={tempoSecs}
            onChange={(e) => setTempoSecs(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full accent-kumkum cursor-pointer disabled:opacity-50"
          />
          <div className="flex justify-between text-[9px] font-bold text-muted-foreground mt-1">
            <span>Fast</span><span>Medium</span><span>Slow</span>
          </div>
        </div>
      </div>

      {/* Interactive Swara Badges */}
      <div className="space-y-5">
        {/* Arohana */}
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-kumkum mb-2 flex items-center gap-1.5">
            <Music className="size-3.5" /> Arohana (Veena Swarasthanas)
          </p>
          <div className="flex flex-wrap gap-2.5">
            {arohanaNotes.map((note, idx) => {
              const isActive = isPlaying && activeNoteIndex === idx;
              const firstLetter = note.charAt(0);
              const colorClass = SWARA_COLORS[firstLetter] || "bg-muted text-foreground border-border";

              return (
                <button
                  key={`aro-${idx}`}
                  onClick={() => playSwaraNote(note)}
                  className={`group relative px-4 py-3 rounded-xl border font-black text-sm transition-all duration-150 cursor-pointer shadow-sm ${colorClass} ${
                    isActive
                      ? "ring-4 ring-kumkum/40 scale-110 shadow-lg -translate-y-1"
                      : "hover:scale-105 hover:-translate-y-0.5"
                  }`}
                >
                  <span className="block font-serif text-base font-black">{note}</span>
                  <span className="block text-[8px] font-bold opacity-75 uppercase">
                    {(CARNATIC_SWARA_RATIOS[note] || 1.0).toFixed(3)}x
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Avarohana */}
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-kumkum mb-2 flex items-center gap-1.5">
            <Music className="size-3.5 rotate-180" /> Avarohana (Veena Swarasthanas)
          </p>
          <div className="flex flex-wrap gap-2.5">
            {avarohanaNotes.map((note, idx) => {
              const realIdx = arohanaNotes.length + idx;
              const isActive = isPlaying && activeNoteIndex === realIdx;
              const firstLetter = note.charAt(0);
              const colorClass = SWARA_COLORS[firstLetter] || "bg-muted text-foreground border-border";

              return (
                <button
                  key={`ava-${idx}`}
                  onClick={() => playSwaraNote(note)}
                  className={`group relative px-4 py-3 rounded-xl border font-black text-sm transition-all duration-150 cursor-pointer shadow-sm ${colorClass} ${
                    isActive
                      ? "ring-4 ring-marigold/40 scale-110 shadow-lg -translate-y-1"
                      : "hover:scale-105 hover:-translate-y-0.5"
                  }`}
                >
                  <span className="block font-serif text-base font-black">{note}</span>
                  <span className="block text-[8px] font-bold opacity-75 uppercase">
                    {(CARNATIC_SWARA_RATIOS[note] || 1.0).toFixed(3)}x
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
