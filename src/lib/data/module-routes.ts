import type { PlatformFeature } from "@/types/database";

/** Canonical routes per platform module — overrides stale DB href values. */
export const MODULE_ROUTES: Record<string, string> = {
  "Knowledge Hub": "/knowledge-hub",
  "AI Guru": "/ai-guru",
  "Multi-Instrument Support": "/instruments",
  "Student Dashboard": "/student",
  "Teacher Portal": "/teacher",
  "Academy & Admin": "/admin",
  "Notes Generation": "/notes",
};

export function resolveModuleHref(title: string, href: string | null | undefined): string {
  const canonical = MODULE_ROUTES[title];
  if (canonical) return canonical;

  const cleaned = (href ?? "").trim();
  if (!cleaned || cleaned === "#" || cleaned === "/ai-guru") {
    return "/";
  }
  return cleaned;
}

export function normalizePlatformFeatures(
  features: PlatformFeature[]
): PlatformFeature[] {
  return features.map((feature) => ({
    ...feature,
    href: resolveModuleHref(feature.title, feature.href),
  }));
}
