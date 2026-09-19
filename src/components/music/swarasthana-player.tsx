import React, { useState, useRef } from "react";
import Image from "next/image";
import { Play, Volume2, Music, Sparkles, Smartphone, Sliders, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { translateSwaraNotation } from "@/lib/data/knowledge-hub-i18n";

interface SwarasthanaPlayerProps {
  ragaName: string;
  arohana: string;
  avarohana: string;
}

const PLAYER_I18N: Record<
  string,
  {
    engineBadge: string;
    playerTitleSuffix: string;
    tanpuraBtn: string;
    veenaBtn: string;
    violinBtn: string;
    durationLabel: string;
    fastLabel: string;
    legendTitle: string;
    playScaleBtn: string;
    playingScaleBtn: string;
    shadja: string;
    rishabha: string;
    gandhara: string;
    madhyama: string;
    panchama: string;
    dhaivata: string;
    nishada: string;
  }
> = {
  en: {
    engineBadge: "Tanpura Droid Swarasthana Engine",
    playerTitleSuffix: "Swara Player",
    tanpuraBtn: "🪕 Tanpura Droid Sound",
    veenaBtn: "🪕 Veena",
    violinBtn: "🎻 Violin",
    durationLabel: "Swara Playback Duration Time Setter:",
    fastLabel: "0.3s (Fast)",
    legendTitle: "Swarasthana Color Pattern Legend:",
    playScaleBtn: "Play Complete Scale",
    playingScaleBtn: "Playing Scale...",
    shadja: "Shadja (Sa)",
    rishabha: "Rishabha (Ri)",
    gandhara: "Gandhara (Ga)",
    madhyama: "Madhyama (Ma)",
    panchama: "Panchama (Pa)",
    dhaivata: "Dhaivata (Dha)",
    nishada: "Nishada (Ni)",
  },
  te: {
    engineBadge: "తంబూరా నాద స్వరస్థాన ఇంజిన్",
    playerTitleSuffix: "స్వర నాద ప్లేయర్",
    tanpuraBtn: "🪕 తంబూరా నాదం",
    veenaBtn: "🪕 వీణ నాదం",
    violinBtn: "🎻 వయోలిన్ నాదం",
    durationLabel: "స్వర నాద సమయ అవధి ప్రామాణీకరణ:",
    fastLabel: "0.3సె (వేగం)",
    legendTitle: "స్వరస్థాన వర్ణ సూచిక (Color Legend):",
    playScaleBtn: "సంపూర్ణ స్వర క్రమం ప్లే చేయి",
    playingScaleBtn: "స్వరాలు ప్లే అవుతున్నాయి...",
    shadja: "షడ్జము (స)",
    rishabha: "రిషభము (రి)",
    gandhara: "గాంధారము (గా)",
    madhyama: "మధ్యమము (మా)",
    panchama: "పంచమము (పా)",
    dhaivata: "దైవతము (దా)",
    nishada: "నిషాదము (నీ)",
  },
  hi: {
    engineBadge: "तानपुरा नाद स्वरस्थान इंजन",
    playerTitleSuffix: "स्वर प्लेयर",
    tanpuraBtn: "🪕 तानपुरा ध्वनि",
    veenaBtn: "🪕 वीणा ध्वनि",
    violinBtn: "🎻 वायलिन ध्वनि",
    durationLabel: "स्वर बजाने की समयावधि सेट करें:",
    fastLabel: "0.3से (तीव्र)",
    legendTitle: "स्वरस्थान रंग संकेतक (Color Legend):",
    playScaleBtn: "संपूर्ण स्वर क्रम बजाएं",
    playingScaleBtn: "स्वर बज रहे हैं...",
    shadja: "षड्ज (सा)",
    rishabha: "ऋषभ (रे)",
    gandhara: "गंधार (ग)",
    madhyama: "मध्यम (म)",
    panchama: "पंचम (प)",
    dhaivata: "धैवत (ध)",
    nishada: "निषाद (नि)",
  },
  ta: {
    engineBadge: "தம்பூரா ஸ்வரஸ்தான கருவி",
    playerTitleSuffix: "ஸ்வர பிளேயர்",
    tanpuraBtn: "🪕 தம்பூரா நாதம்",
    veenaBtn: "🪕 வீணை",
    violinBtn: "🎻 வயலின்",
    durationLabel: "ஸ்வர வாசிப்பு நேர அளவு:",
    fastLabel: "0.3வி (வேகம்)",
    legendTitle: "ஸ்வரஸ்தான வண்ணக் குறிப்புகள்:",
    playScaleBtn: "முழு ஸ்வரங்களை இயக்குக",
    playingScaleBtn: "இயங்குகிறது...",
    shadja: "ஷட்ஜம் (ஸ)",
    rishabha: "ரிஷபம் (ரி)",
    gandhara: "காந்தாரம் (க)",
    madhyama: "மத்யமம் (ம)",
    panchama: "பஞ்சமம் (ப)",
    dhaivata: "தைவதம் (த)",
    nishada: "நிஷாதம் (நி)",
  },
  kn: {
    engineBadge: "ತಂಬೂರಿ ಶ್ರುತಿ ಸ್ವರಸ್ಥಾನ ಇಂಜಿನ್",
    playerTitleSuffix: "ಸ್ವರ ಪ್ಲೇಯರ್",
    tanpuraBtn: "🪕 ತಂಬೂರಿ ನಾದ",
    veenaBtn: "🪕 ವೀಣೆ",
    violinBtn: "🎻 ಪಿಟೀಲು",
    durationLabel: "ಸ್ವರ ಪ್ಲೇಬ್ಯಾಕ್ ಸಮಯ ನಿಗದಿ:",
    fastLabel: "0.3ಸೆ (ವೇಗ)",
    legendTitle: "ಸ್ವರಸ್ಥಾನ ಬಣ್ಣ ಸೂಚಕ:",
    playScaleBtn: "ಸಂಪೂರ್ಣ ಸ್ವರ ಕ್ರಮ ಪ್ಲೇ ಮಾಡಿ",
    playingScaleBtn: "ಸ್ವರಗಳು ಪ್ಲೇ ಆಗುತ್ತಿವೆ...",
    shadja: "ಷಡ್ಜ (ಸ)",
    rishabha: "ಋಷಭ (ರಿ)",
    gandhara: "ಗಾಂಧಾರ (ಗ)",
    madhyama: "ಮಧ್ಯಮ (ಮ)",
    panchama: "ಪಂಚಮ (ಪ)",
    dhaivata: "ಧೈವತ (ಧ)",
    nishada: "ನಿಷಾದ (ನಿ)",
  },
  ml: {
    engineBadge: "തമ്പുരു നാദ സ്വരസ്ഥാന എൻജിൻ",
    playerTitleSuffix: "സ്വര പ്ലെയർ",
    tanpuraBtn: "🪕 തമ്പുരു നാദം",
    veenaBtn: "🪕 വീണ",
    violinBtn: "🎻 വയലിൻ",
    durationLabel: "സ്വര പ്ലേബാക്ക് സമയം ക്രമീകരിക്കൂ:",
    fastLabel: "0.3സെ (വേഗം)",
    legendTitle: "സ്വരസ്ഥാന വർണ്ണ സൂചിക:",
    playScaleBtn: "സമ്പൂർണ്ണ സ്വരങ്ങൾ കേൾക്കൂ",
    playingScaleBtn: "പ്ലേ ചെയ്യുന്നു...",
    shadja: "ഷഡ്ജം (സ)",
    rishabha: "ഋഷഭം (രി)",
    gandhara: "ഗാന്ധാരം (ഗ)",
    madhyama: "മദ്ധ്യമം (മ)",
    panchama: "പഞ്ചമം (പ)",
    dhaivata: "ധൈവതം (ധ)",
    nishada: "നിഷാദം (നി)",
  },
};

// Exact Swara frequencies & names relative to Adhara Shadja C3 (130.81 Hz) with Color Patterns
const SWARA_DETAILS: Record<
  string,
  { name: string; freq: number; cents: number; colorClass: string; borderClass: string; tagBg: string }
> = {
  S: { name: "Adhara Shadja (Base Sa)", freq: 130.81, cents: 0, colorClass: "bg-amber-500 text-white", borderClass: "border-amber-600", tagBg: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  R1: { name: "Suddha Rishabha", freq: 138.59, cents: 90, colorClass: "bg-emerald-600 text-white", borderClass: "border-emerald-700", tagBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  R2: { name: "Chatusruti Rishabha", freq: 146.83, cents: 204, colorClass: "bg-emerald-700 text-white", borderClass: "border-emerald-800", tagBg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" },
  G1: { name: "Suddha Gandhara", freq: 146.83, cents: 204, colorClass: "bg-purple-500 text-white", borderClass: "border-purple-600", tagBg: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
  R3: { name: "Shatsruti Rishabha", freq: 155.56, cents: 283, colorClass: "bg-emerald-800 text-white", borderClass: "border-emerald-900", tagBg: "bg-emerald-500/10 text-emerald-800 border-emerald-500/30" },
  G2: { name: "Sadharana Gandhara", freq: 155.56, cents: 283, colorClass: "bg-purple-600 text-white", borderClass: "border-purple-700", tagBg: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
  G3: { name: "Antara Gandhara", freq: 164.81, cents: 386, colorClass: "bg-purple-700 text-white", borderClass: "border-purple-800", tagBg: "bg-purple-500/10 text-purple-700 border-purple-500/30" },
  M1: { name: "Suddha Madhyama", freq: 174.61, cents: 498, colorClass: "bg-rose-600 text-white", borderClass: "border-rose-700", tagBg: "bg-rose-500/10 text-rose-600 border-rose-500/30" },
  M2: { name: "Prati Madhyama", freq: 185.0, cents: 610, colorClass: "bg-red-700 text-white", borderClass: "border-red-800", tagBg: "bg-red-500/10 text-red-600 border-red-500/30" },
  P: { name: "Panchama", freq: 196.0, cents: 702, colorClass: "bg-indigo-600 text-white", borderClass: "border-indigo-700", tagBg: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30" },
  D1: { name: "Suddha Dhaivata", freq: 207.65, cents: 792, colorClass: "bg-teal-600 text-white", borderClass: "border-teal-700", tagBg: "bg-teal-500/10 text-teal-600 border-teal-500/30" },
  D2: { name: "Chatusruti Dhaivata", freq: 220.0, cents: 906, colorClass: "bg-teal-700 text-white", borderClass: "border-teal-800", tagBg: "bg-teal-500/10 text-teal-700 border-teal-500/30" },
  N1: { name: "Suddha Nishada", freq: 220.0, cents: 906, colorClass: "bg-amber-600 text-white", borderClass: "border-amber-700", tagBg: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  D3: { name: "Shatsruti Dhaivata", freq: 233.08, cents: 984, colorClass: "bg-teal-800 text-white", borderClass: "border-teal-900", tagBg: "bg-teal-500/10 text-teal-800 border-teal-500/30" },
  N2: { name: "Kaisiki Nishada", freq: 233.08, cents: 984, colorClass: "bg-amber-700 text-white", borderClass: "border-amber-800", tagBg: "bg-amber-500/10 text-amber-700 border-amber-500/30" },
  N3: { name: "Kakali Nishada", freq: 246.94, cents: 1088, colorClass: "bg-amber-800 text-white", borderClass: "border-amber-900", tagBg: "bg-amber-500/10 text-amber-800 border-amber-500/30" },
  "S'": { name: "Tara Shadja (High Pitch Sa)", freq: 261.63, cents: 1200, colorClass: "bg-amber-500 text-white shadow-lg ring-2 ring-swara-gold", borderClass: "border-amber-600", tagBg: "bg-amber-500/20 text-amber-700 border-amber-500/40" },
};

export function SwarasthanaPlayer({ ragaName, arohana, avarohana }: SwarasthanaPlayerProps) {
  const { language } = useLanguage();
  const pt = PLAYER_I18N[language] || PLAYER_I18N.en;

  const [instrument, setInstrument] = useState<"tanpura" | "veena" | "violin">("tanpura");
  const [noteDurationSec, setNoteDurationSec] = useState<number>(0.8);
  const [activeSwara, setActiveSwara] = useState<string | null>(null);
  const [selectedSwaraInfo, setSelectedSwaraInfo] = useState<{
    token: string;
    name: string;
    freq: number;
    cents: number;
    colorClass: string;
    tagBg: string;
  } | null>(null);
  const [isPlayingScale, setIsPlayingScale] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Convert last SA in Arohana to High Pitch Tara Shadja (S')
  const parseArohanaSwaras = (scaleStr: string): string[] => {
    if (!scaleStr) return ["S", "R1", "G3", "M1", "P", "D1", "N3", "S'"];
    const list = scaleStr
      .split(/\s+/)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    // Transform last swara in Arohana if "S" or "S1" into High Pitch Tara Shadja "S'" (261.63 Hz)
    if (list.length > 0 && (list[list.length - 1] === "S" || list[list.length - 1] === "S1")) {
      list[list.length - 1] = "S'";
    }
    return list;
  };

  // Convert starting SA in Avarohana to High Pitch Tara Shadja (S')
  const parseAvarohanaSwaras = (scaleStr: string): string[] => {
    if (!scaleStr) return ["S'", "N3", "D1", "P", "M1", "G3", "R1", "S"];
    const list = scaleStr
      .split(/\s+/)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    // If first note in Avarohana is "S", transform it into "S'" (High Pitch Tara Sa)
    if (list.length > 0 && list[0] === "S") {
      list[0] = "S'";
    }
    return list;
  };

  const arohanaSwaras = parseArohanaSwaras(arohana);
  const avarohanaSwaras = parseAvarohanaSwaras(avarohana);

  // Web Audio Synthesis: Tanpura Droid Jivari Buzz vs. Veena Pluck vs. Violin Tone
  const playSwaraTone = (swaraToken: string, customDuration?: number) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContextClass();
      if (ctx.state === "suspended") ctx.resume();
      audioCtxRef.current = ctx;

      const durationSec = customDuration || noteDurationSec;

      const details = SWARA_DETAILS[swaraToken] || {
        name: "Swara",
        freq: 130.81,
        cents: 0,
        colorClass: "bg-kumkum text-white",
        borderClass: "border-kumkum",
        tagBg: "bg-kumkum/10 text-kumkum border-kumkum/30",
      };
      const baseHz = details.freq;

      setActiveSwara(swaraToken);
      setSelectedSwaraInfo({ token: swaraToken, ...details });

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      if (instrument === "tanpura") {
        // 🪕 TANPURA DROID SOUND: Multi-harmonic sawtooth/triangle + Jivari cotton thread buzz filter
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();

        osc1.type = "sawtooth";
        osc2.type = "triangle";
        osc3.type = "sine";

        osc1.frequency.setValueAtTime(baseHz, now);
        osc2.frequency.setValueAtTime(baseHz * 2, now);
        osc3.frequency.setValueAtTime(baseHz * 3.01, now);

        // Jivari Metallic Cotton Thread Resonance Bandpass Filter
        const jivariFilter = ctx.createBiquadFilter();
        jivariFilter.type = "bandpass";
        jivariFilter.frequency.setValueAtTime(baseHz * 3.2, now);
        jivariFilter.Q.setValueAtTime(3.0, now);

        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.45, now + 0.04);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

        osc1.connect(jivariFilter);
        osc2.connect(jivariFilter);
        osc3.connect(jivariFilter);
        jivariFilter.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);

        osc1.stop(now + durationSec);
        osc2.stop(now + durationSec);
        osc3.stop(now + durationSec);
      } else if (instrument === "veena") {
        // VEENA SOUND
        const fundamental = ctx.createOscillator();
        const harmonic2 = ctx.createOscillator();
        fundamental.type = "sawtooth";
        harmonic2.type = "triangle";

        fundamental.frequency.setValueAtTime(baseHz, now);
        harmonic2.frequency.setValueAtTime(baseHz * 2, now);

        const bodyFilter = ctx.createBiquadFilter();
        bodyFilter.type = "lowpass";
        bodyFilter.frequency.setValueAtTime(baseHz * 4, now);

        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.4, now + 0.015);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

        fundamental.connect(bodyFilter);
        harmonic2.connect(bodyFilter);
        bodyFilter.connect(masterGain);

        fundamental.start(now);
        harmonic2.start(now);

        fundamental.stop(now + durationSec);
        harmonic2.stop(now + durationSec);
      } else {
        // VIOLIN SOUND
        const bowOsc = ctx.createOscillator();
        const vibratoLfo = ctx.createOscillator();
        const vibratoGain = ctx.createGain();

        bowOsc.type = "sawtooth";
        bowOsc.frequency.setValueAtTime(baseHz, now);

        vibratoLfo.frequency.setValueAtTime(5.5, now);
        vibratoGain.gain.setValueAtTime(baseHz * 0.018, now);
        vibratoLfo.connect(bowOsc.frequency);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2800, now);

        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.35, now + 0.05);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

        vibratoLfo.start(now);
        bowOsc.connect(filter);
        filter.connect(masterGain);

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

    const stepDelayMs = Math.max(300, Math.round(noteDurationSec * 1000 + 100));

    for (let i = 0; i < swaraList.length; i++) {
      playSwaraTone(swaraList[i]);
      await new Promise((res) => setTimeout(res, stepDelayMs));
    }

    setIsPlayingScale(false);
  };

  return (
    <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 bg-card p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header with Tanpura Picture & Sound Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
        <div className="flex items-center gap-4">
          {/* Tanpura Instrument Picture Badge */}
          <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border-2 border-swara-gold/40 shadow-md bg-kumkum/10">
            <Image
              src="/tanpura-instrument.png"
              alt="Acoustic Miraj Tanpura Instrument"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <Badge className="bg-[#800020]/15 text-[#800020] dark:text-amber-200 border-none text-[10px] mb-1 font-extrabold">
              {pt.engineBadge}
            </Badge>
            <h3 className="font-serif text-xl font-extrabold text-[#800020] dark:text-amber-100">{ragaName} {pt.playerTitleSuffix}</h3>
          </div>
        </div>

        {/* Instrument & Time Duration Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Instrument Switcher */}
          <div className="flex items-center gap-1.5 rounded-xl bg-muted p-1 border border-border">
            <button
              onClick={() => setInstrument("tanpura")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                instrument === "tanpura"
                  ? "bg-[#800020] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {pt.tanpuraBtn}
            </button>
            <button
              onClick={() => setInstrument("veena")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                instrument === "veena"
                  ? "bg-[#800020] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {pt.veenaBtn}
            </button>
            <button
              onClick={() => setInstrument("violin")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                instrument === "violin"
                  ? "bg-[#800020] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {pt.violinBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Swara Playback Time Duration Setter Slider */}
      <div className="rounded-2xl bg-muted/60 p-4 border border-swara-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-swara-gold" />
          <span className="text-xs font-extrabold text-foreground">
            {pt.durationLabel}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <span className="text-[10px] font-mono text-muted-foreground font-bold">{pt.fastLabel}</span>
          <input
            type="range"
            min="0.3"
            max="1.5"
            step="0.1"
            value={noteDurationSec}
            onChange={(e) => setNoteDurationSec(parseFloat(e.target.value))}
            className="flex-1 accent-[#800020] h-1.5 bg-background rounded-lg cursor-pointer"
          />
          <span className="text-xs font-extrabold font-mono text-[#800020] dark:text-amber-300">{noteDurationSec.toFixed(1)}s</span>
        </div>
      </div>

      {/* Colored Swarasthana Pattern Inspector */}
      {selectedSwaraInfo && (
        <div className={`rounded-2xl border p-4 flex items-center justify-between text-xs animate-in fade-in duration-200 ${selectedSwaraInfo.tagBg}`}>
          <div className="flex items-center gap-3">
            <Badge className={`${selectedSwaraInfo.colorClass} font-serif font-bold text-base px-3 py-1 rounded-xl shadow-sm`}>
              {selectedSwaraInfo.token}
            </Badge>
            <div>
              <p className="font-bold text-foreground text-sm">{selectedSwaraInfo.name}</p>
              <p className="text-[11px] font-mono opacity-90">
                Frequency: {selectedSwaraInfo.freq.toFixed(2)} Hz | Just Intonation: {selectedSwaraInfo.cents} Cents
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-kumkum flex items-center gap-1">
            <Sparkles className="size-3.5 text-swara-gold" /> {instrument === "tanpura" ? "Tanpura Droid Jivari Buzz" : instrument === "veena" ? "Veena Tone" : "Violin Tone"}
          </span>
        </div>
      )}

      {/* Swarasthana Color Pattern Legend Bar */}
      <div className="bg-muted/60 p-3 rounded-2xl border border-swara-gold/30 space-y-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/80">
          {pt.legendTitle}
        </span>
        <div className="flex flex-wrap gap-1.5 text-[10px] font-extrabold">
          <span className="bg-amber-500 text-white px-2 py-0.5 rounded-md">{pt.shadja}</span>
          <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-md">{pt.rishabha}</span>
          <span className="bg-purple-600 text-white px-2 py-0.5 rounded-md">{pt.gandhara}</span>
          <span className="bg-rose-600 text-white px-2 py-0.5 rounded-md">{pt.madhyama}</span>
          <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-md">{pt.panchama}</span>
          <span className="bg-teal-600 text-white px-2 py-0.5 rounded-md">{pt.dhaivata}</span>
          <span className="bg-amber-700 text-white px-2 py-0.5 rounded-md">{pt.nishada}</span>
        </div>
      </div>

      {/* Arohana Colored Swara Buttons (Last Sa is High Pitch S') */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-kumkum uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="size-3.5 text-swara-gold" /> Arohana (High Pitch S&apos; Peak Ascending Swaras):
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={isPlayingScale}
            onClick={() => playScaleSequence(arohanaSwaras)}
            className="border-swara-gold/30 text-xs font-bold text-kumkum hover:bg-kumkum hover:text-white gap-1.5"
          >
            <Play className="size-3" /> Play Arohana ({instrument === "tanpura" ? "Tanpura Droid" : instrument})
          </Button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {arohanaSwaras.map((s, idx) => {
            const info = SWARA_DETAILS[s] || { colorClass: "bg-[#800020] text-white", borderClass: "border-[#800020]" };
            const translatedS = translateSwaraNotation(s, language);
            return (
              <button
                key={`aro-${idx}`}
                onClick={() => playSwaraTone(s)}
                className={`size-14 rounded-2xl font-serif text-base font-extrabold border-2 transition-all flex flex-col items-center justify-center shadow-md ${info.colorClass} ${info.borderClass} ${
                  activeSwara === s ? "scale-110 ring-4 ring-swara-gold shadow-lg" : "hover:scale-105"
                }`}
              >
                <span>{translatedS}</span>
                <span className="text-[9px] font-sans font-normal opacity-80">
                  {instrument === "tanpura" ? "🪕" : instrument === "veena" ? "🪕" : "🎻"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Avarohana Colored Swara Buttons (Starting with High Pitch Sa S') */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#800020] dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="size-3.5 text-swara-gold" />
            <span>{language === "te" ? "అవరోహణ (అవరోహణ స్వరములు):" : "Avarohana (Descending Swaras):"}</span>
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={isPlayingScale}
            onClick={() => playScaleSequence(avarohanaSwaras)}
            className="border-swara-gold/40 text-xs font-extrabold text-[#800020] dark:text-amber-200 hover:bg-[#800020] hover:text-white gap-1.5 rounded-xl shadow-2xs"
          >
            <Play className="size-3" />
            <span>{isPlayingScale ? pt.playingScaleBtn : pt.playScaleBtn}</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {avarohanaSwaras.map((s, idx) => {
            const info = SWARA_DETAILS[s] || { colorClass: "bg-[#800020] text-white", borderClass: "border-[#800020]" };
            const translatedS = translateSwaraNotation(s, language);
            return (
              <button
                key={`ava-${idx}`}
                onClick={() => playSwaraTone(s)}
                className={`size-14 rounded-2xl font-serif text-base font-extrabold border-2 transition-all flex flex-col items-center justify-center shadow-md ${info.colorClass} ${info.borderClass} ${
                  activeSwara === s ? "scale-110 ring-4 ring-swara-gold shadow-lg" : "hover:scale-105"
                }`}
              >
                <span>{translatedS}</span>
                <span className="text-[9px] font-sans font-normal opacity-80">
                  {instrument === "tanpura" ? "🪕" : instrument === "veena" ? "🪕" : "🎻"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
