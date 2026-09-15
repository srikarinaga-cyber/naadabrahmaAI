"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Plus } from "lucide-react";

interface TeacherAssignmentFormProps {
  studentId: string;
  studentName: string;
}

export function TeacherAssignmentForm({ studentId, studentName }: TeacherAssignmentFormProps) {
  const [title, setTitle] = useState("Adhara Shadja (Sa) 5-Minute Sustained Hold");
  const [description, setDescription] = useState("Focus on holding your base pitch steadily with the Tanpura drone before moving to Sarali Varisai.");
  const [dueDate, setDueDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split("T")[0];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          title,
          description,
          dueDate,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to dispatch practice assignment");
      }

      setSuccessMsg(`Targeted practice assigned to ${studentName} successfully!`);
    } catch (err) {
      console.error("Assignment dispatch error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to create assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const presetAssignments = [
    {
      title: "Adhara Shadja (Sa) 5-Minute Sustained Hold",
      desc: "Focus on holding your base pitch steadily with the Tanpura drone.",
    },
    {
      title: "Mayamalavagowla Arohana Practice (1st & 2nd Speed)",
      desc: "Practice swara transitions cleanly without rushing tempo.",
    },
    {
      title: "Sarali Varisai 1 to 4 Speed Transitions",
      desc: "Maintain uniform stroke pressure and steady pulse count.",
    },
    {
      title: "Panchama (Pa) Pitch Accuracy Test",
      desc: "Sing or play Panchama note into pitch tracker aiming for >85% accuracy.",
    },
  ];

  return (
    <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-br from-[#191006] via-[#100b04] to-[#080502] p-6 text-amber-50 shadow-xl space-y-4">
      <div className="flex items-center gap-2 border-b border-amber-900/30 pb-3">
        <Send className="size-4 text-[#d4af37]" />
        <h3 className="text-base font-bold text-amber-100">
          Assign Targeted Practice to {studentName}
        </h3>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="size-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Preset Pickers */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-300/70 mb-2">
          Quick Preset Practice Exercises
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presetAssignments.map((p, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                setTitle(p.title);
                setDescription(p.desc);
              }}
              className="p-2.5 rounded-xl border border-amber-900/40 bg-black/40 text-left hover:border-[#d4af37]/60 transition"
            >
              <div className="text-xs font-semibold text-amber-100">{p.title}</div>
              <div className="text-[10px] text-amber-300/60 truncate mt-0.5">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-amber-200 mb-1">
            Assignment Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl border border-amber-900/50 bg-black/60 px-3.5 py-2.5 text-xs text-amber-100 focus:border-[#d4af37] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-200 mb-1">
            Guru Practice Instructions
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-amber-900/50 bg-black/60 px-3.5 py-2.5 text-xs text-amber-100 focus:border-[#d4af37] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-200 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="rounded-xl border border-amber-900/50 bg-black/60 px-3.5 py-2 text-xs text-amber-100 focus:border-[#d4af37] focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-700 text-black font-bold text-xs shadow-lg hover:brightness-110 disabled:opacity-50 transition flex items-center gap-1.5"
          >
            <Send className="size-3.5" />
            {isSubmitting ? "Dispatching..." : "Assign Targeted Practice"}
          </button>
        </div>
      </form>
    </div>
  );
}
