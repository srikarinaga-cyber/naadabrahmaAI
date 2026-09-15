"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MELAKARTA_SEED_DATA, MelakartaSeed } from "@/lib/data/melakartas-seed";
import { Search, Sparkles, BookOpen, Music, ArrowRight, CornerDownRight, CheckCircle2, Volume2, HelpCircle } from "lucide-react";
import { LearningPath } from "@/lib/ai/learning-path";

// Extended Janya interface
interface JanyaItem {
  name: string;
  arohana: string;
  avarohana: string;
  notes: string;
  kriti: string;
}

import { getJanyasForMelakarta, ExtendedJanya } from "@/lib/data/janyas-db";

export function RagaTreeExplorer() {
  const [selectedMelakartaNum, setSelectedMelakartaNum] = useState<number>(15); // Default to Mayamalavagowla (#15)
  const [selectedJanya, setSelectedJanya] = useState<ExtendedJanya | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedChakra, setSelectedChakra] = useState<string>("All");
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);

  // Fetch active student learning path for personalized recommendation indicator
  useEffect(() => {
    async function loadPath() {
      try {
        const res = await fetch("/api/learning-path");
        if (res.ok) {
          const data = await res.json();
          if (data.learningPath) {
            setLearningPath(data.learningPath);
          }
        }
      } catch (e) {
        console.warn("Could not load student path for raga explorer:", e);
      }
    }
    loadPath();
  }, []);

  const selectedMelakarta: MelakartaSeed =
    MELAKARTA_SEED_DATA.find((m) => m.number === selectedMelakartaNum) || MELAKARTA_SEED_DATA[14];

  // Get Janyas for selected Melakarta guaranteed by getJanyasForMelakarta
  const janyaList: ExtendedJanya[] = getJanyasForMelakarta(selectedMelakartaNum, selectedMelakarta.name);

  // Filtered Melakartas list
  const chakras = ["All", "Indu", "Netra", "Agni", "Veda", "Bana", "Ruthu", "Rishi", "Vasu", "Brahma", "Disi", "Rudra", "Aditya"];

  const filteredMelakartas = MELAKARTA_SEED_DATA.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.number.toString() === searchQuery ||
      m.chakra.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChakra = selectedChakra === "All" || m.chakra.toLowerCase() === selectedChakra.toLowerCase();
    return matchesSearch && matchesChakra;
  });

  // Check if selected raga matches student's learning path
  const isRecommendedForStudent = (): boolean => {
    if (!learningPath) return false;
    const goal = learningPath.target_goal?.toLowerCase() || "";
    const level = learningPath.current_level || "beginner";

    if (level === "beginner" && (selectedMelakartaNum === 15 || selectedMelakartaNum === 29 || selectedMelakartaNum === 8)) {
      return true; // Mayamalavagowla, Shankarabharanam, Hanumatodi
    }
    if (level === "intermediate" && (selectedMelakartaNum === 22 || selectedMelakartaNum === 28 || selectedMelakartaNum === 20)) {
      return true; // Kharaharapriya, Harikambhoji, Natabhairavi
    }
    if (goal.includes("pitch") && selectedMelakartaNum === 15) return true;
    return false;
  };

  return (
    <div className="space-y-8">
      {/* ── Search & Chakra Filter Bar ── */}
      <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-r from-[#181006] via-[#100b04] to-[#0a0602] p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Classical Indian Musicology Taxonomy
            </span>
            <h2 className="text-2xl font-bold text-amber-100 tracking-wide mt-1">
              72 Melakarta Heritage Relationship Tree
            </h2>
            <p className="text-xs text-amber-300/60 mt-0.5">
              Explore Venkatamakhin&apos;s 72 Parent Melakartas and their musicological Janya derivatives
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 size-4 text-amber-400/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Raga name or # (e.g. 15, Mayamalavagowla)..."
              className="w-full rounded-xl border border-amber-900/50 bg-black/60 pl-10 pr-4 py-2.5 text-xs text-amber-100 focus:border-[#d4af37] focus:outline-none"
            />
          </div>
        </div>

        {/* Chakra Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-amber-400/70 uppercase tracking-wider mr-1 shrink-0">
            Chakra:
          </span>
          {chakras.map((chk) => (
            <button
              key={chk}
              onClick={() => setSelectedChakra(chk)}
              className={`px-3 py-1 rounded-lg border text-xs font-semibold whitespace-nowrap transition ${
                selectedChakra === chk
                  ? "border-[#d4af37] bg-[#d4af37]/20 text-amber-100"
                  : "border-amber-900/40 bg-black/40 text-amber-300/60 hover:border-amber-800"
              }`}
            >
              {chk}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Relationship Explorer Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 72 Melakarta Grid Selector (Span 4) */}
        <div className="lg:col-span-4 rounded-2xl border border-amber-900/40 bg-[#120b04]/90 p-5 space-y-4 max-h-[700px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
            <h3 className="text-sm font-bold text-amber-100 flex items-center gap-2">
              <BookOpen className="size-4 text-[#d4af37]" />
              <span>72 Parent Melakartas ({filteredMelakartas.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {filteredMelakartas.map((mel) => (
              <button
                key={mel.number}
                onClick={() => {
                  setSelectedMelakartaNum(mel.number);
                  setSelectedJanya(null);
                }}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  selectedMelakartaNum === mel.number
                    ? "border-[#d4af37] bg-[#d4af37]/15 text-amber-100 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                    : "border-amber-900/30 bg-black/40 text-amber-300/70 hover:border-amber-800/60"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-900/40 text-amber-300 border border-amber-800/40">
                      #{mel.number}
                    </span>
                    <span className="font-semibold text-xs text-amber-100">{mel.name}</span>
                  </div>
                  <div className="text-[10px] text-amber-400/60 mt-1 font-mono">
                    {mel.arohana}
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-amber-400/60 uppercase">
                  {mel.chakra}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Relationship Tree & Raga Details (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Node 1: Selected Parent Melakarta Card */}
          <div className="rounded-2xl border border-[#d4af37]/40 bg-gradient-to-br from-[#1d1308] via-[#120b04] to-[#090502] p-6 text-amber-50 shadow-xl relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-amber-900/40 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                    Parent Melakarta #{selectedMelakarta.number}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800/40">
                    {selectedMelakarta.chakra} Chakra
                  </span>

                  {isRecommendedForStudent() && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
                      <Sparkles className="size-3 text-emerald-400" /> Recommended for your path
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-amber-100 mt-2">
                  {selectedMelakarta.name} Raga
                </h3>
                <p className="text-xs text-amber-300/70 mt-1 max-w-xl leading-relaxed">
                  {selectedMelakarta.description}
                </p>
              </div>

              {/* Action: Ask AI Guru */}
              <Link
                href={`/ai-guru?prompt=Explain the musicology of Melakarta #${selectedMelakarta.number} ${selectedMelakarta.name}, its Arohana/Avarohana scales, and its popular compositions.`}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-black font-bold text-xs shadow-lg hover:brightness-110 transition flex items-center gap-1.5"
              >
                <Sparkles className="size-3.5" /> Ask AI Guru About {selectedMelakarta.name}
              </Link>
            </div>

            {/* Scales: Arohana & Avarohana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="p-3.5 rounded-xl bg-black/50 border border-amber-900/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/70 block mb-1">
                  Arohana (Ascending Scale)
                </span>
                <span className="text-sm font-mono font-bold text-amber-100 tracking-wider">
                  {selectedMelakarta.arohana}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-amber-900/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/70 block mb-1">
                  Avarohana (Descending Scale)
                </span>
                <span className="text-sm font-mono font-bold text-amber-100 tracking-wider">
                  {selectedMelakarta.avarohana}
                </span>
              </div>
            </div>
          </div>

          {/* Node 2: Derived Janya Ragas List */}
          <div className="rounded-2xl border border-amber-900/40 bg-[#120b04]/90 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
              <div className="flex items-center gap-2">
                <CornerDownRight className="size-4 text-[#d4af37]" />
                <h4 className="text-sm font-bold text-amber-100">
                  Derived Janya Ragas ({janyaList.length})
                </h4>
              </div>
              <span className="text-xs text-amber-300/60 font-mono">
                Parent: #{selectedMelakarta.number} {selectedMelakarta.name}
              </span>
            </div>

            {janyaList.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <HelpCircle className="size-6 text-amber-400/40 mx-auto" />
                <h5 className="text-xs font-bold text-amber-200">Janya Relationship Data Unavailable</h5>
                <p className="text-[11px] text-amber-300/60 max-w-sm mx-auto">
                  Detailed Janya derivatives for this specific Melakarta scale have not been compiled in the catalog yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {janyaList.map((janya, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedJanya(janya)}
                    className={`p-3.5 rounded-xl border text-left transition flex justify-between items-start ${
                      selectedJanya?.name === janya.name
                        ? "border-[#d4af37] bg-[#d4af37]/20 text-amber-100 shadow-md"
                        : "border-amber-900/30 bg-black/40 text-amber-300/80 hover:border-amber-700"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-amber-100 block">{janya.name}</span>
                      <span className="text-[10px] font-mono text-amber-400/70 block mt-0.5">
                        ↑ {janya.arohana}
                      </span>
                      <span className="text-[10px] text-amber-300/50 mt-1 block line-clamp-1">
                        {janya.musicTheoryNotes || janya.jeevaSwara || "Janya scale"}
                      </span>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-amber-950 text-amber-300 border border-amber-800/40 shrink-0">
                      Janya
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Node 3: Selected Janya Raga Deep Dive Detail */}
          {selectedJanya && (
            <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0d160e] via-[#09100a] to-[#040804] p-6 text-amber-50 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/30 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Selected Janya Raga Detail
                  </span>
                  <h4 className="text-xl font-bold text-emerald-100 mt-0.5">
                    {selectedJanya.name}
                  </h4>
                  <p className="text-xs text-emerald-300/70">
                    Parent Melakarta: <strong className="text-amber-300">#{selectedMelakarta.number} {selectedMelakarta.name}</strong>
                  </p>
                </div>

                <Link
                  href={`/ai-guru?prompt=Explain the janya raga ${selectedJanya.name} derived from Melakarta #${selectedMelakarta.number} ${selectedMelakarta.name}, its unique gamakas, and famous compositions.`}
                  className="px-3.5 py-1.5 rounded-lg border border-emerald-700/50 bg-emerald-950/60 text-xs font-bold text-emerald-200 hover:bg-emerald-900/50 transition flex items-center gap-1.5"
                >
                  <Sparkles className="size-3.5" /> Ask AI Guru About {selectedJanya.name}
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-900/30">
                  <span className="text-[10px] font-bold uppercase text-emerald-400/80 block mb-0.5">Arohana</span>
                  <span className="text-emerald-100 font-bold">{selectedJanya.arohana}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-900/30">
                  <span className="text-[10px] font-bold uppercase text-emerald-400/80 block mb-0.5">Avarohana</span>
                  <span className="text-emerald-100 font-bold">{selectedJanya.avarohana}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-900/30 text-xs leading-relaxed">
                <span className="font-bold text-emerald-300 block mb-1">Musicological Characteristics & Notes:</span>
                <p className="text-emerald-100/80">{selectedJanya.musicTheoryNotes || selectedJanya.jeevaSwara || "Verified Carnatic Janya Derivative."}</p>
                {selectedJanya.famousKriti && (
                  <div className="mt-2 text-[11px] text-amber-300/90 font-medium">
                    🎵 Famous Composition: <strong>{selectedJanya.famousKriti}</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
