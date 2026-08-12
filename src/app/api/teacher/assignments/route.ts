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

export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(["teacher", "platform_admin"]);
    if (!auth) return jsonUnauthorized();

    const classId = request.nextUrl.searchParams.get("classId");

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    let query = supabase
      .from("assignments")
      .select("*, teacher_classes(name, teacher_id)")
      .order("due_date", { ascending: true });

    if (classId) {
      query = query.eq("class_id", classId);
    }

    const { data } = await query;

    const filtered = (data ?? []).filter((a) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tc = (a as any).teacher_classes as { teacher_id: string } | null;
      return tc?.teacher_id === auth.user.id || auth.profile.role === "platform_admin";
    });

    return jsonOk(filtered);
  } catch {
    return jsonServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireRole(["teacher", "platform_admin"]);
    if (!auth) return jsonForbidden();

    const body = await request.json();
    if (!body.classId || !body.title || !body.dueDate) {
      return jsonError("classId, title, and dueDate are required");
    }

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const { data: cls } = await supabase
      .from("teacher_classes")
      .select("teacher_id")
      .eq("id", body.classId)
      .single();

    if (!cls || (cls.teacher_id !== auth.user.id && auth.profile.role !== "platform_admin")) {
      return jsonForbidden("You can only create assignments for your own classes");
    }

    const { data, error } = await supabase
      .from("assignments")
      .insert({
        class_id: body.classId,
        title: body.title,
        description: body.description ?? null,
        pdf_attachment_url: body.pdfAttachmentUrl ?? null,
        due_date: body.dueDate,
      })
      .select()
      .single();

    if (error) return jsonServerError("Failed to create assignment");
    return jsonOk(data);
  } catch {
    return jsonServerError();
  }
}
