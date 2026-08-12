import { NextRequest } from "next/server";
import {
  jsonOk,
  jsonError,
  jsonUnauthorized,
  jsonServerError,
} from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";
import { mapProgress } from "@/lib/mappers";
import { getDashboardStats, recordProgress } from "@/lib/db/progress";

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const { data } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("last_studied_at", { ascending: false });

    const stats = await getDashboardStats(user.id);

    return jsonOk({
      progress: (data ?? []).map(mapProgress),
      stats,
    });
  } catch {
    return jsonServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const body = await request.json();
    if (!body.entityType || !body.entityId) {
      return jsonError("entityType and entityId are required");
    }

    const result = await recordProgress({
      userId: user.id,
      entityType: body.entityType,
      entityId: body.entityId,
      status: body.status ?? "completed",
      score: body.score,
    });

    if (!result) return jsonServerError("Failed to record progress");
    return jsonOk(mapProgress(result as Record<string, unknown>));
  } catch {
    return jsonServerError();
  }
}
