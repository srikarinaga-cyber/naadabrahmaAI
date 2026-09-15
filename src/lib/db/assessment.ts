import { createClient } from "@/lib/supabase/server";

export interface MusicAssessmentRecord {
  id?: string;
  user_id?: string;
  target_name: string;
  duration_seconds: number;
  pitch_accuracy: number;
  rhythm_score: number;
  swara_accuracy: number;
  pitch_stability: number;
  overall_score: number;
  notes_detected: string[];
  ai_feedback: string;
  created_at?: string;
}

export async function saveMusicAssessment(userId: string, record: MusicAssessmentRecord) {
  const supabase = await createClient();
  if (!supabase) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("music_assessments" as any) as any)
    .insert({
      user_id: userId,
      target_name: record.target_name,
      duration_seconds: record.duration_seconds,
      pitch_accuracy: record.pitch_accuracy,
      rhythm_score: record.rhythm_score,
      swara_accuracy: record.swara_accuracy,
      pitch_stability: record.pitch_stability,
      overall_score: record.overall_score,
      notes_detected: record.notes_detected,
      ai_feedback: record.ai_feedback,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving music assessment record:", error);
    return null;
  }

  return data;
}

export async function getUserMusicAssessments(userId: string, limit = 10) {
  const supabase = await createClient();
  if (!supabase) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("music_assessments" as any) as any)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching user music assessments:", error);
    return [];
  }

  return data || [];
}
