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

export function generateFallbackStudyNotes(userQuestion: string, language: string = "en"): AiChatResponse {
  let cleanTopic = "Carnatic Music Theory";
  let explicitText = "";

  if (userQuestion.includes("TOPIC:")) {
    const afterTopic = userQuestion.split("TOPIC:")[1] || "";
    cleanTopic = afterTopic.split("\n")[0]?.trim() || "Carnatic Music Theory";
  } else if (!userQuestion.includes("EXACT SYLLABUS TEXT CONTEXT:")) {
    cleanTopic = userQuestion.trim();
  }

  if (userQuestion.includes("EXACT SYLLABUS TEXT CONTEXT:")) {
    explicitText = userQuestion.split("EXACT SYLLABUS TEXT CONTEXT:")[1]?.trim() || "";
  }

  // Strip duplicate prompt labels from explicit text
  explicitText = explicitText.replace(/^TOPIC:.*$/gm, "").trim();

  if (language === "te") {
    return {
      answer: `## కర్ణాటక సంగీత పాఠ్యాంశ నోట్స్: ${cleanTopic}\n\n### 1. సిద్ధాంత వివరణ & ముఖ్యాంశాలు\nఈ అంశం కర్ణాటక సంగీత సిద్ధాంతంలోని ప్రధాన నియమాలు, స్వరస్థానాల వర్గీకరణ మరియు తాళ అంగాల అమరికను వివరిస్తుంది.\n\n${explicitText ? `### 2. పాఠ్యాంశ వివరములు (Syllabus Text)\n${explicitText}\n\n` : ""}### 3. సాధనా నియమాలు & పరీక్షా ముఖ్యాంశాలు\n- **నాదం & శ్రుతి:** ఆధార షడ్జమంతో శ్రుతిని కలిపి సాధన చేయాలి.\n- **ద్వాదశ స్వరస్థానములు:** స, రి1, రి2, గ1, గ2, మ1, మ2, ప, ద1, ద2, ని1, ని2 స్థానాలను శ్రద్ధగా గుర్తుంచుకోవాలి.`,
      raga: cleanTopic,
      arohanam: "స రి గ మ ప ద ని స'",
      avarohanam: "స' ని ద ప మ గ రి స",
    };
  }

  if (language === "hi") {
    return {
      answer: `## कर्नाटक संगीत अध्ययन नोट्स: ${cleanTopic}\n\n### 1. सिद्धांत एवं परिचय\nयह विषय कर्नाटक संगीत पाठ्यक्रम के स्वरस्थानों, राग नियमों और ताल प्रणाली को स्पष्ट करता है।\n\n${explicitText ? `### 2. मुख्य पाठ्यक्रम पाठ्य सामग्री\n${explicitText}\n\n` : ""}### 3. अभ्यास निर्देश एवं परीक्षा के मुख्य बिंदु\n- तानपुरा श्रुति के साथ अभ्यास करें।\n- 12 स्वरस्थानों और ताल अंगों को समझें।`,
      raga: cleanTopic,
      arohanam: "सा री गा मा पा ढा नी सा'",
      avarohanam: "सा' नी ढा पा मा गा री सा",
    };
  }

  if (language === "ta") {
    return {
      answer: `## கர்நாடக இசை பாடக் குறிப்புகள்: ${cleanTopic}\n\n### 1. அறிமுகம் மற்றும் விதிகள்\nஇந்த பகுதி கர்நாடக இசையின் ஸ்வரஸ்தானங்கள் மற்றும் தாள அமைப்புகளை விளக்குகிறது.\n\n${explicitText ? `### 2. பாடப் பகுதி\n${explicitText}\n\n` : ""}### 3. பயிற்சி முறைகள்\n- ஸ்ருதி சுத்தமாக பாடிப் பழகவும்.`,
      raga: cleanTopic,
    };
  }

  if (language === "kn") {
    return {
      answer: `## ಕರ್ನಾಟಕ ಸಂಗೀತ ಅಧ್ಯಯನ ಟಿಪ್ಪಣಿಗಳು: ${cleanTopic}\n\n### 1. ಸಿದ್ಧಾಂತ ಪರಿಚಯ\nಈ ವಿಷಯವು ಕರ್ನಾಟಕ ಸಂಗೀತದ ಸ್ವರಸ್ಥಾನಗಳು ಮತ್ತು ತಾಳ ಪದ್ಧತಿಯನ್ನು ಒಳಗೊಂಡಿದೆ.\n\n${explicitText ? `### 2. ಮುಖ್ಯ ಪಠ್ಯ ವಿವರಣೆ\n${explicitText}\n\n` : ""}### 3. ಅಭ್ಯಾಸದ ಮಾರ್ಗದರ್ಶನ\n- ಶ್ರುತಿಬದ್ಧವಾಗಿ ಅಭ್ಯಾಸ ಮಾಡಿ.`,
      raga: cleanTopic,
    };
  }

  if (language === "ml") {
    return {
      answer: `## കർണാടക സംഗീത പഠന കുറിപ്പുകൾ: ${cleanTopic}\n\n### 1. വിഷയാവലോകനം\nഈ വിഷയം കർണാടക സംഗീതത്തിലെ സ്വരസ്ഥാനങ്ങളും താള വിഭജനങ്ങളും വ്യക്തമാക്കുന്നു.\n\n${explicitText ? `### 2. പ്രധാന പഠനഭാഗം\n${explicitText}\n\n` : ""}### 3. പരിശീലന കുറിപ്പുകൾ\n- തമ്പുരു ശ്രുതിയിൽ കൃത്യമായി പരിശീലിക്കുക.`,
      raga: cleanTopic,
    };
  }

  return {
    answer: `## Carnatic Music Study Notes: ${cleanTopic}\n\n### 1. Overview & Theoretical Definition\nThis topic covers essential Carnatic music theory principles regarding scale structures, Swarasthana pitch intervals, and classical performance traditions.\n\n${explicitText ? `### 2. Official Syllabus Text Details\n${explicitText}\n\n` : ""}### 3. Practical Application & Exam Guidance\n- **Adhara Shadja (S):** Fundamental tonic pitch reference.\n- **Swarasthanas:** 12 microtonal positions (S, R1-R3, G1-G3, M1-M2, P, D1-D3, N1-N3).\n- Practice slowly in Vilambita Kala (slow tempo) with Tanpura drone pitch reference.`,
    raga: cleanTopic,
    arohanam: "S R G M P D N S'",
    avarohanam: "S' N D P M G R S",
  };
}

