import { NextRequest } from "next/server";
import {
  jsonOk,
  jsonError,
  jsonUnauthorized,
  jsonServerError,
} from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";
import { mapExamQuestion, quizLevelToExamLevel, type QuizLevel } from "@/lib/mappers";
import { recordProgress } from "@/lib/db/progress";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const level = (request.nextUrl.searchParams.get("level") ?? "beginner") as QuizLevel;
    const count = parseInt(request.nextUrl.searchParams.get("count") ?? "5", 10);
    const examLevel = quizLevelToExamLevel(level);

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const { data, error } = await supabase
      .from("exam_questions")
      .select("id, type, level, question_text, options, raga_id, composer_id, kriti_id, created_at")
      .eq("level", examLevel)
      .eq("type", "mcq")
      .limit(count);

    if (error) return jsonServerError("Failed to load quiz questions");

    const questions = (data ?? []).map((q) => mapExamQuestion(q as Record<string, unknown>, false));
    return jsonOk({ questions, level });
  } catch {
    return jsonServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const body = await request.json();
    const answers = body.answers as Array<{ questionId: string; answer: string }>;

    if (!answers?.length) return jsonError("Answers are required");

    const supabase = await createClient();
    if (!supabase) return jsonServerError("Database not configured");

    const questionIds = answers.map((a) => a.questionId);
    const { data: questions } = await supabase
      .from("exam_questions")
      .select("*")
      .in("id", questionIds);

    if (!questions?.length) return jsonError("Questions not found");

    let correct = 0;
    const results = answers.map((a) => {
      const q = questions.find((q) => q.id === a.questionId);
      if (!q) return { questionId: a.questionId, correct: false, explanation: "" };
      const isCorrect = q.correct_answer.toLowerCase() === a.answer.toLowerCase();
      if (isCorrect) correct++;
      return {
        questionId: a.questionId,
        correct: isCorrect,
        correctAnswer: q.correct_answer,
        explanation: q.explanation ?? "",
      };
    });

    const score = Math.round((correct / answers.length) * 100);

    await recordProgress({
      userId: user.id,
      entityType: "exam_question",
      entityId: questionIds[0],
      status: "completed",
      score,
    });

    return jsonOk({ score, correct, total: answers.length, results });
  } catch {
    return jsonServerError();
  }
}
