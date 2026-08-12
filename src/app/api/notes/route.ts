import { NextRequest } from "next/server";
import {
  jsonOk,
  jsonError,
  jsonUnauthorized,
  jsonServerError,
} from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";
import { mapNote } from "@/lib/mappers";

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const { data } = await supabase
      .from("ai_notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return jsonOk((data ?? []).map(mapNote));
  } catch {
    return jsonServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const body = await request.json();
    if (!body.title || !body.content) {
      return jsonError("title and content are required");
    }

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const { data, error } = await supabase
      .from("ai_notes")
      .insert({
        user_id: user.id,
        title: body.title,
        content: body.content,
        source_raga_id: body.sourceRagaId ?? null,
        source_kriti_id: body.sourceKritiId ?? null,
      })
      .select()
      .single();

    if (error) return jsonServerError("Failed to save note");
    return jsonOk(mapNote(data as Record<string, unknown>));
  } catch {
    return jsonServerError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return jsonError("Note id is required");

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    await supabase.from("ai_notes").delete().eq("id", id).eq("user_id", user.id);

    return jsonOk({ deleted: true });
  } catch {
    return jsonServerError();
  }
}
