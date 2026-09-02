import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { instrumentGuidance, type Instrument } from "@/lib/ai/instruments";
import { searchSyllabus, cleanSearchQuery } from "@/lib/ai/syllabus";

export type SupportedLanguage = "en" | "te" | "hi" | "ta" | "kn" | "ml";

export interface MusicContext {
  melakartas: Array<{ number: number; name: string; arohana: string; avarohana: string; description?: string }>;
  janyas: Array<{ name: string; arohana: string; avarohana: string; parent?: string }>;
  composers: Array<{ name: string; era?: string; mudra?: string }>;
  talas: Array<{ name: string; beats: number; angas: string }>;
  kritis: Array<{ title: string; composer?: string; raga?: string }>;
  syllabusChunks: Array<{ title: string | null; content: string; pageNumber: number }>;
}

async function getDbClient() {
  const supabase = await createClient();
  if (supabase) return supabase;
  return createAdminClient();
}

export async function buildMusicContext(params: {
  query: string;
  ragaId?: string;
}): Promise<MusicContext> {
  const supabase = await getDbClient();
  if (!supabase) {
    return { melakartas: [], janyas: [], composers: [], talas: [], kritis: [], syllabusChunks: [] };
  }

  const cleanedQuery = cleanSearchQuery(params.query);
  const likePattern = `%${cleanedQuery.split(/\s+/).join("%")}%`;

  let melakartasRes: { data: any[] | null } = { data: [] };
  let janyasRes: { data: any[] | null } = { data: [] };
  let composersRes: { data: any[] | null } = { data: [] };
  let talasRes: { data: any[] | null } = { data: [] };
  let kritisRes: { data: any[] | null } = { data: [] };

  try {
    const [mRes, jRes, cRes, tRes, kRes] = await Promise.all([
      supabase
        .from("melakartas")
        .select("number, name, arohana, avarohana, description")
        .or(`name.ilike.${likePattern},description.ilike.${likePattern}`)
        .limit(5),
      supabase
        .from("janyas")
        .select("name, arohana, avarohana, description, melakartas(name)")
        .or(`name.ilike.${likePattern},description.ilike.${likePattern}`)
        .limit(5),
      supabase
        .from("composers")
        .select("name, era, mudra")
        .ilike("name", likePattern)
        .limit(3),
      supabase
        .from("talas")
        .select("name, beats, angas")
        .ilike("name", likePattern)
        .limit(3),
      supabase
        .from("kritis")
        .select("title, composers(name), janyas(name), melakartas(name)")
        .ilike("title", likePattern)
        .limit(3),
    ]);

    melakartasRes = mRes;
    janyasRes = jRes;
    composersRes = cRes;
    talasRes = tRes;
    kritisRes = kRes;

    if (params.ragaId) {
      const { data: specificMel } = await supabase
        .from("melakartas")
        .select("number, name, arohana, avarohana, description")
        .eq("id", params.ragaId)
        .maybeSingle();

      if (specificMel) {
        melakartasRes.data = [specificMel, ...(melakartasRes.data ?? [])];
      } else {
        const { data: specificJanya } = await supabase
          .from("janyas")
          .select("name, arohana, avarohana, description, melakartas(name)")
          .eq("id", params.ragaId)
          .maybeSingle();
        if (specificJanya) {
          janyasRes.data = [specificJanya, ...(janyasRes.data ?? [])];
        }
      }
    }
  } catch (dbError) {
    console.error("Database context query error (falling back to knowledge base):", dbError);
  }

  const syllabusRes = await searchSyllabus(params.query, 10);

  return {
    melakartas: (melakartasRes.data ?? []).map((m) => ({
      number: m.number,
      name: m.name,
      arohana: m.arohana,
      avarohana: m.avarohana,
      description: m.description ?? undefined,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    janyas: (janyasRes.data ?? []).map((j: any) => {
      const parent = j.melakartas as { name: string } | null;
      return {
        name: j.name,
        arohana: j.arohana,
        avarohana: j.avarohana,
        parent: parent?.name,
      };
    }),
    composers: (composersRes.data ?? []).map((c) => ({
      name: c.name,
      era: c.era ?? undefined,
      mudra: c.mudra ?? undefined,
    })),
    talas: (talasRes.data ?? []).map((t) => ({
      name: t.name,
      beats: t.beats,
      angas: t.angas,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kritis: (kritisRes.data ?? []).map((k: any) => {
      const composer = k.composers as { name: string } | null;
      const janya = k.janyas as { name: string } | null;
      const mel = k.melakartas as { name: string } | null;
      return {
        title: k.title,
        composer: composer?.name,
        raga: janya?.name ?? mel?.name,
      };
    }),
    syllabusChunks: syllabusRes.map((c) => ({
      title: c.title,
      content: c.content,
      pageNumber: c.page_number,
    })),
  };
}

export function buildSystemPrompt(params: {
  context: MusicContext;
  instrument?: Instrument;
  language?: SupportedLanguage;
}): string {
  const { context, instrument, language = "en" } = params;

  let prompt = `You are AI Guru, the premier multilingual Carnatic musicologist and assistant for Naadabrahma AI.

PRIMARY RULE ON KNOWLEDGE COMPLETENESS:
If the local database context or syllabus context below is incomplete or lacks details for the requested raga, tala, composer, kriti, or theory topic, YOU MUST DRAW FROM YOUR COMPREHENSIVE ONLINE CARNATIC MUSICOLOGY REPOSITORY to provide full, authentic, accurate, and complete information.
NEVER say "insufficient information in database", "no records found", or leave empty spaces. Always present complete Arohana, Avarohana, Swarasthanas, composer history, mudra, and classical compositions.

OFFICIAL SYLLABUS CONTEXT:
${JSON.stringify(context.syllabusChunks, null, 2)}

DATABASE CONTEXT (RAGAS, TALAS, COMPOSERS, KRITIS):
${JSON.stringify(
  {
    melakartas: context.melakartas,
    janyas: context.janyas,
    composers: context.composers,
    talas: context.talas,
    kritis: context.kritis,
  },
  null,
  2
)}
`;

  if (instrument) {
    prompt += `\nINSTRUMENT CONTEXT: ${instrument}\n${instrumentGuidance(instrument)}\n`;
  }

  // Explicit Multilingual Response Instructions
  if (language === "te") {
    prompt += `\nLANGUAGE REQUIREMENT: The user selected TELUGU (తెలుగు). Respond fluently in Telugu script (తెలుగు) with standard Carnatic music terms.\n`;
  } else if (language === "hi") {
    prompt += `\nLANGUAGE REQUIREMENT: The user selected HINDI (हिन्दी). Respond fluently in Hindi script (हिन्दी) with standard Carnatic music terms.\n`;
  } else if (language === "ta") {
    prompt += `\nLANGUAGE REQUIREMENT: The user selected TAMIL (தமிழ்). Respond fluently in Tamil script (தமிழ்) with standard Carnatic music terms.\n`;
  } else if (language === "kn") {
    prompt += `\nLANGUAGE REQUIREMENT: The user selected KANNADA (ಕನ್ನಡ). Respond fluently in Kannada script (ಕನ್ನಡ) with standard Carnatic music terms.\n`;
  } else if (language === "ml") {
    prompt += `\nLANGUAGE REQUIREMENT: The user selected MALAYALAM (മലയാളം). Respond fluently in Malayalam script (മലയാളം) with standard Carnatic music terms.\n`;
  } else {
    prompt += `\nLANGUAGE REQUIREMENT: Respond in clear English.\n`;
  }

  prompt += `\nFor raga-specific questions, structure your response with: answer, raga details, arohanam, avarohanam, famous kritis, important points, and practice tips.
Do NOT claim real-time pitch analysis or instrument performance evaluation capabilities.`;

  return prompt;
}

export interface AiChatResponse {
  answer: string;
  raga?: string;
  melakartaNumber?: number;
  arohanam?: string;
  avarohanam?: string;
  swaras?: string[];
  famousKritis?: string[];
  importantPoints?: string[];
  practiceTips?: string[];
}

function generateFallbackStudyNotes(userQuestion: string): AiChatResponse {
  const query = userQuestion.toLowerCase();
  
  if (query.includes("katapayadi") || query.includes("72 melakarta")) {
    return {
      answer: `## 72 Melakartas Katapayadi System (కటపయాది సూత్రం)\n\n### 1. Theoretical Definition\nThe Katapayadi System is an ancient Sanskrit mnemonic cipher assigned by Venkatamakhin to sequence the 72 Janaka (parent) Melakarta ragas into 12 Chakras (6 ragas per Chakra).\n\n### 2. Numerical Mapping Rules\n- Consonants are mapped to digits 1 to 9, and 0.\n- Taking the first two syllables of a Melakarta name and reversing their numeric order reveals its exact Melakarta Index Number (1-72).\n\n### 3. Example Calculations\n- **Kanakangi (#1):** Ka=1, Na=0 -> Reversed = 01 -> Melakarta #1\n- **Ratnangi (#2):** Ra=2, Ta=0 -> Reversed = 02 -> Melakarta #2\n- **Mayamalavagowla (#15):** Ma=5, Ya=1 -> Reversed = 15 -> Melakarta #15\n- **Dheerasankarabharanam (#29):** Dhee=9, Ra=2 -> Reversed = 29 -> Melakarta #29`,
      raga: "72 Melakarta Scheme",
      arohanam: "S R G M P D N S'",
      avarohanam: "S' N D P M G R S",
      famousKritis: ["Kanakambari (Muthuswami Dikshitar)", "Vatapi Ganapatim (Hamsadhwani)"],
      practiceTips: ["Memorize the 12 Chakra names: Indu, Netra, Agni, Veda, Bana, Ritu, Rishi, Vasu, Brahma, Disi, Rudra, Aditya."],
    };
  }

  if (query.includes("tala") || query.includes("suladi")) {
    return {
      answer: `## 35 Suladi Sapta Talas Matrix System\n\n### 1. Theoretical Structure\nThe 35 Suladi Sapta Tala system forms the rhythmic backbone of Carnatic music. It is constructed by multiplying the 7 Principal Tala Types across the 5 Jathis (rhythmic varieties).\n\n### 2. The 7 Principal Tala Types\n1. **Dhruva Tala** (Laghu + Dhrutam + Laghu + Laghu)\n2. **Matya Tala** (Laghu + Dhrutam + Laghu)\n3. **Rupaka Tala** (Dhrutam + Laghu)\n4. **Jhampa Tala** (Laghu + Anudhrutam + Dhrutam)\n5. **Triputa Tala** (Laghu + Dhrutam + Dhrutam)\n6. **Ata Tala** (Laghu + Laghu + Dhrutam + Dhrutam)\n7. **Eka Tala** (Laghu)\n\n### 3. The 5 Jathis\n- Tisra (3 beats), Chatusra (4 beats), Khanda (5 beats), Misra (7 beats), Sankeerna (9 beats).`,
      raga: "Rhythm Matrix",
      arohanam: "I O O",
      avarohanam: "O O I",
      famousKritis: ["35 Suladi Sapta Talas Beat Practice"],
      practiceTips: ["Count Laghu finger taps steadily followed by Dhrutam wave/clap."],
    };
  }

  return {
    answer: `## Carnatic Music Study Notes: ${userQuestion}\n\n### 1. Overview & Musicological Definition\nThis topic covers essential Carnatic music theory principles regarding scale structures, Swarasthana pitch intervals, and classical performance traditions.\n\n### 2. Core Principles\n- **Adhara Shadja (S):** Fundamental tonic pitch reference.\n- **Swarasthanas:** 12 microtonal positions (S, R1-R3, G1-G3, M1-M2, P, D1-D3, N1-N3).\n- **Janaka & Janya Relationship:** Parent Melakarta scales possess all 7 swaras in regular order, while Janya scales derive through omission or zigzag phrasing.\n\n### 3. Classical Compositions & Practice Guidance\n- Practice slowly in Vilambita Kala (slow tempo) with Tanpura Droid drone pitch reference.`,
    raga: "Carnatic Theory",
    arohanam: "S R G M P D N S'",
    avarohanam: "S' N D P M G R S",
    famousKritis: ["Pancharatna Kritis (Saint Tyagaraja)", "Navavarna Kritis (Muthuswami Dikshitar)"],
    practiceTips: ["Maintain steady Adhara Shadja tuning during vocal/instrumental practice."],
  };
}

export async function callGemini(params: {
  systemPrompt: string;
  message: string;
}): Promise<AiChatResponse> {
  const rawApiKey = process.env["GEMINI_API_KEY"];
  const apiKey = rawApiKey ? rawApiKey.trim().replace(/^['"=\s]+|['"\s]+$/g, '') : null;

  if (!apiKey) {
    return generateFallbackStudyNotes(params.message);
  }

  const promptText = `${params.systemPrompt}\n\nUser Question: ${params.message}\n\nRespond in JSON format: { "answer": "...", "raga": "...", "melakartaNumber": null, "arohanam": "...", "avarohanam": "...", "swaras": [], "famousKritis": [], "importantPoints": [], "practiceTips": [] }. Use only fields relevant to the question.`;

  // Official Google Generative AI REST API model names using v1beta
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp", "gemini-1.5-flash-8b"];

  for (const model of models) {
    console.log(`AI Guru: Attempting connection using model: ${model}`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4,
          },
        }),
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        continue;
      }

      try {
        return JSON.parse(content) as AiChatResponse;
      } catch {
        return { answer: content };
      }
    } catch {
      continue;
    }
  }

  // Guaranteed fallback study notes - NEVER return raw API JSON error text to user!
  return generateFallbackStudyNotes(params.message);
}

export async function callOpenAI(params: {
  systemPrompt: string;
  message: string;
}): Promise<AiChatResponse> {
  if (process.env["GEMINI_API_KEY"]) {
    return callGemini(params);
  }

  const rawApiKey = process.env["OPENAI_API_KEY"];
  const apiKey = rawApiKey ? rawApiKey.trim().replace(/^['"=\s]+|['"\s]+$/g, '') : null;
  
  if (!apiKey) {
    return generateFallbackStudyNotes(params.message);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: params.systemPrompt },
          {
            role: "user",
            content: `${params.message}\n\nRespond in JSON format: { "answer": "...", "raga": "...", "melakartaNumber": null, "arohanam": "...", "avarohanam": "...", "swaras": [], "famousKritis": [], "importantPoints": [], "practiceTips": [] }. Use only fields relevant to the question.`,
          },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return generateFallbackStudyNotes(params.message);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return generateFallbackStudyNotes(params.message);
    }

    try {
      return JSON.parse(content) as AiChatResponse;
    } catch {
      return { answer: content };
    }
  } catch (e) {
    return generateFallbackStudyNotes(params.message);
  }
}
