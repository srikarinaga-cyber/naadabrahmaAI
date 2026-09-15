"use client";

import { useState, useEffect, useRef } from "react";
import { usePitchTracker } from "@/hooks/usePitchTracker";
import { Mic, RefreshCw, Sparkles, AlertCircle, HelpCircle } from "lucide-react";

interface EvaluationResult {
  target_name: string;
  duration_seconds: number;
  pitch_accuracy: number;
  rhythm_score: number; // Stored in DB as rhythm_score, displayed in UI as Signal Continuity
  swara_accuracy: number;
  pitch_stability: number;
  overall_score: number;
  notes_detected: string[];
  ai_feedback: string;
}

interface AIAssessmentConsoleProps {
  onAssessmentComplete?: () => void;
}

export function AIAssessmentConsole({ onAssessmentComplete }: AIAssessmentConsoleProps) {
  const [assessmentState, setAssessmentState] = useState<"idle" | "listening" | "analyzing" | "complete">("idle");
  const [selectedTarget, setSelectedTarget] = useState<string>("Adhara Shadja (Sa) Sustained Hold");
  const [timerSeconds, setTimerSeconds] = useState<number>(15);
  const [countdown, setCountdown] = useState<number>(15);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { pitch, clarity, matchedSwara, startTracking, stopTracking } = usePitchTracker(130.81);

  // Audio measurement accumulators
  const recordedFramesRef = useRef<Array<{ pitch: number; centsOffset: number; swara: string }>>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Accumulate pitch data during listening state
  useEffect(() => {
    if (assessmentState === "listening" && pitch > 95 && clarity > 0.55 && matchedSwara) {
      recordedFramesRef.current.push({
        pitch,
        centsOffset: matchedSwara.centsOffset,
        swara: matchedSwara.swara,
      });
    }
  }, [assessmentState, pitch, clarity, matchedSwara]);

  const startAssessmentSession = async () => {
    setErrorMsg(null);
    setEvaluation(null);
    recordedFramesRef.current = [];
    setCountdown(timerSeconds);

    try {
      await startTracking();
      setAssessmentState("listening");

      // Start countdown timer
      timerIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            finishRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Failed to start mic for assessment:", err);
      setErrorMsg("Microphone permission denied or device unavailable.");
      setAssessmentState("idle");
    }
  };

  const finishRecording = async () => {
    stopTracking();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setAssessmentState("analyzing");

    const frames = recordedFramesRef.current;
    if (frames.length < 10) {
      setErrorMsg("No reliable pitch data detected during recording. Please sing or play closer to the microphone in a quiet room.");
      setAssessmentState("idle");
      return;
    }

    // 1. Measured Pitch Accuracy: % of valid frames within ±25 cents of target interval
    const accurateFrames = frames.filter((f) => Math.abs(f.centsOffset) <= 25).length;
    const measuredPitchAccuracy = Math.min(100, Math.max(0, Math.round((accurateFrames / frames.length) * 100)));

    // 2. Cents-Based Pitch Stability: Musically accurate cents deviation formula across octaves
    const meanCentsDev = Math.sqrt(
      frames.reduce((sum, f) => sum + f.centsOffset * f.centsOffset, 0) / frames.length
    );
    const measuredPitchStability = Math.min(100, Math.max(0, Math.round(100 - meanCentsDev * 2)));

    // 3. Swara Precision (Target Specific)
    let targetSwaras = ["S"];
    if (selectedTarget.includes("Panchama")) {
      targetSwaras = ["P"];
    } else if (selectedTarget.includes("Mayamalavagowla")) {
      targetSwaras = ["S", "R1", "G3", "M1", "P", "D1", "N3", "S'"];
    }

    const matchedTargetFrames = frames.filter((f) => targetSwaras.includes(f.swara)).length;
    const measuredSwaraAccuracy = Math.min(100, Math.max(0, Math.round((matchedTargetFrames / frames.length) * 100)));

    // 4. Signal Continuity (Audio presence percentage during recording window)
    const expectedFrameCount = timerSeconds * 12; // ~12 pitch analysis frames per second
    const measuredSignalContinuity = Math.min(100, Math.max(0, Math.round((frames.length / expectedFrameCount) * 100)));

    const detectedNotes = Array.from(new Set(frames.map((f) => f.swara)));

    try {
      const res = await fetch("/api/assessment/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetName: selectedTarget,
          durationSeconds: timerSeconds,
          pitchAccuracy: measuredPitchAccuracy,
          rhythmScore: measuredSignalContinuity, // Renamed to Signal Continuity
          swaraAccuracy: measuredSwaraAccuracy,
          pitchStability: measuredPitchStability,
          notesDetected: detectedNotes,
          learningMode: "vocal",
          currentLevel: "beginner",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to process assessment");
      }

      setEvaluation(json.assessment);
      setAssessmentState("complete");

      if (onAssessmentComplete) {
        onAssessmentComplete();
      }
    } catch (err) {
      console.error("Assessment evaluation error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to generate assessment results.");
      setAssessmentState("idle");
    }
  };

  const cancelSession = () => {
    stopTracking();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setAssessmentState("idle");
  };

  const targetsList = [
    "Adhara Shadja (Sa) Sustained Hold",
    "Mayamalavagowla Arohana Scale (S R1 G3 M1 P D1 N3 S')",
    "Panchama (Pa) Swara Stability Test",
    "Custom Vocal / Instrument Pitch Matching",
  ];

  return (
    <div className="rounded-2xl border border-[#d4af37]/40 bg-gradient-to-br from-[#1b1206] via-[#110c04] to-[#080502] p-6 text-amber-50 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/40 pb-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
            <Sparkles className="size-3" /> Live Audio Assessment
          </span>
          <h3 className="text-xl font-bold text-amber-100 tracking-wide mt-1.5">
            AI Music Assessment Engine
          </h3>
          <p className="text-xs text-amber-300/60 mt-0.5">
            Real acoustic pitch tracking analyzed by Web Audio YIN algorithm & AI Guru feedback
          </p>
        </div>

        {assessmentState === "complete" && (
          <button
            onClick={() => setAssessmentState("idle")}
            className="px-3.5 py-1.5 rounded-xl border border-amber-800/50 bg-black/40 text-xs font-semibold text-amber-300 hover:border-[#d4af37] hover:text-amber-100 transition flex items-center gap-1.5"
          >
            <RefreshCw className="size-3.5" /> Test Another Exercise
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-200 flex items-start gap-2.5">
          <AlertCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Assessment Notice</span>
            {errorMsg}
          </div>
        </div>
      )}

      {/* ── State 1: IDLE / CONFIGURATION ── */}
      {assessmentState === "idle" && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-200/90 mb-2">
              Select Practice Assessment Target
            </label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full rounded-xl border border-amber-900/50 bg-black/60 px-4 py-3 text-sm text-amber-100 focus:border-[#d4af37] focus:outline-none"
            >
              {targetsList.map((tgt, idx) => (
                <option key={idx} value={tgt} className="bg-[#120b04] text-amber-100">
                  {tgt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-200/90 mb-2">
              Recording Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[10, 15, 30].map((sec) => (
                <button
                  type="button"
                  key={sec}
                  onClick={() => setTimerSeconds(sec)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                    timerSeconds === sec
                      ? "border-[#d4af37] bg-[#d4af37]/20 text-amber-100"
                      : "border-amber-900/40 bg-black/40 text-amber-300/60 hover:border-amber-700"
                  }`}
                >
                  ⏱ {sec} Seconds
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={startAssessmentSession}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-700 text-black font-bold text-sm shadow-xl hover:brightness-110 transition flex items-center gap-2"
            >
              <Mic className="size-4" /> Start Live Assessment →
            </button>
          </div>
        </div>
      )}

      {/* ── State 2: RECORDING / LISTENING ── */}
      {assessmentState === "listening" && (
        <div className="space-y-6 text-center py-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-red-600/20 border-2 border-red-500 animate-ping absolute" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-xl relative">
              <Mic className="size-8" />
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-400 animate-pulse block">
              ● Listening to Microphone Audio
            </span>
            <h4 className="text-lg font-bold text-amber-100 mt-1">
              Target: {selectedTarget}
            </h4>
            <div className="text-4xl font-extrabold font-mono text-[#d4af37] mt-3">
              00:{countdown < 10 ? `0${countdown}` : countdown}
            </div>
          </div>

          {/* Live pitch feedback box */}
          <div className="max-w-md mx-auto rounded-xl border border-amber-900/50 bg-black/60 p-4 text-xs">
            {pitch > 95 ? (
              <div className="flex items-center justify-between text-amber-200">
                <span>Detected Pitch: <strong className="font-mono text-[#d4af37]">{Math.round(pitch)} Hz</strong></span>
                <span>Swara: <strong className="font-mono text-emerald-400">{matchedSwara?.swara || "S"}</strong></span>
                <span>Cents: <strong className="font-mono">{matchedSwara?.centsOffset || 0}</strong></span>
              </div>
            ) : (
              <span className="text-amber-300/50 italic">Sing or play notes steadily into mic...</span>
            )}
          </div>

          <button
            onClick={cancelSession}
            className="px-4 py-2 rounded-xl border border-red-900/50 bg-red-950/40 text-xs font-semibold text-red-300 hover:bg-red-900/40 transition"
          >
            Cancel Session
          </button>
        </div>
      )}

      {/* ── State 3: ANALYZING ── */}
      {assessmentState === "analyzing" && (
        <div className="py-12 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
          <h4 className="text-base font-bold text-amber-100">Analyzing Acoustic Frequencies & Generating AI Feedback...</h4>
          <p className="text-xs text-amber-300/60">Evaluating cents deviation, swarasthanas, and pitch stability</p>
        </div>
      )}

      {/* ── State 4: COMPLETE / SCORECARD ── */}
      {assessmentState === "complete" && evaluation && (
        <div className="space-y-6">
          {/* Measured Scores Grid */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300/70 block mb-3">
              1. Measured Acoustic Performance (Web Audio YIN Algorithm)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-amber-900/40 bg-black/50 p-4 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-300/60 block">
                  Pitch Accuracy
                </span>
                <span className="text-2xl font-extrabold font-mono text-amber-100 mt-1 block">
                  {evaluation.pitch_accuracy}%
                </span>
                <span className="text-[10px] text-amber-400/60">±25 Cents Range</span>
              </div>

              <div className="rounded-xl border border-amber-900/40 bg-black/50 p-4 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-300/60 block">
                  Pitch Stability
                </span>
                <span className="text-2xl font-extrabold font-mono text-amber-100 mt-1 block">
                  {evaluation.pitch_stability}%
                </span>
                <span className="text-[10px] text-amber-400/60">Cents Std Deviation</span>
              </div>

              <div className="rounded-xl border border-amber-900/40 bg-black/50 p-4 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-300/60 block">
                  Swara Precision
                </span>
                <span className="text-2xl font-extrabold font-mono text-amber-100 mt-1 block">
                  {evaluation.swara_accuracy}%
                </span>
                <span className="text-[10px] text-amber-400/60">Target Match</span>
              </div>

              <div className="rounded-xl border border-amber-900/40 bg-black/50 p-4 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-300/60 block">
                  Signal Continuity
                </span>
                <span className="text-2xl font-extrabold font-mono text-amber-100 mt-1 block">
                  {evaluation.rhythm_score}%
                </span>
                <span className="text-[10px] text-amber-400/60">Audio Presence</span>
              </div>
            </div>
          </div>

          {/* Detected Swara Notes */}
          {evaluation.notes_detected && evaluation.notes_detected.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-amber-200/80 bg-black/40 p-3 rounded-xl border border-amber-900/30">
              <span className="font-bold text-amber-400 shrink-0">Detected Swaras:</span>
              <div className="flex flex-wrap gap-1">
                {evaluation.notes_detected.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800/40"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Guru Feedback Section */}
          <div className="rounded-xl border border-[#d4af37]/40 bg-[#1e1408]/90 p-5 text-amber-100 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#d4af37]" />
              <span className="font-bold text-[#d4af37] uppercase tracking-wider text-[11px]">
                2. AI Guru Pedagogical Feedback
              </span>
            </div>
            <p className="text-amber-100/90 text-sm">{evaluation.ai_feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}
