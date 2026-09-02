"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, GitCompare, Music, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { MELAKARTA_SEED_DATA } from "@/lib/data/melakartas-seed";
import { SwarasthanaPlayer } from "@/components/music/swarasthana-player";

interface ExtendedRagaComparison {
  number: number;
  name: string;
  chakra: string;
  arohana: string;
  avarohana: string;
  type: string;
  notes: string;
  famousKritis: string[];
}

const RAGA_DATABASE: ExtendedRagaComparison[] = [
  ...MELAKARTA_SEED_DATA.map((m) => ({
    number: m.number,
    name: m.name,
    chakra: m.chakra,
    arohana: m.arohana,
    avarohana: m.avarohana,
    type: `Janaka Melakarta #${m.number}`,
    notes: `Melakarta Raga #${m.number} in ${m.chakra} Chakra according to Venkatamakhin's 72 scheme.`,
    famousKritis: [`${m.name} Kirthanam`, `Sri ${m.name} Ganam`],
  })),
  {
    number: 2801,
    name: "Mohanam",
    chakra: "Audava (Derived from #28 Harikambhoji)",
    arohana: "S R2 G3 P D2 S'",
    avarohana: "S' D2 P G3 R2 S",
    type: "Janya Raga (Audava - 5 Swaras)",
    notes: "Pentatonic symmetrical scale. Replaces M and N with pure S R2 G3 P D2 phrasing.",
    famousKritis: ["Ninnukora (Varnam / Adi Tala)", "Kapali (Mohanam / Adi Tala)"],
  },
  {
    number: 2901,
    name: "Hamsadhwani",
    chakra: "Audava (Derived from #29 Sankarabharanam)",
    arohana: "S R2 G3 P N3 S'",
    avarohana: "S' N3 P G3 R2 S",
    type: "Janya Raga (Audava - 5 Swaras)",
    notes: "Popular auspicious raga composed by Ramaswami Dikshitar. Uses Kakali Nishada N3 instead of Dhaivata.",
    famousKritis: ["Vatapi Ganapatim (Hamsadhwani / Adi)", "Raghunayaka (Hamsadhwani / Adi)"],
  },
  {
    number: 2001,
    name: "Bhairavi",
    chakra: "Bhashanga (Derived from #20 Natabhairavi)",
    arohana: "S R2 G2 M1 P D2 N2 S'",
    avarohana: "S' N2 D1 P M1 G2 R2 S",
    type: "Janya Raga (Bhashanga)",
    notes: "Uses Chatusruti Dhaivata D2 in Arohana and Suddha Dhaivata D1 in Avarohana.",
    famousKritis: ["Kamakshi Swarajathi (Bhairavi / Chapu)", "Viriboni (Varnam / Ata Tala)"],
  },
];

