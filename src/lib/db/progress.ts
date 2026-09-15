import { createClient } from "@/lib/supabase/server";

export async function updateStudyStreak(userId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const today = new Date().toISOString().split("T")[0];

  const { data: streak } = await supabase
    .from("study_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!streak) {
    const { data } = await supabase
      .from("study_streaks")
      .insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today,
      })
      .select()
      .single();
    return data;
  }

  if (streak.last_activity_date === today) {
    return streak;
  }

  const lastDate = new Date(streak.last_activity_date ?? today);
  const todayDate = new Date(today);
  const diffDays = Math.floor(
    (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let newStreak = streak.current_streak;
  if (diffDays === 1) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  const longestStreak = Math.max(streak.longest_streak, newStreak);

  const { data } = await supabase
    .from("study_streaks")
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_activity_date: today,
    })
    .eq("user_id", userId)
    .select()
    .single();

  return data;
}

export async function recordProgress(params: {
  userId: string;
  entityType: string;
  entityId: string;
  status: "not_started" | "in_progress" | "completed";
  score?: number;
}) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: params.userId,
        entity_type: params.entityType,
        entity_id: params.entityId,
        status: params.status,
        score: params.score ?? null,
        last_studied_at: new Date().toISOString(),
      },
      { onConflict: "user_id,entity_type,entity_id" }
    )
    .select()
    .single();

  if (!error) {
    await updateStudyStreak(params.userId);
  }

  return data;
}

export async function getDashboardStats(userId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const [progressRes, streakRes, bookmarksRes] = await Promise.all([
    supabase.from("user_progress").select("*").eq("user_id", userId),
    supabase.from("study_streaks").select("*").eq("user_id", userId).single(),
    supabase.from("user_bookmarks").select("*").eq("user_id", userId),
  ]);

  const progress = progressRes.data ?? [];
  const completed = progress.filter((p) => p.status === "completed");
  const avgScore =
    progress.filter((p) => p.score != null).length > 0
      ? Math.round(
          progress
            .filter((p) => p.score != null)
            .reduce((sum, p) => sum + Number(p.score), 0) /
            progress.filter((p) => p.score != null).length
        )
      : 0;

  const ragaProgress = completed.filter((p) => p.entity_type === "raga");

  return {
    studyProgress: progress.length > 0 ? Math.round((completed.length / progress.length) * 100) : 0,
    completedLessons: completed.length,
    totalLessons: progress.length,
    ragasDiscovered: ragaProgress.length,
    practiceScore: avgScore,
    streak: streakRes.data ?? { current_streak: 0, longest_streak: 0 },
    bookmarkCount: bookmarksRes.data?.length ?? 0,
  };
}

export async function getComprehensiveStudentProgress(userId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [progressRes, streakRes, quizRes, pathRes, assessmentRes] = await Promise.all([
    supabase.from("user_progress" as any).select("*").eq("user_id", userId),
    supabase.from("study_streaks" as any).select("*").eq("user_id", userId).single(),
    supabase.from("quiz_attempts" as any).select("*").eq("user_id", userId),
    supabase.from("student_learning_paths" as any).select("*").eq("user_id", userId).single(),
    supabase.from("music_assessments" as any).select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);

  const progress = (progressRes.data as any[]) ?? [];
  const completed = progress.filter((p: any) => p.status === "completed");
  const ragasCompleted = completed.filter((p: any) => p.entity_type === "raga").length;
  const ragasExplored = progress.filter((p: any) => p.entity_type === "raga").length;

  // Quiz Stats calculation
  const quizAttempts = (quizRes.data as any[]) ?? [];
  const quizCount = quizAttempts.length;
  const avgQuizScore =
    quizCount > 0
      ? Math.round(quizAttempts.reduce((sum: number, q: any) => sum + Number(q.score || 0), 0) / quizCount)
      : null;
  const latestQuizScore = quizCount > 0 ? Number(quizAttempts[quizAttempts.length - 1]?.score || 0) : null;

  // Music Assessments calculation (Phase 4 integration readiness)
  const assessments = (assessmentRes.data as any[]) ?? [];
  const hasAssessmentData = assessments.length > 0;
  const avgPitch = hasAssessmentData
    ? Math.round(assessments.reduce((sum: number, a: any) => sum + Number(a.pitch_accuracy || 0), 0) / assessments.length)
    : null;
  const avgRhythm = hasAssessmentData
    ? Math.round(assessments.reduce((sum: number, a: any) => sum + Number(a.rhythm_score || 0), 0) / assessments.length)
    : null;
  const avgSwara = hasAssessmentData
    ? Math.round(assessments.reduce((sum: number, a: any) => sum + Number(a.swara_accuracy || 0), 0) / assessments.length)
    : null;

  // Learning Path Data
  const pathData = pathRes.data as any;

  // Calculate composite study progress
  let overallPct = 0;
  if (progress.length > 0) {
    overallPct = Math.round((completed.length / progress.length) * 100);
  } else if (quizCount > 0) {
    overallPct = Math.min(100, Math.round(avgQuizScore || 0));
  } else if (pathData) {
    overallPct = 10; // Baseline initialized profile
  }

  return {
    overallProgress: overallPct,
    completedLessons: completed.length,
    totalLessons: progress.length,
    ragasExplored,
    ragasCompleted,
    streak: streakRes.data ?? { current_streak: 0, longest_streak: 0 },
    quizStats: {
      attemptsCount: quizCount,
      averageScore: avgQuizScore,
      latestScore: latestQuizScore,
    },
    musicPerformance: {
      hasData: hasAssessmentData,
      avgPitchAccuracy: avgPitch,
      avgRhythmScore: avgRhythm,
      avgSwaraAccuracy: avgSwara,
      latestOverall: hasAssessmentData ? Number(assessments[0]?.overall_score || 0) : null,
      latestFeedback: hasAssessmentData ? String(assessments[0]?.ai_feedback || "") : null,
      assessmentsCount: assessments.length,
    },
    learningPath: pathData
      ? {
          hasPath: true,
          currentLevel: pathData.current_level,
          learningMode: pathData.learning_mode,
          targetGoal: pathData.target_goal,
          strengths: pathData.strengths || [],
          weakAreas: pathData.weak_areas || [],
          aiRecommendation: pathData.ai_recommendation,
        }
      : {
          hasPath: false,
        },
  };
}

