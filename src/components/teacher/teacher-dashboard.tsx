"use client";

import { useState, useEffect } from "react";
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
  UserCheck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface TeacherProfile {
  id: string;
  name: string;
  subject: string;
  email: string;
}

export interface DemoClass {
  id: string;
  teacherId: string;
  teacherName: string;
  name: string;
  level: string;
  studentsCount: number;
  schedule: string;
  currentTopic: string;
  meetUrl: string;
}

export interface DemoAssignment {
  id: string;
  teacherId: string;
  className: string;
  title: string;
  type: string;
  dueDate: string;
  submittedCount: number;
  totalCount: number;
}

export interface DemoStudent {
  id: string;
  teacherId: string;
  name: string;
  class: string;
  pitchAccuracy: number;
  talaPrecision: number;
  streak: number;
  status: "Excellent" | "Needs Practice" | "On Track";
}

const TEACHER_PROFILES: TeacherProfile[] = [
  { id: "tch-1", name: "Guru Sangeetha", subject: "Carnatic Vocal & Theory", email: "sangeetha@naadabrahma.ai" },
  { id: "tch-2", name: "Guru Vishwanathan", subject: "Veena & Instrumental Gamaka", email: "vishwanathan@naadabrahma.ai" },
  { id: "tch-3", name: "Guru Ramanathan", subject: "Mridangam & Solkattu Rhythm", email: "ramanathan@naadabrahma.ai" },
];

const INITIAL_CLASSES: DemoClass[] = [
  // Guru Sangeetha (Vocal)
  {
    id: "cls-1",
    teacherId: "tch-1",
    teacherName: "Guru Sangeetha",
    name: "Carnatic Vocal Abhyasa Ganam",
    level: "Beginner - Batch A",
    studentsCount: 14,
    schedule: "Mon, Wed • 5:00 PM IST",
    currentTopic: "Mayamalavagowla - Sarali Swaras & Alankaram",
    meetUrl: "https://meet.google.com/new",
  },
  {
    id: "cls-2",
    teacherId: "tch-1",
    teacherName: "Guru Sangeetha",
    name: "Geetham & Swarajathi Masterclass",
    level: "Intermediate - Batch B",
    studentsCount: 9,
    schedule: "Tue, Thu • 6:30 PM IST",
    currentTopic: "Kalyani Raga Geetham (Kamalajadhala)",
    meetUrl: "https://meet.google.com/new",
  },
  // Guru Vishwanathan (Veena)
  {
    id: "cls-3",
    teacherId: "tch-2",
    teacherName: "Guru Vishwanathan",
    name: "Veena Foundation & Swarasthana Alignment",
    level: "Batch V1",
    studentsCount: 8,
    schedule: "Fri, Sun • 4:00 PM IST",
    currentTopic: "Veena Fret Positioning & Suddha Swara Strumming",
    meetUrl: "https://meet.google.com/new",
  },
  {
    id: "cls-4",
    teacherId: "tch-2",
    teacherName: "Guru Vishwanathan",
    name: "Advanced Veena Gamakam & Keerthanam",
    level: "Senior Batch V2",
    studentsCount: 5,
    schedule: "Sat, Sun • 11:00 AM IST",
    currentTopic: "Kampita & Nokku Gamaka in Hamsadhwani",
    meetUrl: "https://meet.google.com/new",
  },
  // Guru Ramanathan (Mridangam)
  {
    id: "cls-5",
    teacherId: "tch-3",
    teacherName: "Guru Ramanathan",
    name: "Mridangam Tha-Dhi-Gi-Na-Thom Lessons",
    level: "Batch M1",
    studentsCount: 7,
    schedule: "Tue, Fri • 7:00 PM IST",
    currentTopic: "Basic Stroke Execution & Chatusra Jathi Beats",
    meetUrl: "https://meet.google.com/new",
  },
];

