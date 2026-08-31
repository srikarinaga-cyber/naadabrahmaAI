"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
}

type QuizLevel = "beginner" | "intermediate" | "advanced";

export function ExamPanel() {
  const [level, setLevel] = useState<QuizLevel>("beginner");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    correct: number;
    total: number;
  } | null>(null);

  const loadQuiz = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      const res = await fetch(`/api/quiz?level=${level}&count=5`);
      if (res.status === 401) {
        setQuestions([]);
        return;
      }
      const json = await res.json();
      setQuestions(json.data?.questions ?? []);
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  async function handleSubmit() {
    if (questions.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: questions.map((q) => ({
            questionId: q.id,
            answer: answers[q.id] ?? "",
          })),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const levels: { id: QuizLevel; label: string }[] = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-serif text-lg font-bold text-[#800020]">Exam & Quiz Hub</h4>
        <p className="text-xs text-gray-500 mt-1">
          Test your Carnatic music knowledge with syllabus-aligned multiple choice questions.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {levels.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              level === l.id
                ? "bg-[#800020] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#D4AF37]/50"
            }`}
          >
            {l.label}
          </button>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={loadQuiz}
          disabled={loading}
          className="ml-auto border-[#D4AF37]/40 text-[#800020]"
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : "New Quiz"}
        </Button>
      </div>

      {result && (
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#FAF6F0] p-5 flex items-center gap-4">
          <CheckCircle2 className="size-8 text-[#800020] shrink-0" />
          <div>
            <p className="font-serif text-xl font-bold text-[#800020]">{result.score}%</p>
            <p className="text-xs text-gray-600">
              {result.correct} of {result.total} correct
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-12">Loading questions...</p>
      ) : questions.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
          <XCircle className="size-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            No quiz questions available for this level yet. Questions will appear once exam data
            is seeded in Supabase.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-2 mb-3">
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  Q{idx + 1}
                </Badge>
                <p className="text-sm font-semibold text-[#1A2228]">{q.questionText}</p>
              </div>
              <div className="space-y-2 ml-8">
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs cursor-pointer transition-colors ${
                      answers[q.id] === opt
                        ? "border-[#800020] bg-[#800020]/5 text-[#800020]"
                        : "border-gray-100 hover:border-[#D4AF37]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                      }
                      className="accent-[#800020]"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <Button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length < questions.length}
            className="w-full bg-[#800020] hover:bg-[#9e1b32]"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : "Submit Quiz"}
          </Button>
        </div>
      )}
    </div>
  );
}
