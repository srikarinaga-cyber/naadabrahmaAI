"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, BookOpen, Music, Users, Sparkles, Binary } from "lucide-react";
import { SwarasthanaPlayer } from "@/components/music/swarasthana-player";
import { useLanguage } from "@/components/providers/language-provider";
import { translateSwaraNotation } from "@/lib/data/knowledge-hub-i18n";
import type { ExtendedJanya } from "@/lib/data/janyas-db";

interface DisplayKriti {
  id: string;
  title: string;
  composers?: { name: string };
  talas?: { name: string };
}

interface MelakartaDetailClientViewProps {
  melakarta: {
    number: number;
    name: string;
    chakra: string;
    arohana: string;
    avarohana: string;
    description?: string;
  };
  prevMelakartaNum: number;
  prevMelakartaName: string;
  nextMelakartaNum: number;
  nextMelakartaName: string;
  janyasForMelakarta: ExtendedJanya[];
  kritisList: DisplayKriti[];
}

const DETAIL_I18N: Record<
  string,
  {
    backToHub: string;
    prev: string;
    next: string;
    janakaBadge: string;
    chakraBadge: string;
    katapayadiBadge: string;
    katapayadiTitle: string;
    katapayadiDesc: string;
    arohanaTitle: string;
    avarohanaTitle: string;
    derivedJanyas: string;
    janyasSubtitle: string;
    kritisTitle: string;
    kritisSubtitle: string;
    parentLabel: string;
    composerLabel: string;
    talaLabel: string;
  }
