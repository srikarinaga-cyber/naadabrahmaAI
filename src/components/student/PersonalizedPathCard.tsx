"use client";

import { useState } from "react";
import { LearningPath, PracticeActivity } from "@/lib/ai/learning-path";
import { OnboardingModal } from "./OnboardingModal";

interface PersonalizedPathCardProps {
  learningPath: LearningPath | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function PersonalizedPathCard({
  learningPath,
  isLoading,
  onRefresh,
}: PersonalizedPathCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activitiesState, setActivitiesState] = useState<PracticeActivity[]>(
    learningPath?.daily_plan?.activities || []
  );

  const toggleActivity = (id: string) => {
    setActivitiesState((prev) =>
      prev.map((act) => (act.id === id ? { ...act, completed: !act.completed } : act))
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-amber-900/30 bg-[#120b04]/80 p-6 backdrop-blur-md animate-pulse">
        <div className="h-6 w-48 bg-amber-900/30 rounded mb-4" />
        <div className="h-4 w-full bg-amber-900/20 rounded mb-2" />
        <div className="h-4 w-3/4 bg-amber-900/20 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-amber-900/20 rounded-xl" />
          <div className="h-32 bg-amber-900/20 rounded-xl" />
        </div>
      </div>
    );
  }

  // Empty State (No path created yet)
  if (!learningPath) {
    return (
      <>
        <div className="rounded-2xl border border-[#d4af37]/40 bg-gradient-to-br from-[#1c1206] via-[#120c04] to-[#0a0602] p-8 text-amber-50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 mb-3">
              ✨ AI Personalization Engine
            </span>
            <h3 className="text-2xl font-bold text-amber-100 tracking-wide">
              Unlock Your Personalized Learning Roadmap
            </h3>
            <p className="text-sm text-amber-200/70 mt-2 leading-relaxed">
              Complete a 60-second diagnostic assessment to receive a customized daily practice plan, pitch targets, and AI-driven skill progression.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-700 text-black font-bold text-sm shadow-lg hover:brightness-110 transition flex items-center gap-2"
            >
              Start Skill Diagnostic →
            </button>
          </div>
        </div>

        <OnboardingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPathCreated={() => {
            onRefresh();
          }}
        />
      </>
    );
  }

  const { current_level, learning_mode, target_goal, daily_plan, strengths, weak_areas, ai_recommendation } =
    learningPath;
  const activities = activitiesState.length > 0 ? activitiesState : daily_plan?.activities || [];
  const completedCount = activities.filter((a) => a.completed).length;
  const progressPct = activities.length > 0 ? Math.round((completedCount / activities.length) * 100) : 0;

  return (
    <>
      <div className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#191006]/90 via-[#100b04]/95 to-[#080502]/95 p-6 text-amber-50 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar / Level Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-900/40 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                {current_level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-amber-950/60 text-amber-200/80 border border-amber-800/40">
                {learning_mode} Discipline
              </span>
            </div>
            <h3 className="text-xl font-bold text-amber-100 mt-2 flex items-center gap-2">
              Your Personalized Learning Path
            </h3>
            <p className="text-xs text-amber-300/60 mt-0.5">
              Goal: <span className="text-amber-200 font-medium">{target_goal}</span>
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-amber-800/50 bg-black/40 text-xs text-amber-300/80 hover:border-[#d4af37] hover:text-amber-100 transition"
          >
            Adjust Goal / Diagnostic ⚙️
          </button>
        </div>

        {/* Strengths & Weak Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
              ✓ Core Strengths
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {strengths && strengths.length > 0 ? (
                strengths.map((str, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs bg-emerald-900/20 text-emerald-200 border border-emerald-800/40"
                  >
                    {str}
                  </span>
                ))
              ) : (
                <span className="text-xs text-amber-300/50 italic">Building core baseline...</span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-amber-900/40 bg-amber-950/10 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
              • Target Focus Areas
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {weak_areas && weak_areas.length > 0 ? (
                weak_areas.map((wa, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs bg-amber-900/20 text-amber-200 border border-amber-800/40"
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

        {/* Today's Practice Plan */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-amber-200 tracking-wide uppercase flex items-center gap-2">
              <span>📅 Today&apos;s Practice Plan</span>
              <span className="text-xs font-normal text-amber-400/60 lowercase">
                ({daily_plan?.total_minutes || 45} mins total)
              </span>
            </h4>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 text-xs text-amber-300/70">
              <span>{completedCount}/{activities.length} completed</span>
              <div className="w-20 h-2 bg-amber-950 rounded-full overflow-hidden border border-amber-900/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[#d4af37] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {activities.map((act) => (
              <div
                key={act.id}
                onClick={() => toggleActivity(act.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                  act.completed
                    ? "border-emerald-900/50 bg-emerald-950/20 opacity-75"
                    : "border-amber-900/40 bg-black/40 hover:border-[#d4af37]/60 hover:bg-black/60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={!!act.completed}
                    onChange={() => {}}
                    className="mt-1 h-4 w-4 rounded border-amber-700 bg-black text-[#d4af37] focus:ring-[#d4af37]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          act.completed ? "line-through text-emerald-300/70" : "text-amber-100"
                        }`}
                      >
                        {act.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-900/30 text-amber-300/80 border border-amber-800/30">
                        {act.type}
                      </span>
                    </div>
                    <p className="text-xs text-amber-300/60 mt-0.5">{act.reason}</p>
                    <div className="text-[11px] text-[#d4af37]/80 mt-1 font-mono">
                      Target: {act.target}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800/50">
                    ⏱ {act.duration_minutes} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Guru Recommendation Banner */}
        {ai_recommendation && (
          <div className="rounded-xl border border-[#d4af37]/30 bg-[#1f1508]/80 p-4 flex items-start gap-3 text-xs leading-relaxed text-amber-200/90">
            <span className="text-lg leading-none shrink-0">🤖</span>
            <div>
              <span className="font-bold text-[#d4af37] block mb-0.5">AI Guru Guidance</span>
              {ai_recommendation}
            </div>
          </div>
        )}
      </div>

      <OnboardingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialLevel={current_level}
        initialMode={learning_mode}
        onPathCreated={() => {
          onRefresh();
        }}
      />
    </>
  );
}
