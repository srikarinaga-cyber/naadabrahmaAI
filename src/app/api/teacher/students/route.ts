import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api/auth";
import { getTeacherEnrolledStudents } from "@/lib/db/teacher";

export async function GET() {
  try {
    const auth = await requireRole(["teacher", "platform_admin", "academy_admin"]);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized teacher access" }, { status: 401 });
    }

    const students = await getTeacherEnrolledStudents(auth.user.id);

    return NextResponse.json({
      students,
      count: students.length,
    });
  } catch (err) {
    console.error("Error in GET /api/teacher/students:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
