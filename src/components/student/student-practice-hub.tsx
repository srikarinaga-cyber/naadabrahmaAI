"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  Volume2,
  Tv,
  CheckCircle2,
  Video,
  RotateCcw,
  Clock,
  Music,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TalaMatrixPlayer } from "@/components/music/tala-matrix-player";

interface YouTubeLesson {
  id: string;
  title: string;
  category: string;
  instructor: string;
  youtubeId: string;
  description: string;
}

interface EarQuizQuestion {
  id: string;
  title: string;
  swarasToPlay: string[];
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Curated YouTube Masterclass Video Lessons for Carnatic Music
const YOUTUBE_LESSONS: YouTubeLesson[] = [
  {
    id: "yt-featured",
    title: "Carnatic Music Vocal & Tala Practice Masterclass",
    category: "Featured Masterclass",
    instructor: "Carnatic Vidwan Lessons",
    youtubeId: "OPhnN6bFFgw",
    description: "Comprehensive Carnatic music lesson covering raga swarasthana practice, tala counts, and vocal exercises.",
  },
  {
    id: "yt-1",
    title: "Carnatic Vocal Foundation: Mayamalavagowla Sarali Varisai",
    category: "Vocal Abhyasa Ganam",
    instructor: "Carnatic Academy Masterclass",
    youtubeId: "5qap5aO4i9A",
    description: "Learn the foundational Sarali Swaras in 3 speeds with proper Adhara Shadja tuning and rhythm alignment.",
  },
  {
    id: "yt-2",
    title: "Understanding 72 Melakarta Ragas & Chakra System",
    category: "Raga Science & Theory",
    instructor: "Sangeetha Vidwan Series",
    youtubeId: "x0ZlY5uWJkU",
    description: "Deep dive into Venkatamakhin's 72 Melakarta classification system and swarasthana variations.",
  },
  {
    id: "yt-3",
    title: "How to Count 8 Beats of Adi Tala with Hand Gestures",
    category: "Tala & Rhythm Practice",
    instructor: "Guru Rhythm Workshop",
    youtubeId: "L_LupnjgPso",
    description: "Master Laghu finger counts and Dhrutam waves for Adi Tala and 35 Suladi Sapta Talas.",
  },
  {
    id: "yt-4",
    title: "Carnatic Gamaka Secrets: Kampita, Sphurita & Jarus",
    category: "Advanced Vocal Technique",
    instructor: "Carnatic Vocal Masterclass",
    youtubeId: "YQHsXMglC9A",
    description: "Explore authentic gamaka oscillations on G3, M1, and N3 swarasthanas.",
  },
];

// Interactive "Listen the Swaras & Answer" Audio Ear Training Dataset
const SWARA_EAR_QUIZZES: EarQuizQuestion[] = [
  {
    id: "ear-1",
    title: "Listen to the 3-Note Swara Phrase:",
    swarasToPlay: ["S", "R1", "G3"],
    options: [
      "S R1 G3 (Mayamalavagowla Phase)",
      "S R2 G2 (Kharaharapriya Phase)",
      "S R2 G3 (Sankarabharanam Phase)",
      "S G3 P (Bauli Phase)",
    ],
    correctAnswer: "S R1 G3 (Mayamalavagowla Phase)",
    explanation: "Suddha Rishabha (R1) and Antara Gandhara (G3) form the characteristic warm signature of Mayamalavagowla.",
  },
  {
    id: "ear-2",
    title: "Listen to the 5-Note Pentatonic Scale Audio:",
    swarasToPlay: ["S", "R2", "G3", "P", "N3", "S'"],
    options: [
      "Hamsadhwani Raga",
      "Mohanam Raga",
      "Hindolam Raga",
      "Kambhoji Raga",
    ],
    correctAnswer: "Hamsadhwani Raga",
    explanation: "Hamsadhwani consists of S R2 G3 P N3 S' in both Arohana and Avarohana.",
  },
  {
    id: "ear-3",
    title: "Listen to the Melakarta #22 Arohana Phrase:",
    swarasToPlay: ["S", "R2", "G2", "M1", "P", "D2", "N2", "S'"],
    options: [
      "Kharaharapriya (S R2 G2 M1 P D2 N2 S')",
      "Mayamalavagowla (S R1 G3 M1 P D1 N3 S')",
      "Mechakalyani (S R2 G3 M2 P D2 N3 S')",
      "Natabhairavi (S R2 G2 M1 P D1 N2 S')",
    ],
    correctAnswer: "Kharaharapriya (S R2 G2 M1 P D2 N2 S')",
    explanation: "Kharaharapriya uses Chatusruti Rishabha (R2), Sadharana Gandhara (G2), Suddha Madhyama (M1), Chatusruti Dhaivata (D2), and Kaisiki Nishada (N2).",
  },
  {
    id: "ear-4",
    title: "Listen to the Auspicious Pentatonic Audio Clip:",
    swarasToPlay: ["S", "G2", "M1", "D1", "N2", "S'"],
    options: [
      "Hindolam Raga",
      "Mohanam Raga",
      "Abheri Raga",
      "Revagupti Raga",
    ],
    correctAnswer: "Hindolam Raga",
    explanation: "Hindolam is a 5-note pentatonic raga omitting Rishabha and Panchama (S G2 M1 D1 N2 S').",
  },
];

// Swara Audio Frequency Mapping (Hz)
const SWARA_FREQS: Record<string, number> = {
  S: 130.81,
  R1: 138.59,
  R2: 146.83,
  G1: 146.83,
  G2: 155.56,
  G3: 164.81,
  M1: 174.61,
  M2: 185.0,
  P: 196.0,
  D1: 207.65,
  D2: 220.0,
  N2: 233.08,
  N3: 246.94,
  "S'": 261.63,
};

export function StudentPracticeHub() {
  const [activeTab, setActiveTab] = useState<"ear-quiz" | "35-talas" | "youtube">("ear-quiz");

  // Ear Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [instrument, setInstrument] = useState<"veena" | "violin">("veena");

  // YouTube Lesson State
  const [activeVideo, setActiveVideo] = useState<YouTubeLesson>(YOUTUBE_LESSONS[0]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize Swara Audio Phrase for Ear Training Quiz
  const playSwaraAudioPhrase = async (swaras: string[]) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContextClass();
      if (ctx.state === "suspended") await ctx.resume();
      audioCtxRef.current = ctx;

      for (let i = 0; i < swaras.length; i++) {
        const swara = swaras[i];
        const hz = SWARA_FREQS[swara] || 130.81;
        const now = ctx.currentTime;

        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);

        if (instrument === "veena") {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          osc1.type = "sawtooth";
          osc2.type = "triangle";

          osc1.frequency.setValueAtTime(hz, now);
          osc2.frequency.setValueAtTime(hz * 2, now);

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(hz * 4, now);

          masterGain.gain.setValueAtTime(0.001, now);
          masterGain.gain.linearRampToValueAtTime(0.35, now + 0.015);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(masterGain);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.6);
          osc2.stop(now + 0.6);
        } else {
          const osc = ctx.createOscillator();
          const vibrato = ctx.createOscillator();
          const vibratoGain = ctx.createGain();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(hz, now);

          vibrato.frequency.setValueAtTime(5.5, now);
          vibratoGain.gain.setValueAtTime(hz * 0.015, now);
          vibrato.connect(osc.frequency);

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(hz * 3.5, now);

          masterGain.gain.setValueAtTime(0.001, now);
          masterGain.gain.linearRampToValueAtTime(0.3, now + 0.05);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

          vibrato.start(now);
          osc.connect(filter);
          filter.connect(masterGain);

          osc.start(now);
          vibrato.stop(now + 0.6);
          osc.stop(now + 0.6);
        }

        await new Promise((res) => setTimeout(res, 650));
      }
    } catch (e) {
      console.warn("Audio play error:", e);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(opt);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === SWARA_EAR_QUIZZES[currentQuizIdx].correctAnswer) {
      setScore((prev) => prev + 25);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    if (currentQuizIdx < SWARA_EAR_QUIZZES.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
    } else {
      setCurrentQuizIdx(0);
    }
  };

  const currentQuiz = SWARA_EAR_QUIZZES[currentQuizIdx];

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 bg-card p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[10px] mb-1">
              Carnatic Student Practice Hub
            </Badge>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-kumkum">
              Practice Hub & Rhythm Sound Engine
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
              Practice 35 Suladi Sapta Tala beats sound, test your ear pitch recognition, and watch masterclass video lessons.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-muted/60 p-3 rounded-2xl border border-border">
            <div className="flex size-10 items-center justify-center rounded-xl bg-swara-gold/20 text-kumkum font-bold font-serif text-lg">
              🏆
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Practice Score</p>
              <p className="font-serif text-xl font-bold text-foreground">{score} Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("ear-quiz")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "ear-quiz"
              ? "bg-kumkum text-white shadow-sm font-bold"
              : "bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          <Volume2 className="size-4" />
          Listen Swaras & Answer ({SWARA_EAR_QUIZZES.length})
        </button>
        <button
          onClick={() => setActiveTab("35-talas")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "35-talas"
              ? "bg-kumkum text-white shadow-sm font-bold"
              : "bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          <Clock className="size-4" />
          35 Suladi Sapta Talas Beat Sound Player
        </button>
        <button
          onClick={() => setActiveTab("youtube")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "youtube"
              ? "bg-kumkum text-white shadow-sm font-bold"
              : "bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          <Tv className="size-4" />
          YouTube Masterclasses ({YOUTUBE_LESSONS.length})
        </button>
      </div>

      {/* ── TAB 1: LISTEN SWARAS & ANSWER (AUDIO EAR QUIZ) ── */}
      {activeTab === "ear-quiz" && (
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 bg-card p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
            <div>
              <span className="text-[10px] font-bold text-kumkum uppercase tracking-widest bg-kumkum/10 px-2.5 py-0.5 rounded-full">
                Question {currentQuizIdx + 1} of {SWARA_EAR_QUIZZES.length}
              </span>
              <h3 className="font-serif text-xl font-bold text-foreground mt-1">
                {currentQuiz.title}
              </h3>
            </div>

            {/* Instrument Switcher */}
            <div className="flex items-center gap-2 rounded-xl bg-muted p-1 border border-border">
              <button
                onClick={() => setInstrument("veena")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  instrument === "veena"
                    ? "bg-card text-kumkum font-bold shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                🪕 Veena Sound
              </button>
              <button
                onClick={() => setInstrument("violin")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  instrument === "violin"
                    ? "bg-card text-kumkum font-bold shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                🎻 Violin Sound
              </button>
            </div>
          </div>

          {/* Audio Player Button */}
          <div className="rounded-2xl border border-swara-gold/30 bg-kumkum/5 p-6 text-center space-y-3">
            <p className="text-xs font-semibold text-muted-foreground">
              Click below to listen to the Swara Audio Clip in {instrument === "veena" ? "Veena" : "Violin"} sound:
            </p>
            <Button
              size="lg"
              disabled={isPlayingAudio}
              onClick={() => playSwaraAudioPhrase(currentQuiz.swarasToPlay)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-6 py-3 rounded-2xl gap-2 shadow-md transition-all"
            >
              {isPlayingAudio ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Playing Audio Clip...
                </span>
              ) : (
                <>
                  <Play className="size-5 fill-current" /> Play Swara Audio Phrase
                </>
              )}
            </Button>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-foreground">
              Select the correct Swara phrase or Raga based on the audio clip:
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              {currentQuiz.options.map((opt) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === currentQuiz.correctAnswer;

                let btnStyle = "border-border bg-card hover:border-kumkum/40";
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 font-bold";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "border-red-500 bg-red-500/10 text-red-700 font-bold";
                  }
                } else if (isSelected) {
                  btnStyle = "border-kumkum bg-kumkum/10 text-kumkum font-bold ring-1 ring-kumkum";
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    className={`rounded-2xl border p-4 text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit & Explanation Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-border pt-4 gap-3">
            {isAnswerSubmitted ? (
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground">
                  💡 Explanation: <span className="font-normal text-muted-foreground">{currentQuiz.explanation}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Select an option and submit your answer.</p>
            )}

            {!isAnswerSubmitted ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="bg-kumkum hover:bg-kumkum-light text-white text-xs px-5 py-2 font-bold"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuiz}
                className="bg-swara-gold hover:bg-swara-gold/90 text-shanti-slate text-xs px-5 py-2 font-bold gap-1.5"
              >
                Next Question <RotateCcw className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: 35 SULADI SAPTA TALAS BEAT SOUND PLAYER ── */}
      {activeTab === "35-talas" && (
        <div className="space-y-6">
          <TalaMatrixPlayer />
        </div>
      )}

      {/* ── TAB 3: YOUTUBE MASTERCLASSES ── */}
      {activeTab === "youtube" && (
        <div className="space-y-6">
          {/* Active Player */}
          <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 bg-card p-6 md:p-8 space-y-4 shadow-sm">
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border shadow-md bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[10px]">
                  {activeVideo.category}
                </Badge>
                <span className="text-xs text-muted-foreground">• {activeVideo.instructor}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-kumkum">{activeVideo.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{activeVideo.description}</p>
            </div>
          </div>

          {/* Video Lesson Selection Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {YOUTUBE_LESSONS.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className={`glass-panel rounded-2xl p-4 border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                  activeVideo.id === video.id
                    ? "border-kumkum bg-kumkum/5 shadow-md ring-1 ring-kumkum"
                    : "border-swara-gold/20 bg-card hover:border-kumkum/40"
                }`}
              >
                <div className="space-y-2">
                  <div className="aspect-video w-full rounded-xl bg-muted overflow-hidden relative border border-border flex items-center justify-center">
                    <Video className="size-8 text-kumkum/60" />
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      YouTube
                    </span>
                  </div>
                  <Badge variant="outline" className="border-swara-gold/30 text-swara-gold text-[9px]">
                    {video.category}
                  </Badge>
                  <h4 className="font-serif text-xs font-bold text-foreground line-clamp-2">
                    {video.title}
                  </h4>
                </div>

                <span className="text-[10px] text-kumkum font-bold flex items-center gap-1 pt-2 border-t border-border/50">
                  <Play className="size-3 fill-current" /> Watch Lesson
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
