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
  Trash2,
  Globe,
  Share2,
  Check,
  Video,
  Copy,
  ExternalLink,
  Radio,
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
  meetUrl: string;
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
    meetUrl: "https://meet.google.com/naada-vocal-batch1",
  },
  {
    id: "cls-2",
    name: "Geetham & Swarajathi Masterclass",
    level: "Intermediate - Batch B",
    studentsCount: 9,
    schedule: "Tue, Thu • 6:30 PM IST",
    currentTopic: "Kalyani Raga Geetham (Kamalajadhala)",
    meetUrl: "https://meet.google.com/naada-geetham-batch2",
  },
  {
    id: "cls-3",
    name: "Varnam & Manodharma Sangeetham",
    level: "Advanced - Senior Batch",
    studentsCount: 6,
    schedule: "Sat, Sun • 10:00 AM IST",
    currentTopic: "Sankarabharanam Adi Tala Varnam (Saami Ninne)",
    meetUrl: "https://meet.google.com/naada-varnam-senior",
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
  const [activeTab, setActiveTab] = useState<"classes" | "google-meet" | "assignments" | "students" | "ai-copilot">("classes");
  const [classes, setClasses] = useState<DemoClass[]>(INITIAL_CLASSES);
  const [assignments, setAssignments] = useState<DemoAssignment[]>(INITIAL_ASSIGNMENTS);
  const [students] = useState<DemoStudent[]>(INITIAL_STUDENTS);

  // Student Filter State
  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState<string>("All");

  // New Class Form State
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassLevel, setNewClassLevel] = useState("");
  const [newClassSchedule, setNewClassSchedule] = useState("");
  const [newClassMeetUrl, setNewClassMeetUrl] = useState("");

  // Copy Feedback State
  const [copiedClassId, setCopiedClassId] = useState<string | null>(null);

  // New Assignment Form State
  const [showNewAsgModal, setShowNewAsgModal] = useState(false);
  const [newAsgTitle, setNewAsgTitle] = useState("");
  const [newAsgClass, setNewAsgClass] = useState(INITIAL_CLASSES[0]?.name || "");
  const [newAsgDueDate, setNewAsgDueDate] = useState("");

  // AI Copilot Generator State
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotLanguage, setCopilotLanguage] = useState<"en" | "te" | "kn" | "ta" | "hi">("en");
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [assignmentAssigned, setAssignmentAssigned] = useState(false);

  // Dynamic Calculated Stats
  const totalEnrolled = classes.reduce((sum, c) => sum + c.studentsCount, 0);
  const avgPitch = Math.round(
    students.reduce((acc, s) => acc + s.pitchAccuracy, 0) / (students.length || 1)
  );

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
      meetUrl: newClassMeetUrl.trim() || `https://meet.google.com/naada-${Date.now().toString().slice(-6)}`,
    };

    setClasses([created, ...classes]);
    setNewClassName("");
    setNewClassLevel("");
    setNewClassSchedule("");
    setNewClassMeetUrl("");
    setShowNewClassModal(false);
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  const handleCopyMeetLink = (cls: DemoClass) => {
    const inviteText = `🎶 Naadabrahma AI Carnatic Online Class\nBatch: ${cls.name}\nTopic: ${cls.currentTopic}\nGoogle Meet Link: ${cls.meetUrl}`;
    navigator.clipboard.writeText(inviteText);
    setCopiedClassId(cls.id);
    setTimeout(() => setCopiedClassId(null), 2500);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim()) return;

    const created: DemoAssignment = {
      id: `asg-${Date.now()}`,
      className: newAsgClass || classes[0]?.name || "General Batch",
      title: newAsgTitle.trim(),
      type: "Vocal & Theory Practice",
      dueDate: newAsgDueDate || "Next Week",
      submittedCount: 0,
      totalCount: 12,
    };

    setAssignments([created, ...assignments]);
    setNewAsgTitle("");
    setNewAsgDueDate("");
    setShowNewAsgModal(false);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  const handleAskCopilot = async (customPrompt?: string) => {
    const queryToUse = customPrompt || copilotQuery;
    if (!queryToUse.trim() || copilotLoading) return;
    setCopilotLoading(true);
    setCopilotResponse(null);
    setAssignmentAssigned(false);

    const langInstruction =
      copilotLanguage === "te"
        ? "Respond in simple Telugu."
        : copilotLanguage === "kn"
        ? "Respond in Kannada."
        : copilotLanguage === "ta"
        ? "Respond in Tamil."
        : copilotLanguage === "hi"
        ? "Respond in Hindi."
        : "Respond in English.";

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `You are a Carnatic Music Guru Assistant helping a teacher create a full, detailed lesson plan and homework assignment for: "${queryToUse}". Provide: 1. Overview & Concept Breakdown 2. Swarasthana & Tala Exercise Steps 3. Practice Homework Tasks for Students. ${langInstruction}`,
          language: copilotLanguage === "te" ? "te" : "en",
        }),
      });

      const json = await res.json();
      if (json?.data?.answer) {
        setCopilotResponse(json.data.answer);
      } else {
        setCopilotResponse(
          `Detailed Plan for: "${queryToUse}"\n\n1. Concept Overview: Adi Tala (8 Aksharas = 1 Laghu of 4 beats + 2 Dhrutams of 2 beats).\n2. Class Practice Drills:\n  - Sarali Varisai in 3 Speeds with hand gestures (Talam).\n  - Pitch alignment on S-R-G-M-P-D-N-S.\n3. Homework Assignment:\n  - Record 2 cycles of Adi Tala Alankaram.\n  - Submit vocal sample to Teacher Portal.`
        );
      }
    } catch {
      setCopilotResponse(
        `Custom Lesson Plan for: "${queryToUse}"\n\n- Part A: Warm-up on Suddha Swaras (10 mins)\n- Part B: Core Tala Execution & Akshara count (15 mins)\n- Part C: Student Performance Evaluation & Feedback (5 mins)`
      );
    } finally {
      setCopilotLoading(false);
    }
  };

  const handlePublishCopilotAsAssignment = () => {
    if (!copilotResponse) return;
    const titleSnippet = copilotQuery.trim()
      ? `AI Assignment: ${copilotQuery.trim()}`
      : "AI Lesson Practice Drill";

    const created: DemoAssignment = {
      id: `asg-${Date.now()}`,
      className: classes[0]?.name || "Carnatic Vocal Batch",
      title: titleSnippet,
      type: "AI Co-Teacher Homework",
      dueDate: "3 Days from Today",
      submittedCount: 0,
      totalCount: classes[0]?.studentsCount || 10,
    };

    setAssignments([created, ...assignments]);
    setAssignmentAssigned(true);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.class.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesStatus =
      studentStatusFilter === "All" || s.status === studentStatusFilter;
    return matchesSearch && matchesStatus;
  });

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
              <p className="font-serif text-2xl font-bold text-foreground">{totalEnrolled} Students</p>
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
              <p className="font-serif text-2xl font-bold text-emerald-600">{avgPitch}%</p>
            </div>
          </div>
        </div>

        <div className="glass-panel traditional-glow rounded-2xl border border-swara-gold/20 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Video className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Online Classes</p>
              <p className="font-serif text-2xl font-bold text-blue-600">Google Meet</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex flex-wrap items-center justify-between border-b border-border pb-3 gap-3">
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
            onClick={() => setActiveTab("google-meet")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "google-meet"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-card text-blue-600 hover:bg-blue-50 border border-blue-200"
            }`}
          >
            <Video className="size-4" />
            Google Meet Online Classes 🎥
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
          {classes.length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-card rounded-3xl border border-dashed border-border p-8">
              <p className="text-sm text-muted-foreground mb-3">No active classes yet.</p>
              <Button
                onClick={() => setShowNewClassModal(true)}
                className="bg-kumkum text-white text-xs"
              >
                Create First Batch
              </Button>
            </div>
          ) : (
            classes.map((cls) => (
              <div
                key={cls.id}
                className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[10px]">
                      {cls.level}
                    </Badge>
                    <button
                      onClick={() => handleDeleteClass(cls.id)}
                      className="text-muted-foreground hover:text-red-600 transition-colors p-1"
                      title="Delete Class"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-kumkum mb-2">{cls.name}</h3>

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3">
                    <Calendar className="size-3.5 text-swara-gold" />
                    {cls.schedule}
                  </p>

                  <div className="rounded-xl bg-muted/50 p-3 text-xs space-y-1 mb-4 border border-border/40">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Current Syllabus Topic:
                    </span>
                    <p className="font-medium text-foreground">{cls.currentTopic}</p>
                  </div>

                  {/* Google Meet Quick Launch Action */}
                  <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 space-y-2 mb-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                        <Video className="size-3.5" /> Google Meet Class Room
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <Radio className="size-3 animate-pulse" /> Live
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={cls.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-lg transition-all shadow-xs"
                      >
                        <Video className="size-3.5" /> Start Meet <ExternalLink className="size-3" />
                      </a>
                      <button
                        onClick={() => handleCopyMeetLink(cls)}
                        className="p-1.5 bg-card hover:bg-muted border border-border text-foreground rounded-lg transition-colors text-xs font-medium"
                        title="Copy Meet Link"
                      >
                        {copiedClassId === cls.id ? (
                          <Check className="size-4 text-emerald-600" />
                        ) : (
                          <Copy className="size-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <Users className="size-3.5 text-kumkum" /> {cls.studentsCount} Enrolled
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Active Batch
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TAB 2: GOOGLE MEET LIVE CLASSES CENTER ── */}
      {activeTab === "google-meet" && (
        <div className="space-y-6">
          <div className="glass-panel traditional-glow rounded-3xl border border-blue-500/30 bg-card p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                  <Video className="size-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Google Meet Online Class Command Center
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Host instant live video classes, manage batch meeting links, and invite students to live sessions.
                  </p>
                </div>
              </div>

              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl transition-all shadow-md shrink-0"
              >
                <Video className="size-4" /> 🚀 Instant Google Meet Class <ExternalLink className="size-3.5" />
              </a>
            </div>

            {/* Class Batches Meet Links List */}
            <div className="space-y-4">
              <h4 className="font-serif text-base font-bold text-kumkum">Batch Google Meet Meeting Rooms</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="rounded-2xl border border-blue-500/20 bg-muted/30 p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="border-blue-500/30 text-blue-600 text-[10px]">
                          {cls.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-semibold">{cls.schedule}</span>
                      </div>
                      <h5 className="font-bold text-base text-foreground mb-1">{cls.name}</h5>
                      <p className="text-xs text-muted-foreground">Topic: {cls.currentTopic}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={cls.meetUrl}
                          className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono"
                        />
                        <button
                          onClick={() => handleCopyMeetLink(cls)}
                          className="px-3 py-1.5 bg-card hover:bg-muted border border-border text-xs font-bold text-foreground rounded-xl transition-all flex items-center gap-1"
                        >
                          {copiedClassId === cls.id ? (
                            <>
                              <Check className="size-3.5 text-emerald-600" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="size-3.5" /> Copy Invite
                            </>
                          )}
                        </button>
                      </div>

                      <a
                        href={cls.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition-all shadow-xs"
                      >
                        <Video className="size-4" /> Connect & Start Google Meet Class →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: ASSIGNMENTS ── */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          {assignments.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-3xl border border-dashed border-border p-8">
              <p className="text-sm text-muted-foreground mb-3">No assignments created yet.</p>
              <Button
                onClick={() => setShowNewAsgModal(true)}
                className="bg-kumkum text-white text-xs"
              >
                Create Assignment
              </Button>
            </div>
          ) : (
            assignments.map((asg) => (
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
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((asg.submittedCount / (asg.totalCount || 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAssignment(asg.id)}
                    className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                    title="Delete Assignment"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TAB 4: STUDENTS TRACKER ── */}
      {activeTab === "students" && (
        <div className="glass-panel rounded-3xl border border-swara-gold/20 bg-card overflow-hidden shadow-sm space-y-4">
          <div className="px-6 py-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-base font-bold text-kumkum">Class Performance Roster</h3>
              <p className="text-xs text-muted-foreground">Track student pitch accuracy, tala precision, and streaks.</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={studentStatusFilter}
                onChange={(e) => setStudentStatusFilter(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Excellent">Excellent</option>
                <option value="On Track">On Track</option>
                <option value="Needs Practice">Needs Practice</option>
              </select>

              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search student..."
                  className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-kumkum/30"
                />
              </div>
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
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No matching students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 5: DYNAMIC AI GURU CO-TEACHER ASSISTANT ── */}
      {activeTab === "ai-copilot" && (
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/30 bg-card p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-swara-gold/20">
                <Sparkles className="size-5 text-kumkum" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-kumkum">AI Guru Co-Teacher Copilot</h3>
                <p className="text-xs text-muted-foreground">
                  Generate Carnatic lesson plans, tala exercises, and homework drills in any language.
                </p>
              </div>
            </div>

            {/* Multilingual Selector */}
            <div className="flex items-center gap-2">
              <Globe className="size-3.5 text-muted-foreground" />
              <select
                value={copilotLanguage}
                onChange={(e) => setCopilotLanguage(e.target.value as any)}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold"
              >
                <option value="en">English</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="hi">Hindi (हिंदी)</option>
              </select>
            </div>
          </div>

          {/* Quick Preset Prompt Shortcuts */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground">Quick Lesson Generators:</span>
            <div className="flex flex-wrap gap-2">
              {[
                "For Aadi Taalam give complete information & practice drills",
                "Mayamalavagowla 14 Sarali Swaras & Alankaram 3 speeds",
                "Kalyani Raga Kamalajadhala Geetham notation breakdown",
                "35 Suladi Sapta Tala Laghu-Dhrutam matrix guide",
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCopilotQuery(preset);
                    handleAskCopilot(preset);
                  }}
                  className="rounded-xl border border-swara-gold/30 bg-swara-gold/5 px-3 py-1.5 text-xs text-foreground hover:bg-swara-gold/15 transition-all text-left"
                >
                  💡 {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-foreground">
              Ask AI Guru for lesson plan or musical explanation:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskCopilot()}
                placeholder="e.g. For Aadi Taalam give complete information"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kumkum/30"
              />
              <Button
                onClick={() => handleAskCopilot()}
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
            <div className="rounded-2xl border border-swara-gold/30 bg-kumkum/5 p-5 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[10px]">
                  Generated Lesson Plan & Explanation
                </Badge>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePublishCopilotAsAssignment}
                  disabled={assignmentAssigned}
                  className="border-kumkum/30 text-kumkum hover:bg-kumkum hover:text-white text-xs gap-1.5"
                >
                  {assignmentAssigned ? (
                    <>
                      <Check className="size-3.5 text-emerald-600" /> Published to Class
                    </>
                  ) : (
                    <>
                      <Share2 className="size-3.5" /> Assign to Class Batches
                    </>
                  )}
                </Button>
              </div>

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

              <div>
                <label className="block font-semibold mb-1">Google Meet Room URL (Optional)</label>
                <input
                  type="url"
                  value={newClassMeetUrl}
                  onChange={(e) => setNewClassMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowNewClassModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-kumkum text-white font-bold">
                  Create Batch
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
            <h3 className="font-serif text-xl font-bold text-kumkum">Create Class Assignment</h3>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Batch</label>
                <select
                  value={newAsgClass}
                  onChange={(e) => setNewAsgClass(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.level})
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
                  placeholder="e.g. Geetham Vocal Recording in Kalyani"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Due Date</label>
                <input
                  type="text"
                  value={newAsgDueDate}
                  onChange={(e) => setNewAsgDueDate(e.target.value)}
                  placeholder="e.g. Next Monday, 8:00 PM"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowNewAsgModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-kumkum text-white font-bold">
                  Publish Assignment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
