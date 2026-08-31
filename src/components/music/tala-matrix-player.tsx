"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Square, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface SuladiTala {
  id: string;
  name: string;
  family: "Dhruva" | "Matya" | "Rupaka" | "Jhampa" | "Triputa" | "Ata" | "Eka";
  jathi: "Tisra" | "Chatusra" | "Khanda" | "Misra" | "Sankeerna";
  jathiValue: number;
  totalBeats: number;
  angaNotation: string;
  description: string;
}

// Complete 35 Suladi Sapta Tala dataset (7 Tala Families x 5 Jathis)
export const SULADI_35_TALAS: SuladiTala[] = [
  // 1. DHRUVA TALA (Angas: Laghu + Dhrutam + Laghu + Laghu)
  { id: "dt-1", name: "Tisra Jathi Dhruva Tala", family: "Dhruva", jathi: "Tisra", jathiValue: 3, totalBeats: 11, angaNotation: "I3 O I3 I3", description: "1 Tisra Laghu (3) + 1 Dhrutam (2) + 2 Tisra Laghus (6) = 11 beats." },
  { id: "dt-2", name: "Chatusra Jathi Dhruva Tala", family: "Dhruva", jathi: "Chatusra", jathiValue: 4, totalBeats: 14, angaNotation: "I4 O I4 I4", description: "1 Chatusra Laghu (4) + 1 Dhrutam (2) + 2 Chatusra Laghus (8) = 14 beats." },
  { id: "dt-3", name: "Khanda Jathi Dhruva Tala", family: "Dhruva", jathi: "Khanda", jathiValue: 5, totalBeats: 17, angaNotation: "I5 O I5 I5", description: "1 Khanda Laghu (5) + 1 Dhrutam (2) + 2 Khanda Laghus (10) = 17 beats." },
  { id: "dt-4", name: "Misra Jathi Dhruva Tala", family: "Dhruva", jathi: "Misra", jathiValue: 7, totalBeats: 23, angaNotation: "I7 O I7 I7", description: "1 Misra Laghu (7) + 1 Dhrutam (2) + 2 Misra Laghus (14) = 23 beats." },
  { id: "dt-5", name: "Sankeerna Jathi Dhruva Tala", family: "Dhruva", jathi: "Sankeerna", jathiValue: 9, totalBeats: 29, angaNotation: "I9 O I9 I9", description: "1 Sankeerna Laghu (9) + 1 Dhrutam (2) + 2 Sankeerna Laghus (18) = 29 beats." },

  // 2. MATYA TALA (Angas: Laghu + Dhrutam + Laghu)
  { id: "mt-1", name: "Tisra Jathi Matya Tala", family: "Matya", jathi: "Tisra", jathiValue: 3, totalBeats: 8, angaNotation: "I3 O I3", description: "1 Tisra Laghu (3) + 1 Dhrutam (2) + 1 Tisra Laghu (3) = 8 beats." },
  { id: "mt-2", name: "Chatusra Jathi Matya Tala", family: "Matya", jathi: "Chatusra", jathiValue: 4, totalBeats: 10, angaNotation: "I4 O I4", description: "1 Chatusra Laghu (4) + 1 Dhrutam (2) + 1 Chatusra Laghu (4) = 10 beats." },
  { id: "mt-3", name: "Khanda Jathi Matya Tala", family: "Matya", jathi: "Khanda", jathiValue: 5, totalBeats: 12, angaNotation: "I5 O I5", description: "1 Khanda Laghu (5) + 1 Dhrutam (2) + 1 Khanda Laghu (5) = 12 beats." },
  { id: "mt-4", name: "Misra Jathi Matya Tala", family: "Matya", jathi: "Misra", jathiValue: 7, totalBeats: 16, angaNotation: "I7 O I7", description: "1 Misra Laghu (7) + 1 Dhrutam (2) + 1 Misra Laghu (7) = 16 beats." },
  { id: "mt-5", name: "Sankeerna Jathi Matya Tala", family: "Matya", jathi: "Sankeerna", jathiValue: 9, totalBeats: 20, angaNotation: "I9 O I9", description: "1 Sankeerna Laghu (9) + 1 Dhrutam (2) + 1 Sankeerna Laghu (9) = 20 beats." },

  // 3. RUPAKA TALA (Angas: Dhrutam + Laghu)
  { id: "rt-1", name: "Tisra Jathi Rupaka Tala", family: "Rupaka", jathi: "Tisra", jathiValue: 3, totalBeats: 5, angaNotation: "O I3", description: "1 Dhrutam (2) + 1 Tisra Laghu (3) = 5 beats." },
  { id: "rt-2", name: "Chatusra Jathi Rupaka Tala", family: "Rupaka", jathi: "Chatusra", jathiValue: 4, totalBeats: 6, angaNotation: "O I4", description: "1 Dhrutam (2) + 1 Chatusra Laghu (4) = 6 beats." },
  { id: "rt-3", name: "Khanda Jathi Rupaka Tala", family: "Rupaka", jathi: "Khanda", jathiValue: 5, totalBeats: 7, angaNotation: "O I5", description: "1 Dhrutam (2) + 1 Khanda Laghu (5) = 7 beats." },
  { id: "rt-4", name: "Misra Jathi Rupaka Tala", family: "Rupaka", jathi: "Misra", jathiValue: 7, totalBeats: 9, angaNotation: "O I7", description: "1 Dhrutam (2) + 1 Misra Laghu (7) = 9 beats." },
  { id: "rt-5", name: "Sankeerna Jathi Rupaka Tala", family: "Rupaka", jathi: "Sankeerna", jathiValue: 9, totalBeats: 11, angaNotation: "O I9", description: "1 Dhrutam (2) + 1 Sankeerna Laghu (9) = 11 beats." },

  // 4. JHAMPA TALA (Angas: Laghu + Anudhrutam + Dhrutam)
  { id: "jt-1", name: "Tisra Jathi Jhampa Tala", family: "Jhampa", jathi: "Tisra", jathiValue: 3, totalBeats: 6, angaNotation: "I3 U O", description: "1 Tisra Laghu (3) + 1 Anudhrutam (1) + 1 Dhrutam (2) = 6 beats." },
  { id: "jt-2", name: "Chatusra Jathi Jhampa Tala", family: "Jhampa", jathi: "Chatusra", jathiValue: 4, totalBeats: 7, angaNotation: "I4 U O", description: "1 Chatusra Laghu (4) + 1 Anudhrutam (1) + 1 Dhrutam (2) = 7 beats." },
  { id: "jt-3", name: "Khanda Jathi Jhampa Tala", family: "Jhampa", jathi: "Khanda", jathiValue: 5, totalBeats: 8, angaNotation: "I5 U O", description: "1 Khanda Laghu (5) + 1 Anudhrutam (1) + 1 Dhrutam (2) = 8 beats." },
  { id: "jt-4", name: "Misra Jathi Jhampa Tala", family: "Jhampa", jathi: "Misra", jathiValue: 7, totalBeats: 10, angaNotation: "I7 U O", description: "1 Misra Laghu (7) + 1 Anudhrutam (1) + 1 Dhrutam (2) = 10 beats." },
  { id: "jt-5", name: "Sankeerna Jathi Jhampa Tala", family: "Jhampa", jathi: "Sankeerna", jathiValue: 9, totalBeats: 12, angaNotation: "I9 U O", description: "1 Sankeerna Laghu (9) + 1 Anudhrutam (1) + 1 Dhrutam (2) = 12 beats." },

  // 5. TRIPUTA TALA (Angas: Laghu + Dhrutam + Dhrutam)
  { id: "tt-1", name: "Tisra Jathi Triputa Tala", family: "Triputa", jathi: "Tisra", jathiValue: 3, totalBeats: 7, angaNotation: "I3 O O", description: "1 Tisra Laghu (3) + 2 Dhrutams (4) = 7 beats." },
  { id: "tt-2", name: "Chatusra Jathi Triputa Tala (Adi Tala)", family: "Triputa", jathi: "Chatusra", jathiValue: 4, totalBeats: 8, angaNotation: "I4 O O", description: "1 Chatusra Laghu (4) + 2 Dhrutams (4) = 8 beats (Popularly known as ADI TALA)." },
  { id: "tt-3", name: "Khanda Jathi Triputa Tala", family: "Triputa", jathi: "Khanda", jathiValue: 5, totalBeats: 9, angaNotation: "I5 O O", description: "1 Khanda Laghu (5) + 2 Dhrutams (4) = 9 beats." },
  { id: "tt-4", name: "Misra Jathi Triputa Tala", family: "Triputa", jathi: "Misra", jathiValue: 7, totalBeats: 11, angaNotation: "I7 O O", description: "1 Misra Laghu (7) + 2 Dhrutams (4) = 11 beats." },
  { id: "tt-5", name: "Sankeerna Jathi Triputa Tala", family: "Triputa", jathi: "Sankeerna", jathiValue: 9, totalBeats: 13, angaNotation: "I9 O O", description: "1 Sankeerna Laghu (9) + 2 Dhrutams (4) = 13 beats." },

  // 6. ATA TALA (Angas: Laghu + Laghu + Dhrutam + Dhrutam)
  { id: "at-1", name: "Tisra Jathi Ata Tala", family: "Ata", jathi: "Tisra", jathiValue: 3, totalBeats: 10, angaNotation: "I3 I3 O O", description: "2 Tisra Laghus (6) + 2 Dhrutams (4) = 10 beats." },
  { id: "at-2", name: "Chatusra Jathi Ata Tala", family: "Ata", jathi: "Chatusra", jathiValue: 4, totalBeats: 12, angaNotation: "I4 I4 O O", description: "2 Chatusra Laghus (8) + 2 Dhrutams (4) = 12 beats." },
  { id: "at-3", name: "Khanda Jathi Ata Tala", family: "Ata", jathi: "Khanda", jathiValue: 5, totalBeats: 14, angaNotation: "I5 I5 O O", description: "2 Khanda Laghus (10) + 2 Dhrutams (4) = 14 beats." },
  { id: "at-4", name: "Misra Jathi Ata Tala", family: "Ata", jathi: "Misra", jathiValue: 7, totalBeats: 18, angaNotation: "I7 I7 O O", description: "2 Misra Laghus (14) + 2 Dhrutams (4) = 18 beats." },
  { id: "at-5", name: "Sankeerna Jathi Ata Tala", family: "Ata", jathi: "Sankeerna", jathiValue: 9, totalBeats: 22, angaNotation: "I9 I9 O O", description: "2 Sankeerna Laghus (18) + 2 Dhrutams (4) = 22 beats." },

  // 7. EKA TALA (Angas: Laghu)
  { id: "et-1", name: "Tisra Jathi Eka Tala", family: "Eka", jathi: "Tisra", jathiValue: 3, totalBeats: 3, angaNotation: "I3", description: "1 Tisra Laghu (3) = 3 beats." },
  { id: "et-2", name: "Chatusra Jathi Eka Tala", family: "Eka", jathi: "Chatusra", jathiValue: 4, totalBeats: 4, angaNotation: "I4", description: "1 Chatusra Laghu (4) = 4 beats." },
  { id: "et-3", name: "Khanda Jathi Eka Tala", family: "Eka", jathi: "Khanda", jathiValue: 5, totalBeats: 5, angaNotation: "I5", description: "1 Khanda Laghu (5) = 5 beats." },
  { id: "et-4", name: "Misra Jathi Eka Tala", family: "Eka", jathi: "Misra", jathiValue: 7, totalBeats: 7, angaNotation: "I7", description: "1 Misra Laghu (7) = 7 beats." },
  { id: "et-5", name: "Sankeerna Jathi Eka Tala", family: "Eka", jathi: "Sankeerna", jathiValue: 9, totalBeats: 9, angaNotation: "I9", description: "1 Sankeerna Laghu (9) = 9 beats." },
];

