export const dynamic = "force-dynamic";

import { requireRole } from "@/lib/api/auth";
import { verifyTeacherStudentAccess } from "@/lib/db/teacher";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, User, Trophy, Flame, Target, Award, Sparkles, AlertCircle, Plus, BookOpen, Clock } from "lucide-react";
import { TeacherAssignmentForm } from "@/components/teacher/TeacherAssignmentForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TeacherStudentDetailPage({ params }: PageProps) {
  const { id: studentId } = await params;

  // 1. Authenticate Teacher Role
  const auth = await requireRole(["teacher", "platform_admin", "academy_admin"]);
  if (!auth) {
    return (
      <div className="min-h-screen bg-[#0a0602] text-amber-50 flex items-center justify-center p-6">
        <div className="max-w-md p-6 rounded-2xl border border-red-900/50 bg-red-950/20 text-center space-y-3">
          <AlertCircle className="size-8 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold text-red-200">Teacher Authentication Required</h2>
          <p className="text-xs text-red-300/70">Please log in as an authorized teacher or guru to view student records.</p>
        </div>
      </div>
    );
  }

  // 2. Strict Teacher-Student RLS Authorization Check
  const isAuthorized = await verifyTeacherStudentAccess(auth.user.id, studentId);
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0602] text-amber-50 flex items-center justify-center p-6">
        <div className="max-w-md p-6 rounded-2xl border border-red-900/50 bg-red-950/20 text-center space-y-3">
          <AlertCircle className="size-8 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold text-red-200">403 Access Forbidden</h2>
          <p className="text-xs text-red-300/70">
            You are not authorized to access this student&apos;s records. Teacher monitoring is strictly isolated to enrolled batch members.
          </p>
          <Link
            href="/teacher"
            className="inline-block px-4 py-2 rounded-xl bg-amber-900/40 border border-amber-700 text-xs text-amber-200 hover:bg-amber-800/40"
          >
            ← Return to Teacher Portal
          </Link>
        </div>
      </div>
    );
  }

  // 3. Fetch Real Student Records from Supabase
  const supabase = await createClient();
  if (!supabase) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profileRes, pathRes, streakRes, assessmentRes, quizRes, classRes] = await Promise.all([
    supabase.from("profiles" as any).select("*").eq("id", studentId).single(),
    supabase.from("student_learning_paths" as any).select("*").eq("user_id", studentId).single(),
    supabase.from("study_streaks" as any).select("*").eq("user_id", studentId).single(),
    supabase.from("music_assessments" as any).select("*").eq("user_id", studentId).order("created_at", { ascending: false }),
    supabase.from("quiz_attempts" as any).select("*").eq("user_id", studentId),
    supabase.from("class_enrollments" as any).select("class_id, teacher_classes(name)").eq("student_id", studentId).limit(1),
  ]);

  const studentProfile = profileRes.data as any;
  const pathData = pathRes.data as any;
  const streakData = streakRes.data as any;
  const assessments = (assessmentRes.data as any[]) ?? [];
  const quizAttempts = (quizRes.data as any[]) ?? [];
  const className = (classRes.data as any[])?.[0]?.teacher_classes?.name || "Carnatic Music Class";

  const streak = streakData?.current_streak || 0;
  const quizCount = quizAttempts.length;
  const avgQuizScore = quizCount > 0
    ? Math.round(quizAttempts.reduce((sum: number, q: any) => sum + Number(q.score || 0), 0) / quizCount)
    : null;

  // Evaluate Progress Trends (only when >= 2 assessments exist)
  const hasTrend = assessments.length >= 2;
  const oldestAcc = hasTrend ? Number(assessments[assessments.length - 1]?.pitch_accuracy || 0) : 0;
  const latestAcc = hasTrend ? Number(assessments[0]?.pitch_accuracy || 0) : 0;
  const accDiff = latestAcc - oldestAcc;

  return (
    <div className="min-h-screen bg-[#070402] text-amber-50 flex flex-col justify-between">
      <Navbar />
      <main className="mx-auto max-w-6xl w-full px-6 py-8 space-y-8">
        {/* Navigation Top Bar */}
        <div>
          <Link
            href="/teacher"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300/70 hover:text-amber-100 transition mb-4"
          >
            <ArrowLeft className="size-3.5" /> Back to Guru Command Center
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-900/40 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 border border-[#d4af37]/40 flex items-center justify-center text-xl font-bold text-black shadow-lg">
                {studentProfile?.name?.charAt(0) || "S"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                    {pathData?.current_level || "Beginner"}
                  </span>
                  <span className="text-xs text-amber-300/70">{className}</span>
                </div>
                <h1 className="text-2xl font-bold text-amber-100 mt-1">
                  {studentProfile?.name || "Student Record"}
                </h1>
                <p className="text-xs text-amber-300/60">
                  Target Goal: <span className="text-amber-200">{pathData?.target_goal || "Basics"}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="px-3 py-2 rounded-xl bg-black/50 border border-amber-900/40 text-center">
                <span className="text-[10px] text-amber-400/60 uppercase block">Streak</span>
                <span className="font-bold text-orange-300">{streak} Days</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-black/50 border border-amber-900/40 text-center">
                <span className="text-[10px] text-amber-400/60 uppercase block">Quizzes</span>
                <span className="font-bold text-emerald-300">{avgQuizScore !== null ? `${avgQuizScore}%` : "None"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Weak Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/10 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              ✓ Verified Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {pathData?.strengths && pathData.strengths.length > 0 ? (
                pathData.strengths.map((str: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs bg-emerald-900/20 text-emerald-200 border border-emerald-800/40"
                  >
                    {str}
                  </span>
                ))
              ) : (
                <span className="text-xs text-amber-300/50 italic">Building core baseline...</span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-900/40 bg-amber-950/10 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              • Target Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {pathData?.weak_areas && pathData.weak_areas.length > 0 ? (
                pathData.weak_areas.map((wa: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs bg-amber-900/20 text-amber-200 border border-amber-800/40"
                  >
                    {wa}
                  </span>
                ))
              ) : (
                <span className="text-xs text-amber-300/50 italic">None logged yet</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Progress Trend Section (Only rendered if >= 2 assessments exist) ── */}
        {hasTrend ? (
          <div className="rounded-2xl border border-amber-900/40 bg-black/40 p-5 text-xs text-amber-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#d4af37]" />
              <div>
                <span className="font-bold text-amber-100 block">Acoustic Pitch Progress Trend</span>
                <span className="text-amber-300/70 text-[11px]">
                  Measured across {assessments.length} logged audio assessment sessions
                </span>
              </div>
            </div>

            <div className="text-right font-mono font-bold text-sm">
              {accDiff >= 0 ? (
                <span className="text-emerald-400">+{accDiff}% Improvement</span>
              ) : (
                <span className="text-amber-400">{accDiff}% Change</span>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-amber-900/50 p-4 text-center text-xs text-amber-300/50 italic">
            Complete more assessments to see your progress trend graph.
          </div>
        )}

        {/* ── Chronological Assessment History Table ── */}
        <div className="rounded-2xl border border-amber-900/40 bg-[#120b04]/90 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
            <h3 className="text-base font-bold text-amber-100 flex items-center gap-2">
              <span>🎙️ Student Audio Assessment History</span>
              <span className="text-xs font-normal text-amber-300/60 font-mono">
                ({assessments.length} sessions logged)
              </span>
            </h3>
          </div>

          {assessments.length === 0 ? (
            <div className="py-8 text-center text-xs text-amber-300/50 italic">
              No assessments recorded yet for this student.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-amber-200/90">
                <thead className="bg-black/40 text-amber-300/70 uppercase text-[10px] tracking-wider border-b border-amber-900/40">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Practice Target</th>
                    <th className="py-2.5 px-3">Pitch Acc.</th>
                    <th className="py-2.5 px-3">Pitch Stab.</th>
                    <th className="py-2.5 px-3">Swara Prec.</th>
                    <th className="py-2.5 px-3">Signal Cont.</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3 max-w-xs">AI Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/30">
                  {assessments.map((a: any) => (
                    <tr key={a.id} className="hover:bg-amber-950/20">
                      <td className="py-3 px-3 font-mono text-amber-300/70 shrink-0 whitespace-nowrap">
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-semibold text-amber-100">{a.target_name}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">{a.pitch_accuracy}%</td>
                      <td className="py-3 px-3 font-mono text-amber-200">{a.pitch_stability}%</td>
                      <td className="py-3 px-3 font-mono text-amber-200">{a.swara_accuracy}%</td>
                      <td className="py-3 px-3 font-mono text-amber-200">{a.rhythm_score}%</td>
                      <td className="py-3 px-3 font-mono">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                          {a.overall_score}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-amber-300/80 max-w-xs truncate">
                        {a.ai_feedback}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Assign Targeted Practice Console ── */}
        <TeacherAssignmentForm studentId={studentId} studentName={studentProfile?.name || "Student"} />
      </main>
      <Footer />
    </div>
  );
}
