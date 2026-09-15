import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateLearningPath, LearningPathInput, SkillLevel, LearningMode } from "@/lib/ai/learning-path";

// GET: Fetch current user's learning path
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database client unavailable" }, { status: 500 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pathData, error: dbError } = await (supabase.from("student_learning_paths" as any) as any)
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (dbError && dbError.code !== "PGRST116") {
      console.error("Database error fetching learning path:", dbError);
      return NextResponse.json({ error: "Failed to fetch learning path" }, { status: 500 });
    }

    if (!pathData) {
      return NextResponse.json({ learningPath: null, hasPath: false });
    }

    return NextResponse.json({ learningPath: pathData, hasPath: true });
  } catch (err) {
    console.error("Unexpected error in GET /api/learning-path:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Create or update current user's learning path
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database client unavailable" }, { status: 500 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { currentLevel, learningMode, targetGoal, preferredLanguage } = body;

    // Input Validation
    const validLevels: SkillLevel[] = ["beginner", "intermediate", "advanced"];
    const validModes: LearningMode[] = ["vocal", "veena", "violin", "flute", "mridangam"];

    if (!currentLevel || !validLevels.includes(currentLevel)) {
      return NextResponse.json({ error: "Invalid currentLevel parameter" }, { status: 400 });
    }

    if (!learningMode || !validModes.includes(learningMode)) {
      return NextResponse.json({ error: "Invalid learningMode parameter" }, { status: 400 });
    }

    if (!targetGoal || typeof targetGoal !== "string" || targetGoal.trim().length === 0) {
      return NextResponse.json({ error: "Invalid targetGoal parameter" }, { status: 400 });
    }

    // Fetch user progress history if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [progressRes, quizRes, streakRes] = await Promise.all([
      supabase.from("user_progress" as any).select("*").eq("user_id", user.id),
      supabase.from("quiz_attempts" as any).select("*").eq("user_id", user.id),
      supabase.from("study_streaks" as any).select("*").eq("user_id", user.id).single(),
    ]);

    const progress = (progressRes.data as any[]) ?? [];
    const quizAttempts = (quizRes.data as any[]) ?? [];

    const completedLessonsCount = progress.filter((p: any) => p.status === "completed").length;
    const quizScoreAvg =
      quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((acc: number, q: any) => acc + (q.score || 0), 0) / quizAttempts.length)
        : 0;

    const inputData: LearningPathInput = {
      currentLevel,
      learningMode,
      targetGoal: targetGoal.trim(),
      preferredLanguage,
    };

    const generatedPath = generateLearningPath(inputData, {
      completedLessonsCount,
      quizScoreAvg,
      streakCount: (streakRes.data as any)?.current_streak ?? 0,
    });

    // Upsert into Supabase student_learning_paths table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: savedPath, error: saveError } = await (supabase.from("student_learning_paths" as any) as any)
      .upsert(
        {
          user_id: user.id,
          current_level: generatedPath.current_level,
          learning_mode: generatedPath.learning_mode,
          target_goal: generatedPath.target_goal,
          daily_plan: generatedPath.daily_plan,
          strengths: generatedPath.strengths,
          weak_areas: generatedPath.weak_areas,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (saveError) {
      console.error("Error saving learning path:", saveError);
      // Fallback response with generated path in memory if DB table doesn't exist yet
      return NextResponse.json({
        learningPath: { ...generatedPath, user_id: user.id },
        isFallback: true,
        message: "Generated path successfully (in-memory mode)",
      });
    }

    return NextResponse.json({
      learningPath: savedPath,
      message: "Personalized learning path saved successfully",
    });
  } catch (err) {
    console.error("Unexpected error in POST /api/learning-path:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
