import type {
  LandingPageData,
  PlatformFeature,
  PlatformStatistic,
  Testimonial,
} from "@/types/database";
import { MODULE_ROUTES } from "@/lib/data/module-routes";

const FALLBACK_FEATURES: Omit<PlatformFeature, "id" | "created_at">[] = [
  {
    title: "Knowledge Hub",
    description:
      "Explore 72 Melakarta Ragas, Janya derivatives, Talas, Composers, Kritis, Swaras, Gamakas, and comprehensive theory.",
    icon: "book-open",
    tag: "Catalog",
    href: MODULE_ROUTES["Knowledge Hub"],
    sort_order: 1,
    is_active: true,
  },
  {
    title: "AI Guru",
    description:
      "Ask musical doubts, compare ragas, generate quizzes and notes, and obtain personalized practice schedules powered by GPT.",
    icon: "sparkles",
    tag: "AI Assistant",
    href: MODULE_ROUTES["AI Guru"],
    sort_order: 2,
    is_active: true,
  },
  {
    title: "Notes Generation",
    description:
      "Browse official syllabus PDFs, view ingested topics, and generate AI study notes from your exam syllabus.",
    icon: "notebook-pen",
    tag: "Notes & PDFs",
    href: MODULE_ROUTES["Notes Generation"],
    sort_order: 3,
    is_active: true,
  },
  {
    title: "Multi-Instrument Support",
    description:
      "Built for Vocal, Veena, Violin, Flute, Mridangam, and Keyboard — not limited to vocal music alone.",
    icon: "music",
    tag: "Instruments",
    href: MODULE_ROUTES["Multi-Instrument Support"],
    sort_order: 4,
    is_active: true,
  },
  {
    title: "Student Dashboard",
    description:
      "Track progress, bookmarks, study streaks, achievements, practice history, and AI-generated notes.",
    icon: "graduation-cap",
    tag: "Students",
    href: MODULE_ROUTES["Student Dashboard"],
    sort_order: 5,
    is_active: true,
  },
  {
    title: "Teacher Portal",
    description:
      "Manage students, assignments, question papers, upload notes, and view class analytics.",
    icon: "users",
    tag: "Teachers",
    href: MODULE_ROUTES["Teacher Portal"],
    sort_order: 6,
    is_active: true,
  },
  {
    title: "Academy & Admin",
    description:
      "Institution management, content curation, reports, and platform-wide analytics for academies and administrators.",
    icon: "shield",
    tag: "Enterprise",
    href: MODULE_ROUTES["Academy & Admin"],
    sort_order: 7,
    is_active: true,
  },
];

const FALLBACK_STATISTICS: Omit<PlatformStatistic, "id" | "created_at">[] = [
  { label: "Melakarta Ragas", value: "72", suffix: "", icon: "layers", sort_order: 1, is_active: true },
  { label: "Melakarta Ragas", value: "72", suffix: "", icon: "git-branch", sort_order: 2, is_active: true },
  { label: "Talas Catalogued", value: "35", suffix: "+", icon: "timer", sort_order: 3, is_active: true },
  { label: "Composers", value: "200", suffix: "+", icon: "user", sort_order: 4, is_active: true },
  { label: "Instruments Supported", value: "6", suffix: "", icon: "music-2", sort_order: 5, is_active: true },
  { label: "AI-Powered Learning", value: "24/7", suffix: "", icon: "bot", sort_order: 6, is_active: true },
];

const FALLBACK_TESTIMONIALS: Omit<Testimonial, "id" | "created_at">[] = [
  {
    quote:
      "Naadabrahma AI transformed how I prepare for my diploma exam. The raga comparison tool and AI Guru explain concepts better than any textbook.",
    author_name: "Priya Ramanathan",
    author_role: "Diploma Student",
    author_institution: "Kalakshetra Foundation",
    instrument: "Vocal",
    rating: 5,
    sort_order: 1,
    is_active: true,
  },
  {
    quote:
      "As a veena teacher managing 40 students, the analytics dashboard and assignment system save me hours every week.",
    author_name: "Dr. Lakshmi Venkataraman",
    author_role: "Senior Faculty",
    author_institution: "Chennai Music Academy",
    instrument: "Veena",
    rating: 5,
    sort_order: 2,
    is_active: true,
  },
  {
    quote:
      "Our academy adopted Naadabrahma for all branches. The Knowledge Hub is the most comprehensive Carnatic database I have seen in digital form.",
    author_name: "Raghav Iyer",
    author_role: "Academy Director",
    author_institution: "Naada Kala Kendra",
    instrument: "Multi-instrument",
    rating: 5,
    sort_order: 3,
    is_active: true,
  },
];

function withSyntheticIds<T extends { sort_order: number }>(
  rows: T[],
  prefix: string
): (T & { id: string; created_at: string })[] {
  return rows.map((row, index) => ({
    ...row,
    id: `fallback-${prefix}-${index}`,
    created_at: new Date(0).toISOString(),
  }));
}

export function getLandingFallbackData(): LandingPageData {
  return {
    features: withSyntheticIds(FALLBACK_FEATURES, "feature"),
    statistics: withSyntheticIds(FALLBACK_STATISTICS, "stat"),
    testimonials: withSyntheticIds(FALLBACK_TESTIMONIALS, "testimonial"),
    featuredRaga: null,
  };
}
