"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import { Check, Plus, Trash2, Sparkles, BookOpen, ArrowRight, Video, Radio, ExternalLink, UserCheck, BookMarked } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TanpuraTablaPlayer } from "@/components/music/tanpura-tabla-player";

const PitchVisualizer = nextDynamic(
  () => import("@/components/music/PitchVisualizer"),
  { ssr: false }
);

interface Goal {
  id: string;
  task: string;
  done: boolean;
}

interface Bookmark {
  id: string;
  title: string;
  raga: string;
}

interface CourseInfo {
  className: string;
  teacherName: string;
  teacherSubject: string;
  topic: string;
  meetUrl: string;
  instrumentIcon: string;
}

const COURSE_MAP: Record<string, CourseInfo> = {
  "Veena": {
    className: "Veena Foundation & Swarasthana Alignment",
    teacherName: "Guru Vishwanathan",
    teacherSubject: "Veena & Stringed Instruments",
    topic: "Veena Fret Positioning, Strumming & Kampita Gamaka",
    meetUrl: "https://meet.google.com/new",
    instrumentIcon: "🪕",
  },
  "Violin": {
    className: "Violin Bowing & Gamaka Masterclass",
    teacherName: "Guru Vishwanathan",
    teacherSubject: "Violin & Bowed Strings",
    topic: "Vocal Accompaniment Bowing & Swara Pitch Matching",
    meetUrl: "https://meet.google.com/new",
    instrumentIcon: "🎻",
  },
  "Mridangam": {
    className: "Mridangam Tha-Dhi-Gi-Na-Thom Lessons",
    teacherName: "Guru Ramanathan",
    teacherSubject: "Mridangam & Solkattu Percussion",
    topic: "Basic Stroke Execution & Chatusra Jathi Beats",
    meetUrl: "https://meet.google.com/new",
    instrumentIcon: "🥁",
  },
  "Flute": {
    className: "Carnatic Venu Flute Swara Resonance",
    teacherName: "Guru Ramanathan",
    teacherSubject: "Venu Flute & Wind Technique",
    topic: "Fingering Placement & Breath Control in Mayamalavagowla",
    meetUrl: "https://meet.google.com/new",
    instrumentIcon: "🪈",
  },
  "Carnatic Vocal": {
    className: "Carnatic Vocal Abhyasa Ganam",
    teacherName: "Guru Sangeetha",
    teacherSubject: "Carnatic Vocal Sangeetham",
    topic: "Mayamalavagowla Sarali Swaras & Alankaram",
    meetUrl: "https://meet.google.com/new",
    instrumentIcon: "🎤",
  },
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2] || "") : null;
}

