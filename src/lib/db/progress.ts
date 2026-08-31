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