export default function RagaComparePage() {
  const [raga1Name, setRaga1Name] = useState<string>("Mohanam");
  const [raga2Name, setRaga2Name] = useState<string>("Hamsadhwani");

  const raga1 = RAGA_DATABASE.find((r) => r.name === raga1Name) || RAGA_DATABASE[0];
  const raga2 = RAGA_DATABASE.find((r) => r.name === raga2Name) || RAGA_DATABASE[1];

  // Compare Swarasthana tokens
  const raga1SwaraTokens = raga1.arohana.split(/\s+/).filter(Boolean);
  const raga2SwaraTokens = raga2.arohana.split(/\s+/).filter(Boolean);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* High-Visibility Realistic Sangeetha Trinity Background Theme */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-[center_top] bg-no-repeat opacity-50 dark:opacity-45"
        style={{ backgroundImage: "url('/trinity-theme-bg.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/30 via-transparent to-background/50" />

      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-kumkum transition-colors bg-card/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-border shadow-xs mb-8"
        >
          <ArrowLeft className="size-4" /> Back to Knowledge Hub
        </Link>

        {/* Header */}
        <div className="mb-10">
          <Badge variant="outline" className="border-kumkum/30 text-kumkum mb-3 font-bold">
            <GitCompare className="mr-1.5 size-3.5" />
            Side-by-Side Raga Comparison Matrix
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
            Compare Any Two Carnatic Ragas
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed text-sm">
            Select any two Melakarta or Janya ragas to inspect side-by-side Arohana/Avarohana swarasthana differences, parent classifications, and audio player sound signatures.
          </p>
        </div>

        {/* Raga Selectors */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          {/* Raga 1 Selector */}
          <div className="glass-panel rounded-3xl border border-swara-gold/40 bg-card/85 backdrop-blur-md p-6 space-y-3 shadow-md">
            <label className="block text-xs font-bold text-kumkum uppercase tracking-wider">
              Select Raga 1:
            </label>
            <select
              value={raga1Name}
              onChange={(e) => setRaga1Name(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-serif font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-kumkum/40"
            >
              {RAGA_DATABASE.map((r) => (
                <option key={`r1-${r.name}`} value={r.name}>
                  {r.name} ({r.type})
                </option>
              ))}
            </select>
          </div>

          {/* Raga 2 Selector */}
          <div className="glass-panel rounded-3xl border border-swara-gold/40 bg-card/85 backdrop-blur-md p-6 space-y-3 shadow-md">
            <label className="block text-xs font-bold text-kumkum uppercase tracking-wider">
              Select Raga 2:
            </label>
            <select
              value={raga2Name}
              onChange={(e) => setRaga2Name(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-serif font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-kumkum/40"
            >
              {RAGA_DATABASE.map((r) => (
                <option key={`r2-${r.name}`} value={r.name}>
                  {r.name} ({r.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          {/* Raga 1 Card */}
          <div className="glass-panel rounded-3xl border border-swara-gold/30 bg-card/85 backdrop-blur-md p-6 space-y-5 shadow-lg">
            <div className="border-b border-border pb-4">
              <Badge className="bg-kumkum text-white font-bold mb-2 text-xs">
                Raga 1
              </Badge>
              <h2 className="font-serif text-2xl font-bold text-kumkum">{raga1.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">{raga1.type}</p>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-foreground block mb-1">Arohana (Ascending):</span>
                <div className="bg-muted/60 p-3 rounded-xl font-serif text-base font-bold text-kumkum border border-border">
                  {raga1.arohana}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-foreground block mb-1">Avarohana (Descending):</span>
                <div className="bg-muted/60 p-3 rounded-xl font-serif text-base font-bold text-kumkum border border-border">
                  {raga1.avarohana}
                </div>
              </div>

              <div className="pt-2 text-xs text-muted-foreground leading-relaxed">
                💡 <strong className="text-foreground">Theory Notes:</strong> {raga1.notes}
              </div>
            </div>
          </div>

          {/* Raga 2 Card */}
          <div className="glass-panel rounded-3xl border border-swara-gold/30 bg-card/85 backdrop-blur-md p-6 space-y-5 shadow-lg">
            <div className="border-b border-border pb-4">
              <Badge className="bg-swara-gold text-shanti-slate font-bold mb-2 text-xs">
                Raga 2
              </Badge>
              <h2 className="font-serif text-2xl font-bold text-kumkum">{raga2.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">{raga2.type}</p>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-foreground block mb-1">Arohana (Ascending):</span>
                <div className="bg-muted/60 p-3 rounded-xl font-serif text-base font-bold text-kumkum border border-border">
                  {raga2.arohana}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-foreground block mb-1">Avarohana (Descending):</span>
                <div className="bg-muted/60 p-3 rounded-xl font-serif text-base font-bold text-kumkum border border-border">
                  {raga2.avarohana}
                </div>
              </div>

              <div className="pt-2 text-xs text-muted-foreground leading-relaxed">
                💡 <strong className="text-foreground">Theory Notes:</strong> {raga2.notes}
              </div>
            </div>
          </div>
        </div>

        {/* Swara Difference Analysis Card */}
        <div className="glass-panel rounded-3xl border border-swara-gold/30 bg-card/85 backdrop-blur-md p-6 md:p-8 space-y-6 shadow-xl mb-12">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Sparkles className="size-5 text-swara-gold" />
            <h3 className="font-serif text-xl font-bold text-kumkum">
              Key Swara Differences Analysis ({raga1.name} vs. {raga2.name})
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <p className="font-bold text-amber-900 dark:text-amber-300 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-amber-600" />
                {raga1.name} Swara Structure
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ascends as <strong>{raga1.arohana}</strong>. {raga1.notes}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <p className="font-bold text-amber-900 dark:text-amber-300 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-amber-600" />
                {raga2.name} Swara Structure
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ascends as <strong>{raga2.arohana}</strong>. {raga2.notes}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Audio Player for Raga 1 */}
        <div className="mb-12 space-y-4">
          <h3 className="font-serif text-lg font-bold text-kumkum flex items-center gap-2">
            <Music className="size-4 text-swara-gold" /> Play & Listen Swarasthana: {raga1.name}
          </h3>
          <SwarasthanaPlayer
            ragaName={raga1.name}
            arohana={raga1.arohana}
            avarohana={raga1.avarohana}
          />
        </div>

        {/* Interactive Audio Player for Raga 2 */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-kumkum flex items-center gap-2">
            <Music className="size-4 text-swara-gold" /> Play & Listen Swarasthana: {raga2.name}
          </h3>
          <SwarasthanaPlayer
            ragaName={raga2.name}
            arohana={raga2.arohana}
            avarohana={raga2.avarohana}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
