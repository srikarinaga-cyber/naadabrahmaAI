import { createClient } from "@/lib/supabase/server";
import { mapMelakarta, mapJanya, mapComposer, mapTala, mapKriti } from "@/lib/mappers";

export async function searchMusicCatalog(query: string, limit = 20) {
  const supabase = await createClient();
  if (!supabase || !query.trim()) {
    return { melakartas: [], janyas: [], composers: [], talas: [], kritis: [] };
  }

  const pattern = `%${query.trim()}%`;

  const [melakartas, janyas, composers, talas, kritis] = await Promise.all([
    supabase
      .from("melakartas")
      .select("*")
      .or(`name.ilike.${pattern},chakra.ilike.${pattern}`)
      .order("number")
      .limit(limit),
    supabase
      .from("janyas")
      .select("*, melakartas(number, name)")
      .ilike("name", pattern)
      .limit(limit),
    supabase.from("composers").select("*").ilike("name", pattern).limit(limit),
    supabase.from("talas").select("*").ilike("name", pattern).limit(limit),
    supabase
      .from("kritis")
      .select("*, composers(name), janyas(name), melakartas(name)")
      .ilike("title", pattern)
      .limit(limit),
  ]);

  return {
    melakartas: (melakartas.data ?? []).map(mapMelakarta),
    janyas: (janyas.data ?? []).map(mapJanya),
    composers: (composers.data ?? []).map(mapComposer),
    talas: (talas.data ?? []).map(mapTala),
    kritis: (kritis.data ?? []).map(mapKriti),
  };
}

export async function getMelakartas(page = 1, pageSize = 24) {
  const supabase = await createClient();
  if (!supabase) return { data: [], total: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await supabase
    .from("melakartas")
    .select("*", { count: "exact" })
    .order("number")
    .range(from, to);

  return { data: (data ?? []).map(mapMelakarta), total: count ?? 0 };
}

export async function getMelakartaByNumber(number: number) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("melakartas")
    .select("*")
    .eq("number", number)
    .single();

  if (!data) return null;

  const { data: janyas } = await supabase
    .from("janyas")
    .select("*")
    .eq("parent_melakarta_id", data.id);

  const { data: kritis } = await supabase
    .from("kritis")
    .select("*, composers(name), talas(name)")
    .eq("melakarta_id", data.id);

  return {
    melakarta: mapMelakarta(data),
    janyas: (janyas ?? []).map(mapJanya),
    kritis: (kritis ?? []).map(mapKriti),
  };
}

export async function getJanyaById(id: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("janyas")
    .select("*, melakartas(*)")
    .eq("id", id)
    .single();

  if (!data) return null;

  const { data: kritis } = await supabase
    .from("kritis")
    .select("*, composers(name), talas(name)")
    .eq("janya_id", id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parent = (data as any).melakartas as Record<string, unknown> | null;

  return {
    janya: mapJanya(data),
    parentMelakarta: parent ? mapMelakarta(parent) : null,
    kritis: (kritis ?? []).map(mapKriti),
  };
}

export async function getTalas() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase.from("talas").select("*").order("name");
  return (data ?? []).map(mapTala);
}

export async function getComposers() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase.from("composers").select("*").order("name");
  return (data ?? []).map(mapComposer);
}

export async function getKritis(page = 1, pageSize = 20) {
  const supabase = await createClient();
  if (!supabase) return { data: [], total: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await supabase
    .from("kritis")
    .select("*, composers(name), janyas(name), melakartas(name), talas(name)", {
      count: "exact",
    })
    .order("title")
    .range(from, to);

  return { data: (data ?? []).map(mapKriti), total: count ?? 0 };
}
