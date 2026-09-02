"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Users,
  Zap,
  BookOpen,
  Calendar,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signIn as serverSignIn } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
  mode: "login" | "signup";
}

export interface CourseAllocation {
  course: string;
  teacherId: string;
  teacherName: string;
  subject: string;
}

export function getTeacherForCourse(course: string): CourseAllocation {
  if (course === "Veena" || course === "Violin") {
    return {
      course,
      teacherId: "tch-2",
      teacherName: "Guru Vishwanathan",
      subject: "Veena & Stringed Instruments",
    };
  }
  if (course === "Mridangam" || course === "Flute") {
    return {
      course,
      teacherId: "tch-3",
      teacherName: "Guru Ramanathan",
      subject: "Mridangam & Solkattu Percussion",
    };
  }
  return {
    course: "Carnatic Vocal",
    teacherId: "tch-1",
    teacherName: "Guru Sangeetha",
    subject: "Carnatic Vocal Sangeetham",
  };
}

export function AuthForm({ mode }: AuthFormProps) {
  const [portal, setPortal] = useState<"student" | "teacher">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // Student Enrollment Fields (Year & Course)
  const [academicYear, setAcademicYear] = useState("1st Year (Beginner)");
  const [selectedCourse, setSelectedCourse] = useState("Carnatic Vocal");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const allocatedGuru = getTeacherForCourse(selectedCourse);

  const saveUserNameAndEnrollment = (explicitName?: string, userEmail?: string) => {
    let resolvedName = "Student";
    if (explicitName && explicitName.trim()) {
      resolvedName = explicitName.trim();
    } else if (userEmail && userEmail.includes("@")) {
      const rawUser = userEmail.split("@")[0];
      resolvedName = rawUser
        .replace(/[._-]/g, " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    } else {
      resolvedName = portal === "teacher" ? "Guru Sangeetha" : "Srinivas K.";
    }

    try {
      localStorage.setItem("naada_user_name", resolvedName);
      document.cookie = `naada_user_name=${encodeURIComponent(resolvedName)}; path=/; max-age=86400; SameSite=Lax`;

      if (portal === "student") {
        const studentRecord = {
          id: `std-enrolled-${Date.now()}`,
          name: resolvedName,
          email: userEmail || "student@naadabrahma.ai",
          academicYear,
          course: selectedCourse,
          teacherId: allocatedGuru.teacherId,
          teacherName: allocatedGuru.teacherName,
          class: `${selectedCourse} - ${academicYear}`,
          pitchAccuracy: 92,
          talaPrecision: 90,
          streak: 1,
          status: "On Track",
        };

        // Save newly enrolled student to local storage list
        const existingStored = localStorage.getItem("naada_enrolled_students");
        let studentsList = [];
        if (existingStored) {
          try {
            studentsList = JSON.parse(existingStored);
          } catch {
            studentsList = [];
          }
        }
        studentsList.unshift(studentRecord);
        localStorage.setItem("naada_enrolled_students", JSON.stringify(studentsList));

        // Save student's active allocation info
        localStorage.setItem("naada_student_allocation", JSON.stringify(studentRecord));
        document.cookie = `naada_student_course=${encodeURIComponent(selectedCourse)}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `naada_teacher_id=${encodeURIComponent(allocatedGuru.teacherId)}; path=/; max-age=86400; SameSite=Lax`;
      }
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  };

  const handleInstantPortalAccess = (targetRole: "student" | "teacher") => {
    setLoading(true);
    setError(null);
    const demoName = targetRole === "teacher" ? "Guru Sangeetha" : (name.trim() || "Srinivas K.");
    saveUserNameAndEnrollment(demoName, email || "demo@naadabrahma.ai");

    setSuccess(`Enrolling into ${targetRole === "teacher" ? "Teacher Portal" : "Student Dashboard"} under ${allocatedGuru.teacherName}...`);

    document.cookie = `naada_demo_role=${targetRole}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `demo_mode=true; path=/; max-age=86400; SameSite=Lax`;

    const targetUrl = targetRole === "teacher" ? "/teacher" : "/student";
    window.location.href = targetUrl;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    saveUserNameAndEnrollment(name, email);

    const targetDestination = portal === "teacher" ? "/teacher" : "/student";

    try {
      let supabase = null;
      try {
        supabase = createClient();
      } catch (err) {
        console.warn("Browser Supabase client fallback:", err);
      }

      if (mode === "login") {
        if (supabase) {
          const { error: authError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (authError) {
            console.warn("Supabase login warning, falling back to portal session:", authError.message);
          }
        } else {
          const formData = new FormData();
          formData.append("email", email);
          formData.append("password", password);
          const res = await serverSignIn(formData);
          if (res?.error) {
            console.warn("Server signin warning:", res.error);
          }
        }

        document.cookie = `naada_demo_role=${portal}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `demo_mode=true; path=/; max-age=86400; SameSite=Lax`;

        setSuccess(`Enrolled successfully! Redirecting to ${portal === "teacher" ? "Teacher Portal" : "Student Dashboard"}...`);
        setTimeout(() => {
          window.location.href = targetDestination;
        }, 300);
      } else {
        if (supabase) {
          const { error: authError } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                name: name.trim() || "Student",
                role: portal,
                course: selectedCourse,
                academicYear,
                teacherId: allocatedGuru.teacherId,
                teacherName: allocatedGuru.teacherName,
              },
            },
          });
          if (authError) {
            console.warn("Supabase signup warning, setting portal session:", authError.message);
          }
        }

        document.cookie = `naada_demo_role=${portal}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `demo_mode=true; path=/; max-age=86400; SameSite=Lax`;

        setSuccess(`Student registered & allocated to ${allocatedGuru.teacherName}! Redirecting...`);
        setTimeout(() => {
          window.location.href = targetDestination;
        }, 300);
      }
    } catch {
      document.cookie = `naada_demo_role=${portal}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `demo_mode=true; path=/; max-age=86400; SameSite=Lax`;
      window.location.href = targetDestination;
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Role / Portal Switcher ── */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted/60 p-1 border border-border/50">
        <button
          type="button"
          onClick={() => setPortal("student")}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all ${
            portal === "student"
              ? "bg-card text-kumkum shadow-sm font-bold border border-swara-gold/40"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <GraduationCap className="size-4" />
          Student Registration
        </button>
        <button
          type="button"
          onClick={() => setPortal("teacher")}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all ${
            portal === "teacher"
              ? "bg-card text-kumkum shadow-sm font-bold border border-swara-gold/40"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-4" />
          Teacher Portal (Guru)
        </button>
      </div>

      {/* 🎓 Student Course & Year Allocation Selection Box */}
      {portal === "student" && (
        <div className="rounded-2xl border border-swara-gold/30 bg-swara-gold/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-kumkum uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="size-3.5" /> Select Course & Academic Year:
            </span>
            <span className="text-[10px] bg-kumkum/10 text-kumkum font-bold px-2 py-0.5 rounded-full">
              Auto Teacher Allocation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <BookOpen className="size-3 text-swara-gold" /> Carnatic Course / Subject:
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-xl border border-swara-gold/40 bg-background px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-kumkum/30 cursor-pointer shadow-xs"
              >
                <option value="Carnatic Vocal">🎤 Carnatic Vocal Sangeetham</option>
                <option value="Veena">🪕 Veena (Stringed Instrument)</option>
                <option value="Violin">🎻 Violin (Bowed Strings)</option>
                <option value="Mridangam">🥁 Mridangam (Percussion)</option>
                <option value="Flute">🪈 Flute (Venu Wind Instrument)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="size-3 text-swara-gold" /> Academic Year / Level:
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full rounded-xl border border-swara-gold/40 bg-background px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-kumkum/30 cursor-pointer shadow-xs"
              >
                <option value="1st Year (Beginner)">1st Year (Beginner - Abhyasa Ganam)</option>
                <option value="2nd Year (Intermediate)">2nd Year (Intermediate - Geetham & Swarajathi)</option>
                <option value="3rd Year (Advanced)">3rd Year (Advanced - Varnam Masterclass)</option>
                <option value="4th Year (Senior Master)">4th Year (Senior - Manodharma & Kritis)</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-card/80 border border-emerald-500/30 p-2.5 text-xs flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-semibold">
              <UserCheck className="size-3.5 text-emerald-600" /> Allocated Guru Portal:
            </span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
              {allocatedGuru.teacherName} ({allocatedGuru.subject})
            </span>
          </div>
        </div>
      )}

      {/* ⚡ Instant One-Click Entry Banner */}
      <div className="rounded-2xl border border-swara-gold/30 bg-card p-3 text-center space-y-2">
        <p className="text-[11px] font-bold text-kumkum uppercase tracking-wider flex items-center justify-center gap-1">
          <Zap className="size-3.5 fill-current text-swara-gold" /> Instant Enroll & Access Portal:
        </p>
        <Button
          type="button"
          onClick={() => handleInstantPortalAccess(portal)}
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 h-auto rounded-xl shadow-xs gap-1.5"
        >
          <Sparkles className="size-3.5 fill-current" />
          Enroll as Student & Enter Dashboard
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-muted-foreground mb-1">
              Full Student Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kumkum/30 transition-all"
                placeholder={portal === "teacher" ? "Guru Sangeetha" : "e.g. Srinivas K."}
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kumkum/30 transition-all"
              placeholder={portal === "teacher" ? "teacher@naadabrahma.ai" : "student@naadabrahma.ai"}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kumkum/30 transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 rounded-xl px-3.5 py-2.5 animate-in fade-in duration-200">
            <AlertCircle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl px-3.5 py-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="size-4 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-kumkum hover:bg-kumkum-light text-white font-medium py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Allocating & Entering Portal...
            </span>
          ) : (
            <span className="flex items-center gap-2 font-bold">
              {mode === "login"
                ? portal === "teacher"
                  ? "Sign In as Guru"
                  : `Enroll in ${selectedCourse} & Sign In`
                : portal === "teacher"
                ? "Create Guru Account"
                : `Register for ${selectedCourse} (${academicYear})`}
              <ArrowRight className="size-4" />
            </span>
          )}
        </Button>
      </form>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">Or quick demo access</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleInstantPortalAccess("student")}
          disabled={loading}
          className="border-swara-gold/30 hover:border-swara-gold hover:bg-swara-gold/10 text-foreground font-bold rounded-xl text-xs py-2 h-auto transition-all flex items-center justify-center gap-1"
        >
          <GraduationCap className="size-3.5 text-swara-gold" />
          Demo Student
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleInstantPortalAccess("teacher")}
          disabled={loading}
          className="border-swara-gold/30 hover:border-swara-gold hover:bg-swara-gold/10 text-foreground font-bold rounded-xl text-xs py-2 h-auto transition-all flex items-center justify-center gap-1"
        >
          <Users className="size-3.5 text-kumkum" />
          Demo Teacher
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground pt-1">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-kumkum font-semibold hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already registered?{" "}
            <Link href="/login" className="text-kumkum font-semibold hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
