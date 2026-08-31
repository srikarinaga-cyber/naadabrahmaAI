import { createStaticClient, isSupabaseConfigured } from "@/lib/supabase/static";
import { getLandingFallbackData } from "@/lib/data/landing-fallback";
import { normalizePlatformFeatures } from "@/lib/data/module-routes";
import type { LandingPageData } from "@/types/database";

export async function getLandingPageData(): Promise<LandingPageData> {
  const fallback = getLandingFallbackData();

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  const supabase = createStaticClient();
  if (!supabase) {
    return fallback;
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

  const features =
    featuresResult.data && featuresResult.data.length > 0
      ? normalizePlatformFeatures(featuresResult.data)
      : fallback.features;

  return {
    features,
    statistics:
      statisticsResult.data && statisticsResult.data.length > 0
        ? statisticsResult.data
        : fallback.statistics,
    testimonials:
      testimonialsResult.data && testimonialsResult.data.length > 0
        ? testimonialsResult.data
        : fallback.testimonials,
    featuredRaga: ragaResult.data ?? null,
  };
}
