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

  // Parse notes from string
  const arohanaNotes = arohana.split(" ").filter(Boolean);
  const avarohanaNotes = avarohana.split(" ").filter(Boolean);
  const fullSequence = [...arohanaNotes, ...avarohanaNotes];

  // Synthesize rich swara tone with harmonics
  const playSwaraNote = useCallback((swara: string) => {
    const ctx = getAudioContext();
    const ratio = CARNATIC_SWARA_RATIOS[swara] || 1.0;
    const freq = selectedKey.freq * ratio;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.6, now + 0.04);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + tempoSecs * 0.95);

    // Warm Body Filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 6, now);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Harmonics stack (fundamental + overtones for warm acoustic feel)
    const harmonics = [
      { mult: 1, gain: 0.7 },
      { mult: 2, gain: 0.3 },
      { mult: 3, gain: 0.15 },
      { mult: 4, gain: 0.08 },
    ];

    harmonics.forEach(({ mult, gain: g }) => {
      const osc = ctx.createOscillator();
      osc.type = mult === 1 ? "triangle" : "sawtooth";
      osc.frequency.setValueAtTime(freq * mult, now);

      const hGain = ctx.createGain();
      hGain.gain.setValueAtTime(g, now);

      osc.connect(hGain);
      hGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + tempoSecs);
    });
  }, [getAudioContext, selectedKey, tempoSecs]);

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
              Swara Audio Synthesizer
            </Badge>
            <span className="text-xs font-extrabold text-swara-gold">
              Raga #{ragaNumber}
            </span>
          </div>
          <h3 className="font-serif text-xl md:text-2xl font-black text-kumkum flex items-center gap-2">
            <Volume2 className="size-5 text-kumkum" /> Play Swarasthanas for {ragaName}
          </h3>
          <p className="text-xs font-semibold text-muted-foreground mt-0.5">
            Click any Swara badge to pluck it individually, or press Play to hear the full Arohana & Avarohana scale.
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
              <Play className="size-4 fill-current" /> Play Swarasthanas
            </>
          )}
        </button>
      </div>

      {/* Controls: Sruthi Key & Speed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border border-swara-gold/20">
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
            <Music className="size-3.5" /> Arohana (Ascending Swarasthanas)
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
            <Music className="size-3.5 rotate-180" /> Avarohana (Descending Swarasthanas)
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
