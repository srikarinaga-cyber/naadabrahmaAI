import { NextRequest } from "next/server";
import {
  jsonOk,
  jsonError,
  jsonUnauthorized,
  jsonServerError,
} from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";
import { mapBookmark } from "@/lib/mappers";

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const { data } = await supabase
      .from("user_bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return jsonOk((data ?? []).map(mapBookmark));
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

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const { data, error } = await supabase
      .from("user_bookmarks")
      .upsert(
        {
          user_id: user.id,
          entity_type: body.entityType,
          entity_id: body.entityId,
        },
        { onConflict: "user_id,entity_type,entity_id" }
      )
      .select()
      .single();

    if (error) return jsonServerError("Failed to save bookmark");
    return jsonOk(mapBookmark(data as Record<string, unknown>));
  } catch {
    return jsonServerError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return jsonError("Bookmark id is required");

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    await supabase.from("user_bookmarks").delete().eq("id", id).eq("user_id", user.id);

    return jsonOk({ deleted: true });
  } catch {
    return jsonServerError();
  }
}