const INITIAL_ASSIGNMENTS: DemoAssignment[] = [
  {
    id: "asg-1",
    teacherId: "tch-1",
    className: "Carnatic Vocal Abhyasa Ganam",
    title: "Practice Alankaram 1 to 4 in 3 Speeds (Mayamalavagowla)",
    type: "Pitch & Tala Recording",
    dueDate: "Tomorrow, 8:00 PM",
    submittedCount: 11,
    totalCount: 14,
  },
  {
    id: "asg-2",
    teacherId: "tch-1",
    className: "Geetham & Swarajathi Masterclass",
    title: "Nata Raga Geetham - Notation Reading & Vocal Submission",
    type: "Theory & Vocal Practice",
    dueDate: "Sep 5, 2026",
    submittedCount: 6,
    totalCount: 9,
  },
  {
    id: "asg-3",
    teacherId: "tch-2",
    className: "Veena Foundation & Swarasthana Alignment",
    title: "Veena Strumming & Swara Resonance Submission",
    type: "Instrumental Recording",
    dueDate: "Sep 6, 2026",
    submittedCount: 7,
    totalCount: 8,
  },
  {
    id: "asg-4",
    teacherId: "tch-3",
    className: "Mridangam Tha-Dhi-Gi-Na-Thom Lessons",
    title: "Adi Tala Solkattu Recitation & Left Head Stroke Audio",
    type: "Rhythm Practice",
    dueDate: "Sep 8, 2026",
    submittedCount: 5,
    totalCount: 7,
  },
];

const INITIAL_STUDENTS: DemoStudent[] = [
  // Guru Sangeetha Students
  {
    id: "std-1",
    teacherId: "tch-1",
    name: "Aditi Ramachandran",
    class: "Carnatic Vocal Abhyasa Ganam",
    pitchAccuracy: 96,
    talaPrecision: 94,
    streak: 12,
    status: "Excellent",
  },
  {
    id: "std-2",
    teacherId: "tch-1",
    name: "Karthik Venkatesh",
    class: "Geetham & Swarajathi Masterclass",
    pitchAccuracy: 91,
    talaPrecision: 88,
    streak: 8,
    status: "On Track",
  },
  {
    id: "std-3",
    teacherId: "tch-1",
    name: "Rohan Subramanian",
    class: "Carnatic Vocal Abhyasa Ganam",
    pitchAccuracy: 78,
    talaPrecision: 82,
    streak: 3,
    status: "Needs Practice",
  },
  // Guru Vishwanathan Students
  {
    id: "std-4",
    teacherId: "tch-2",
    name: "Sneha Narayanan",
    class: "Veena Foundation & Swarasthana Alignment",
    pitchAccuracy: 98,
    talaPrecision: 96,
    streak: 21,
    status: "Excellent",
  },
  {
    id: "std-5",
    teacherId: "tch-2",
    name: "Ananya Iyer",
    class: "Advanced Veena Gamakam & Keerthanam",
    pitchAccuracy: 93,
    talaPrecision: 90,
    streak: 15,
    status: "Excellent",
  },
  // Guru Ramanathan Students
  {
    id: "std-6",
    teacherId: "tch-3",
    name: "Siddharth Rao",
    class: "Mridangam Tha-Dhi-Gi-Na-Thom Lessons",
    pitchAccuracy: 89,
    talaPrecision: 97,
    streak: 10,
    status: "On Track",
  },
];