export function TalaMatrixPlayer() {
  const [selectedJathi, setSelectedJathi] = useState<string>("All");
  const [selectedFamily, setSelectedFamily] = useState<string>("All");
  const [activeTala, setActiveTala] = useState<SuladiTala>(SULADI_35_TALAS[21]); // Default to Adi Tala
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play wooden Manjira / Kanjira beat sound
  const playClickSound = (isFirstBeat: boolean) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContextClass();
      if (ctx.state === "suspended") ctx.resume();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isFirstBeat ? "sine" : "triangle";
      osc.frequency.setValueAtTime(isFirstBeat ? 880 : 440, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn("Click sound error:", e);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentBeat((prev) => {
          const next = (prev + 1) % activeTala.totalBeats;
          playClickSound(next === 0);
          return next;
        });
      }, 500); // 120 BPM
    } else {
      setCurrentBeat(0);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeTala]);

  const filteredTalas = SULADI_35_TALAS.filter((t) => {
    const matchJ = selectedJathi === "All" || t.jathi === selectedJathi;
    const matchF = selectedFamily === "All" || t.family === selectedFamily;
    return matchJ && matchF;
  });

  return (
    <div className="space-y-8">
      {/* Interactive Tala Player & Rhythm Metronome */}
      <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 bg-card p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div>
            <Badge className="bg-kumkum/10 text-kumkum border-none text-[10px] mb-1">
              35 Suladi Sapta Tala System
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-kumkum">{activeTala.name}</h2>
            <p className="text-xs text-muted-foreground mt-1">{activeTala.description}</p>
          </div>

          <Button
            size="lg"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`shrink-0 text-white font-bold gap-2 text-xs py-2.5 px-5 rounded-2xl transition-all shadow-md ${
              isPlaying
                ? "bg-kumkum hover:bg-kumkum-light"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="size-4 fill-current animate-pulse" /> Stop Metronome
              </>
            ) : (
              <>
                <Play className="size-4 fill-current" /> Start Tala Pulse
              </>
            )}
          </Button>
        </div>

        {/* Akshara Beats Visualizer Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Anga Notation: <strong className="text-kumkum">{activeTala.angaNotation}</strong></span>
            <span className="text-kumkum font-bold">Cycle Beats: {activeTala.totalBeats} Aksharas</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: activeTala.totalBeats }).map((_, i) => (
              <div
                key={i}
                className={`size-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                  isPlaying && currentBeat === i
                    ? "bg-kumkum text-white scale-110 shadow-md ring-2 ring-swara-gold"
                    : i === 0
                    ? "bg-swara-gold/20 text-kumkum border border-swara-gold/40"
                    : "bg-muted text-muted-foreground border border-border/50"
                }`}
              >
                <span>{i + 1}</span>
                <span className="text-[8px] font-normal opacity-70">
                  {i === 0 ? "Samam" : "Beat"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-muted-foreground mr-1">Filter Jathi:</span>
          {["All", "Tisra", "Chatusra", "Khanda", "Misra", "Sankeerna"].map((j) => (
            <button
              key={j}
              onClick={() => setSelectedJathi(j)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedJathi === j
                  ? "bg-kumkum text-white shadow-sm font-bold"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {j} {j !== "All" && `(${j === "Tisra" ? 3 : j === "Chatusra" ? 4 : j === "Khanda" ? 5 : j === "Misra" ? 7 : 9})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">Family:</span>
          <select
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            <option value="All">All 7 Tala Families</option>
            <option value="Dhruva">Dhruva</option>
            <option value="Matya">Matya</option>
            <option value="Rupaka">Rupaka</option>
            <option value="Jhampa">Jhampa</option>
            <option value="Triputa">Triputa</option>
            <option value="Ata">Ata</option>
            <option value="Eka">Eka</option>
          </select>
        </div>
      </div>

      {/* 35 Suladi Sapta Tala Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTalas.map((t) => (
          <div
            key={t.id}
            onClick={() => {
              setActiveTala(t);
              setIsPlaying(false);
            }}
            className={`glass-panel rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
              activeTala.id === t.id
                ? "border-kumkum bg-kumkum/5 shadow-md ring-1 ring-kumkum"
                : "border-swara-gold/15 bg-card hover:border-kumkum/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="border-swara-gold/30 text-swara-gold text-[10px]">
                  {t.jathi} Jathi ({t.jathiValue})
                </Badge>
                <span className="text-xs font-extrabold text-kumkum bg-kumkum/10 px-2 py-0.5 rounded-full">
                  {t.totalBeats} Beats
                </span>
              </div>

              <h4 className="font-serif text-base font-bold text-foreground mb-1">{t.name}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t.description}</p>
            </div>

            <div className="border-t border-border/50 pt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground text-[11px]">Notation:</span>
              <span className="font-serif font-bold text-kumkum bg-kumkum/5 px-2 py-0.5 rounded-md">
                {t.angaNotation}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
