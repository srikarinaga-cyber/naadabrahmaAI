"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { TalaMatrixPlayer } from "@/components/music/tala-matrix-player";
import { useLanguage } from "@/components/providers/language-provider";
import { KH_UI_STRINGS } from "@/lib/data/knowledge-hub-i18n";

export default function TalasPage() {
  const { language } = useLanguage();
  const ui = KH_UI_STRINGS[language] || KH_UI_STRINGS.en;
  const isTe = language === "te";

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col justify-between">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-16 flex-1 w-full relative z-10">
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:text-[#800020] mb-8 transition-colors bg-card/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-swara-gold/40 shadow-xs"
        >
          <ArrowLeft className="size-4 text-[#800020] dark:text-amber-300" />
          <span>{isTe ? "← జనక రాగాలకు తిరిగి వెళ్ళండి" : "Back to Janaka Ragas"}</span>
        </Link>

        <div className="mb-10 bg-card/85 backdrop-blur-xl border border-swara-gold/30 p-6 md:p-8 rounded-3xl shadow-xl">
          <Badge variant="outline" className="border-[#800020]/30 text-[#800020] dark:text-amber-200 mb-3 font-extrabold text-xs">
            {ui.talasTitle}
          </Badge>
          <h1 className="font-serif text-3xl font-extrabold text-[#800020] dark:text-amber-100 md:text-4xl">
            {isTe ? "35 సుళాది సప్త తాళాల మ్యాట్రిక్స్ & తాళ సాధన సింథసైజర్" : "35 Suladi Sapta Talas Matrix & Beat Synthesizer"}
          </h1>
          <p className="text-foreground/90 font-medium mt-3 max-w-3xl leading-relaxed text-xs md:text-sm">
            {isTe
              ? "కర్ణాటక సంగీతంలోని 7 ప్రధాన తాళములు (ధ్రువ, మత్య, రూపక, ఝంప, త్రిపుట, అట, ఏక) మరియు 5 లఘు జాతులు (తిస్ర, చతుస్ర, ఖండ, మిస్ర, సంకీర్ణ) కలయికతో ఏర్పడిన 35 పవిత్ర తాళ చక్రములు. ప్రతి తాళం ఎంచుకుని ఖచ్చితమైన అంగ తాళ నాదాన్ని ఆలకించండి."
              : ui.talasSubtitle}
          </p>
        </div>

        <TalaMatrixPlayer />
      </main>
      <Footer />
    </div>
  );
}
