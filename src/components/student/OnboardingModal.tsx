"use client";

import { useState } from "react";
import { SkillLevel, LearningMode } from "@/lib/ai/learning-path";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPathCreated: (pathData: unknown) => void;
  initialLevel?: SkillLevel;
  initialMode?: LearningMode;
}

export function OnboardingModal({
  isOpen,
  onClose,
  onPathCreated,
  initialLevel = "beginner",
  initialMode = "vocal",
}: OnboardingModalProps) {
  const [currentLevel, setCurrentLevel] = useState<SkillLevel>(initialLevel);
  const [learningMode, setLearningMode] = useState<LearningMode>(initialMode);
  const [targetGoal, setTargetGoal] = useState<string>("Learn Carnatic basics");
  const [preferredLanguage, setPreferredLanguage] = useState<string>("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentLevel,
          learningMode,
          targetGoal,
          preferredLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create learning path");
      }

      onPathCreated(data.learningPath);
      onClose();
    } catch (err) {
      console.error("Onboarding submission error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goalsList = [
    "Learn Carnatic basics & foundations",
    "Improve pitch stability & shruti alignment",
    "Learn Melakarta & Janya ragas",
    "Improve tala consistency & rhythm accuracy",
    "Prepare for Carnatic music grade exams",
    "Build daily singing/playing practice consistency",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[#d4af37]/30 bg-[#0d0905]/95 p-6 md:p-8 text-amber-50 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4 mb-6">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#d4af37] uppercase">
              Smart AI Diagnostic
            </span>
            <h2 className="text-2xl font-bold tracking-wide text-amber-100 mt-1">
              Personalized Learning Path Setup
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-amber-400/60 hover:text-amber-200 text-xl font-bold p-1 transition"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-950/50 border border-red-500/30 p-3 text-sm text-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Skill Level */}
          <div>
            <label className="block text-sm font-medium text-amber-200/90 mb-2">
              1. What is your current Carnatic music skill level?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "beginner", label: "Beginner", desc: "Starting with swaras & Sarali Varisai" },
                { id: "intermediate", label: "Intermediate", desc: "Practicing Alankarams & Geethams" },
                { id: "advanced", label: "Advanced", desc: "Improvisation & Varnams / Kritis" },
              ].map((lvl) => (
                <button
                  type="button"
                  key={lvl.id}
                  onClick={() => setCurrentLevel(lvl.id as SkillLevel)}
                  className={`p-3 rounded-xl border text-left transition ${
                    currentLevel === lvl.id
                      ? "border-[#d4af37] bg-[#d4af37]/15 text-amber-100 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                      : "border-amber-900/40 bg-black/40 text-amber-300/70 hover:border-amber-700/50"
                  }`}
                >
                  <div className="font-semibold text-sm">{lvl.label}</div>
                  <div className="text-[11px] text-amber-200/50 mt-1 leading-tight">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Learning Mode */}
          <div>
            <label className="block text-sm font-medium text-amber-200/90 mb-2">
              2. What discipline / instrument are you focusing on?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: "vocal", label: "🎤 Vocal" },
                { id: "veena", label: "🪕 Veena" },
                { id: "violin", label: "🎻 Violin" },
                { id: "flute", label: "🪈 Flute" },
                { id: "mridangam", label: "🪘 Mridangam" },
              ].map((mode) => (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => setLearningMode(mode.id as LearningMode)}
                  className={`py-2 px-3 rounded-lg border text-center text-xs font-semibold transition ${
                    learningMode === mode.id
                      ? "border-[#d4af37] bg-[#d4af37]/20 text-amber-100"
                      : "border-amber-900/40 bg-black/40 text-amber-300/60 hover:border-amber-700/50"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Primary Learning Goal */}
          <div>
            <label className="block text-sm font-medium text-amber-200/90 mb-2">
              3. What is your primary learning goal?
            </label>
            <select
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              className="w-full rounded-xl border border-amber-900/50 bg-black/60 px-4 py-3 text-sm text-amber-100 focus:border-[#d4af37] focus:outline-none"
            >
              {goalsList.map((goal, idx) => (
                <option key={idx} value={goal} className="bg-[#100b05] text-amber-100">
                  {goal}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Preferred Language */}
          <div>
            <label className="block text-sm font-medium text-amber-200/90 mb-2">
              4. Preferred AI Guru Language
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { code: "en", label: "English" },
                { code: "te", label: "తెలుగు" },
                { code: "hi", label: "हिंदी" },
                { code: "ta", label: "தமிழ்" },
                { code: "kn", label: "ಕನ್ನಡ" },
              ].map((lang) => (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => setPreferredLanguage(lang.code)}
                  className={`py-2 px-2 rounded-lg border text-center text-xs font-medium transition ${
                    preferredLanguage === lang.code
                      ? "border-[#d4af37] bg-[#d4af37]/20 text-amber-100"
                      : "border-amber-900/40 bg-black/40 text-amber-300/60"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-amber-900/30 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-amber-900/40 text-sm font-medium text-amber-300/70 hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-700 text-sm font-bold text-black shadow-lg hover:brightness-110 disabled:opacity-50 transition"
            >
              {isSubmitting ? "Generating Plan..." : "Generate Learning Path ✨"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
