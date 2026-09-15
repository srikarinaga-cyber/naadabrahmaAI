import { createClient } from "@/lib/supabase/server";

export interface EnrolledStudentSummary {
  id: string;
  name: string;
  avatar_url?: string;
  className: string;
  currentLevel: string;
  targetGoal: string;
  streak: number;
  overallProgress: number;
  latestPitchAccuracy: number | null;
  latestSignalContinuity: number | null;
  latestAssessmentScore: number | null;
  lastAssessmentDate: string | null;
  weakAreas: string[];
}

export async function verifyTeacherStudentAccess(teacherId: string, studentId: string): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) return false;

  // Check if student is in any class owned by teacher
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: enrollment } = await (supabase.from("class_enrollments" as any) as any)
    .select("id, teacher_classes!inner(teacher_id)")
    .eq("student_id", studentId)
    .eq("teacher_classes.teacher_id", teacherId)
    .maybeSingle();

  if (enrollment) return true;

  // Check if teacher has platform_admin role
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase.from("profiles" as any) as any)
    .select("role")
    .eq("id", teacherId)
    .single();

  return profile?.role === "platform_admin" || profile?.role === "academy_admin";
}

export async function getTeacherEnrolledStudents(teacherId: string): Promise<EnrolledStudentSummary[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  // 1. Fetch teacher classes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: classes } = await (supabase.from("teacher_classes" as any) as any)
    .select("id, name")
    .eq("teacher_id", teacherId);

  const classList = (classes as any[]) ?? [];
  if (classList.length === 0) return [];

  const classIds = classList.map((c: any) => c.id);

  // 2. Fetch enrollments with student profiles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: enrollments } = await (supabase.from("class_enrollments" as any) as any)
    .select("class_id, student_id, profiles(id, name, avatar_url)")
    .in("class_id", classIds);

  const enrollmentList = (enrollments as any[]) ?? [];
  if (enrollmentList.length === 0) return [];

  const classMap = new Map(classList.map((c: any) => [c.id, c.name]));

  // 3. For each student, query real metrics
  const summaries: EnrolledStudentSummary[] = await Promise.all(
    enrollmentList.map(async (e: any) => {
      const student = e.profiles as { id: string; name: string; avatar_url?: string };
      const studentId = student?.id || e.student_id;
      const className = classMap.get(e.class_id) || "Carnatic Class";

      // Fetch latest metrics from student_learning_paths, study_streaks, and music_assessments
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [pathRes, streakRes, assessmentRes, progressRes] = await Promise.all([
        supabase.from("student_learning_paths" as any).select("*").eq("user_id", studentId).single(),
        supabase.from("study_streaks" as any).select("*").eq("user_id", studentId).single(),
        supabase.from("music_assessments" as any).select("*").eq("user_id", studentId).order("created_at", { ascending: false }).limit(1),
        supabase.from("user_progress" as any).select("*").eq("user_id", studentId),
      ]);

      const pathData = pathRes.data as any;
      const streakData = streakRes.data as any;
      const latestAssessment = (assessmentRes.data as any[])?.[0];
      const progressData = (progressRes.data as any[]) ?? [];
      const completedCount = progressData.filter((p: any) => p.status === "completed").length;

      const overall = progressData.length > 0
        ? Math.round((completedCount / progressData.length) * 100)
        : pathData ? 10 : 0;

      return {
        id: studentId,
        name: student?.name || "Student",
        avatar_url: student?.avatar_url,
        className,
        currentLevel: pathData?.current_level || "beginner",
        targetGoal: pathData?.target_goal || "Basics",
        streak: streakData?.current_streak || 0,
        overallProgress: overall,
        latestPitchAccuracy: latestAssessment ? Number(latestAssessment.pitch_accuracy) : null,
        latestSignalContinuity: latestAssessment ? Number(latestAssessment.rhythm_score) : null,
        latestAssessmentScore: latestAssessment ? Number(latestAssessment.overall_score) : null,
        lastAssessmentDate: latestAssessment ? latestAssessment.created_at : null,
        weakAreas: pathData?.weak_areas || [],
      };
    })
  );

  return summaries;
}
