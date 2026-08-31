"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import nextDynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Square,
  Volume2,
  Music,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  Activity,
  Sliders,
  Award,
  Video,
  ExternalLink,
} from "lucide-react";

const PitchVisualizer = nextDynamic(
  () => import("@/components/music/PitchVisualizer"),
  { ssr: false }
);

// ──────────────────────────────────────────────
// YOUTUBE PRACTICE VIDEOS DATA
// ──────────────────────────────────────────────
const PRACTICE_VIDEOS = [
  {
    id: "OPhnN6bFFgw",
    title: "Carnatic Vocal & Sarali Varisai Guided Practice",
    category: "Vocal & Sarali Varisai",
    duration: "Guided Masterclass",
    embedUrl: "https://www.youtube.com/embed/OPhnN6bFFgw?autoplay=0&rel=0",
    watchUrl: "https://youtu.be/OPhnN6bFFgw?si=yroNuooHHB1r0XV2",
    description: "Step-by-step vocal practice session covering Sarali Varisai swara alignment, sruthi synchronization, and steady tempo control.",
    keyTakeaways: [
      "Keep your body relaxed and maintain steady Adhara Sruthi (Sa)",
      "Focus on clear pronunciation of Swara sthanas (R1, G3, M1)",
      "Practice in 3 speeds (Kalas) — slow, medium, and fast",
    ],
  },
  {
    id: "sarali-masterclass",
    title: "Carnatic Music Theory & Swara Sthana Essentials",
    category: "Music Theory & Swara Sthanas",
    duration: "15 Mins",
    embedUrl: "https://www.youtube.com/embed/OPhnN6bFFgw?autoplay=0&rel=0",
    watchUrl: "https://youtu.be/OPhnN6bFFgw",
    description: "Learn the foundational 72 Melakarta system, 16 Swara sthanas, and fundamental raga structures.",
    keyTakeaways: [
      "Understand the difference between Sampurna (Melakarta) and Janya ragas",
      "Identify Madhyama types (M1 Suddha vs M2 Prati Madhyama)",
      "Master the counting of 12 Chakras",
    ],
  },
  {
    id: "adi-tala-guide",
    title: "Adi Tala & Layam Masterclass (8 Beats Count)",
    category: "Tala & Layam",
    duration: "20 Mins",
    embedUrl: "https://www.youtube.com/embed/OPhnN6bFFgw?autoplay=0&rel=0",
    watchUrl: "https://youtu.be/OPhnN6bFFgw",
    description: "Detailed breakdown of Laghu and Dhrutams in Adi Tala, finger counting techniques, and maintaining steady tempo.",
    keyTakeaways: [
      "1 Laghu (4 counts) + 2 Dhrutams (2 counts each) = 8 Beats total",
      "Execute crisp wave (visarjitam) and claps",
      "Practice shifting between 1st, 2nd, and 3rd speeds seamlessly",
    ],
  },
];

// ──────────────────────────────────────────────
// 1. SARALI & JANTAI VARISAI DATA
// ──────────────────────────────────────────────
const VARISAI_LESSONS = [
  {
    id: "sarali-1",
    type: "Sarali Varisai",
    title: "Sarali Varisai 1 (Fundamental)",
    notes: ["S", "R", "G", "M", "P", "D", "N", "S'"],
    reverse: ["S'", "N", "D", "P", "M", "G", "R", "S"],
    raga: "Mayamalavagowla (15th Melakarta)",
  },
  {
    id: "sarali-2",
    type: "Sarali Varisai",
    title: "Sarali Varisai 2 (Pa-Dha-Ni-Sa emphasis)",
    notes: ["S", "R", "G", "M", "S", "R", "G", "M", "P", "D", "N", "S'"],
    reverse: ["S'", "N", "D", "P", "S'", "N", "D", "P", "M", "G", "R", "S"],
    raga: "Mayamalavagowla",
  },
  {
    id: "sarali-3",
    type: "Sarali Varisai",
    title: "Sarali Varisai 3 (Triple Swara Pattern)",
    notes: ["S", "R", "G", "S", "R", "G", "M", "P", "D", "N", "S'"],
    reverse: ["S'", "N", "D", "S'", "N", "D", "P", "M", "G", "R", "S"],
    raga: "Mayamalavagowla",
  },
  {
    id: "jantai-1",
    type: "Jantai Varisai",
    title: "Jantai Varisai 1 (Double Swara Stress)",
    notes: ["S", "S", "R", "R", "G", "G", "M", "M", "P", "P", "D", "D", "N", "N", "S'", "S'"],
    reverse: ["S'", "S'", "N", "N", "D", "D", "P", "P", "M", "M", "G", "G", "R", "R", "S", "S"],
    raga: "Mayamalavagowla",
  },
  {
    id: "alankaram-1",
    type: "Alankaram",
    title: "Eka Tala Alankaram (4 Swaras per Beat)",
    notes: ["S", "R", "G", "M", "R", "G", "M", "P", "G", "M", "P", "D", "M", "P", "D", "N"],
    reverse: ["S'", "N", "D", "P", "N", "D", "P", "M", "D", "P", "M", "G", "P", "M", "G", "R"],
    raga: "Mayamalavagowla",
  },
];

