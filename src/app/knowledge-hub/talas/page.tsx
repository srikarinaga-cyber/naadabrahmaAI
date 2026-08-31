export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Music, Info, Activity, Layers } from "lucide-react";
import { getTalas } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/static";

// ──────────────────────────────────────────────
// 35 SULADI SAPTA TALA DATA SYSTEM
// ──────────────────────────────────────────────
interface SaptaTalaDef {
  id: string;
  name: string;
  symbol: string;
  angaNotation: string;
  description: string;
  counts: {
    tisra: number;     // Laghu = 3
    chatusra: number;  // Laghu = 4
    khanda: number;    // Laghu = 5
    misra: number;     // Laghu = 7
    sankeerna: number; // Laghu = 9
  };
}

const SAPTA_TALAS: SaptaTalaDef[] = [
  {
    id: "dhruva",
    name: "Dhruva Tala",
    symbol: "I O I I",
    angaNotation: "Laghu + Dhrutam + Laghu + Laghu",
    description: "A majestic 4-anga cycle. Contains 3 Laghus and 1 Dhrutam.",
    counts: { tisra: 11, chatusra: 14, khanda: 17, misra: 23, sankeerna: 29 },
  },
  {
    id: "matya",
    name: "Matya Tala",
    symbol: "I O I",
    angaNotation: "Laghu + Dhrutam + Laghu",
    description: "A 3-anga balanced cycle with 2 Laghus flanking 1 Dhrutam.",
    counts: { tisra: 8, chatusra: 10, khanda: 12, misra: 16, sankeerna: 20 },
  },
  {
    id: "rupaka",
    name: "Rupaka Tala",
    symbol: "O I",
    angaNotation: "Dhrutam + Laghu",
    description: "A popular 2-anga cycle starting with a Dhrutam followed by a Laghu.",
    counts: { tisra: 5, chatusra: 6, khanda: 7, misra: 9, sankeerna: 11 },
  },
  {
    id: "jhampa",
    name: "Jhampa Tala",
    symbol: "I U O",
    angaNotation: "Laghu + Anudhrutam + Dhrutam",
    description: "The only Sapta Tala containing an Anudhrutam (1 beat beat-only anga).",
    counts: { tisra: 6, chatusra: 7, khanda: 8, misra: 10, sankeerna: 12 },
  },
  {
    id: "triputa",
    name: "Triputa Tala",
    symbol: "I O O",
    angaNotation: "Laghu + Dhrutam + Dhrutam",
    description: "Contains 1 Laghu and 2 Dhrutams. Chatusra Jaati Triputa is popularly known as Adi Tala (8 beats).",
    counts: { tisra: 7, chatusra: 8, khanda: 9, misra: 11, sankeerna: 13 },
  },
  {
    id: "ata",
    name: "Ata Tala",
    symbol: "I I O O",
    angaNotation: "Laghu + Laghu + Dhrutam + Dhrutam",
    description: "A grand 4-anga rhythm framework with 2 Laghus and 2 Dhrutams.",
    counts: { tisra: 10, chatusra: 12, khanda: 14, misra: 18, sankeerna: 22 },
  },
  {
    id: "eka",
    name: "Eka Tala",
    symbol: "I",
    angaNotation: "Laghu",
    description: "The simplest 1-anga cycle consisting solely of 1 Laghu.",
    counts: { tisra: 3, chatusra: 4, khanda: 5, misra: 7, sankeerna: 9 },
  },
];

const JAATIS = [
  { key: "tisra", label: "Tisra (3)", laghu: 3, desc: "3 counts per Laghu" },
  { key: "chatusra", label: "Chatusra (4)", laghu: 4, desc: "4 counts per Laghu" },
  { key: "khanda", label: "Khanda (5)", laghu: 5, desc: "5 counts per Laghu" },
  { key: "misra", label: "Misra (7)", laghu: 7, desc: "7 counts per Laghu" },
  { key: "sankeerna", label: "Sankeerna (9)", laghu: 9, desc: "9 counts per Laghu" },
];

