"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Activity,
  Award,
  BookOpen,
  Mic,
  Music,
  Flame,
  Zap,
} from "lucide-react";

const PitchVisualizer = nextDynamic(
  () => import("@/components/music/PitchVisualizer"),
  { ssr: false }
);

export default function StudentDashboardPage() {
  const [goals, setGoals] = useState([
    { id: 1, task: "Practice Mayamalavagowla scales (Sarali 1-3)", done: true },
    { id: 2, task: "Review 18th Century Composer Trinity eras", done: false },
    { id: 3, task: "Perform a 5-minute Tanpura pitch alignment hum", done: false },
    { id: 4, task: "Complete Adi Tala rhythm metronome 10-min run", done: false },
  ]);

  const toggleGoal = (id: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const RECOMMENDATIONS = [
    {
      title: "Perfect your G3 (Antara Gandhara)",
      desc: "Based on your last mock, your pitch accuracy in Sankarabharanam was 4.2Hz sharp on G3.",
      action: "Practice Scale",
      type: "Pitch Tune",
      href: "/student/practice",
      icon: "🎯",
    },
    {
      title: "Explore Raga Hamsadhwani",
      desc: "A popular symmetric pentatonic Janya scale. Good for practicing basic compositions.",
      action: "Learn Scale",
      type: "Raga Study",
      href: "/knowledge-hub",
      icon: "📖",
    },
    {
      title: "Adi Tala Structure Quiz",
      desc: "Review angas (1 Laghu, 2 Dhrutams) to master rhythmic calculations.",
      action: "Take Quiz",
      type: "Exam Prep",
      href: "/student/exam",
      icon: "🧠",
    },
  ];

  const STATS = [
    {
      label: "Study Progress",
      val: "68%",
      sub: "12 of 18 lessons completed",
      color: "from-[#800020] to-[#A82040]",
      progress: 68,
      icon: BookOpen,
    },
    {
      label: "Ragas Discovered",
      val: "14",
      sub: "8 Melakartas, 6 Janya derivatives",
      color: "from-[#E68A00] to-[#F0A500]",
      progress: 45,
      icon: Music,
    },
    {
      label: "Practice Score",
      val: "91%",
      sub: "Average pitch correctness",
      color: "from-[#D4AF37] to-[#E8C87A]",
      progress: 91,
      icon: Award,
    },
  ];

  const BOOKMARKS = [
    { title: "Kriti: Vatapi Ganapatim", raga: "Hamsadhwani", type: "Kriti", href: "/knowledge-hub" },
    { title: "Composer: Muthuswami Dikshitar", raga: "Carnatic Trinity", type: "Composer", href: "/knowledge-hub/composers" },
    { title: "Raga: Bhairavi (Janya)", raga: "Melakarta #20 parent", type: "Janya Raga", href: "/knowledge-hub" },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* ── Quick Welcome & Action Bar ── */}
      <div className="glass-panel traditional-glow rounded-3xl border border-[#D4AF37]/30 p-6 md:p-8 bg-gradient-to-r from-[#FAF6F0] via-white to-[#F5E6CF] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-[#800020]/15 text-[#800020] border-[#800020]/25 font-black text-xs px-3 py-1">
              Carnatic Student Portal
            </Badge>
            <Badge variant="outline" className="border-[#E68A00]/40 text-[#E68A00] font-extrabold flex items-center gap-1">
              <Flame className="size-3 text-[#E68A00] fill-current" /> 7 Day Streak
            </Badge>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-black text-[#800020]">
            Welcome Back, Student!
          </h1>
          <p className="text-sm font-semibold text-gray-600 mt-1 max-w-xl">
            Track your singing pitch, practice Sarali Varisai with live audio, and ask AI Guru doubts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/student/practice"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#800020] to-[#A82040] text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            <Zap className="size-4" /> Start Practice Suite
          </Link>
          <Link
            href="/student/guru"
            className="px-5 py-3 rounded-2xl bg-white border border-[#D4AF37]/40 text-[#800020] font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-[#FAF6F0] transition-all"
          >
            <Sparkles className="size-4 text-[#D4AF37]" /> AI Guru Chat
          </Link>
        </div>
      </div>

      {/* ── 3 Overview Stats Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="glass-panel rounded-3xl p-6 border border-[#D4AF37]/25 bg-white/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  {stat.label}
                </span>
                <div className={`size-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                  <stat.icon className="size-4" />
                </div>
              </div>
              <h3 className="font-serif text-4xl font-black text-[#1A2228] tracking-tight">
                {stat.val}
              </h3>
            </div>

            <div className="mt-4 space-y-2">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
              <p className="text-[11px] font-bold text-gray-500">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Dashboard Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Recommendations & Goals */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Guru Personal Recommendations */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-[#800020]" />
                <h2 className="font-serif text-xl font-black text-[#800020]">
                  AI Guru Personal Recommendations
                </h2>
              </div>
              <Badge variant="outline" className="border-[#800020]/20 text-[#800020] text-[10px] font-extrabold uppercase">
                Updated Live
              </Badge>
            </div>

            <div className="space-y-3">
              {RECOMMENDATIONS.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-[#D4AF37]/20 shadow-sm hover:border-[#800020]/40 hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{rec.icon}</span>
                      <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-[#FAF6F0] text-[#E68A00] border border-[#D4AF37]/30">
                        {rec.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-[#1A2228]">{rec.title}</h3>
                    <p className="text-xs font-semibold text-gray-500 leading-relaxed">{rec.desc}</p>
                  </div>
                  <Link
                    href={rec.href}
                    className="whitespace-nowrap px-4 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#800020] text-xs font-extrabold text-[#800020] hover:text-white border border-[#D4AF37]/30 hover:border-[#800020] transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    {rec.action} <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Daily Goals Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/25 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-black text-[#800020] flex items-center gap-2">
                <CheckCircle2 className="size-5 text-[#800020]" /> Daily Practice Goals
              </h2>
              <span className="text-xs font-extrabold text-gray-500">
                {goals.filter(g => g.done).length} / {goals.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all ${
                    goal.done
                      ? "bg-green-50/60 border-green-200 text-gray-400 line-through"
                      : "bg-[#FAF6F0]/60 border-gray-200 text-[#1A2228] hover:border-[#D4AF37]"
                  }`}
                >
                  <div
                    className={`size-5 rounded-lg flex items-center justify-center border transition-all ${
                      goal.done
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-white border-gray-300 text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                  <span className="text-xs font-extrabold leading-snug">{goal.task}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Vocal Pitch Visualizer & Bookmarks */}
        <div className="space-y-8">
          
          {/* Real-time Vocal Pitch Visualizer Card */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mic className="size-5 text-[#800020]" />
              <h2 className="font-serif text-lg font-black text-[#800020]">
                Vocal Pitch & Swara Tracker
              </h2>
            </div>
            <PitchVisualizer />
          </div>

          {/* Saved Bookmarks */}
          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/25 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-black text-[#800020] flex items-center gap-2">
                <Bookmark className="size-5 text-[#800020]" /> Saved Bookmarks
              </h2>
              <Link href="/notes" className="text-[10px] font-extrabold text-[#E68A00] hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {BOOKMARKS.map((bk, idx) => (
                <Link
                  key={idx}
                  href={bk.href}
                  className="flex justify-between items-center p-3 rounded-2xl border border-gray-100 bg-[#FAF6F0]/40 hover:border-[#D4AF37]/50 transition-all group"
                >
                  <div>
                    <p className="text-xs font-black text-[#1A2228] group-hover:text-[#800020] transition-colors">
                      {bk.title}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-400 mt-0.5">{bk.raga}</p>
                  </div>
                  <span className="text-xs">⭐</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