export function TeacherDashboard() {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("tch-1");
  const [activeTab, setActiveTab] = useState<"classes" | "google-meet" | "assignments" | "students" | "ai-copilot">("classes");

  const [classes, setClasses] = useState<DemoClass[]>(INITIAL_CLASSES);
  const [assignments, setAssignments] = useState<DemoAssignment[]>(INITIAL_ASSIGNMENTS);
  const [students, setStudents] = useState<DemoStudent[]>(INITIAL_STUDENTS);

  // Published Live Links State
  const [publishedFeedbackClassId, setPublishedFeedbackClassId] = useState<string | null>(null);

  // Load newly enrolled students registered from login form dynamically!
  useEffect(() => {
    try {
      const stored = localStorage.getItem("naada_enrolled_students");
      if (stored) {
        const parsed: DemoStudent[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudents((prev) => {
            const existingIds = new Set(prev.map((s) => s.id));
            const newOnly = parsed.filter((s) => !existingIds.has(s.id));
            return [...newOnly, ...prev];
          });
        }
      }

      // Load published Meet links from storage
      const storedMeets = localStorage.getItem("naada_published_meets");
      if (storedMeets) {
        const parsedMeets: Record<string, string> = JSON.parse(storedMeets);
        setClasses((prev) =>
          prev.map((cls) => (parsedMeets[cls.id] ? { ...cls, meetUrl: parsedMeets[cls.id] } : cls))
        );
      }
    } catch (e) {
      console.warn("Failed loading enrolled students:", e);
    }
  }, []);

  // Active Selected Teacher
  const currentTeacher = TEACHER_PROFILES.find((t) => t.id === selectedTeacherId) || TEACHER_PROFILES[0];

  // Isolated Allocated Data for Current Teacher ONLY
  const teacherClasses = classes.filter((c) => c.teacherId === selectedTeacherId);
  const teacherAssignments = assignments.filter((a) => a.teacherId === selectedTeacherId);
  const teacherStudents = students.filter((s) => s.teacherId === selectedTeacherId);

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
  const [newAsgClass, setNewAsgClass] = useState("");
  const [newAsgDueDate, setNewAsgDueDate] = useState("");

  // AI Copilot Generator State
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotLanguage, setCopilotLanguage] = useState<"en" | "te" | "kn" | "ta" | "hi">("en");
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [assignmentAssigned, setAssignmentAssigned] = useState(false);

  // Dynamic Calculated Stats for Current Teacher ONLY
  const totalEnrolled = teacherClasses.reduce((sum, c) => sum + c.studentsCount, 0) + teacherStudents.length;
  const avgPitch = Math.round(
    teacherStudents.reduce((acc, s) => acc + s.pitchAccuracy, 0) / (teacherStudents.length || 1)
  );

  const handlePublishMeetLinkToStudents = (clsId: string, meetUrlToPublish: string) => {
    try {
      const storedMeetsStr = localStorage.getItem("naada_published_meets") || "{}";
      const meetMap = JSON.parse(storedMeetsStr);
      meetMap[clsId] = meetUrlToPublish;
      
      // Also map teacher subject to link
      if (currentTeacher.subject.includes("Veena")) {
        meetMap["Veena"] = meetUrlToPublish;
      } else if (currentTeacher.subject.includes("Vocal")) {
        meetMap["Carnatic Vocal"] = meetUrlToPublish;
      } else if (currentTeacher.subject.includes("Mridangam")) {
        meetMap["Mridangam"] = meetUrlToPublish;
      }

      localStorage.setItem("naada_published_meets", JSON.stringify(meetMap));
      document.cookie = `naada_published_meet_${currentTeacher.id}=${encodeURIComponent(meetUrlToPublish)}; path=/; max-age=86400; SameSite=Lax`;

      setPublishedFeedbackClassId(clsId);
      setTimeout(() => setPublishedFeedbackClassId(null), 3000);
    } catch (e) {
      console.warn("Storage update error:", e);
    }
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const created: DemoClass = {
      id: `cls-${Date.now()}`,
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name,
      name: newClassName.trim(),
      level: newClassLevel.trim() || "All Levels",
      studentsCount: 1,
      schedule: newClassSchedule.trim() || "TBD",
      currentTopic: "Introductory Carnatic Foundation",
      meetUrl: newClassMeetUrl.trim() || "https://meet.google.com/new",
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
    const inviteText = `🎶 Naadabrahma AI Carnatic Online Class\nTeacher: ${currentTeacher.name}\nBatch: ${cls.name}\nTopic: ${cls.currentTopic}\nOfficial Google Meet Link: ${cls.meetUrl}\n(Access restricted to enrolled students in this batch)`;
    navigator.clipboard.writeText(inviteText);
    setCopiedClassId(cls.id);
    setTimeout(() => setCopiedClassId(null), 2500);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim()) return;

    const created: DemoAssignment = {
      id: `asg-${Date.now()}`,
      teacherId: currentTeacher.id,
      className: newAsgClass || teacherClasses[0]?.name || "General Batch",
      title: newAsgTitle.trim(),
      type: "Vocal & Practice Submission",
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
          message: `You are a Carnatic Music Guru Assistant helping ${currentTeacher.name} create a lesson plan and homework assignment for: "${queryToUse}". Provide: 1. Overview & Concept Breakdown 2. Swarasthana & Tala Exercise Steps 3. Practice Homework Tasks for Allocated Students. ${langInstruction}`,
          language: copilotLanguage === "te" ? "te" : "en",
        }),
      });

      const json = await res.json();
      if (json?.data?.answer) {
        setCopilotResponse(json.data.answer);
      } else {
        setCopilotResponse(
          `Detailed Plan for ${currentTeacher.name}: "${queryToUse}"\n\n1. Concept Overview: Adi Tala (8 Aksharas = 1 Laghu of 4 beats + 2 Dhrutams of 2 beats).\n2. Class Practice Drills:\n  - Sarali Varisai in 3 Speeds with hand gestures (Talam).\n  - Pitch alignment on S-R-G-M-P-D-N-S.\n3. Homework Assignment:\n  - Record 2 cycles of Adi Tala Alankaram.\n  - Submit vocal sample to ${currentTeacher.name}.`
        );
      }
    } catch {
      setCopilotResponse(
        `Custom Lesson Plan for ${currentTeacher.name}: "${queryToUse}"\n\n- Part A: Warm-up on Suddha Swaras (10 mins)\n- Part B: Core Tala Execution & Akshara count (15 mins)\n- Part C: Student Performance Evaluation & Feedback (5 mins)`
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
      teacherId: currentTeacher.id,
      className: teacherClasses[0]?.name || "Carnatic Batch",
      title: titleSnippet,
      type: "AI Co-Teacher Homework",
      dueDate: "3 Days from Today",
      submittedCount: 0,
      totalCount: teacherClasses[0]?.studentsCount || 10,
    };

    setAssignments([created, ...assignments]);
    setAssignmentAssigned(true);
  };

  const filteredStudents = teacherStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.class.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesStatus =
      studentStatusFilter === "All" || s.status === studentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* ── Teacher Profile Allocation Switcher ── */}
      <div className="rounded-3xl border border-swara-gold/30 bg-card p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="size-5 text-kumkum" />
            <div>
              <span className="text-xs font-bold text-kumkum uppercase tracking-wider block">
                Active Guru Portal Account:
              </span>
              <h3 className="font-serif text-lg font-bold text-foreground">
                {currentTeacher.name} ({currentTeacher.subject})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Switch Active Teacher:</span>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="rounded-xl border border-swara-gold/40 bg-background px-3.5 py-1.5 text-xs font-bold text-kumkum focus:outline-none focus:ring-2 focus:ring-kumkum/30 cursor-pointer shadow-xs"
            >
              {TEACHER_PROFILES.map((t) => (
                <option key={t.id} value={t.id}>
                  👑 {t.name} — {t.subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
            <Lock className="mr-1 size-3" /> Isolated Data Allocation Active
          </Badge>
          <span>
            Viewing <strong>{teacherClasses.length} Batches</strong> and <strong>{teacherStudents.length} Allocated Students</strong> assigned exclusively to {currentTeacher.name}.
          </span>
        </div>
      </div>

      {/* ── Top Guru Stats Overview for Selected Teacher ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel traditional-glow rounded-2xl border border-swara-gold/20 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-kumkum/10 text-kumkum">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Allocated Students</p>
              <p className="font-serif text-2xl font-bold text-foreground">{teacherStudents.length} Enrolled</p>
            </div>
          </div>
        </div>

        <div className="glass-panel traditional-glow rounded-2xl border border-swara-gold/20 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-swara-gold/15 text-swara-gold">
              <BookOpen className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">My Batches</p>
              <p className="font-serif text-2xl font-bold text-foreground">{teacherClasses.length} Classes</p>
            </div>
          </div>
        </div>

        <div className="glass-panel traditional-glow rounded-2xl border border-swara-gold/20 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Avg Pitch Score</p>
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
              <p className="text-xs text-muted-foreground font-medium">Google Meet Access</p>
              <p className="font-serif text-2xl font-bold text-blue-600">Live Publisher</p>
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
            Allocated Batches ({teacherClasses.length})
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
            Publish Official Google Meet Links 🎥
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
            Batch Assignments ({teacherAssignments.length})
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
            Allocated Student Tracker ({teacherStudents.length})
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
            className="bg-kumkum hover:bg-kumkum-light text-white text-xs gap-1.5 font-bold"
          >
            <Plus className="size-4" /> Add Batch for {currentTeacher.name}
          </Button>
        )}

        {activeTab === "assignments" && (
          <Button
            size="sm"
            onClick={() => setShowNewAsgModal(true)}
            className="bg-kumkum hover:bg-kumkum-light text-white text-xs gap-1.5 font-bold"
          >
            <Plus className="size-4" /> Create Assignment
          </Button>
        )}
      </div>

      {/* ── TAB 1: ALLOCATED CLASSES ── */}
      {activeTab === "classes" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teacherClasses.length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-card rounded-3xl border border-dashed border-border p-8">
              <p className="text-sm text-muted-foreground mb-3">No allocated batches for {currentTeacher.name} yet.</p>
              <Button
                onClick={() => setShowNewClassModal(true)}
                className="bg-kumkum text-white text-xs font-bold"
              >
                Create Batch
              </Button>
            </div>
          ) : (
            teacherClasses.map((cls) => (
              <div
                key={cls.id}
                className="glass-panel traditional-glow rounded-3xl border border-swara-gold/25 bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[10px] font-bold">
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

                  <h3 className="font-serif text-lg font-bold text-kumkum mb-1">{cls.name}</h3>
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                    Teacher: {cls.teacherName}
                  </p>

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
                        <Video className="size-3.5" /> Official Google Meet Room
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <Radio className="size-3 animate-pulse" /> Live Broadcast
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
                        title="Copy Meet Link for Enrolled Students"
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
                    <Users className="size-3.5 text-kumkum" /> {cls.studentsCount} Enrolled Students
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Allocated
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
                    Official Google Meet Link Publisher — {currentTeacher.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Paste your official scheduled Google Meet link below. Once published, your enrolled students will instantly receive your exact live meeting URL!
                  </p>
                </div>
              </div>

              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl transition-all shadow-md shrink-0"
              >
                <Video className="size-4" /> 🚀 Create New Google Meet <ExternalLink className="size-3.5" />
              </a>
            </div>

            {/* Class Batches Meet Links List */}
            <div className="space-y-4">
              <h4 className="font-serif text-base font-bold text-kumkum">
                {currentTeacher.name}&apos;s Official Batch Meeting Links
              </h4>

              {teacherClasses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No allocated batches for this teacher.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teacherClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="rounded-2xl border border-blue-500/20 bg-muted/30 p-4 space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="border-blue-500/30 text-blue-600 text-[10px] font-bold">
                            {cls.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-semibold">{cls.schedule}</span>
                        </div>
                        <h5 className="font-bold text-base text-foreground mb-1">{cls.name}</h5>
                        <p className="text-xs text-muted-foreground">Topic: {cls.currentTopic}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-border/50">
                        <label className="block text-[11px] font-semibold text-muted-foreground">
                          Paste & Publish Official Google Meet Link for Students:
                        </label>

                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={cls.meetUrl}
                            onChange={(e) => {
                              const updatedUrl = e.target.value;
                              setClasses(classes.map((c) => (c.id === cls.id ? { ...c, meetUrl: updatedUrl } : c)));
                            }}
                            placeholder="https://meet.google.com/abc-defg-hij"
                            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono"
                          />
                          <button
                            onClick={() => handlePublishMeetLinkToStudents(cls.id, cls.meetUrl)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-xs font-extrabold text-white rounded-xl transition-all flex items-center gap-1 shadow-xs shrink-0"
                          >
                            {publishedFeedbackClassId === cls.id ? (
                              <>
                                <Check className="size-3.5" /> Published!
                              </>
                            ) : (
                              <>
                                <Radio className="size-3.5 animate-pulse" /> Publish to Students
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
                          <Video className="size-4" /> Launch & Join Live Meet Class →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: ASSIGNMENTS ── */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          {teacherAssignments.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-3xl border border-dashed border-border p-8">
              <p className="text-sm text-muted-foreground mb-3">No assignments created by {currentTeacher.name} yet.</p>
              <Button
                onClick={() => setShowNewAsgModal(true)}
                className="bg-kumkum text-white text-xs font-bold"
              >
                Create Assignment
              </Button>
            </div>
          ) : (
            teacherAssignments.map((asg) => (
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

      {/* ── TAB 4: ALLOCATED STUDENTS TRACKER ── */}
      {activeTab === "students" && (
        <div className="glass-panel rounded-3xl border border-swara-gold/20 bg-card overflow-hidden shadow-sm space-y-4">
          <div className="px-6 py-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-base font-bold text-kumkum">
                {currentTeacher.name}&apos;s Allocated Student Roster
              </h3>
              <p className="text-xs text-muted-foreground">
                Displaying students assigned to {currentTeacher.name}&apos;s batches.
              </p>
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
                  <th className="px-6 py-3">Allocated Student Name</th>
                  <th className="px-6 py-3">Enrolled Class / Course</th>
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
                      No matching students allocated to {currentTeacher.name}.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">{std.name}</td>
                      <td className="px-6 py-4 font-medium text-muted-foreground">{std.class}</td>
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
                <h3 className="font-serif text-lg font-bold text-kumkum">AI Guru Co-Teacher Copilot ({currentTeacher.name})</h3>
                <p className="text-xs text-muted-foreground">
                  Generate Carnatic lesson plans, tala exercises, and homework drills for {currentTeacher.name}&apos;s students.
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
                className="bg-kumkum hover:bg-kumkum-light text-white shrink-0 gap-1.5 font-bold"
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
                  Generated Lesson Plan for {currentTeacher.name}
                </Badge>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePublishCopilotAsAssignment}
                  disabled={assignmentAssigned}
                  className="border-kumkum/30 text-kumkum hover:bg-kumkum hover:text-white text-xs gap-1.5 font-bold"
                >
                  {assignmentAssigned ? (
                    <>
                      <Check className="size-3.5 text-emerald-600" /> Published to Allocated Class
                    </>
                  ) : (
                    <>
                      <Share2 className="size-3.5" /> Assign to My Batches
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
            <h3 className="font-serif text-xl font-bold text-kumkum">
              Add New Class Batch for {currentTeacher.name}
            </h3>

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
                  placeholder="https://meet.google.com/new"
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
            <h3 className="font-serif text-xl font-bold text-kumkum">
              Create Assignment ({currentTeacher.name})
            </h3>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Allocated Batch</label>
                <select
                  value={newAsgClass}
                  onChange={(e) => setNewAsgClass(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                >
                  {teacherClasses.map((c) => (
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