export default function StudentDashboardPage() {
  const [selectedCourseKey, setSelectedCourseKey] = useState<string>("Veena");
  const [academicYear, setAcademicYear] = useState<string>("1st Year (Beginner)");

  const [goals, setGoals] = useState<Goal[]>([
    { id: "g1", task: "Practice Mayamalavagowla scales in 3 speeds", done: true },
    { id: "g2", task: "Review 18th Century Carnatic Trinity eras", done: false },
    { id: "g3", task: "Perform a 5-minute Adhara Shadja Tanpura hum", done: false },
  ]);

  const [newGoalText, setNewGoalText] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: "b1", title: "Kriti: Vatapi Ganapatim", raga: "Hamsadhwani • Adi Tala" },
    { id: "b2", title: "Composer: Muthuswami Dikshitar", raga: "Carnatic Trinity Era" },
    { id: "b3", title: "Raga: Bhairavi (Janya)", raga: "Parent: Melakarta #20 Natabhairavi" },
  ]);

  useEffect(() => {
    try {
      // 1. Check direct course cookie or local storage
      const storedCourseCookie = getCookie("naada_student_course");
      const storedCourseLocal = localStorage.getItem("naada_student_course");
      const storedAllocation = localStorage.getItem("naada_student_allocation");

      let resolvedCourse = storedCourseCookie || storedCourseLocal;

      if (!resolvedCourse && storedAllocation) {
        try {
          const parsed = JSON.parse(storedAllocation);
          resolvedCourse = parsed?.course;
        } catch {
          // fallback
        }
      }

      if (resolvedCourse && COURSE_MAP[resolvedCourse]) {
        setSelectedCourseKey(resolvedCourse);
      } else {
        setSelectedCourseKey("Veena");
      }
    } catch (e) {
      console.warn("Could not parse student allocation:", e);
      setSelectedCourseKey("Veena");
    }
  }, []);

  const currentCourseInfo = COURSE_MAP[selectedCourseKey] || COURSE_MAP["Veena"];

  const handleCourseSwitch = (newCourse: string) => {
    setSelectedCourseKey(newCourse);
    try {
      localStorage.setItem("naada_student_course", newCourse);
      document.cookie = `naada_student_course=${encodeURIComponent(newCourse)}; path=/; max-age=86400; SameSite=Lax`;
      
      const allocation = {
        course: newCourse,
        academicYear,
        teacherName: COURSE_MAP[newCourse]?.teacherName,
      };
      localStorage.setItem("naada_student_allocation", JSON.stringify(allocation));
    } catch (e) {
      console.warn("Storage update error:", e);
    }
  };

  const completedGoalsCount = goals.filter((g) => g.done).length;
  const progressPercent = Math.round((completedGoalsCount / (goals.length || 1)) * 100);

  const toggleGoal = (id: string) => {
    setGoals(
      goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setGoals([
      ...goals,
      { id: `g-${Date.now()}`, task: newGoalText.trim(), done: false },
    ]);
    setNewGoalText("");
    setShowAddGoal(false);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const RECOMMENDATIONS = [
    {
      title: "Listen Swaras & Answer Audio Quizzes",
      desc: "Test your pitch ear recognition on Veena & Violin swara phrases.",
      action: "Open Ear Quiz",
      type: "Practice Hub",
      href: "/student/exam",
    },
    {
      title: "35 Suladi Sapta Talas Beat Player",
      desc: "Practice rhythm beat sounds across all 35 Talas with custom BPM tempo.",
      action: "Play 35 Talas",
      type: "Practice Hub",
      href: "/student/exam",
    },
    {
      title: "YouTube Carnatic Masterclasses",
      desc: "Watch featured video lessons and vocal exercises directly in Practice Hub.",
      action: "Watch Lessons",
      type: "Practice Hub",
      href: "/student/exam",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Allocated Live Google Meet Class Notification for Enrolled Student ── */}
      <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl space-y-5">
        {/* Course & Teacher Switcher Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-blue-500/30 pb-4 gap-3">
          <div className="flex items-center gap-2">
            <BookMarked className="size-4 text-swara-gold" />
            <span className="text-xs font-semibold text-blue-200">
              My Enrolled Course & Year:
            </span>
            <Badge className="bg-swara-gold/20 text-swara-gold border-swara-gold/40 text-xs font-extrabold">
              {academicYear}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-200">Switch Enrolled Subject:</span>
            <select
              value={selectedCourseKey}
              onChange={(e) => handleCourseSwitch(e.target.value)}
              className="rounded-xl border border-blue-400/40 bg-blue-900/80 px-3.5 py-1.5 text-xs font-extrabold text-white focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer shadow-xs"
            >
              <option value="Veena">🪕 Veena (Guru Vishwanathan)</option>
              <option value="Violin">🎻 Violin (Guru Vishwanathan)</option>
              <option value="Mridangam">🥁 Mridangam (Guru Ramanathan)</option>
              <option value="Flute">🪈 Flute (Guru Ramanathan)</option>
              <option value="Carnatic Vocal">🎤 Carnatic Vocal (Guru Sangeetha)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-600 text-white border-none text-[10px] font-bold animate-pulse flex items-center gap-1">
                <Radio className="size-3" /> LIVE ONLINE CLASS READY
              </Badge>
              <Badge variant="outline" className="border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                Assigned Guru Access Active
              </Badge>
            </div>

            <h2 className="font-serif text-2xl font-bold flex items-center gap-2.5 text-white">
              <span className="text-2xl">{currentCourseInfo.instrumentIcon}</span>
              {currentCourseInfo.className} — Live Google Meet
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-blue-100/90">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <UserCheck className="size-3.5 text-emerald-400" /> Allocated Guru: {currentCourseInfo.teacherName} ({currentCourseInfo.teacherSubject})
              </span>
              <span className="text-blue-200">• Topic: {currentCourseInfo.topic}</span>
            </div>
          </div>

          <a
            href={currentCourseInfo.meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-xl transition-all"
          >
            <Video className="size-4" /> Join My Batch Google Meet <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* ── Direct Banner Shortcut to Practice Hub ── */}
      <div className="rounded-3xl border border-swara-gold/30 bg-gradient-to-r from-[#800020] via-[#5c0017] to-[#800020] p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge className="bg-swara-gold text-shanti-slate border-none text-[10px] font-bold">
            🎵 Practice Hub for Students
          </Badge>
          <h2 className="font-serif text-2xl font-bold">
            Interactive Practice Hub
          </h2>
          <p className="text-xs text-amber-100/80 max-w-xl leading-relaxed">
            Access <strong>Swara Audio Quizzes</strong> (Listen & Answer), <strong>35 Suladi Sapta Talas Beat Sound Player</strong>, and <strong>YouTube Masterclass Video Lessons</strong>.
          </p>
        </div>

        <Link
          href="/student/exam"
          className="shrink-0 bg-swara-gold hover:bg-swara-gold/90 text-shanti-slate px-6 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
        >
          Open Practice Hub <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* ── Tanpura & Tabla Rhythm Drone Console ── */}
      <TanpuraTablaPlayer />

      {/* Overview Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Study Goals Progress
            </p>
            <h4 className="text-3xl font-extrabold text-[#800020] mt-1">
              {progressPercent}%
            </h4>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#800020]" />
            <span className="text-[10px] text-gray-500 font-medium">
              {completedGoalsCount} of {goals.length} tasks completed
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Ragas Discovered
            </p>
            <h4 className="text-3xl font-extrabold text-[#1A2228] mt-1">14</h4>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#E68A00]" />
            <span className="text-[10px] text-gray-500 font-medium">8 Melakartas, 6 Janyas</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Instrument Pitch Score
            </p>
            <h4 className="text-3xl font-extrabold text-emerald-600 mt-1">91%</h4>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span className="text-[10px] text-gray-500 font-medium">Avg pitch correctness</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Recommendations (Col Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-serif text-lg font-bold text-[#800020] flex items-center gap-1.5">
              <Sparkles className="size-4 text-[#D4AF37]" />
              Practice Hub Shortcuts & Recommendations
            </h4>
            <span className="text-[10px] bg-[#800020]/5 text-[#800020] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Updated Live
            </span>
          </div>

          <div className="space-y-3">
            {RECOMMENDATIONS.map((rec, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-[#D4AF37]/50 transition-all flex justify-between items-start gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                      {rec.type}
                    </span>
                  </div>
                  <h5 className="text-xs font-extrabold text-[#1A2228]">{rec.title}</h5>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{rec.desc}</p>
                </div>
                <Link
                  href={rec.href}
                  className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#F3EBE0] text-[10px] font-extrabold text-[#800020] border border-[#D4AF37]/20 transition-all"
                >
                  {rec.action}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Study Details (Col Span 1) */}
        <div className="space-y-6">
          <PitchVisualizer />

          {/* Dynamic Daily Goals */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-md font-bold text-[#800020]">Daily Goals</h4>
              <button
                onClick={() => setShowAddGoal(!showAddGoal)}
                className="text-[11px] text-[#800020] font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="size-3" /> Add Task
              </button>
            </div>

            {showAddGoal && (
              <form onSubmit={handleAddGoal} className="flex gap-2">
                <input
                  type="text"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  placeholder="Enter custom practice task..."
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#800020]"
                />
                <button
                  type="submit"
                  className="bg-[#800020] text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                >
                  Save
                </button>
              </form>
            )}

            <div className="space-y-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className="flex items-center space-x-3 text-xs cursor-pointer select-none group"
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                      goal.done
                        ? "bg-green-100 border-green-300 text-green-700 font-bold"
                        : "bg-white border-gray-300 text-transparent group-hover:border-[#800020]"
                    }`}
                  >
                    {goal.done && <Check className="size-3" />}
                  </span>
                  <span
                    className={
                      goal.done
                        ? "text-gray-400 line-through"
                        : "text-[#1A2228] font-medium group-hover:text-[#800020]"
                    }
                  >
                    {goal.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Saved Bookmarks */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-md font-bold text-[#800020] flex items-center gap-1.5">
                <BookOpen className="size-4 text-[#D4AF37]" />
                Saved Bookmarks
              </h4>
              <Badge variant="outline" className="border-gray-200 text-[10px]">
                {bookmarks.length} Items
              </Badge>
            </div>

            <div className="space-y-2.5">
              {bookmarks.map((bk) => (
                <div
                  key={bk.id}
                  className="flex justify-between items-center text-xs pb-2 border-b border-gray-50 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-extrabold text-[#1A2228]">{bk.title}</p>
                    <p className="text-[9px] text-gray-400">{bk.raga}</p>
                  </div>
                  <button
                    onClick={() => removeBookmark(bk.id)}
                    className="text-gray-300 hover:text-red-600 transition-colors p-1"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
