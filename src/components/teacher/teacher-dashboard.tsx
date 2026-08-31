"use client";

import { useState } from "react";
import {
  Users,
  BookOpen,
  Plus,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Send,
  FileText,
  TrendingUp,
  Search,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DemoClass {
  id: string;
  name: string;
  level: string;
  studentsCount: number;
  schedule: string;
  currentTopic: string;
}

interface DemoAssignment {
  id: string;
  className: string;
  title: string;
  type: string;
  dueDate: string;
  submittedCount: number;
  totalCount: number;
}

interface DemoStudent {
  id: string;
  name: string;
  class: string;
  pitchAccuracy: number;
  talaPrecision: number;
  streak: number;
  status: "Excellent" | "Needs Practice" | "On Track";
}

const INITIAL_CLASSES: DemoClass[] = [
  {
    id: "cls-1",
    name: "Carnatic Vocal Abhyasa Ganam",
    level: "Beginner - Batch A",
    studentsCount: 14,
    schedule: "Mon, Wed • 5:00 PM IST",
    currentTopic: "Mayamalavagowla - Sarali Swaras & Alankaram",
  },
  {
    id: "cls-2",
    name: "Geetham & Swarajathi Masterclass",
    level: "Intermediate - Batch B",
    studentsCount: 9,
    schedule: "Tue, Thu • 6:30 PM IST",
    currentTopic: "Kalyani Raga Geetham (Kamalajadhala)",
  },
  {
    id: "cls-3",
    name: "Varnam & Manodharma Sangeetham",
    level: "Advanced - Senior Batch",
    studentsCount: 6,
    schedule: "Sat, Sun • 10:00 AM IST",
    currentTopic: "Sankarabharanam Adi Tala Varnam (Saami Ninne)",
  },
];

const INITIAL_ASSIGNMENTS: DemoAssignment[] = [
  {
    id: "asg-1",
    className: "Carnatic Vocal Abhyasa Ganam",
    title: "Practice Alankaram 1 to 4 in 3 Speeds (Mayamalavagowla)",
    type: "Pitch & Tala Recording",
    dueDate: "Tomorrow, 8:00 PM",
    submittedCount: 11,
    totalCount: 14,
  },
  {
    id: "asg-2",
    className: "Geetham & Swarajathi Masterclass",
    title: "Nata Raga Geetham - Notation Reading & Vocal Submission",
    type: "Theory & Vocal Practice",
    dueDate: "Sep 5, 2026",
    submittedCount: 6,
    totalCount: 9,
  },
  {
    id: "asg-3",
    className: "Varnam & Manodharma Sangeetham",
    title: "Kalpanaswaram Exploration in Mohana Raga (2 Cycles)",
    type: "Creativity & Pitch Analysis",
    dueDate: "Sep 7, 2026",
    submittedCount: 4,
    totalCount: 6,
  },
];

const INITIAL_STUDENTS: DemoStudent[] = [
  {
    id: "std-1",
    name: "Aditi Ramachandran",
    class: "Carnatic Vocal Abhyasa Ganam",
    pitchAccuracy: 96,
    talaPrecision: 94,
    streak: 12,
    status: "Excellent",
  },
  {
    id: "std-2",
    name: "Karthik Venkatesh",
    class: "Geetham & Swarajathi Masterclass",
    pitchAccuracy: 91,
    talaPrecision: 88,
    streak: 8,
    status: "On Track",
  },
  {
    id: "std-3",
    name: "Sneha Narayanan",
    class: "Varnam & Manodharma Sangeetham",
    pitchAccuracy: 98,
    talaPrecision: 96,
    streak: 21,
    status: "Excellent",
  },
  {
    id: "std-4",
    name: "Rohan Subramanian",
    class: "Carnatic Vocal Abhyasa Ganam",
    pitchAccuracy: 78,
    talaPrecision: 82,
    streak: 3,
    status: "Needs Practice",
  },
];

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<"classes" | "assignments" | "students" | "ai-copilot">("classes");
  const [classes, setClasses] = useState<DemoClass[]>(INITIAL_CLASSES);
  const [assignments, setAssignments] = useState<DemoAssignment[]>(INITIAL_ASSIGNMENTS);
  const [students] = useState<DemoStudent[]>(INITIAL_STUDENTS);

  // New Class Form State
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassLevel, setNewClassLevel] = useState("");
  const [newClassSchedule, setNewClassSchedule] = useState("");

  // New Assignment Form State
  const [showNewAsgModal, setShowNewAsgModal] = useState(false);
  const [newAsgTitle, setNewAsgTitle] = useState("");
  const [newAsgClass, setNewAsgClass] = useState(INITIAL_CLASSES[0].name);
  const [newAsgDueDate, setNewAsgDueDate] = useState("");

  // AI Copilot Generator
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const created: DemoClass = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      level: newClassLevel.trim() || "All Levels",
      studentsCount: 1,
      schedule: newClassSchedule.trim() || "TBD",
      currentTopic: "Introductory Carnatic Foundation",
    };

    setClasses([created, ...classes]);
    setNewClassName("");
    setNewClassLevel("");
    setNewClassSchedule("");
    setShowNewClassModal(false);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim()) return;

    const created: DemoAssignment = {
      id: `asg-${Date.now()}`,
      className: newAsgClass,
      title: newAsgTitle.trim(),
      type: "Vocal & Theory Submission",
      dueDate: newAsgDueDate || "Next Week",
      submittedCount: 0,
      totalCount: 12,
    };

    setAssignments([created, ...assignments]);
    setNewAsgTitle("");
    setNewAsgDueDate("");
    setShowNewAsgModal(false);
  };

  const handleAskCopilot = async () => {
    if (!copilotQuery.trim() || copilotLoading) return;
    setCopilotLoading(true);
    setCopilotResponse(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `You are a Carnatic Music Guru Assistant helping a teacher create a class lesson plan and assignment for: "${copilotQuery}". Give a structured lesson outline, key swarasthanas to practice, and 3 specific homework exercises.`,
        }),
      });

      const json = await res.json();
      if (json?.data?.answer) {
        setCopilotResponse(json.data.answer);
      } else {
        setCopilotResponse("Lesson Plan Generated:\n\n1. Sarali Varisai Speed 1-3 Warmup\n2. Focus on Suddha Madhyama stability\n3. Assign 4-bar Alankaram rhythm exercise.");
      }
    } catch {
      setCopilotResponse("AI Copilot generated a custom 30-minute practice plan focused on Tala accuracy and Swara clarity.");
    } finally {
      setCopilotLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Top Guru Stats Overview ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel traditional-glow rounded-2xl border border-swara-gold/20 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-kumkum/10 text-kumkum">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Enrolled</p>
              <p className="font-serif text-2xl font-bold text-foreground">29 Students</p>
            </div>
          </div>
        </div>

        <div className="glass-panel traditional-glow rounded-2xl border border-swara-gold/20 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-swara-gold/15 text-swara-gold">
              <BookOpen className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Active Batches</p>
              <p className="font-serif text-2xl font-bold text-foreground">{classes.length} Classes</p>
            </div>
          </div>
        </div>

        <div className="glass-panel traditional-glow rounded-2xl border border-swara-gold/20 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Avg Pitch Accuracy</p>
              <p className="font-serif text-2xl font-bold text-emerald-600">92.4%</p>
            </div>
          </div>
        </div>

        <div className="glass-panel traditional-glow rounded-2xl border border-swara-gold/20 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-marigold/15 text-marigold">
              <ClipboardList className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Pending Reviews</p>
              <p className="font-serif text-2xl font-bold text-foreground">8 Exercises</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("classes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "classes"
                ? "bg-kumkum text-white shadow-sm"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <Users className="size-4" />
            Class Batches ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "assignments"
                ? "bg-kumkum text-white shadow-sm"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <FileText className="size-4" />
            Assignments ({assignments.length})
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "students"
                ? "bg-kumkum text-white shadow-sm"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <Award className="size-4" />
            Student Tracker ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("ai-copilot")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "ai-copilot"
                ? "bg-swara-gold text-shanti-slate shadow-sm font-bold"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <Sparkles className="size-4 text-kumkum" />
            AI Guru Co-Teacher
          </button>
        </div>

        {activeTab === "classes" && (
          <Button
            size="sm"
            onClick={() => setShowNewClassModal(true)}
            className="bg-kumkum hover:bg-kumkum-light text-white text-xs gap-1.5"
          >
            <Plus className="size-4" /> Add New Class
          </Button>
        )}

        {activeTab === "assignments" && (
          <Button
            size="sm"
            onClick={() => setShowNewAsgModal(true)}
            className="bg-kumkum hover:bg-kumkum-light text-white text-xs gap-1.5"
          >
            <Plus className="size-4" /> Create Assignment
          </Button>
        )}
      </div>

      {/* ── TAB 1: CLASSES ── */}
      {activeTab === "classes" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[10px]">
                    {cls.level}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <Users className="size-3.5" /> {cls.studentsCount} Students
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-kumkum mb-2">{cls.name}</h3>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-4">
                  <Calendar className="size-3.5 text-swara-gold" />
                  {cls.schedule}
                </p>

                <div className="rounded-xl bg-muted/50 p-3 text-xs space-y-1 mb-6 border border-border/40">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Current Syllabus Topic:
                  </span>
                  <p className="font-medium text-foreground">{cls.currentTopic}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <button className="text-xs text-kumkum font-semibold hover:underline flex items-center gap-1">
                  Manage Class <ChevronRight className="size-3.5" />
                </button>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Active Batch
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 2: ASSIGNMENTS ── */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className="glass-panel rounded-2xl border border-swara-gold/20 bg-card p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-swara-gold/30 text-swara-gold text-[10px]">
                    {asg.className}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">• {asg.type}</span>
                </div>
                <h4 className="font-serif text-base font-bold text-foreground">{asg.title}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3.5 text-kumkum" /> Due: {asg.dueDate}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground">
                    {asg.submittedCount} / {asg.totalCount} Submitted
                  </p>
                  <div className="w-32 bg-muted h-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-kumkum h-full rounded-full"
                      style={{ width: `${(asg.submittedCount / asg.totalCount) * 100}%` }}
                    />
                  </div>
                </div>

                <Button size="sm" variant="outline" className="border-swara-gold/30 text-xs gap-1">
                  Review <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 3: STUDENTS TRACKER ── */}
      {activeTab === "students" && (
        <div className="glass-panel rounded-3xl border border-swara-gold/20 bg-card overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-kumkum">Class Performance Roster</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search student..."
                className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-kumkum/30"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Enrolled Class</th>
                  <th className="px-6 py-3">Pitch Accuracy</th>
                  <th className="px-6 py-3">Tala Precision</th>
                  <th className="px-6 py-3">Practice Streak</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{std.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{std.class}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">{std.pitchAccuracy}%</td>
                    <td className="px-6 py-4 font-semibold text-swara-gold">{std.talaPrecision}%</td>
                    <td className="px-6 py-4 font-medium">{std.streak} Days 🔥</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={
                          std.status === "Excellent"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                            : std.status === "Needs Practice"
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-600"
                            : "border-blue-500/30 bg-blue-500/10 text-blue-600"
                        }
                      >
                        {std.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: AI GURU CO-TEACHER ASSISTANT ── */}
      {activeTab === "ai-copilot" && (
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/30 bg-card p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-swara-gold/20">
              <Sparkles className="size-5 text-kumkum" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-kumkum">AI Guru Co-Teacher Copilot</h3>
              <p className="text-xs text-muted-foreground">
                Generate custom Carnatic lesson plans, swarasthana practice drills, and homework quizzes for your batches.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-foreground">
              What lesson or exercise outline do you need help creating?
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskCopilot()}
                placeholder="e.g. 30-minute practice plan for Kalyani Raga Geetham with 3 Tala exercises"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kumkum/30"
              />
              <Button
                onClick={handleAskCopilot}
                disabled={copilotLoading || !copilotQuery.trim()}
                className="bg-kumkum hover:bg-kumkum-light text-white shrink-0 gap-1.5"
              >
                {copilotLoading ? (
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                Generate Plan
              </Button>
            </div>
          </div>

          {copilotResponse && (
            <div className="rounded-2xl border border-swara-gold/30 bg-kumkum/5 p-5 space-y-3 animate-in fade-in duration-300">
              <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[10px]">
                Generated Lesson Plan
              </Badge>
              <pre className="whitespace-pre-wrap font-sans text-xs text-foreground leading-relaxed">
                {copilotResponse}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ── CREATE CLASS MODAL ── */}
      {showNewClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-swara-gold/30 bg-card p-6 shadow-xl space-y-5">
            <h3 className="font-serif text-xl font-bold text-kumkum">Add New Carnatic Class</h3>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Class Title</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Varnam Masterclass - Batch C"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Level / Category</label>
                <input
                  type="text"
                  value={newClassLevel}
                  onChange={(e) => setNewClassLevel(e.target.value)}
                  placeholder="e.g. Intermediate - Batch C"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Schedule Timing</label>
                <input
                  type="text"
                  value={newClassSchedule}
                  onChange={(e) => setNewClassSchedule(e.target.value)}
                  placeholder="e.g. Sat & Sun • 11:00 AM IST"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewClassModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-kumkum hover:bg-kumkum-light text-white">
                  Create Class
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE ASSIGNMENT MODAL ── */}
      {showNewAsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-swara-gold/30 bg-card p-6 shadow-xl space-y-5">
            <h3 className="font-serif text-xl font-bold text-kumkum">Create Practice Assignment</h3>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Batch</label>
                <select
                  value={newAsgClass}
                  onChange={(e) => setNewAsgClass(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newAsgTitle}
                  onChange={(e) => setNewAsgTitle(e.target.value)}
                  placeholder="e.g. Shankarabharanam Geetham Speed 1 & 2"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Due Date</label>
                <input
                  type="text"
                  value={newAsgDueDate}
                  onChange={(e) => setNewAsgDueDate(e.target.value)}
                  placeholder="e.g. Next Monday, 6:00 PM"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewAsgModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-kumkum hover:bg-kumkum-light text-white">
                  Assign to Students
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