export default async function TalasPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-semibold">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12 pb-20">
        
        {/* Back Link */}
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-kumkum mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Knowledge Hub
        </Link>

        {/* ── Page Header ── */}
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 p-8 md:p-10 mb-10 bg-gradient-to-r from-sandalwood via-card to-sandalwood-dark">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-kumkum/15 text-kumkum border-kumkum/25 font-black text-xs px-3 py-1">
                  Carnatic Rhythmology
                </Badge>
                <Badge variant="outline" className="border-swara-gold/40 text-marigold font-bold">
                  Suladi Sapta Tala System
                </Badge>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-black text-kumkum tracking-tight">
                35 Talas & Talanga Table
              </h1>
              <p className="text-muted-foreground mt-3 max-w-2xl text-base font-semibold leading-relaxed">
                The 35 Tala classification is created by pairing the <strong>7 Sapta Talas</strong> with the <strong>5 Jaatis</strong>. Each combination defines a unique beat count (*Aksharakala*) and rhythmic structure.
              </p>
            </div>

            <div className="hidden md:flex size-24 items-center justify-center rounded-2xl border-2 border-swara-gold/30 bg-swara-gold/10 shrink-0 text-center p-3">
              <div>
                <p className="font-serif text-3xl font-black text-swara-gold leading-none">35</p>
                <p className="text-[10px] font-black uppercase text-kumkum mt-1 tracking-wider">Talas</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Anga Explanations Card ── */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          <div className="glass-panel rounded-2xl border border-swara-gold/20 p-5 bg-card/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="size-7 rounded-lg bg-kumkum/15 text-kumkum font-black flex items-center justify-center text-xs">U</span>
              <h3 className="font-serif text-base font-black text-kumkum">Anudhrutam</h3>
            </div>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              <strong>1 Beat</strong> (1 Beat/Clap). Notation symbol: <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-kumkum font-bold">U</code>.
            </p>
          </div>

          <div className="glass-panel rounded-2xl border border-swara-gold/20 p-5 bg-card/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="size-7 rounded-lg bg-marigold/15 text-marigold font-black flex items-center justify-center text-xs">O</span>
              <h3 className="font-serif text-base font-black text-kumkum">Dhrutam</h3>
            </div>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              <strong>2 Beats</strong> (1 Beat/Clap + 1 Wave/Visarjitam). Symbol: <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-marigold font-bold">O</code>.
            </p>
          </div>

          <div className="glass-panel rounded-2xl border border-swara-gold/20 p-5 bg-card/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="size-7 rounded-lg bg-swara-gold/15 text-swara-gold font-black flex items-center justify-center text-xs">I</span>
              <h3 className="font-serif text-base font-black text-kumkum">Laghu</h3>
            </div>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              <strong>Variable Beats</strong> (1 Beat + Finger counts based on Jaati: 3, 4, 5, 7, or 9 counts). Symbol: <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-swara-gold font-bold">I</code>.
            </p>
          </div>
        </div>

        {/* ── 35 TALAS MATRIX TABLE ── */}
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 overflow-hidden mb-12 shadow-xl">
          <div className="p-6 border-b border-swara-gold/20 bg-kumkum/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl md:text-2xl font-black text-kumkum flex items-center gap-2">
                <Layers className="size-5 text-kumkum" /> Complete 35 Talangas Matrix Table
              </h2>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                Total Aksharas (beats) for all 7 Sapta Talas across 5 Jaatis (7 × 5 = 35 Talas)
              </p>
            </div>

            <Badge className="bg-swara-gold/15 text-swara-gold border-swara-gold/30 font-black text-xs self-start sm:self-auto">
              7 Sapta Talas × 5 Jaatis
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-swara-gold/20 text-xs font-black uppercase tracking-wider text-kumkum">
                  <th className="p-4 pl-6">Sapta Tala</th>
                  <th className="p-4">Anga Structure</th>
                  {JAATIS.map((j) => (
                    <th key={j.key} className="p-4 text-center">
                      <span>{j.label}</span>
                      <span className="block text-[9px] text-muted-foreground font-normal lowercase">{j.desc}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-swara-gold/10 text-sm">
                {SAPTA_TALAS.map((tala, idx) => (
                  <tr key={tala.id} className={idx % 2 === 0 ? "bg-card/50 hover:bg-kumkum/5 transition-colors" : "bg-card/90 hover:bg-kumkum/5 transition-colors"}>
                    
                    {/* Tala Name */}
                    <td className="p-4 pl-6 font-extrabold text-foreground whitespace-nowrap">
                      <p className="font-serif text-base text-kumkum font-black">{tala.name}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{tala.angaNotation}</p>
                    </td>

                    {/* Anga Symbol */}
                    <td className="p-4 font-mono font-black text-xs text-swara-gold whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-swara-gold/10 border border-swara-gold/20">
                        {tala.symbol}
                      </span>
                    </td>

                    {/* Beats per Jaati */}
                    <td className="p-4 text-center font-black text-base text-foreground">
                      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-background border border-border shadow-xs">
                        {tala.counts.tisra}
                      </span>
                    </td>

                    <td className="p-4 text-center font-black text-base text-kumkum">
                      <span className={`inline-flex size-9 items-center justify-center rounded-xl border shadow-xs ${
                        tala.id === "triputa" ? "bg-kumkum/15 border-kumkum text-kumkum ring-2 ring-kumkum/30" : "bg-background border-border"
                      }`}>
                        {tala.counts.chatusra}
                      </span>
                      {tala.id === "triputa" && (
                        <span className="block text-[9px] font-black text-kumkum uppercase mt-0.5">Adi Tala</span>
                      )}
                    </td>

                    <td className="p-4 text-center font-black text-base text-foreground">
                      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-background border border-border shadow-xs">
                        {tala.counts.khanda}
                      </span>
                    </td>

                    <td className="p-4 text-center font-black text-base text-foreground">
                      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-background border border-border shadow-xs">
                        {tala.counts.misra}
                      </span>
                    </td>

                    <td className="p-4 text-center font-black text-base text-foreground">
                      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-background border border-border shadow-xs">
                        {tala.counts.sankeerna}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Sapta Tala Individual Descriptions ── */}
        <div className="space-y-4 mb-10">
          <h2 className="font-serif text-2xl font-black text-kumkum flex items-center gap-2">
            <Clock className="size-5 text-kumkum" /> Detailed Sapta Tala Breakdown
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {SAPTA_TALAS.map((tala) => (
              <div
                key={tala.id}
                className="glass-panel rounded-2xl p-6 border border-swara-gold/20 bg-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-lg font-black text-kumkum">
                      {tala.name}
                    </h3>
                    <Badge className="bg-swara-gold/15 text-swara-gold border-swara-gold/30 font-black text-xs font-mono">
                      {tala.symbol}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground leading-relaxed mb-4">
                    {tala.description}
                  </p>
                </div>

                <div className="border-t border-swara-gold/15 pt-3">
                  <p className="text-[10px] font-black uppercase text-kumkum mb-2">Beats across 5 Jaatis:</p>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-extrabold">
                    <span className="px-2 py-0.5 rounded bg-muted">Tisra: {tala.counts.tisra}</span>
                    <span className="px-2 py-0.5 rounded bg-kumkum/10 text-kumkum">Chatusra: {tala.counts.chatusra}</span>
                    <span className="px-2 py-0.5 rounded bg-muted">Khanda: {tala.counts.khanda}</span>
                    <span className="px-2 py-0.5 rounded bg-muted">Misra: {tala.counts.misra}</span>
                    <span className="px-2 py-0.5 rounded bg-muted">Sankeerna: {tala.counts.sankeerna}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Interactive Practice Callout ── */}
        <div className="glass-panel rounded-3xl border border-swara-gold/30 p-8 bg-gradient-to-r from-kumkum/10 via-card to-marigold/10 text-center space-y-4">
          <h3 className="font-serif text-2xl font-black text-kumkum">
            Want to practice these 35 Talas with visual beat counting?
          </h3>
          <p className="text-sm font-semibold text-muted-foreground max-w-xl mx-auto">
            Try our interactive <strong>Carnatic Tala Rhythm Keeper Metronome</strong> in the Student Practice Hub with live finger counts and audio click accents.
          </p>
          <Link
            href="/student/practice"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-kumkum text-white font-black text-xs uppercase tracking-wider shadow-lg hover:bg-kumkum-light transition-all"
          >
            <Activity className="size-4" /> Open Tala Rhythm Metronome →
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
