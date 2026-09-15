export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type LearningMode = "vocal" | "veena" | "violin" | "flute" | "mridangam";

export interface LearningPathInput {
  currentLevel: SkillLevel;
  learningMode: LearningMode;
  targetGoal: string;
  preferredLanguage?: string;
  weakAreas?: string[];
  strengths?: string[];
}

export interface PracticeActivity {
  id: string;
  title: string;
  type: "pitch" | "varisai" | "raga" | "tala" | "quiz" | "listening" | "exercise";
  duration_minutes: number;
  reason: string;
  target: string;
  completed?: boolean;
}

export interface DailyPracticePlan {
  date: string;
  total_minutes: number;
  activities: PracticeActivity[];
}

export interface UserHistoryData {
  completedLessonsCount?: number;
  avgPitchAccuracy?: number;
  avgRhythmScore?: number;
  quizScoreAvg?: number;
  streakCount?: number;
}

export interface LearningPath {
  user_id?: string;
  current_level: SkillLevel;
  learning_mode: LearningMode;
  target_goal: string;
  daily_plan: DailyPracticePlan;
  strengths: string[];
  weak_areas: string[];
  ai_recommendation: string;
  created_at?: string;
  updated_at?: string;
}

export function generateLearningPath(
  input: LearningPathInput,
  history: UserHistoryData = {}
): LearningPath {
  const { currentLevel, learningMode, targetGoal } = input;
  const today = new Date().toISOString().split("T")[0];

  const strengths: string[] = [];
  const weakAreas: string[] = [];
  const activities: PracticeActivity[] = [];

  // Analyze instrument/vocal specifics
  const isPercussion = learningMode === "mridangam";
  const isInstrument = learningMode === "veena" || learningMode === "violin" || learningMode === "flute";
  const isVocal = learningMode === "vocal";

  // 1. Establish Strengths & Weak Areas based on level, goals, and history
  if (currentLevel === "beginner") {
    strengths.push("Enthusiasm for Classical Foundations", "Basic Rhythm Sense");
    if (targetGoal.toLowerCase().includes("pitch")) {
      weakAreas.push("Shruti Alignment (Pitch Stability)", "Lower Octave Swara Precision");
    } else if (targetGoal.toLowerCase().includes("tala")) {
      weakAreas.push("Tala Consistency (Beat Keeping)", "Speed Transitions (Kala Control)");
    } else if (targetGoal.toLowerCase().includes("raga")) {
      weakAreas.push("Arohana/Avarohana Memorization", "Swara Identification");
    } else {
      weakAreas.push("Shruti Stability", "Tala Continuity");
    }
  } else if (currentLevel === "intermediate") {
    strengths.push("Solid Swara Foundation", "Arohana / Avarohana Awareness");
    if (history.avgPitchAccuracy && history.avgPitchAccuracy > 80) {
      strengths.push("Pitch Precision (>80%)");
    } else {
      weakAreas.push("Gamaka & Swara Transitions");
    }
    weakAreas.push("Complex Tala Maintenance", "Raga Structure Exploration");
  } else {
    // Advanced
    strengths.push("Multi-Octave Range", "Raga Lakshana Fluency", "Complex Tala Mastery");
    weakAreas.push("Advanced Manodharma (Improvisation)", "Rare Melakarta Raga Nuances");
  }

  // 2. Generate Deterministic Daily Practice Activities tailored to Mode & Goal
  if (currentLevel === "beginner") {
    if (isVocal || isInstrument) {
      activities.push({
        id: "act-1",
        title: "Adhara Shadja Shruti Alignment",
        type: "pitch",
        duration_minutes: 10,
        reason: "Anchor your base pitch (Sa) with the Tanpura drone",
        target: "Maintain pitch accuracy above 85% for 30 consecutive seconds",
        completed: false,
      });
      activities.push({
        id: "act-2",
        title: "Sarali Varisai & Jantai Varisai",
        type: "varisai",
        duration_minutes: 10,
        reason: "Develop swara fingering / vocal flexibility in Mayamalavagowla",
        target: "Practice 1st & 2nd speeds smoothly",
        completed: false,
      });
    } else if (isPercussion) {
      activities.push({
        id: "act-1",
        title: "Tha-Dhi-Thom-Nam Basic Solkattu",
        type: "exercise",
        duration_minutes: 15,
        reason: "Master fundamental stroke clarity on Mridangam",
        target: "Equal pressure and crisp tone on Chapu and Dheem",
        completed: false,
      });
    }

    // Raga/Tala specific practice
    if (targetGoal.toLowerCase().includes("raga") || !isPercussion) {
      activities.push({
        id: "act-3",
        title: "Mayamalavagowla Scale Exploration",
        type: "raga",
        duration_minutes: 15,
        reason: "Explore 15th Melakarta parent raga scale notes",
        target: "Sing/Play Arohana & Avarohana accurately",
        completed: false,
      });
    }

    activities.push({
        id: "act-4",
        title: "Adi Tala 8-Beat Count & Rhythm Sync",
        type: "tala",
        duration_minutes: 10,
        reason: "Build internal pulse for 1 Laghu (4 counts) + 2 Dhrutams (4 counts)",
        target: "Keep steady tempo alongside Tabla/Tala drone",
        completed: false,
      });

    activities.push({
      id: "act-5",
      title: "Carnatic Theory & Melakarta Quiz",
      type: "quiz",
      duration_minutes: 5,
      reason: "Test knowledge of swarasthanas and foundational concepts",
      target: "Score at least 80% on 5 quick questions",
      completed: false,
    });
  } else if (currentLevel === "intermediate") {
    activities.push({
      id: "act-1",
      title: "Detailed Shruti & Gamaka Practice",
      type: "pitch",
      duration_minutes: 15,
      reason: "Refine swara oscillations in Shankarabharanam or Kalyani",
      target: "Achieve pitch clarity above 88%",
      completed: false,
    });
    activities.push({
      id: "act-2",
      title: "Alankaram & Geetham Practice",
      type: "varisai",
      duration_minutes: 15,
      reason: "Execute 7 Tala Alankarams across multiple speeds",
      target: "Flawless tempo transition from 1st to 3rd speed",
      completed: false,
    });
    activities.push({
      id: "act-3",
      title: "Melakarta Raga Comparative Study",
      type: "raga",
      duration_minutes: 15,
      reason: "Compare Shuddha Madhyama (M1) vs Prati Madhyama (M2) ragas",
      target: "Identify key swara differences",
      completed: false,
    });
    activities.push({
      id: "act-4",
      title: "Rupaka & Misra Chapu Tala Practice",
      type: "tala",
      duration_minutes: 10,
      reason: "Master asymmetric beat cycles (3 beats & 7 beats)",
      target: "Maintain steady gait without rushing",
      completed: false,
    });
    activities.push({
      id: "act-5",
      title: "Interactive Swara Quiz",
      type: "quiz",
      duration_minutes: 5,
      reason: "Verify raga identification skills",
      target: "Correctly identify 4 out of 5 ragas from swara patterns",
      completed: false,
    });
  } else {
    // Advanced
    activities.push({
      id: "act-1",
      title: "Advanced Manodharma & Swarakalpana",
      type: "exercise",
      duration_minutes: 20,
      reason: "Develop spontaneous swara patterns in major ragas",
      target: "Arrive on Korvai smoothly on the Arudi beat",
      completed: false,
    });
    activities.push({
      id: "act-2",
      title: "Complex Janya Ragas Analysis",
      type: "raga",
      duration_minutes: 20,
      reason: "Analyze Vakra (crooked) and Varja (omitted) scales",
      target: "Master unique gamakas of Abhogi, Mohanam, and Hindolam",
      completed: false,
    });
    activities.push({
      id: "act-3",
      title: "Khanda & Sankeerna Chapu Tala Masterclass",
      type: "tala",
      duration_minutes: 15,
      reason: "Master 5-beat and 9-beat rhythm structures",
      target: "Flawless execution with Tanpura/Tabla sync",
      completed: false,
    });
    activities.push({
      id: "act-4",
      title: "Advanced Musicology Diagnostic",
      type: "quiz",
      duration_minutes: 5,
      reason: "Evaluate deep knowledge of Trinity compositions & Melakartas",
      target: "Score 100%",
      completed: false,
    });
  }

  const totalMinutes = activities.reduce((sum, act) => sum + act.duration_minutes, 0);

  // 3. Formulate Contextual AI Guru Recommendation
  const aiRecommendation = `Based on your ${currentLevel} level in ${learningMode} and target goal to "${targetGoal}", spend ${totalMinutes} minutes today focusing on ${activities[0].title.toLowerCase()} and ${activities[1]?.title.toLowerCase() || "theory"}. Consistent daily practice with the Tanpura drone will accelerate your pitch and rhythm accuracy.`;

  return {
    current_level: currentLevel,
    learning_mode: learningMode,
    target_goal: targetGoal,
    daily_plan: {
      date: today,
      total_minutes: totalMinutes,
      activities,
    },
    strengths,
    weak_areas: weakAreas,
    ai_recommendation: aiRecommendation,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