// Swara frequency multipliers relative to Sa
const SWARA_RATIOS: Record<string, number> = {
  "S": 1.0,
  "R": 1.0535,  // R1
  "G": 1.25,    // G3
  "M": 1.3333,  // M1
  "P": 1.5,
  "D": 1.5802,  // D1
  "N": 1.875,   // N3
  "S'": 2.0,
};

const BASE_SRUTHIS = [
  { name: "C3 (1st Kattai)", freq: 130.81 },
  { name: "C#3 (1.5 Kattai)", freq: 138.59 },
  { name: "D3 (2nd Kattai)", freq: 146.83 },
  { name: "D#3 (2.5 Kattai)", freq: 155.56 },
  { name: "E3 (3rd Kattai)", freq: 164.81 },
  { name: "F3 (4th Kattai)", freq: 174.61 },
  { name: "G3 (5th Kattai)", freq: 196.00 },
];

// ──────────────────────────────────────────────
// 2. TALA METRONOME DATA
// ──────────────────────────────────────────────
interface TalaDef {
  name: string;
  beats: number;
  pattern: { beat: number; type: "laghu" | "dhrutam" | "anudhrutam"; label: string }[];
}

const TALAS: TalaDef[] = [
  {
    name: "Adi Tala (Chatusra Jaati Triputa - 8 Beats)",
    beats: 8,
    pattern: [
      { beat: 1, type: "laghu", label: "Beat 1 (Beat)" },
      { beat: 2, type: "laghu", label: "Beat 2 (Count 1)" },
      { beat: 3, type: "laghu", label: "Beat 3 (Count 2)" },
      { beat: 4, type: "laghu", label: "Beat 4 (Count 3)" },
      { beat: 5, type: "dhrutam", label: "Beat 5 (Wave)" },
      { beat: 6, type: "dhrutam", label: "Beat 6 (Clap)" },
      { beat: 7, type: "dhrutam", label: "Beat 7 (Wave)" },
      { beat: 8, type: "dhrutam", label: "Beat 8 (Clap)" },
    ],
  },
  {
    name: "Rupaka Tala (3 Beats)",
    beats: 3,
    pattern: [
      { beat: 1, type: "dhrutam", label: "Beat 1 (Wave)" },
      { beat: 2, type: "dhrutam", label: "Beat 2 (Clap)" },
      { beat: 3, type: "laghu", label: "Beat 3 (Clap)" },
    ],
  },
  {
    name: "Khanda Chapu Tala (5 Beats)",
    beats: 5,
    pattern: [
      { beat: 1, type: "laghu", label: "Beat 1 (Clap)" },
      { beat: 2, type: "laghu", label: "Beat 2 (Clap)" },
      { beat: 3, type: "laghu", label: "Beat 3 (Clap)" },
      { beat: 4, type: "dhrutam", label: "Beat 4 (Wave)" },
      { beat: 5, type: "dhrutam", label: "Beat 5 (Clap)" },
    ],
  },
  {
    name: "Misra Chapu Tala (7 Beats)",
    beats: 7,
    pattern: [
      { beat: 1, type: "laghu", label: "Beat 1 (Clap 1)" },
      { beat: 2, type: "laghu", label: "Beat 2 (Clap 2)" },
      { beat: 3, type: "laghu", label: "Beat 3 (Clap 3)" },
      { beat: 4, type: "dhrutam", label: "Beat 4 (Wave 1)" },
      { beat: 5, type: "dhrutam", label: "Beat 5 (Clap 4)" },
      { beat: 6, type: "dhrutam", label: "Beat 6 (Wave 2)" },
      { beat: 7, type: "dhrutam", label: "Beat 7 (Clap 5)" },
    ],
  },
];

