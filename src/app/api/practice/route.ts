import { NextRequest } from "next/server";
import {
  jsonOk,
  jsonError,
  jsonUnauthorized,
  jsonServerError,
} from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";
import { mapPracticeSession } from "@/lib/mappers";
import { updateStudyStreak } from "@/lib/db/progress";

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const { data } = await supabase
      .from("practice_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    return jsonOk((data ?? []).map(mapPracticeSession));
  } catch {
    return jsonServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const body = await request.json();

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const { data, error } = await supabase
      .from("practice_sessions")
      .insert({
        user_id: user.id,
        shruti: body.shruti ?? "C",
        instrument: body.instrument ?? "vocal",
        duration_seconds: body.durationSeconds ?? 0,
        pitch_summary: body.pitchSummary ?? null,
      })
      .select()
      .single();

    if (error) return jsonServerError("Failed to save practice session");

    await updateStudyStreak(user.id);

    return jsonOk(mapPracticeSession(data as Record<string, unknown>));
  } catch {
    return jsonServerError();
  }
}
