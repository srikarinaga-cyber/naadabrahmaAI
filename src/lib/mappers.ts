import type {
  Melakarta,
  Janya,
  Composer,
  Tala,
  Kriti,
  ExamQuestion,
  UserProgress,
  StudyStreak,
  UserBookmark,
  AIStudyNote,
  Profile,
  PracticeSession,
} from "@/types/music";

export function mapMelakarta(row: Record<string, unknown>): Melakarta {
  return {
    id: row.id as string,
    number: row.number as number,
    name: row.name as string,
    chakra: row.chakra as string,
    arohana: row.arohana as string,
    avarohana: row.avarohana as string,
    swaraFrequencies: row.swara_frequencies as Record<string, number> | undefined,
    description: (row.description as string) ?? undefined,
    metadata: (row.metadata as Record<string, unknown>) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export function mapJanya(row: Record<string, unknown>): Janya {
  return {
    id: row.id as string,
    name: row.name as string,
    parentMelakartaId: row.parent_melakarta_id as string,
    arohana: row.arohana as string,
    avarohana: row.avarohana as string,
    vakra: row.vakra as boolean,
    bhashanga: row.bhashanga as boolean,
    upanga: row.upanga as boolean,
    description: (row.description as string) ?? undefined,
    metadata: (row.metadata as Record<string, unknown>) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export function mapComposer(row: Record<string, unknown>): Composer {
  return {
    id: row.id as string,
    name: row.name as string,
    era: (row.era as string) ?? undefined,
    biography: (row.biography as string) ?? undefined,
    mudra: (row.mudra as string) ?? undefined,
    metadata: (row.metadata as Record<string, unknown>) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export function mapTala(row: Record<string, unknown>): Tala {
  return {
    id: row.id as string,
    name: row.name as string,
    beats: row.beats as number,
    angas: row.angas as string,
    description: (row.description as string) ?? undefined,
    metadata: (row.metadata as Record<string, unknown>) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export function mapKriti(row: Record<string, unknown>): Kriti {
  return {
    id: row.id as string,
    title: row.title as string,
    composerId: (row.composer_id as string) ?? undefined,
    melakartaId: (row.melakarta_id as string) ?? undefined,
    janyaId: (row.janya_id as string) ?? undefined,
    talaId: (row.tala_id as string) ?? undefined,
    notation: (row.notation as string) ?? undefined,
    lyrics: (row.lyrics as string) ?? undefined,
    translation: (row.translation as string) ?? undefined,
    audioReferenceUrl: (row.audio_reference_url as string) ?? undefined,
    difficultyLevel: row.difficulty_level as Kriti["difficultyLevel"],
    metadata: (row.metadata as Record<string, unknown>) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export function mapExamQuestion(row: Record<string, unknown>, includeAnswer = false): ExamQuestion {
  const q: ExamQuestion = {
    id: row.id as string,
    type: row.type as ExamQuestion["type"],
    level: row.level as ExamQuestion["level"],
    questionText: row.question_text as string,
    options: row.options as string[] | undefined,
    correctAnswer: includeAnswer ? (row.correct_answer as string) : "",
    explanation: includeAnswer ? ((row.explanation as string) ?? undefined) : undefined,
    ragaId: (row.raga_id as string) ?? undefined,
    composerId: (row.composer_id as string) ?? undefined,
    kritiId: (row.kriti_id as string) ?? undefined,
    createdAt: row.created_at as string,
  };
  return q;
}

export function mapProgress(row: Record<string, unknown>): UserProgress {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    entityType: row.entity_type as UserProgress["entityType"],
    entityId: row.entity_id as string,
    status: row.status as UserProgress["status"],
    score: row.score != null ? Number(row.score) : undefined,
    lastStudiedAt: row.last_studied_at as string,
    createdAt: row.created_at as string,
  };
}

export function mapStreak(row: Record<string, unknown>): StudyStreak {
  return {
    userId: row.user_id as string,
    currentStreak: row.current_streak as number,
    longestStreak: row.longest_streak as number,
    lastActivityDate: row.last_activity_date as string,
    createdAt: row.created_at as string,
  };
}

export function mapBookmark(row: Record<string, unknown>): UserBookmark {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    entityType: row.entity_type as UserBookmark["entityType"],
    entityId: row.entity_id as string,
    createdAt: row.created_at as string,
  };
}

export function mapNote(row: Record<string, unknown>): AIStudyNote {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    content: row.content as string,
    sourceRagaId: (row.source_raga_id as string) ?? undefined,
    sourceKritiId: (row.source_kriti_id as string) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    name: row.name as string,
    role: row.role as Profile["role"],
    institutionId: (row.institution_id as string) ?? undefined,
    avatarUrl: (row.avatar_url as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function mapPracticeSession(row: Record<string, unknown>): PracticeSession {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    shruti: row.shruti as string,
    instrument: row.instrument as string,
    durationSeconds: row.duration_seconds as number,
    pitchSummary: (row.pitch_summary as Record<string, unknown>) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export type QuizLevel = "beginner" | "intermediate" | "advanced" | "mock_exam";

export function quizLevelToExamLevel(level: QuizLevel): string {
  const map: Record<QuizLevel, string> = {
    beginner: "lower",
    intermediate: "higher",
    advanced: "diploma",
    mock_exam: "degree",
  };
  return map[level];
}