// ──────────────────────────────────────────────
// 3. EAR TRAINING QUIZ DATA
// ──────────────────────────────────────────────
const EAR_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Identify the Arohana pattern: S R2 G3 P D2 S'",
    audioSwaras: ["S", "R", "G", "P", "D", "S'"],
    options: ["Mohanam", "Hamsadhwani", "Kalyani", "Mayamalavagowla"],
    correct: "Mohanam",
    explanation: "Mohanam is a pentatonic (Audava) raga with S R2 G3 P D2 S'.",
  },
  {
    id: 2,
    question: "Which raga has N3 (Kakali Nishada) instead of D2 in its ascent?",
    audioSwaras: ["S", "R", "G", "P", "N", "S'"],
    options: ["Mohanam", "Hamsadhwani", "Shankarabharanam", "Bhairavi"],
    correct: "Hamsadhwani",
    explanation: "Hamsadhwani uses S R2 G3 P N3 S'.",
  },
  {
    id: 3,
    question: "What is the 15th Melakarta parent raga for Sarali Varisai?",
    audioSwaras: ["S", "R", "G", "M", "P", "D", "N", "S'"],
    options: ["Mayamalavagowla", "Kharaharapriya", "Hanumattodi", "Dheerasankarabharanam"],
    correct: "Mayamalavagowla",
    explanation: "Mayamalavagowla (#15) is the fundamental scale taught to beginners.",
  },
];