export async function callGemini(params: {
  systemPrompt: string;
  message: string;
  language?: string;
}): Promise<AiChatResponse> {
  const rawApiKey = process.env["GEMINI_API_KEY"];
  const apiKey = rawApiKey ? rawApiKey.trim().replace(/^['"=\s]+|['"\s]+$/g, '') : null;

  if (!apiKey) {
    return generateFallbackStudyNotes(params.message, params.language);
  }

  const promptText = `${params.systemPrompt}\n\nUser Question: ${params.message}\n\nRespond in JSON format: { "answer": "...", "raga": "...", "melakartaNumber": null, "arohanam": "...", "avarohanam": "...", "swaras": [], "famousKritis": [], "importantPoints": [], "practiceTips": [] }. Use only fields relevant to the question.`;

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

  return generateFallbackStudyNotes(params.message, params.language);
}

export async function callOpenAI(params: {
  systemPrompt: string;
  message: string;
  language?: string;
}): Promise<AiChatResponse> {
  if (process.env["GEMINI_API_KEY"]) {
    return callGemini(params);
  }

  const rawApiKey = process.env["OPENAI_API_KEY"];
  const apiKey = rawApiKey ? rawApiKey.trim().replace(/^['"=\s]+|['"\s]+$/g, '') : null;
  
  if (!apiKey) {
    return generateFallbackStudyNotes(params.message, params.language);
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
      return generateFallbackStudyNotes(params.message, params.language);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return generateFallbackStudyNotes(params.message, params.language);
    }

    try {
      return JSON.parse(content) as AiChatResponse;
    } catch {
      return { answer: content };
    }
  } catch (e) {
    return generateFallbackStudyNotes(params.message, params.language);
  }
}
