import { NextRequest } from "next/server";
import {
  jsonOk,
  jsonError,
  jsonUnauthorized,
  jsonForbidden,
  jsonServerError,
} from "@/lib/api/response";
import { requireRole } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const auth = await requireRole(["teacher", "platform_admin"]);
    if (!auth) return jsonUnauthorized();

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const { data } = await supabase
      .from("teacher_classes")
      .select("*, class_enrollments(count)")
      .eq("teacher_id", auth.user.id)
      .order("created_at", { ascending: false });

    return jsonOk(data ?? []);
  } catch {
    return jsonServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireRole(["teacher", "platform_admin"]);
    if (!auth) return jsonForbidden();

    const body = await request.json();
    if (!body.name) return jsonError("Class name is required");

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const { data, error } = await supabase
      .from("teacher_classes")
      .insert({
        teacher_id: auth.user.id,
        name: body.name,
        description: body.description ?? null,
      })
      .select()
      .single();

    if (error) return jsonServerError("Failed to create class");
    return jsonOk(data);
  } catch {
    return jsonServerError();
  }
}
