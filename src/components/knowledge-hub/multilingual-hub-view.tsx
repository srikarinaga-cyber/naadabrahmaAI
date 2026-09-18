"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Languages, Search } from "lucide-react";
import { MusicThemeBackdrop } from "@/components/ui/music-theme-backdrop";
import type { SupportedLanguage } from "@/lib/ai/context";
import {
  KH_LANGUAGES,
  KH_UI_STRINGS,
  translateSwaraNotation,
} from "@/lib/data/knowledge-hub-i18n";
import type { MelakartaSeed } from "@/lib/data/melakartas-seed";

interface Props {
  melakartas: MelakartaSeed[];
}

export function MultilingualKnowledgeHubView({ melakartas }: Props) {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [searchQuery, setSearchQuery] = useState("");

  const ui = KH_UI_STRINGS[language] || KH_UI_STRINGS.en;

  const filteredMelakartas = melakartas.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.number.toString() === q ||
      m.chakra.toLowerCase().includes(q) ||
      m.arohana.toLowerCase().includes(q) ||
      m.avarohana.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background/80 relative overflow-hidden flex flex-col">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12 flex-1 w-full relative z-10">
        {/* Header with Multilingual Switcher */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-card/85 backdrop-blur-xl border-2 border-swara-gold/40 p-6 rounded-3xl shadow-xl">
          <div>
            <Badge variant="outline" className="border-[#800020]/40 text-[#800020] dark:text-amber-200 mb-2 font-extrabold text-xs">
              {ui.badge}
            </Badge>
            <h1 className="font-serif text-3xl font-extrabold text-[#800020] dark:text-amber-100 md:text-4xl tracking-tight">
              {ui.mainTitle}
            </h1>
            <p className="text-foreground/90 font-medium text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
              {ui.mainSubtitle}
            </p>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-2.5 bg-muted/60 p-3 rounded-2xl border border-swara-gold/30 shrink-0 self-start md:self-auto shadow-sm">
            <Languages className="size-5 text-[#800020] dark:text-amber-300" />
            <span className="text-xs font-extrabold text-foreground">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="rounded-xl border-2 border-swara-gold/50 bg-card px-3 py-1.5 text-xs font-extrabold text-[#800020] focus:outline-none focus:ring-2 focus:ring-[#800020] shadow-sm"
            >
              {KH_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/knowledge-hub"
            className="text-xs font-extrabold px-4 py-2.5 rounded-xl bg-[#800020] text-white shadow-md transition"
          >
            {ui.tabMelakartas}
          </Link>
          <Link
            href="/knowledge-hub/explorer"
            className="text-xs font-extrabold px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-700 text-black shadow-md flex items-center gap-1.5 hover:brightness-110 transition"
          >
            <span>{ui.tabExplorer}</span>
          </Link>
          <Link
            href="/knowledge-hub/compare"
            className="text-xs font-extrabold px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-md flex items-center gap-1.5 transition"
          >
            <GitCompare className="size-3.5" />
            {ui.tabCompare}
          </Link>
          <Link
            href="/knowledge-hub/composers"
            className="text-xs font-extrabold px-4 py-2.5 rounded-xl bg-card/90 backdrop-blur-md border border-swara-gold/40 text-foreground hover:bg-[#800020] hover:text-white transition shadow-sm"
          >
            {ui.tabComposers}
          </Link>
          <Link
            href="/knowledge-hub/talas"
            className="text-xs font-extrabold px-4 py-2.5 rounded-xl bg-card/90 backdrop-blur-md border border-swara-gold/40 text-foreground hover:bg-[#800020] hover:text-white transition shadow-sm"
          >
            {ui.tabTalas}
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-3.5 top-3.5 size-4 text-[#800020]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={ui.searchPlaceholder}
            className="w-full rounded-2xl border-2 border-swara-gold/40 bg-card/95 pl-10 pr-4 py-2.5 text-xs font-extrabold text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-[#800020] shadow-sm backdrop-blur-md"
          />
        </div>

        {/* 72 Melakarta Janaka Ragas Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMelakartas.map((m) => {
            const translatedArohana = translateSwaraNotation(m.arohana, language);
            const translatedAvarohana = translateSwaraNotation(m.avarohana, language);

            return (
              <Link
                key={m.number}
                href={`/knowledge-hub/melakarta/${m.number}`}
                className="group rounded-3xl border-2 border-swara-gold/30 p-5 transition-all hover:border-[#800020] hover:bg-[#800020]/10 hover:shadow-xl bg-card/90 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-xs text-[#800020] dark:text-amber-300 border-[#800020]/30 font-extrabold">
                      #{m.number}
                    </Badge>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#800020] dark:text-amber-300">
                      {ui.chakraLabel} {m.chakra}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-extrabold text-foreground group-hover:text-[#800020] dark:group-hover:text-amber-200 mt-2">
                    {m.name}
                  </h2>

                  <div className="mt-3 space-y-1 text-xs font-bold border-t border-swara-gold/20 pt-2.5">
                    <p className="text-emerald-800 dark:text-emerald-300 font-mono">
                      <span className="font-sans text-[11px] font-extrabold text-foreground mr-1">{ui.arohanaLabel}</span>
                      {translatedArohana}
                    </p>
                    <p className="text-emerald-800 dark:text-emerald-300 font-mono">
                      <span className="font-sans text-[11px] font-extrabold text-foreground mr-1">{ui.avarohanaLabel}</span>
                      {translatedAvarohana}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-[11px] font-extrabold text-[#800020] dark:text-amber-300 group-hover:underline flex items-center gap-1">
                  {ui.viewDetails}
                </div>
              </Link>
            );
          })}
        </div>

        {filteredMelakartas.length === 0 && (
          <div className="text-center py-12 bg-card/85 backdrop-blur-md rounded-3xl border border-swara-gold/30 p-6 my-4">
            <p className="text-sm font-extrabold text-foreground">{ui.noResults}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
