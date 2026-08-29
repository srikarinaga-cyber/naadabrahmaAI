import { createStaticClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { LandingPageData } from "@/types/database";

export async function getLandingPageData(): Promise<LandingPageData> {
  if (!isSupabaseConfigured()) {
    return {
      features: [],
      statistics: [],
      testimonials: [],
      featuredRaga: null,
    };
  }

  const supabase = createStaticClient();
  if (!supabase) {
    return {
      features: [],
      statistics: [],
      testimonials: [],
      featuredRaga: null,
    };
  }

  const [featuresResult, statisticsResult, testimonialsResult, ragaResult] =
    await Promise.all([
      supabase
        .from("platform_features")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("platform_statistics")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("melakartas")
        .select("*")
        .eq("number", 29)
        .maybeSingle(),
    ]);

  if (featuresResult.error) {
    console.error("[landing] features fetch failed:", featuresResult.error.message);
  }
  if (statisticsResult.error) {
    console.error("[landing] statistics fetch failed:", statisticsResult.error.message);
  }
  if (testimonialsResult.error) {
    console.error("[landing] testimonials fetch failed:", testimonialsResult.error.message);
  }
  if (ragaResult.error) {
    console.error("[landing] featured raga fetch failed:", ragaResult.error.message);
  }

  return {
    features: featuresResult.data ?? [],
    statistics: statisticsResult.data ?? [],
    testimonials: testimonialsResult.data ?? [],
    featuredRaga: ragaResult.data ?? null,
  };
}
