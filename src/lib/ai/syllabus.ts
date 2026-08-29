import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SyllabusChunkMatch {
  id: string;
  title: string | null;
  section: string | null;
  content: string;
  source_file: string;
  page_number: number;
  language: string;
  similarity?: number;
}

async function getDbClient() {
  const supabase = await createClient();
  if (supabase) return supabase;
  return createAdminClient();
}

/**
 * Generate embedding vector using OpenAI Embeddings API
 */
export async function getEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env["OPENAI_API_KEY"];
  if (!apiKey) {
    console.warn("OPENAI_API_KEY is not defined. Skipping embedding generation.");
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text.replace(/\n/g, " "),
        model: "text-embedding-3-small",
      }),
    });

    if (!response.ok) {
      console.error(`OpenAI Embeddings API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.data?.[0]?.embedding ?? null;
  } catch (error) {
    console.error("Failed to generate embedding:", error);
    return null;
  }
}

const STOP_WORDS = new Set([
  "gurinchi", "cheppu", "cheppava", "enti", "yenti", "lo", "kosam",
  "tell", "me", "about", "what", "is", "the", "of", "in", "explain", "who", "was", "write", "info", "a", "an", "and", "to", "for", "on", "with", "at", "by", "from"
]);

export function cleanSearchQuery(query: string): string {
  let cleaned = query.toLowerCase();
  
  // Replace common Telugu variations to match textbook English terms
  cleaned = cleaned.replace(/purandaradasu/g, "purandara dasa");
  cleaned = cleaned.replace(/ragam/g, "raga");
  cleaned = cleaned.replace(/talam/g, "tala");

  const words = cleaned
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(w => w && !STOP_WORDS.has(w));

  if (words.length === 0) {
    return query.trim();
  }

  return words.slice(0, 3).join(" ");
}

/**
 * Search the syllabus_knowledge table using semantic vector similarity or text fallback
 */
export async function searchSyllabus(
  query: string,
  limit = 10
): Promise<SyllabusChunkMatch[]> {
  const supabase = await getDbClient();
  if (!supabase) {
    console.error("Supabase client is unavailable.");
    return [];
  }

  const queryText = cleanSearchQuery(query);
  if (!queryText) return [];

  // 1. Try vector semantic search if embedding model is configured
  const embedding = await getEmbedding(queryText);
  if (embedding) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase.rpc("match_syllabus_knowledge" as any, {
        query_embedding: embedding,
        match_threshold: 0.2, // Cosine similarity threshold
        match_count: limit,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!error && data && (data as any).length > 0) {
        return data as SyllabusChunkMatch[];
      }

      if (error) {
        console.error("Vector search RPC failed:", error.message);
      }
    } catch (err) {
      console.error("Vector search error:", err);
    }
  }

  // 2. Fallback: Text-based partial matching (keyword-based ilike)
  console.log("Falling back to text-based search for query:", queryText);
  try {
    const words = queryText.replace(/[^\w\s]/g, " ").trim().split(/\s+/).slice(0, 4);
    const likePattern = `%${words.join("%")}%`;

    const { data, error } = await supabase
      .from("syllabus_knowledge")
      .select("id, title, section, content, source_file, page_number, language")
      .or(`content.ilike.${likePattern},title.ilike.${likePattern}`)
      .limit(limit);

    if (error) {
      console.error("Text search fallback failed:", error.message);
      return [];
    }

    console.log("Text search fallback results count:", data ? data.length : 0);
    return (data ?? []) as SyllabusChunkMatch[];
  } catch (err) {
    console.error("Fallback search exception:", err);
    return [];
  }
}
