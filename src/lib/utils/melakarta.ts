import type { MelakartaMetadata } from "@/types/database";

export function parseMelakartaMetadata(
  metadata: unknown
): MelakartaMetadata | null {
  if (!metadata || typeof metadata !== "object") return null;
  return metadata as MelakartaMetadata;
}
