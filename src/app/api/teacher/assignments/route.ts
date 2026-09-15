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
import { verifyTeacherStudentAccess } from "@/lib/db/teacher";

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
    const auth = await requireRole(["teacher", "platform_admin", "academy_admin"]);
    if (!auth) return jsonForbidden();

    const body = await request.json();
    const { title, description, dueDate, classId, studentId } = body;

    if (!title || !dueDate || (!classId && !studentId)) {
      return jsonError("title, dueDate, and either classId or studentId are required");
    }

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    let resolvedClassId = classId;

    if (studentId) {
      const isAuthorized = await verifyTeacherStudentAccess(auth.user.id, studentId);
      if (!isAuthorized) {
        return jsonForbidden("Unauthorized: You can only assign practice to your enrolled students.");
      }

      // Find first classId linking teacher to student
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: enrollment } = await (supabase.from("class_enrollments" as any) as any)
        .select("class_id, teacher_classes!inner(teacher_id)")
        .eq("student_id", studentId)
        .eq("teacher_classes.teacher_id", auth.user.id)
        .maybeSingle();

      resolvedClassId = enrollment?.class_id;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cls } = await (supabase.from("teacher_classes" as any) as any)
      .select("teacher_id")
      .eq("id", resolvedClassId)
      .single();

    if (!cls && auth.profile.role !== "platform_admin") {
      return jsonForbidden("You can only create assignments for your own classes");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("assignments" as any) as any)
      .insert({
        class_id: resolvedClassId,
        title,
        description: description ?? null,
        due_date: dueDate,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting assignment:", error);
      return jsonServerError("Failed to create assignment");
    }

    return jsonOk(data);
  } catch (err) {
    console.error("Teacher assignment POST error:", err);
    return jsonServerError();
  }
}
