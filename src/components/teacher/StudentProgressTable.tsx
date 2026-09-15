"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EnrolledStudentSummary } from "@/lib/db/teacher";
import { Users, Flame, ArrowRight, Sparkles, BookOpen, AlertCircle, HelpCircle } from "lucide-react";

export function StudentProgressTable() {
  const [students, setStudents] = useState<EnrolledStudentSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/teacher/students");
      if (!res.ok) throw new Error("Failed to fetch student progress records");
      const json = await res.json();
      setStudents(json.students || []);
    } catch (err) {
      console.warn("Error loading teacher student table:", err);
      setErrorMsg("Unable to load enrolled student metrics.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-amber-900/30 bg-[#120b04]/80 p-6 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-amber-900/30 rounded" />
        <div className="h-10 w-full bg-amber-900/20 rounded-xl" />
        <div className="h-10 w-full bg-amber-900/20 rounded-xl" />
      </div>
    );
  }

  // Generate Evidence-Based Teaching Insights
  const noAssessmentCount = students.filter((s) => s.latestAssessmentScore === null).length;
  const highPerformers = students.filter((s) => s.latestPitchAccuracy && s.latestPitchAccuracy >= 80);
  const weakPitchStudents = students.filter((s) => s.latestPitchAccuracy !== null && s.latestPitchAccuracy < 70);

  return (
    <div className="space-y-6">
      {/* ── 1. Teaching Insights Card (Evidence-Based) ── */}
      {students.length > 0 && (
        <div className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-r from-[#1f1508] via-[#140d04] to-[#0a0602] p-5 text-amber-50 shadow-lg flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Guru Teaching Insights (Batch Evidence)
            </span>
            <div className="flex flex-wrap gap-2 text-xs text-amber-200/90">
              {noAssessmentCount > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-amber-950 text-amber-300 border border-amber-800/40">
                  ℹ️ {noAssessmentCount} student{noAssessmentCount > 1 ? "s have" : " has"} no audio assessments logged yet.
                </span>
              )}
              {highPerformers.length > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  ✓ {highPerformers.length} student{highPerformers.length > 1 ? "s" : ""} achieving &gt;80% pitch accuracy.
                </span>
              )}
              {weakPitchStudents.length > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-red-950 text-red-300 border border-red-800/40">
                  ⚠️ {weakPitchStudents.length} student{weakPitchStudents.length > 1 ? "s" : ""} need pitch stability practice.
                </span>
              )}
              {noAssessmentCount === 0 && highPerformers.length === 0 && weakPitchStudents.length === 0 && (
                <span className="text-xs text-amber-300/60">Batch actively establishing baseline practice logs.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Enrolled Student Progress Table ── */}
      <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-br from-[#181108]/90 via-[#100b04]/95 to-[#080502]/95 p-6 text-amber-50 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-[#d4af37]" />
            <h3 className="text-lg font-bold text-amber-100">
              Enrolled Students Progress ({students.length})
            </h3>
          </div>

          <span className="text-xs text-amber-300/60 font-mono">
            Authorized Batch RLS Active
          </span>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-200 mb-4">
            {errorMsg}
          </div>
        )}

        {students.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <HelpCircle className="size-8 text-amber-400/50 mx-auto" />
            <h4 className="text-sm font-bold text-amber-200">No Enrolled Students Found</h4>
            <p className="text-xs text-amber-300/60 max-w-sm mx-auto">
              You currently have no students enrolled in your assigned batch classes.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-amber-200/90">
              <thead className="bg-black/40 text-amber-300/70 uppercase text-[10px] tracking-wider border-b border-amber-900/40">
                <tr>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Class & Level</th>
                  <th className="py-3 px-3">Target Goal</th>
                  <th className="py-3 px-3">Streak</th>
                  <th className="py-3 px-3">Pitch Acc.</th>
                  <th className="py-3 px-3">Signal Cont.</th>
                  <th className="py-3 px-3">Overall Grade</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/30">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-amber-950/20 transition">
                    <td className="py-3.5 px-3 font-semibold text-amber-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-xs font-bold text-[#d4af37]">
                          {student.name.charAt(0)}
                        </div>
                        <span>{student.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-amber-200">{student.className}</div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/70">
                        {student.currentLevel}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 max-w-xs truncate text-amber-300/80">
                      {student.targetGoal}
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-orange-300">
                      <span className="flex items-center gap-1">
                        <Flame className="size-3 text-orange-400" /> {student.streak}d
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      {student.latestPitchAccuracy !== null ? (
                        <span className="text-emerald-300 font-bold">{student.latestPitchAccuracy}%</span>
                      ) : (
                        <span className="text-amber-400/40 italic">No data yet</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      {student.latestSignalContinuity !== null ? (
                        <span className="text-amber-200 font-bold">{student.latestSignalContinuity}%</span>
                      ) : (
                        <span className="text-amber-400/40 italic">No data yet</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      {student.latestAssessmentScore !== null ? (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                          {student.latestAssessmentScore}%
                        </span>
                      ) : (
                        <span className="text-amber-400/40 italic">No data yet</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/teacher/students/${student.id}`}
                        className="px-3 py-1.5 rounded-lg border border-amber-800/40 bg-black/40 text-[11px] font-bold text-amber-300 hover:border-[#d4af37] hover:text-amber-100 transition inline-flex items-center gap-1"
                      >
                        View Detail <ArrowRight className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
