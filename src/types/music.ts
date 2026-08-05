export type UserRole = 'student' | 'teacher' | 'academy_admin' | 'platform_admin';

export type ExamLevel = 'lower' | 'higher' | 'diploma' | 'degree' | 'certificate';

export type QuestionType = 'mcq' | 'practical_pitch' | 'theory_short';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface Institution {
  id: string;
  name: string;
  address?: string;
  contactEmail?: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  institutionId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Melakarta {
  id: string;
  number: number;
  name: string;
  chakra: string;
  arohana: string;
  avarohana: string;
  swaraFrequencies?: Record<string, number>;
  description?: string;
  metadata?: Record<string, any>;
  embedding?: number[];
  createdAt: string;
}

export interface Janya {
  id: string;
  name: string;
  parentMelakartaId: string;
  arohana: string;
  avarohana: string;
  vakra: boolean;
  bhashanga: boolean;
  upanga: boolean;
  description?: string;
  metadata?: Record<string, any>;
  embedding?: number[];
  createdAt: string;
}

export interface Composer {
  id: string;
  name: string;
  era?: string;
  biography?: string;
  mudra?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Tala {
  id: string;
  name: string;
  beats: number;
  angas: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Kriti {
  id: string;
  title: string;
  composerId?: string;
  melakartaId?: string;
  janyaId?: string;
  notation?: string;
  lyrics?: string;
  translation?: string;
  audioReferenceUrl?: string;
  difficultyLevel: ExamLevel;
  metadata?: Record<string, any>;
  embedding?: number[];
  createdAt: string;
}

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  level: ExamLevel;
  questionText: string;
  options?: string[]; // Parsed from JSONB
  correctAnswer: string;
  explanation?: string;
  ragaId?: string;
  composerId?: string;
  kritiId?: string;
  embedding?: number[];
  createdAt: string;
}

export interface AIStudyNote {
  id: string;
  userId: string;
  title: string;
  content: string; // Markdown text
  sourceRagaId?: string;
  sourceKritiId?: string;
  embedding?: number[];
  createdAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  entityType: 'raga' | 'kriti' | 'exam_question' | 'lesson';
  entityId: string;
  status: ProgressStatus;
  score?: number;
  lastStudiedAt: string;
  createdAt: string;
}

export interface StudyStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  createdAt: string;
}

export interface UserBookmark {
  id: string;
  userId: string;
  entityType: 'raga_m' | 'raga_j' | 'composer' | 'kriti' | 'note';
  entityId: string;
  createdAt: string;
}
