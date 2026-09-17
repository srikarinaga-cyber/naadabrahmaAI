export const dynamic = "force-dynamic";

import { getMelakartas } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/static";
import { MELAKARTA_SEED_DATA } from "@/lib/data/melakartas-seed";
import { MultilingualKnowledgeHubView } from "@/components/knowledge-hub/multilingual-hub-view";

export default async function KnowledgeHubPage() {
  const configured = isSupabaseConfigured();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let melakartas: any[] = [];

  if (configured) {
    const { data } = await getMelakartas(1, 72);
    melakartas = data;
  }

  if (!melakartas || melakartas.length === 0) {
    melakartas = MELAKARTA_SEED_DATA;
  }

  return <MultilingualKnowledgeHubView melakartas={melakartas} />;
}
