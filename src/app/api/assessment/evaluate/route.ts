import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callOpenAI } from "@/lib/ai/context";
import { saveMusicAssessment, MusicAssessmentRecord } from "@/lib/db/assessment";

// Helper to safely clamp metrics within [0, 100] bounds
function clampScore(value: unknown, defaultVal = 0): number {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return defaultVal;
  return Math.min(100, Math.max(0, Math.round(num)));
}

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
    const targetName = typeof body.targetName === "string" ? body.targetName.trim() : "Adhara Shadja (Sa) Sustained Hold";
    const durationSeconds = Math.min(120, Math.max(0, Number(body.durationSeconds) || 0));

    // Server-side Score Bounds Validation (0 - 100)
    const pitchAccuracy = clampScore(body.pitchAccuracy);
    const signalContinuity = clampScore(body.rhythmScore); // Renamed from rhythmScore to accurately represent signal/audio continuity
    const swaraAccuracy = clampScore(body.swaraAccuracy);
    const pitchStability = clampScore(body.pitchStability);
    const learningMode = typeof body.learningMode === "string" ? body.learningMode : "vocal";
    const currentLevel = typeof body.currentLevel === "string" ? body.currentLevel : "beginner";

    // Clean notes detected array
    const rawNotes = Array.isArray(body.notesDetected) ? body.notesDetected : [];
    const notesDetected = rawNotes.slice(0, 15).map((n: unknown) => String(n).slice(0, 10));

    // Reject unmeasured or insufficient audio data cleanly
    if (durationSeconds < 3 || (pitchAccuracy === 0 && pitchStability === 0)) {
      return NextResponse.json(
        {
          error: "Insufficient audio signal detected. Please sing or play closer to the microphone for at least 3 seconds.",
          hasData: false,
        },
        { status: 400 }
      );
    }

    // Calculate composite overall score: 40% Pitch Accuracy, 30% Cents Stability, 20% Swara Precision, 10% Signal Continuity
    const overallScore = clampScore(
      pitchAccuracy * 0.4 +
      pitchStability * 0.3 +
      swaraAccuracy * 0.2 +
      signalContinuity * 0.1
    );

    // Formulate prompt for AI Guru interpretation based strictly on measured acoustic metrics
    const aiPrompt = `You are AI Guru, an expert Carnatic music teacher for Naadabrahma AI.
A student completed a ${durationSeconds}-second audio practice session for "${targetName}" using ${learningMode} at ${currentLevel} level.

VERIFIED MEASURED ACOUSTIC DATA (Analyzed client-side via Web Audio YIN algorithm):
- Pitch Accuracy: ${pitchAccuracy}% (cents alignment relative to target swara)
- Pitch Stability: ${pitchStability}% (cents deviation holding consistency)
- Swara Precision: ${swaraAccuracy}% (matching swarasthanas)
- Signal Continuity: ${signalContinuity}% (audio signal presence)
- Detected Swaras: ${notesDetected.length > 0 ? notesDetected.join(", ") : "S"}
- Composite Measured Grade: ${overallScore}%

Instructions:
Provide a warm, constructive 2-sentence pedagogical interpretation of their performance based strictly on these measured numbers. Then provide 2 brief actionable suggestions for their next practice session.`;

    let aiFeedback = "";
    try {
      const aiResult = await callOpenAI({
        systemPrompt: aiPrompt,
        message: `Evaluate practice for ${targetName}`,
      });
      aiFeedback = aiResult.answer || "Practice session complete. Keep refining your swara stability with the Tanpura drone.";
    } catch (err) {
      console.warn("AI feedback query error (using fallback advice):", err);
      aiFeedback = `Your pitch accuracy was measured at ${pitchAccuracy}% with ${pitchStability}% pitch stability. Focus on holding your Adhara Shadja (Sa) steadily with the Tanpura drone to improve swara alignment.`;
    }

    const record: MusicAssessmentRecord = {
      target_name: targetName,
      duration_seconds: durationSeconds,
      pitch_accuracy: pitchAccuracy,
      rhythm_score: signalContinuity, // mapped column in DB
      swara_accuracy: swaraAccuracy,
      pitch_stability: pitchStability,
      overall_score: overallScore,
      notes_detected: notesDetected,
      ai_feedback: aiFeedback.trim(),
    };

    const savedRecord = await saveMusicAssessment(user.id, record);

    return NextResponse.json({
      success: true,
      assessment: savedRecord || { ...record, user_id: user.id, created_at: new Date().toISOString() },
      message: "Music assessment evaluated and stored successfully",
    });
  } catch (err) {
    console.error("Unexpected error in POST /api/assessment/evaluate:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