export default function StudentPracticePage() {
  const [activeTab, setActiveTab] = useState<"video" | "varisai" | "tala" | "tuner" | "quiz">("video");

  // Selected Video state
  const [activeVideo, setActiveVideo] = useState(PRACTICE_VIDEOS[0]);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

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

  // ──────────────────────────────────────────────
  // VARISAI PLAYER STATE & ENGINE
  // ──────────────────────────────────────────────
  const [selectedLesson, setSelectedLesson] = useState(VARISAI_LESSONS[0]);
  const [baseSruthi, setBaseSruthi] = useState(BASE_SRUTHIS[0]);
  const [tempoBpm, setTempoBpm] = useState(90);
  const [isPlayingVarisai, setIsPlayingVarisai] = useState(false);
  const [currentNoteIdx, setCurrentNoteIdx] = useState<number | null>(null);
  const varisaiIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playSwaraTone = (swara: string) => {
    const ctx = getAudioContext();
    const ratio = SWARA_RATIOS[swara] || 1.0;
    const freq = baseSruthi.freq * ratio;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (60 / tempoBpm) * 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + (60 / tempoBpm) * 0.95);
  };

  const startVarisaiPlayback = () => {
    stopVarisaiPlayback();
    setIsPlayingVarisai(true);
    const fullNotes = [...selectedLesson.notes, ...selectedLesson.reverse];
    let idx = 0;

    const step = () => {
      if (idx >= fullNotes.length) {
        idx = 0; // loop
      }
      setCurrentNoteIdx(idx);
      playSwaraTone(fullNotes[idx]);
      idx++;
    };

    step();
    varisaiIntervalRef.current = setInterval(step, (60 / tempoBpm) * 1000);
  };

  const stopVarisaiPlayback = () => {
    if (varisaiIntervalRef.current) {
      clearInterval(varisaiIntervalRef.current);
      varisaiIntervalRef.current = null;
    }
    setIsPlayingVarisai(false);
    setCurrentNoteIdx(null);
  };

  useEffect(() => {
    return () => stopVarisaiPlayback();
  }, []);

  // ──────────────────────────────────────────────
  // TALA METRONOME STATE & ENGINE
  // ──────────────────────────────────────────────
  const [selectedTala, setSelectedTala] = useState(TALAS[0]);
  const [talaBpm, setTalaBpm] = useState(80);
  const [isPlayingTala, setIsPlayingTala] = useState(false);
  const [activeBeat, setActiveBeat] = useState<number | null>(null);
  const talaIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playTalaClick = (isFirstBeat: boolean, isLaghu: boolean) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isFirstBeat ? "triangle" : "sine";
    osc.frequency.setValueAtTime(isFirstBeat ? 880 : isLaghu ? 587.33 : 440, ctx.currentTime);

    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  };

  const startTalaMetronome = () => {
    stopTalaMetronome();
    setIsPlayingTala(true);
    let beatIndex = 0;

    const tick = () => {
      const beatNum = beatIndex + 1;
      const beatInfo = selectedTala.pattern[beatIndex];
      setActiveBeat(beatNum);
      playTalaClick(beatNum === 1, beatInfo?.type === "laghu");
      beatIndex = (beatIndex + 1) % selectedTala.beats;
    };

    tick();
    talaIntervalRef.current = setInterval(tick, (60 / talaBpm) * 1000);
  };

  const stopTalaMetronome = () => {
    if (talaIntervalRef.current) {
      clearInterval(talaIntervalRef.current);
      talaIntervalRef.current = null;
    }
    setIsPlayingTala(false);
    setActiveBeat(null);
  };

  useEffect(() => {
    return () => stopTalaMetronome();
  }, []);

  // ──────────────────────────────────────────────
  // QUIZ STATE
  // ──────────────────────────────────────────────
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const currentQuiz = EAR_QUIZ_QUESTIONS[quizIdx];

  const handleQuizAnswer = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
    setIsAnswerSubmitted(true);
    if (option === currentQuiz.correct) {
      setQuizScore((s) => s + 1);
    }
  };

  const nextQuizQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizIdx((i) => (i + 1) % EAR_QUIZ_QUESTIONS.length);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ── Page Header ── */}
      <div className="glass-panel traditional-glow rounded-3xl border border-[#D4AF37]/25 p-6 md:p-8 bg-gradient-to-r from-[#FAF6F0] via-white to-[#F5E6CF]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-[#800020]/10 text-[#800020] border-[#800020]/20 font-black text-xs">
                Student Practice Suite
              </Badge>
              <Badge variant="outline" className="border-[#D4AF37]/40 text-[#E68A00] font-bold">
                Video & Audio Modules
              </Badge>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-black text-[#800020]">
              Carnatic Music Practice Hub
            </h1>
            <p className="text-sm font-semibold text-[#1A2228]/70 mt-1 max-w-2xl">
              Watch guided video practice sessions, master Sarali Varisai with live audio, tune your vocal pitch, and practice Tala metronome.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/80 border border-[#D4AF37]/30 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-[10px] font-black uppercase text-gray-400">Practice Score</p>
              <p className="font-serif text-2xl font-black text-[#800020]">94%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Practice Module Tabs ── */}
      <div className="flex flex-wrap gap-2 border-b border-[#D4AF37]/20 pb-4">
        {[
          { id: "video",   label: "📺 Video Practice Lessons", icon: Video },
          { id: "varisai", label: "🎶 Varisai & Exercises",     icon: Music },
          { id: "tala",    label: "🥁 Tala Metronome",           icon: Activity },
          { id: "tuner",   label: "🎤 Live Vocal Tuner",         icon: Sliders },
          { id: "quiz",    label: "🧠 Ear Training Quiz",       icon: Trophy },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                active
                  ? "bg-[#800020] text-white shadow-md scale-105"
                  : "bg-white border border-gray-200 text-[#1A2228]/70 hover:border-[#D4AF37] hover:text-[#800020]"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────
          TAB 0: VIDEO PRACTICE LESSONS (USER REQUESTED)
         ────────────────────────────────────────────── */}
      {activeTab === "video" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Video Catalog */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-extrabold text-[#800020] flex items-center gap-2">
              <Video className="size-5" /> Video Practice Sessions
            </h3>
            <div className="space-y-3">
              {PRACTICE_VIDEOS.map((video) => {
                const isSelected = activeVideo.id === video.id;
                return (
                  <button
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "border-[#800020] bg-[#800020]/5 shadow-md"
                        : "border-gray-200 bg-white hover:border-[#D4AF37]/60"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#E68A00]/10 text-[#E68A00]">
                        {video.category}
                      </span>
                      {isSelected && <Badge className="bg-[#800020] text-white text-[9px]">Playing</Badge>}
                    </div>
                    <p className="font-extrabold text-xs text-[#1A2228] mt-1 line-clamp-2">
                      {video.title}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-2 font-medium">
                      ⏱ {video.duration}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Video Player & Practice Notes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[#D4AF37]/30 p-6 md:p-8 shadow-sm space-y-6">
              {/* Responsive Iframe Container */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-black">
                <iframe
                  src={activeVideo.embedUrl}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-black text-[#800020]">
                    {activeVideo.title}
                  </h2>
                  <p className="text-xs font-semibold text-gray-500 mt-1">
                    {activeVideo.description}
                  </p>
                </div>
                <a
                  href={activeVideo.watchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D4AF37]/30 text-xs font-extrabold text-[#800020] hover:bg-[#F3EBE0] transition-colors whitespace-nowrap"
                >
                  Watch on YouTube <ExternalLink className="size-3.5" />
                </a>
              </div>

              {/* Practice Takeaways & Notes */}
              <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#D4AF37]/20 space-y-3">
                <h4 className="font-serif text-sm font-extrabold text-[#800020] flex items-center gap-2">
                  <Sparkles className="size-4 text-[#E68A00]" /> Practice Session Takeaways
                </h4>
                <ul className="space-y-2">
                  {activeVideo.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#1A2228]">
                      <span className="size-4 rounded-full bg-[#800020]/10 text-[#800020] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="font-semibold leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────
          TAB 1: VARISAI & EXERCISES PLAYER
         ────────────────────────────────────────────── */}
      {activeTab === "varisai" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Lesson Selector */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-extrabold text-[#800020] flex items-center gap-2">
              <Music className="size-5" /> Lessons Catalog
            </h3>
            <div className="space-y-2.5">
              {VARISAI_LESSONS.map((lesson) => {
                const isSelected = selectedLesson.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLesson(lesson);
                      stopVarisaiPlayback();
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "border-[#800020] bg-[#800020]/5 shadow-sm"
                        : "border-gray-200 bg-white hover:border-[#D4AF37]/60"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#E68A00]">
                        {lesson.type}
                      </span>
                      {isSelected && <Badge className="bg-[#800020] text-white text-[9px]">Selected</Badge>}
                    </div>
                    <p className="font-extrabold text-xs text-[#1A2228] mt-1">{lesson.title}</p>
                    <p className="text-[10px] text-gray-500 mt-1">Raga: {lesson.raga}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Interactive Player */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[#D4AF37]/30 p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-black uppercase text-[#E68A00] tracking-wider">
                  Active Lesson
                </span>
                <h2 className="font-serif text-2xl font-black text-[#800020] mt-0.5">
                  {selectedLesson.title}
                </h2>
                <p className="text-xs font-semibold text-gray-500 mt-1">
                  Scale: {selectedLesson.raga}
                </p>
              </div>

              {/* Controls Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF6F0] border border-[#D4AF37]/20">
                {/* Sruthi */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                    Adhara Sruthi
                  </label>
                  <select
                    value={baseSruthi.name}
                    onChange={(e) => {
                      const found = BASE_SRUTHIS.find((s) => s.name === e.target.value);
                      if (found) setBaseSruthi(found);
                    }}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-bold"
                  >
                    {BASE_SRUTHIS.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Tempo */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                    Tempo: {tempoBpm} BPM
                  </label>
                  <input
                    type="range" min={40} max={180} step={5} value={tempoBpm}
                    onChange={(e) => setTempoBpm(Number(e.target.value))}
                    className="w-full accent-[#800020] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-1">
                    <span>1st Speed (60)</span>
                    <span>2nd (120)</span>
                  </div>
                </div>

                {/* Play / Stop Button */}
                <div className="col-span-2 md:col-span-1 flex items-end">
                  <button
                    onClick={isPlayingVarisai ? stopVarisaiPlayback : startVarisaiPlayback}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                      isPlayingVarisai
                        ? "bg-[#800020] text-white hover:bg-red-800"
                        : "bg-gradient-to-r from-[#D4AF37] to-[#E68A00] text-white hover:from-[#E68A00]"
                    }`}
                  >
                    {isPlayingVarisai ? (
                      <>
                        <Square className="size-4 fill-current" /> Stop
                      </>
                    ) : (
                      <>
                        <Play className="size-4 fill-current" /> Play Varisai
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Interactive Swara Karaoke Display */}
              <div className="space-y-4">
                {/* Arohana */}
                <div>
                  <p className="text-xs font-extrabold text-[#800020] mb-2 uppercase tracking-wider">
                    Arohana (Ascending)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLesson.notes.map((note, idx) => {
                      const isActive = isPlayingVarisai && currentNoteIdx === idx;
                      return (
                        <div
                          key={idx}
                          className={`size-12 rounded-xl flex flex-col items-center justify-center border font-black text-sm transition-all duration-150 ${
                            isActive
                              ? "bg-[#800020] text-white border-[#800020] scale-110 shadow-lg ring-4 ring-[#800020]/20"
                              : "bg-[#FAF6F0] border-gray-200 text-[#1A2228]"
                          }`}
                        >
                          <span>{note}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Avarohana */}
                <div>
                  <p className="text-xs font-extrabold text-[#800020] mb-2 uppercase tracking-wider">
                    Avarohana (Descending)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLesson.reverse.map((note, idx) => {
                      const realIdx = selectedLesson.notes.length + idx;
                      const isActive = isPlayingVarisai && currentNoteIdx === realIdx;
                      return (
                        <div
                          key={idx}
                          className={`size-12 rounded-xl flex flex-col items-center justify-center border font-black text-sm transition-all duration-150 ${
                            isActive
                              ? "bg-[#E68A00] text-white border-[#E68A00] scale-110 shadow-lg ring-4 ring-[#E68A00]/20"
                              : "bg-[#FAF6F0] border-gray-200 text-[#1A2228]"
                          }`}
                        >
                          <span>{note}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────
          TAB 2: TALA RHYTHM METRONOME
         ────────────────────────────────────────────── */}
      {activeTab === "tala" && (
        <div className="bg-white rounded-3xl border border-[#D4AF37]/30 p-6 md:p-8 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase text-[#E68A00] tracking-wider">
                Carnatic Rhythm Keeper
              </span>
              <h2 className="font-serif text-2xl font-black text-[#800020]">
                Tala & Beat Counter Metronome
              </h2>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                Visual finger counts with audio accents for Adi Tala, Rupaka, Chapu talas.
              </p>
            </div>

            <button
              onClick={isPlayingTala ? stopTalaMetronome : startTalaMetronome}
              className={`px-6 py-3 rounded-2xl font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${
                isPlayingTala
                  ? "bg-[#800020] text-white hover:bg-red-800"
                  : "bg-gradient-to-r from-[#D4AF37] to-[#E68A00] text-white hover:scale-105"
              }`}
            >
              {isPlayingTala ? <Square className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
              {isPlayingTala ? "Stop Metronome" : "Start Tala Counter"}
            </button>
          </div>

          {/* Tala Selector & Speed Controls */}
          <div className="grid md:grid-cols-3 gap-6 p-6 rounded-2xl bg-[#FAF6F0] border border-[#D4AF37]/20">
            <div>
              <label className="block text-xs font-extrabold text-[#800020] mb-2 uppercase">
                Select Tala
              </label>
              <select
                value={selectedTala.name}
                onChange={(e) => {
                  const found = TALAS.find((t) => t.name === e.target.value);
                  if (found) {
                    setSelectedTala(found);
                    stopTalaMetronome();
                  }
                }}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold"
              >
                {TALAS.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-extrabold text-[#800020] uppercase">
                  Tempo (BPM)
                </label>
                <span className="text-xs font-black text-[#E68A00]">{talaBpm} BPM</span>
              </div>
              <input
                type="range" min={40} max={220} step={2} value={talaBpm}
                onChange={(e) => setTalaBpm(Number(e.target.value))}
                className="w-full accent-[#800020] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#800020] mb-2 uppercase">
                Kala Presets (Speed)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "1st Speed", bpm: 60 },
                  { label: "2nd Speed", bpm: 120 },
                  { label: "3rd Speed", bpm: 180 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setTalaBpm(preset.bpm)}
                    className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                      talaBpm === preset.bpm
                        ? "bg-[#800020] text-white border-[#800020]"
                        : "bg-white border-gray-200 text-gray-700 hover:border-[#D4AF37]"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Tala Beat Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-[#800020] uppercase tracking-wider">
              Live Beat & Finger Visualizer ({selectedTala.beats} Beats)
            </h4>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {selectedTala.pattern.map((p) => {
                const isActive = activeBeat === p.beat;
                return (
                  <div
                    key={p.beat}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-100 ${
                      isActive
                        ? "bg-[#800020] text-white border-[#800020] scale-110 shadow-xl ring-4 ring-[#800020]/20"
                        : "bg-[#FAF6F0] border-gray-200 text-[#1A2228]"
                    }`}
                  >
                    <span className="text-2xl font-black">{p.beat}</span>
                    <span className={`text-[9px] font-extrabold uppercase mt-1 ${isActive ? "text-white" : "text-gray-500"}`}>
                      {p.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────
          TAB 3: VOCAL PITCH TUNER
         ────────────────────────────────────────────── */}
      {activeTab === "tuner" && (
        <div className="flex justify-center">
          <PitchVisualizer />
        </div>
      )}

      {/* ──────────────────────────────────────────────
          TAB 4: EAR TRAINING QUIZ
         ────────────────────────────────────────────── */}
      {activeTab === "quiz" && (
        <div className="bg-white rounded-3xl border border-[#D4AF37]/30 p-6 md:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-black uppercase text-[#E68A00] tracking-wider">
                Question {currentQuiz.id} of {EAR_QUIZ_QUESTIONS.length}
              </span>
              <h2 className="font-serif text-xl font-black text-[#800020] mt-0.5">
                Raga & Swara Ear Quiz
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-[#FAF6F0] border border-[#D4AF37]/30 px-3 py-1.5 rounded-full">
              <Trophy className="size-4 text-[#E68A00]" />
              <span className="text-xs font-black text-[#800020]">Score: {quizScore}</span>
            </div>
          </div>

          {/* Audio Play Button for Question */}
          <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#D4AF37]/20 text-center space-y-3">
            <p className="text-sm font-extrabold text-[#1A2228]">{currentQuiz.question}</p>
            <button
              onClick={() => {
                currentQuiz.audioSwaras.forEach((s, idx) => {
                  setTimeout(() => playSwaraTone(s), idx * 400);
                });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-red-800 transition-all"
            >
              <Volume2 className="size-4" /> Listen to Swara Audio
            </button>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQuiz.options.map((option) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQuiz.correct;

              let style = "bg-white border-gray-200 text-[#1A2228] hover:border-[#D4AF37]";
              if (isAnswerSubmitted) {
                if (isCorrect) style = "bg-green-50 border-green-500 text-green-700 font-black";
                else if (isSelected) style = "bg-red-50 border-red-500 text-red-700 font-black";
              }

              return (
                <button
                  key={option}
                  onClick={() => handleQuizAnswer(option)}
                  disabled={isAnswerSubmitted}
                  className={`p-4 rounded-xl border font-bold text-xs text-left transition-all ${style}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D4AF37]/20 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                {selectedOption === currentQuiz.correct ? (
                  <>
                    <CheckCircle2 className="size-5 text-green-600" />
                    <span className="text-xs font-black text-green-700">Correct Answer!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-5 text-red-600" />
                    <span className="text-xs font-black text-red-700">
                      Incorrect. Correct is {currentQuiz.correct}.
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-600">{currentQuiz.explanation}</p>

              <button
                onClick={nextQuizQuestion}
                className="w-full py-2.5 rounded-xl bg-[#800020] text-white font-bold text-xs hover:bg-red-800 transition-all"
              >
                Next Question →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