> = {
  en: {
    backToHub: "← Back to 72 Melakartas",
    prev: "Previous:",
    next: "Next:",
    janakaBadge: "Janaka (Melakarta) Raga #",
    chakraBadge: "Chakra:",
    katapayadiBadge: "Katapayadi Formula #",
    katapayadiTitle: "Katapayadi System (కటపయాది సూత్రం) Mnemonic Formula:",
    katapayadiDesc: "In Carnatic music theory, the Katapayadi System assigns numerical values (1–9, 0) to Sanskrit consonants. Taking the first two syllables of this raga and reversing their digit order derives its exact Melakarta Index Number in Venkatamakhin's 72 Melakarta scheme.",
    arohanaTitle: "Arohana (Ascending Swaras)",
    avarohanaTitle: "Avarohana (High Pitch S' Descending Swaras)",
    derivedJanyas: "Derived Janya Ragas",
    janyasSubtitle: "Prominent scales originating from this parent Melakarta",
    kritisTitle: "Signature Classical Compositions (Kritis)",
    kritisSubtitle: "Revered Kritis set to this Melakarta scale",
    parentLabel: "Parent:",
    composerLabel: "Composer:",
    talaLabel: "Tala:",
  },
  te: {
    backToHub: "← 72 మేళకర్త రాగాలకు తిరిగి వెళ్ళండి",
    prev: "క్రితం రాగం:",
    next: "తరువాతి రాగం:",
    janakaBadge: "జనక (మేళకర్త) రాగం #",
    chakraBadge: "చక్రం:",
    katapayadiBadge: "కటపయాది సూత్రం సంఖ్య #",
    katapayadiTitle: "కటపయాది సూత్రం (Katapayadi System) వివరణ భావన:",
    katapayadiDesc: "భారతీయ శాస్త్రీయ సంగీత శాస్త్రంలో కటపయాది సూత్రం ద్వారా అక్షరాలకు సంఖ్యలు (1-9, 0) కేటాయించబడతాయి. ఈ రాగం పేరులోని మొదటి రెండు అక్షరాల సంఖ్యా విలువను తిరగేయడం ద్వారా వెంకటమఖి 72 మేళకర్త పద్ధతిలోని ఖచ్చితమైన సంఖ్య లభిస్తుంది.",
    arohanaTitle: "ఆరోహణం (ఆరోహణ స్వరములు)",
    avarohanaTitle: "అవరోహణం (తార షడ్జ అవరోహణ స్వరములు)",
    derivedJanyas: "ఉత్పత్తి అయిన ప్రసిద్ధ జన్య రాగాలు",
    janyasSubtitle: "ఈ ప్రధాన జనక రాగం నుండి ఉత్పన్నమైన అనుబంధ రాగాలు",
    kritisTitle: "ప్రసిద్ధ శాస్త్రీయ కీర్తనలు (కృతులు)",
    kritisSubtitle: "ఈ మేళకర్త స్వర స్థానాలలో స్వరపరచబడిన మహత్తర కీర్తనలు",
    parentLabel: "జనక రాగం:",
    composerLabel: "వాగ్గేయకారుడు:",
    talaLabel: "తాళము:",
  },
  hi: {
    backToHub: "← 72 मेलकर्ता रागों पर वापस जाएं",
    prev: "पिछला राग:",
    next: "अगला राग:",
    janakaBadge: "जनक (मेलकर्ता) राग #",
    chakraBadge: "चक्र:",
    katapayadiBadge: "कटपयादि सूत्र संख्या #",
    katapayadiTitle: "कटपयादि सूत्र (Katapayadi System) विवरण:",
    katapayadiDesc: "भारतीय संगीत शास्त्र में कटपयादि सूत्र द्वारा अक्षरों को संख्या (1-9, 0) दी जाती है। इस राग के नाम के प्रथम दो अक्षरों के क्रम को उलटकर वेंकटमखी की 72 मेलकर्ता प्रणाली में इसकी सटीक संख्या प्राप्त होती है।",
    arohanaTitle: "आरोहण (आरोही स्वर)",
    avarohanaTitle: "अवरोहण (तार षड्ज अवरोही स्वर)",
    derivedJanyas: "उत्पन्न प्रसिद्ध जन्य राग",
    janyasSubtitle: "इस मुख्य जनक राग से उत्पन्न राग",
    kritisTitle: "प्रसिद्ध शास्त्रीय रचनाएं (कृतियां)",
    kritisSubtitle: "इस मेलकर्ता राग में रचित रचनाएं",
    parentLabel: "जनक राग:",
    composerLabel: "रचयिता:",
    talaLabel: "ताल:",
  },
  ta: {
    backToHub: "← 72 மேளகர்த்தாக்களுக்கு திரும்பு",
    prev: "முந்தைய:",
    next: "அடுத்த:",
    janakaBadge: "ஜனக (மேளகர்த்தா) ராகம் #",
    chakraBadge: "சக்கரம்:",
    katapayadiBadge: "கடபயாதி சூத்திரம் #",
    katapayadiTitle: "கடபயாதி சூத்திரம் (Katapayadi System) விளக்கம்:",
    katapayadiDesc: "கர்நாடக இசை சாஸ்திரத்தில் கடபயாதி முறை மூலம் எழுத்துக்களுக்கு எண்கள் வழங்கப்படுகின்றன.",
    arohanaTitle: "ஆரோஹணம் (ஏறு வரிசை ஸ்வரங்கள்)",
    avarohanaTitle: "அவரோஹணம் (இறங்கு வரிசை ஸ்வரங்கள்)",
    derivedJanyas: "உருவான ஜன்ய ராகங்கள்",
    janyasSubtitle: "இந்த மேளகர்த்தாவிலிருந்து உருவான ராகங்கள்",
    kritisTitle: "புகழ்பெற்ற சங்கீத கீர்த்தனைகள்",
    kritisSubtitle: "இந்த ராகத்தில் அமைந்த கீர்த்தனைகள்",
    parentLabel: "ஜனக ராகம்:",
    composerLabel: "இயற்றியவர்:",
    talaLabel: "தாளம்:",
  },
  kn: {
    backToHub: "← 72 ಮೇಳಕರ್ತಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
    prev: "ಹಿಂದಿನ:",
    next: "ಮುಂದಿನ:",
    janakaBadge: "ಜನಕ (ಮೇಳಕರ್ತ) ರಾಗ #",
    chakraBadge: "ಚಕ್ರ:",
    katapayadiBadge: "ಕಟಪಯಾದಿ ಸೂತ್ರ #",
    katapayadiTitle: "ಕಟಪಯಾದಿ ಸೂತ್ರದ ವಿವರಣೆ:",
    katapayadiDesc: "ಕರ್ನಾಟಕ ಸಂಗೀತ ಶಾಸ್ತ್ರದಲ್ಲಿ ಕಟಪಯಾದಿ ಸೂತ್ರದ ಮೂಲಕ ಅಕ್ಷರಗಳಿಗೆ ಸಂಖ್ಯೆ ನೀಡಲಾಗುತ್ತದೆ.",
    arohanaTitle: "ಆರೋಹಣ (ಆರೋಹಣ ಸ್ವರಗಳು)",
    avarohanaTitle: "ಅವರೋಹಣ (ಅವರೋಹಣ ಸ್ವರಗಳು)",
    derivedJanyas: "ಉತ್ಪನ್ನ ಜನ್ಯ ರಾಗಗಳು",
    janyasSubtitle: "ಈ ರಾಗದಿಂದ ಉತ್ಪನ್ನವಾದ ಜನ್ಯ ರಾಗಗಳು",
    kritisTitle: "ಪ್ರಸಿದ್ಧ ಶಾಸ್ತ್ರೀಯ ಕೃತಿಗಳು",
    kritisSubtitle: "ಈ ಮೇಳಕರ್ತ ರಾಗದಲ್ಲಿ ರಚಿತವಾದ ಕೃತಿಗಳು",
    parentLabel: "ಜನಕ ರಾಗ:",
    composerLabel: "ರಚನೆಕಾರರು:",
    talaLabel: "ತಾಳ:",
  },
  ml: {
    backToHub: "← 72 മേളകർത്താക്കളിലേക്ക് മടങ്ങുക",
    prev: "മുൻപത്തെ:",
    next: "അടുത്തത്:",
    janakaBadge: "ജനക (മേളകർത്താ) രാഗം #",
    chakraBadge: "ചക്രം:",
    katapayadiBadge: "കടപയാദി സൂത്രം #",
    katapayadiTitle: "കടപയാദി സൂത്രം വിവരണം:",
    katapayadiDesc: "കർണ്ണാടക സംഗീത ശാസ്ത്രത്തിൽ കടപയാദി രീതി ഉപയോഗിച്ച് രാഗങ്ങളുടെ നമ്പർ കണ്ടെത്തുന്നു.",
    arohanaTitle: "ആരോഹണം (ആരോഹണ സ്വരങ്ങൾ)",
    avarohanaTitle: "അവരോഹണം (അവരോഹണ സ്വരങ്ങൾ)",
    derivedJanyas: "ഉത്ഭവിച്ച ജന്യ രാഗങ്ങൾ",
    janyasSubtitle: "ഈ രാഗത്തിൽ നിന്ന് ഉണ്ടായ ജന്യ രാഗങ്ങൾ",
    kritisTitle: "പ്രസിദ്ധമായ കീർത്തനങ്ങൾ",
    kritisSubtitle: "ഈ മേളകർത്താ രാഗത്തിലെ രചനകൾ",
    parentLabel: "ജനക രാഗം:",
    composerLabel: "രചയിതാവ്:",
    talaLabel: "താളം:",
  },
};

