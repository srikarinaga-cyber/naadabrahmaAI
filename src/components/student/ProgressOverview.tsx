"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trophy, Flame, Clock, Award, Target, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";

export interface ComprehensiveStats {
  overallProgress: number;
  completedLessons: number;
  totalLessons: number;
  ragasExplored: number;
  ragasCompleted: number;
  streak: {
    current_streak: number;
    longest_streak: number;
    last_activity_date?: string;
  };
  quizStats: {
    attemptsCount: number;
    averageScore: number | null;
    latestScore: number | null;
  };
  musicPerformance: {
    hasData: boolean;
    avgPitchAccuracy: number | null;
    avgRhythmScore: number | null;
    avgSwaraAccuracy: number | null;
    latestOverall: number | null;
    latestFeedback: string | null;
    assessmentsCount: number;
  };
  learningPath: {
    hasPath: boolean;
    currentLevel?: string;
    learningMode?: string;
    targetGoal?: string;
    strengths?: string[];
    weakAreas?: string[];
    aiRecommendation?: string;
  };
}

interface ProgressOverviewProps {
  initialData?: ComprehensiveStats | null;
}

export function ProgressOverview({ initialData }: ProgressOverviewProps) {
  const [data, setData] = useState<ComprehensiveStats | null>(initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData) {
      fetchProgress();
    }
  }, [initialData]);

  const fetchProgress = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/progress");
      if (!res.ok) throw new Error("Failed to load progress data");
      const json = await res.json();
      if (json.detailedStats) {
        setData(json.detailedStats);
      }
    } catch (err) {
      console.warn("Error fetching comprehensive progress:", err);
      setErrorMsg("Unable to load latest progress statistics.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-amber-950/20 border border-amber-900/30 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (errorMsg && !data) {
    return (
      <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-200 flex items-center gap-2">
        <AlertCircle className="size-4 text-red-400 shrink-0" />
        <span>{errorMsg}</span>
      </div>
    );
  }

  const overallProgress = data?.overallProgress ?? 0;
  const streak = data?.streak?.current_streak ?? 0;
  const longestStreak = data?.streak?.longest_streak ?? 0;
  const quizCount = data?.quizStats?.attemptsCount ?? 0;
  const avgQuizScore = data?.quizStats?.averageScore;
  const musicPerf = data?.musicPerformance;
  const path = data?.learningPath;

  return (
    <div className="space-y-6">
      {/* ── 1. Top Section: 4 Core Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-br from-[#181108] to-[#0c0803] p-5 text-amber-50 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/70">
              Overall Progress
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-3xl font-extrabold text-amber-100 font-mono">{overallProgress}%</h4>
            <div className="mt-2.5 w-full bg-amber-950 rounded-full h-2 overflow-hidden border border-amber-900/50">
              <div
                className="bg-gradient-to-r from-amber-500 to-[#d4af37] h-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-300/60 mt-2">
              {data?.completedLessons || 0} of {data?.totalLessons || 0} lessons completed
            </p>
          </div>
        </div>

        {/* Practice Streak */}
        <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-br from-[#181108] to-[#0c0803] p-5 text-amber-50 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/70">
              Practice Streak
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Flame className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-extrabold text-orange-200 font-mono">{streak}</h4>
              <span className="text-xs font-semibold text-orange-300/70">days</span>
            </div>
            <p className="text-[11px] text-amber-300/60 mt-2">
              {streak > 0 ? (
                <>Best record: <strong className="text-amber-200">{longestStreak} days</strong></>
              ) : (
                "Start practicing today to build your streak!"
              )}
            </p>
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-br from-[#181108] to-[#0c0803] p-5 text-amber-50 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/70">
              Ear & Theory Quiz
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            {quizCount > 0 ? (
              <>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-extrabold text-emerald-200 font-mono">
                    {avgQuizScore}%
                  </h4>
                  <span className="text-xs font-semibold text-emerald-300/70">avg</span>
                </div>
                <p className="text-[11px] text-amber-300/60 mt-2">
                  {quizCount} quiz attempt{quizCount > 1 ? "s" : ""} completed
                </p>
              </>
            ) : (
              <>
                <h4 className="text-xl font-bold text-amber-300/50">No Quizzes Yet</h4>
                <p className="text-[11px] text-amber-300/60 mt-2">
                  Attempt your first ear training quiz in Practice Hub
                </p>
              </>
            )}
          </div>
        </div>

        {/* Knowledge & Ragas */}
        <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-br from-[#181108] to-[#0c0803] p-5 text-amber-50 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/70">
              Ragas Explored
            </span>
            <div className="p-2 rounded-xl bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20">
              <Target className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-extrabold text-[#d4af37] font-mono">
                {data?.ragasExplored || 0}
              </h4>
              <span className="text-xs font-semibold text-amber-200/70">ragas</span>
            </div>
            <p className="text-[11px] text-amber-300/60 mt-2">
              {data?.ragasCompleted || 0} ragas fully completed
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. AI Music Assessment Performance Section (Phase 4 Integration Point) ── */}
      <div className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#160e05]/95 via-[#0e0a03]/95 to-[#060401]/95 p-6 text-amber-50 shadow-xl">
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#d4af37]">🎙️</span>
            <div>
              <h4 className="text-base font-bold text-amber-100 tracking-wide">
                Live AI Music Assessment Performance
              </h4>
              <p className="text-xs text-amber-300/60">
                Acoustic pitch stability, swara precision, and rhythm analysis metrics
              </p>
            </div>
          </div>

          {musicPerf?.hasData && (
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-900/40 text-amber-200 border border-amber-700/40">
              {musicPerf.assessmentsCount} session{musicPerf.assessmentsCount > 1 ? "s" : ""} logged
            </span>
          )}
        </div>

        {musicPerf?.hasData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-black/40 border border-amber-900/30 p-4 text-center">
                <span className="text-xs text-amber-300/70 block uppercase font-bold tracking-wider">
                  Pitch Accuracy
                </span>
                <span className="text-3xl font-extrabold text-amber-100 font-mono mt-1 block">
                  {musicPerf.avgPitchAccuracy}%
                </span>
              </div>

              <div className="rounded-xl bg-black/40 border border-amber-900/30 p-4 text-center">
                <span className="text-xs text-amber-300/70 block uppercase font-bold tracking-wider">
                  Rhythm Consistency
                </span>
                <span className="text-3xl font-extrabold text-amber-100 font-mono mt-1 block">
                  {musicPerf.avgRhythmScore}%
                </span>
              </div>

              <div className="rounded-xl bg-black/40 border border-amber-900/30 p-4 text-center">
                <span className="text-xs text-amber-300/70 block uppercase font-bold tracking-wider">
                  Swara Precision
                </span>
                <span className="text-3xl font-extrabold text-amber-100 font-mono mt-1 block">
                  {musicPerf.avgSwaraAccuracy}%
                </span>
              </div>
            </div>

            {musicPerf.latestFeedback && (
              <div className="p-3.5 rounded-xl bg-[#1c1308] border border-[#d4af37]/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="size-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#d4af37] block mb-0.5">Latest Assessment Feedback</span>
                  {musicPerf.latestFeedback}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Honest Empty State — No fake data generated */
          <div className="rounded-xl border border-dashed border-amber-900/50 bg-black/30 p-6 text-center">
            <div className="inline-flex p-3 rounded-full bg-amber-950/60 text-amber-400 mb-2">
              <HelpCircle className="size-6" />
            </div>
            <h5 className="text-sm font-bold text-amber-200">No Assessment Data Recorded Yet</h5>
            <p className="text-xs text-amber-300/60 max-w-md mx-auto mt-1 leading-relaxed">
              Complete your first singing or playing session with the microphone active in <strong>Pitch Visualizer</strong> or <strong>AI Music Assessment</strong> to see your pitch accuracy, rhythm consistency, and swara precision.
            </p>
          </div>
        )}
      </div>

      {/* ── 3. AI Learning Guidance & Strategy Banner ── */}
      {path?.hasPath && path.aiRecommendation && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#201507] via-[#150e05] to-[#0c0803] p-5 text-amber-50 shadow-lg flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                Contextual AI Recommendation
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                Why this activity?
              </span>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed">{path.aiRecommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