export function MelakartaDetailClientView({
  melakarta,
  prevMelakartaNum,
  prevMelakartaName,
  nextMelakartaNum,
  nextMelakartaName,
  janyasForMelakarta,
  kritisList,
}: MelakartaDetailClientViewProps) {
  const { language } = useLanguage();
  const t = DETAIL_I18N[language] || DETAIL_I18N.en;

  const arohanaSwaraTranslated = translateSwaraNotation(melakarta.arohana, language);
  const avarohanaSwaraTranslated = translateSwaraNotation(melakarta.avarohana, language);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 relative z-10">
      {/* Navigation Bar with Previous Raga, Back to List & Next Raga */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-foreground hover:text-[#800020] transition-colors bg-card/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-swara-gold/40 shadow-xs"
        >
          <ArrowLeft className="size-4 text-[#800020] dark:text-amber-300" />
          <span>{t.backToHub}</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/knowledge-hub/melakarta/${prevMelakartaNum}`}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#800020] dark:text-amber-200 bg-[#800020]/15 hover:bg-[#800020] hover:text-white px-3.5 py-2 rounded-xl border border-[#800020]/30 transition-all shadow-xs"
            title={`Previous Raga: #${prevMelakartaNum} ${prevMelakartaName}`}
          >
            <ArrowLeft className="size-3.5" />
            <span>{t.prev} #{prevMelakartaNum} {prevMelakartaName}</span>
          </Link>

          <Link
            href={`/knowledge-hub/melakarta/${nextMelakartaNum}`}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#800020] dark:text-amber-200 bg-[#800020]/15 hover:bg-[#800020] hover:text-white px-3.5 py-2 rounded-xl border border-[#800020]/30 transition-all shadow-xs"
            title={`Next Raga: #${nextMelakartaNum} ${nextMelakartaName}`}
          >
            <span>{t.next} #{nextMelakartaNum} {nextMelakartaName}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="glass-panel traditional-glow rounded-3xl border-2 border-swara-gold/40 p-8 md:p-10 mb-8 space-y-6 shadow-xl bg-card/90 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge className="bg-[#800020]/15 text-[#800020] dark:text-amber-200 border-none font-extrabold text-xs">
                {t.janakaBadge}{melakarta.number}
              </Badge>
              <Badge variant="outline" className="border-swara-gold/50 text-[#800020] dark:text-amber-200 font-extrabold text-xs">
                {t.chakraBadge} {melakarta.chakra}
              </Badge>
              <Badge variant="outline" className="border-[#800020]/40 text-[#800020] dark:text-amber-200 font-mono text-[11px] font-extrabold">
                {t.katapayadiBadge}{melakarta.number}
              </Badge>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#800020] dark:text-amber-100 mt-2">
              {melakarta.name}
            </h1>
            <p className="text-foreground/90 font-medium mt-3 leading-relaxed max-w-3xl text-xs md:text-sm">
              {melakarta.description || "వెంకటమఖి 72 మేళకర్త పద్ధతిలోని ప్రధాన జనక రాగం."}
            </p>
          </div>
        </div>

        {/* Katapayadi System Explanation Card */}
        <div className="rounded-2xl border border-swara-gold/40 bg-muted/60 p-4 space-y-2 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2 font-extrabold text-[#800020] dark:text-amber-200">
            <Binary className="size-4 text-swara-gold" />
            <span>{t.katapayadiTitle}</span>
          </div>
          <p className="text-foreground/80 font-medium leading-relaxed">
            {t.katapayadiDesc}
          </p>
        </div>
      </div>

      {/* Interactive Swarasthana Player */}
      <div className="mb-8">
        <SwarasthanaPlayer
          ragaName={melakarta.name}
          arohana={melakarta.arohana}
          avarohana={melakarta.avarohana}
        />
      </div>

      {/* Scale Swarasthana Notation Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel rounded-3xl border border-swara-gold/40 p-6 bg-card/90 backdrop-blur-xl shadow-md">
          <h3 className="font-serif text-base font-extrabold text-[#800020] dark:text-amber-200 mb-3 flex items-center gap-2">
            <Music className="size-4 text-swara-gold" />
            <span>{t.arohanaTitle}</span>
          </h3>
          <div className="bg-muted/70 p-4 rounded-2xl text-center border border-swara-gold/30">
            <span className="font-serif text-2xl font-extrabold tracking-widest text-[#800020] dark:text-amber-100">
              {arohanaSwaraTranslated}
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl border border-swara-gold/40 p-6 bg-card/90 backdrop-blur-xl shadow-md">
          <h3 className="font-serif text-base font-extrabold text-[#800020] dark:text-amber-200 mb-3 flex items-center gap-2">
            <Music className="size-4 rotate-180 text-swara-gold" />
            <span>{t.avarohanaTitle}</span>
          </h3>
          <div className="bg-muted/70 p-4 rounded-2xl text-center border border-swara-gold/30">
            <span className="font-serif text-2xl font-extrabold tracking-widest text-[#800020] dark:text-amber-100">
              {avarohanaSwaraTranslated}
            </span>
          </div>
        </div>
      </div>

      {/* Derived Janya Ragas */}
      <div className="glass-panel rounded-3xl border border-swara-gold/40 p-8 mb-8 bg-card/90 backdrop-blur-xl shadow-md space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-extrabold text-[#800020] dark:text-amber-200 flex items-center gap-2">
            <Sparkles className="size-5 text-swara-gold" />
            <span>{t.derivedJanyas}</span>
          </h3>
          <p className="text-xs text-foreground/80 font-semibold mt-1">
            {t.janyasSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {janyasForMelakarta.map((janya) => (
            <div
              key={janya.id}
              className="rounded-2xl border border-swara-gold/30 bg-muted/50 p-4 hover:border-swara-gold transition shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-extrabold text-[#800020] dark:text-amber-100">
                  {janya.name}
                </h4>
                <Badge variant="outline" className="text-[10px] border-swara-gold/40 text-swara-gold font-extrabold">
                  {janya.classification}
                </Badge>
              </div>

              <div className="text-xs space-y-1 font-mono">
                <p className="text-foreground/90">
                  <span className="font-extrabold text-[#800020] dark:text-amber-300">ఆరోహణ:</span>{" "}
                  {translateSwaraNotation(janya.arohana, language)}
                </p>
                <p className="text-foreground/90">
                  <span className="font-extrabold text-[#800020] dark:text-amber-300">అవరోహణ:</span>{" "}
                  {translateSwaraNotation(janya.avarohana, language)}
                </p>
              </div>

              {janya.musicTheoryNotes && (
                <p className="text-[11px] text-foreground/80 font-medium italic pt-1 border-t border-border/40">
                  💡 {janya.musicTheoryNotes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Signature Classical Compositions */}
      <div className="glass-panel rounded-3xl border border-swara-gold/40 p-8 bg-card/90 backdrop-blur-xl shadow-md space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-extrabold text-[#800020] dark:text-amber-200 flex items-center gap-2">
            <BookOpen className="size-5 text-swara-gold" />
            <span>{t.kritisTitle}</span>
          </h3>
          <p className="text-xs text-foreground/80 font-semibold mt-1">
            {t.kritisSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {kritisList.map((k) => (
            <div
              key={k.id}
              className="rounded-2xl border border-swara-gold/30 bg-muted/50 p-4 space-y-1.5 shadow-xs"
            >
              <h4 className="font-serif text-sm font-extrabold text-[#800020] dark:text-amber-100">
                {k.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-foreground/80 font-semibold">
                <span>{t.composerLabel} {k.composers?.name || "Saint Tyagaraja / Dikshitar"}</span>
                <span>•</span>
                <span>{t.talaLabel} {k.talas?.name || "Adi Tala"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
