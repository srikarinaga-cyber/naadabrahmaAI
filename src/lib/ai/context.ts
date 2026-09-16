import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { instrumentGuidance, type Instrument } from "@/lib/ai/instruments";
import { searchSyllabus, cleanSearchQuery } from "@/lib/ai/syllabus";
import { MELAKARTA_SEED_DATA, type MelakartaSeed } from "@/lib/data/melakartas-seed";

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
  userLearningPath?: {
    current_level?: string;
    learning_mode?: string;
    target_goal?: string;
    weak_areas?: string[];
  };
}): string {
  const { context, instrument, language = "en", userLearningPath } = params;

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

  if (userLearningPath) {
    prompt += `\nACTIVE STUDENT PERSONALIZED PATH:
- Current Level: ${userLearningPath.current_level || "Beginner"}
- Learning Mode: ${userLearningPath.learning_mode || "Vocal"}
- Target Goal: ${userLearningPath.target_goal || "Basics"}
- Focus Areas: ${userLearningPath.weak_areas?.join(", ") || "Shruti alignment, Tala continuity"}
Tailor your pedagogical guidance and explanations to match this student's level and target goals.\n`;
  }

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

function translateSyllabusContext(rawText: string, language: string): string {
  if (language === "en" || !rawText) return rawText;

  const t = rawText.toLowerCase();

  if (language === "te") {
    let result = "### పాఠ్యాంశ ముఖ్యాంశాలు (Telugu Explanation):\n";
    if (t.includes("dwadasa") || t.includes("swaramsthanams") || t.includes("swara")) {
      result += `- **ద్వాదశ స్వరస్థానములు (12 Swarasthanas):** 1. షడ్జమ (స), 2. శుద్ధ రిషభం (రి1), 3. చతుశ్రుతి రిషభం (రి2), 4. సాధారణ గాంధారం (గ1), 5. అంతర గాంధారం (గ2), 6. శుద్ధ మధ్యమం (మ1), 7. ప్రతి మధ్యమం (మ2), 8. పంచమం (ప), 9. శుద్ధ దైవతం (ద1), 10. చతుశ్రుతి దైవతం (ద2), 11. కైశిక నిషాదం (ని1), 12. కాకలి నిషాదం (ని2).\n`;
    }
    if (t.includes("sthayi") || t.includes("sthayis") || t.includes("octave")) {
      result += `- **పంచ స్థాయిలు (5 Sthayis):** 1. అనుమంద్ర స్థాయి, 2. మంద్ర స్థాయి, 3. మధ్య స్థాయి (సాధారణ గాత్ర స్థాయి), 4. తార స్థాయి (హై పిచ్), 5. అతితార స్థాయి.\n`;
    }
    if (t.includes("sangeetham") || t.includes("music") || t.includes("shruti")) {
      result += `- **సంగీతం & శ్రుతి:** గాత్రం, వాద్యం మరియు నృత్యం కలయిక సంగీతం. ఆధార షడ్జమంతో అనుసంధానమైన శ్రవ్య నాదాన్ని శ్రుతి అంటారు.\n`;
    }
    if (t.includes("katapayadi") || t.includes("melakarta")) {
      result += `- **కటపయాది సూత్రం:** 72 మేళకర్త రాగాలను అక్షర సంకేతాల ద్వారా 12 చక్రాలుగా వర్గీకరించే ప్రాచీన సంగీత నియమం.\n`;
    }
    if (t.includes("tala") || t.includes("suladi")) {
      result += `- **సుళాది సప్త తాళములు:** 7 ప్రధాన తాళములు (ధ్రువ, మత్య, రూపక, ఝంప, త్రిపుట, అట, ఏక) 5 జాతులతో గుణించగా ఏర్పడే 35 తాళాల వ్యవస్థ.\n`;
    }
    if (result === "### పాఠ్యాంశ ముఖ్యాంశాలు (Telugu Explanation):\n") {
      result += `- **సంగీత విశ్లేషణ:** ఆధార షడ్జమంతో శ్రుతి శుద్ధంగా సాధన చేయడం, ఆరోహణ అవరోహణల స్వరస్థానాలను స్పష్టంగా పలకడం ముఖ్యమైన నియమం.`;
    }
    return result;
  }

  if (language === "hi") {
    let result = "### पाठ्यक्रम मुख्य बिंदु (Hindi Explanation):\n";
    if (t.includes("dwadasa") || t.includes("swaramsthanams") || t.includes("swara")) {
      result += `- **द्वादश स्वरस्थान (12 Swarasthanas):** 1. षड्ज (सा), 2. शुद्ध ऋषभ, 3. चतुश्रुति ऋषभ, 4. साधारण गांधार, 5. अंतर गांधार, 6. शुद्ध मध्यम, 7. प्रति मध्यम, 8. पंचम (पा), 9. शुद्ध धैवत, 10. चतुश्रुति धैवत, 11. कैशिक निषाद, 12. काकली निषाद।\n`;
    }
    if (t.includes("sthayi") || t.includes("sthayis") || t.includes("octave")) {
      result += `- **पांच स्थाई (5 Sthayis):** 1. अनु-मंद्र स्थाई, 2. मंद्र स्थाई, 3. मध्य स्थाई, 4. तार स्थाई, 5. अति-तार स्थाई।\n`;
    }
    if (t.includes("sangeetham") || t.includes("music") || t.includes("shruti")) {
      result += `- **संगीत और श्रुति:** गायन, वादन और नृत्य का मेल संगीत है। आधार षड्ज के साथ सुरीली ध्वनि को श्रुति कहते हैं।\n`;
    }
    if (result === "### पाठ्यक्रम मुख्य बिंदु (Hindi Explanation):\n") {
      result += `- **संगीत विश्लेषण:** स्वरस्थानों और ताल व्यवस्था का सुरीला अभ्यास आवश्यक है।`;
    }
    return result;
  }

  if (language === "ta") {
    let result = "### பாடப்பகுதி முக்கிய குறிப்புகள் (Tamil Explanation):\n";
    if (t.includes("dwadasa") || t.includes("swaramsthanams") || t.includes("swara")) {
      result += `- **துவாதச ஸ்வரஸ்தானங்கள் (12 Swarasthanas):** 1. ஷட்ஜம் (ஸ), 2. சுத்த ரிஷபம், 3. சதுஸ்ருதி ரிஷபம், 4. சாதாரண காந்தாரம், 5. அந்தர காந்தாரம், 6. சுத்த மத்யமம், 7. ப்ரதி மத்யமம், 8. பஞ்சமம் (ப), 9. சுத்த தைவதம், 10. சதுஸ்ருதி தைவதம், 11. கைசிகி நிஷாதம், 12. காகலி நிஷாதம்.\n`;
    }
    if (t.includes("sthayi") || t.includes("sthayis")) {
      result += `- **ஐந்து ஸ்தாயிகள் (5 Sthayis):** 1. அனு-மந்த்ர ஸ்தாயி, 2. மந்த்ர ஸ்தாயி, 3. மத்ய ஸ்தாயி, 4. தார ஸ்தாயி, 5. அதி-தார ஸ்தாயி.\n`;
    }
    if (result === "### பாடப்பகுதி முக்கிய குறிப்புகள் (Tamil Explanation):\n") {
      result += `- **இசை விளக்கம்:** ஸ்ருதி சுத்தமாகவும் ராக ஸ்வரஸ்தானங்களை துல்லியமாகவும் பாட வேண்டும்.`;
    }
    return result;
  }

  if (language === "kn") {
    let result = "### ಪಠ್ಯಕ್ರಮದ ಮುಖ್ಯ ಬಿಂದುಗಳು (Kannada Explanation):\n";
    if (t.includes("dwadasa") || t.includes("swaramsthanams") || t.includes("swara")) {
      result += `- **ದ್ವಾದಶ ಸ್ವರಸ್ಥಾನಗಳು (12 Swarasthanas):** 1. ಷಡ್ಜ (ಸ), 2. ಶುದ್ಧ ರಿಷಭ, 3. ಚತುಶ್ರುತಿ ರಿಷಭ, 4. ಸಾಧಾರಣ ಗಾಂಧಾರ, 5. ಅಂತರ ಗಾಂಧಾರ, 6. ಶುದ್ಧ ಮಧ್ಯಮ, 7. ಪ್ರತಿ ಮಧ್ಯಮ, 8. ಪಂಚಮ (ಪ), 9. ಶುದ್ಧ ಧೈವತ, 10. ಚತುಶ್ರುತಿ ಧೈವತ, 11. ಕೈಶಿಕ ನಿಷಾದ, 12. ಕಾಕಲಿ ನಿಷಾದ.\n`;
    }
    if (t.includes("sthayi") || t.includes("sthayis")) {
      result += `- **ಐದು ಸ್ಥಾಯಿಗಳು (5 Sthayis):** 1. ಅನು-ಮಂದ್ರ ಸ್ಥಾಯಿ, 2. ಮಂದ್ರ ಸ್ಥಾಯಿ, 3. ಮಧ್ಯ ಸ್ಥಾಯಿ, 4. ತಾರ ಸ್ಥಾಯಿ, 5. ಅತಿ-ತಾರ ಸ್ಥಾಯಿ.\n`;
    }
    if (result === "### ಪಠ್ಯಕ್ರಮದ ಮುಖ್ಯ ಬಿಂದುಗಳು (Kannada Explanation):\n") {
      result += `- **ಸಂಗೀತ ವಿಶ್ಲೇಷಣೆ:** ಶ್ರುತಿಬದ್ಧವಾಗಿ ಸ್ವರಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡುವುದು ಮುಖ್ಯ.`;
    }
    return result;
  }

  if (language === "ml") {
    let result = "### പാഠഭാഗ പ്രധാന കുറിപ്പുകൾ (Malayalam Explanation):\n";
    if (t.includes("dwadasa") || t.includes("swaramsthanams") || t.includes("swara")) {
      result += `- **ദ്വാദശ സ്വരസ്ഥാനങ്ങൾ (12 Swarasthanas):** 1. ഷഡ്ജം (സ), 2. ശുദ്ധ ഋഷഭം, 3. ചതുശ്രുതി ഋഷഭം, 4. സാധാരണ ഗാന്ധാരം, 5. അന്തര ഗാന്ധാരം, 6. ശുദ്ധ മധ്യമം, 7. പ്രതി മധ്യമം, 8. പഞ്ചമം (പ), 9. ശുദ്ധ ധൈവതം, 10. ചതുശ്രുതി ധൈവതം, 11. കൈശിക നിഷാദം, 12. കാകലി നിഷാദം.\n`;
    }
    if (t.includes("sthayi") || t.includes("sthayis")) {
      result += `- **അഞ്ച് സ്ഥായികൾ (5 Sthayis):** 1. അനു-മന്ദ്ര സ്ഥായി, 2. മന്ദ്ര സ്ഥായി, 3. മധ്യ സ്ഥായി, 4. താര സ്ഥായി, 5. അതി-താര സ്ഥായി.\n`;
    }
    if (result === "### പാഠഭാഗ പ്രധാന കുറിപ്പുകൾ (Malayalam Explanation):\n") {
      result += `- **സംഗീത വിശകലനം:** തമ്പുരു ശ്രുതിയിൽ കൃത്യമായി പരിശീലിക്കുക.`;
    }
    return result;
  }

  return rawText;
}

export function generateFallbackStudyNotes(userQuestion: string, language: string = "en"): AiChatResponse {
  let rawCleanTopic = "Carnatic Music Theory";
  let rawExplicitText = "";

  if (userQuestion.includes("TOPIC:")) {
    const afterTopic = userQuestion.split("TOPIC:")[1] || "";
    rawCleanTopic = afterTopic.split("\n")[0]?.trim() || "Carnatic Music Theory";
  } else if (!userQuestion.includes("EXACT SYLLABUS TEXT CONTEXT:")) {
    rawCleanTopic = userQuestion.trim();
  }

  if (userQuestion.includes("EXACT SYLLABUS TEXT CONTEXT:")) {
    rawExplicitText = userQuestion.split("EXACT SYLLABUS TEXT CONTEXT:")[1]?.trim() || "";
  }

  rawExplicitText = rawExplicitText.replace(/^TOPIC:.*$/gm, "").trim();
  const explicitText = translateSyllabusContext(rawExplicitText, language);

  // Clean prompt artifacts from topic title
  let cleanTopicTitle = rawCleanTopic
    .replace(/^(what is|explain|tell me about|how to|difference between|briefly explain)\s+/i, "")
    .replace(/\s+(అంటే ఏమిటి|గురించి వివరించండి|వివరించండి|అంటే ఏంటి|గురించి చెప్పండి|ఏవి\?|ఏంటి\?)$/gi, "")
    .trim();

  if (!cleanTopicTitle) cleanTopicTitle = "Carnatic Music Theory";

  const qLower = userQuestion.toLowerCase();

  // 1. Dynamic Match across 72 Melakarta Ragas Catalog (Venkatamakhin system)
  const matchedMelakarta = MELAKARTA_SEED_DATA.find((m) => {
    const mName = m.name.toLowerCase();
    const cleanMName = mName
      .replace(/^dheera/, "")
      .replace(/^mecha/, "")
      .replace(/^hanumat/, "")
      .replace(/^harikambhoji/, "kambhoji");
    return (
      qLower.includes(mName) ||
      (cleanMName.length >= 4 && qLower.includes(cleanMName))
    );
  });

function toTeluguNotation(str: string): string {
  if (!str) return str;
  return str
    .replace(/S'/g, "స'")
    .replace(/S/g, "స")
    .replace(/R1/g, "రి1")
    .replace(/R2/g, "రి2")
    .replace(/R3/g, "రి3")
    .replace(/R/g, "రి")
    .replace(/G1/g, "గా1")
    .replace(/G2/g, "గా2")
    .replace(/G3/g, "గా3")
    .replace(/G/g, "గా")
    .replace(/M1/g, "మా1")
    .replace(/M2/g, "మా2")
    .replace(/M/g, "మా")
    .replace(/P/g, "పా")
    .replace(/D1/g, "దా1")
    .replace(/D2/g, "దా2")
    .replace(/D3/g, "దా3")
    .replace(/D/g, "దా")
    .replace(/N1/g, "నీ1")
    .replace(/N2/g, "నీ2")
    .replace(/N3/g, "నీ3")
    .replace(/N/g, "నీ");
}

  if (matchedMelakarta && !qLower.includes("vs") && !qLower.includes("difference") && !qLower.includes("వ్యత్యాసం")) {
    const teArohana = toTeluguNotation(matchedMelakarta.arohana);
    const teAvarohana = toTeluguNotation(matchedMelakarta.avarohana);

    if (language === "te") {
      return {
        answer: `## ${matchedMelakarta.name} రాగము సిద్ధాంత విశ్లేషణ (${matchedMelakarta.number}వ మేళకర్త)

### 1. రాగ వర్గీకరణ & చక్రం
- **మేళకర్త సంఖ్య:** ${matchedMelakarta.number}వ మేళకర్త రాగం (${matchedMelakarta.chakra} చక్రం).
- **స్వర శ్రేణి:** సంపూర్ణ రాగం (ఆరోహణ మరియు అవరోహణలలో ఏడు స్వరాలు నిండి ఉంటాయి).
- **సంగీత వివరణ:** ${matchedMelakarta.description}

### 2. ఆరోహణ & అవరోహణ
- **ఆరోహణ:** ${teArohana}
- **అవరోహణ:** ${teAvarohana}

### 3. ప్రసిద్ధ జన్య రాగాలు & అంశాలు
${matchedMelakarta.metadata?.popular_janyas?.length ? `- **ప్రసిద్ధ జన్య రాగాలు:** ${matchedMelakarta.metadata.popular_janyas.join(", ")}\n` : ""}${matchedMelakarta.metadata?.western_equivalent ? `- **పాశ్చాత్య సంగీత సమాన స్కేల్:** ${matchedMelakarta.metadata.western_equivalent}\n` : ""}

### 4. సాధనా మార్గదర్శకత్వం
- తంబూరా శ్రుతి సహాయంతో విళంబ కాలంలో (మెల్లగా) ప్రశాంతంగా స్వరస్థానాల స్థిరత్వాన్ని సాధన చేయండి.`,
        raga: matchedMelakarta.name,
        melakartaNumber: matchedMelakarta.number,
        arohanam: teArohana,
        avarohanam: teAvarohana,
        famousKritis: matchedMelakarta.metadata?.popular_janyas,
      };
    }

    return {
      answer: `## ${matchedMelakarta.name} Raga Profile (${matchedMelakarta.number}th Melakarta Parent Scale)

### 1. Classification & Musicological Context
- **Melakarta Index:** ${matchedMelakarta.number}th Melakarta Raga (${matchedMelakarta.chakra} Chakra).
- **Scale Structure:** Sampurna Raga (7 notes ascending & 7 notes descending).
- **Description:** ${matchedMelakarta.description}

### 2. Scale Structure (Arohana & Avarohana)
- **Arohana:** ${matchedMelakarta.arohana}
- **Avarohana:** ${matchedMelakarta.avarohana}

### 3. Derived Janya Ragas & Equivalents
${matchedMelakarta.metadata?.popular_janyas?.length ? `- **Popular Janya Ragas:** ${matchedMelakarta.metadata.popular_janyas.join(", ")}\n` : ""}${matchedMelakarta.metadata?.western_equivalent ? `- **Western Music Equivalent:** ${matchedMelakarta.metadata.western_equivalent}\n` : ""}

### 4. Pedagogical Recommendations
- Sustain each swarasthana against the Tanpura drone to internalize microtonal pitch stability.`,
      raga: matchedMelakarta.name,
      melakartaNumber: matchedMelakarta.number,
      arohanam: matchedMelakarta.arohana,
      avarohanam: matchedMelakarta.avarohana,
      famousKritis: matchedMelakarta.metadata?.popular_janyas,
    };
  }

  // 2. Katapayadi Sankhya System Match
  const isKatapayadi = qLower.includes("katapayadi") || qLower.includes("కటపయాది") || qLower.includes("कटपयादि");
  if (isKatapayadi) {
    if (language === "te") {
      return {
        answer: `## కటపయాది సూత్రం - 72 మేళకర్త రాగ వర్గీకరణ నియమం

### 1. కటపయాది సూత్రం అంటే ఏమిటి?
కటపయాది సూత్రం అనేది ప్రాచీన భారతీయ అక్షర-సంఖ్య పద్ధతి. ఈ నియమం ద్వారా మేళకర్త రాగం పేరులోని మొదటి రెండు అక్షరాల ఆధారంగా ఆ రాగం యొక్క మేళకర్త సంఖ్యను ($1 - 72$) సులభంగా గణించవచ్చు.

### 2. అక్షర-సంఖ్య పట్టిక (Ka-Ta-Pa-Ya Rules)
- **క-వర్గం (క1, ఖ2, గ3, ఘ4, ఙ5...):** సంఖ్యలు $1, 2, 3, 4, 5, 6, 7, 8, 9, 0$
- **ట-వర్గం (ట1, ఠ2, డ3, ఢ4, ణ5...):** సంఖ్యలు $1, 2, 3, 4, 5, 6, 7, 8, 9, 0$
- **ప-వర్గం (ప1, ఫ2, బ3, భ4, మ5):** సంఖ్యలు $1, 2, 3, 4, 5$
- **య-వర్గం (య1, ర2, ల3, వ4, శ5, ష6, స7, హ8):** సంఖ్యలు $1, 2, 3, 4, 5, 6, 7, 8$

### 3. గణన విధానం (ఉదాహరణలు)
1. **ధీరశంకరాభరణం:**
   - మొదటి రెండు అక్షరాలు: **ధీ** ($9$) మరియు **ర** ($2$).
   - ఏర్పడిన సంఖ్య: $92$. దీన్ని తిరగేయగా (Reverse digits): **$29$వ మేళకర్త రాగం**.
2. **మాయామాలవగౌళ:**
   - మొదటి రెండు అక్షరాలు: **మా** ($5$) మరియు **యా** ($1$).
   - ఏర్పడిన సంఖ్య: $51$. తిరగేయగా: **$15$వ మేళకర్త రాగం**.
3. **మేచకళ్యాణి:**
   - మొదటి రెండు అక్షరాలు: **మే** ($5$) మరియు **చ** ($6$).
   - ఏర్పడిన సంఖ్య: $56$. తిరగేయగా: **$65$వ మేళకర్త రాగం**.

### 4. 12 చక్రాలు (Chakras)
72 మేళకర్తలను 12 చక్రాలుగా విభజించారు (ప్రతి చక్రంలో 6 రాగాలు ఉంటాయి):
1. ఇందు, 2. నేత్ర, 3. అగ్ని, 4. వేద, 5. బాణ, 6. రుతు, 7. రిషి, 8. వసు, 9. బ్రహ్మ, 10. దిశి, 11. రుద్ర, 12. ఆదిత్య.`,
        raga: "Katapayadi System",
      };
    }
    return {
      answer: `## Katapayadi Sankhya System in Carnatic Musicology

### 1. What is the Katapayadi Formula?
The **Katapayadi Sankhya System** is an ancient Indian alphanumerical schema used to assign a unique index number ($1 \text{ to } 72$) to each Melakarta parent raga based on the first two syllables of its standardized name.

### 2. Syllable-to-Number Mapping Rules
- **Ka-Group (Ka=1, Kha=2, Ga=3, Gha=4, Nga=5...):** Digits $1, 2, 3, 4, 5, 6, 7, 8, 9, 0$
- **Ta-Group (Ta=1, Tha=2, Da=3, Dha=4, Na=5...):** Digits $1, 2, 3, 4, 5, 6, 7, 8, 9, 0$
- **Pa-Group (Pa=1, Pha=2, Ba=3, Bha=4, Ma=5):** Digits $1, 2, 3, 4, 5$
- **Ya-Group (Ya=1, Ra=2, La=3, Va=4, Sha=5, Sha=6, Sa=7, Ha=8):** Digits $1, 2, 3, 4, 5, 6, 7, 8$

### 3. Reversal Rule & Calculation Examples
To derive the Melakarta number, take the digits corresponding to the first two syllables and **reverse their order**:
1. **Dheerasankarabharanam:**
   - Syllables: **Dhee** ($9$) and **Ra** ($2$) $\rightarrow 92$.
   - Reversed digits: **29th Melakarta**.
2. **Mayamalavagowla:**
   - Syllables: **Ma** ($5$) and **Ya** ($1$) $\rightarrow 51$.
   - Reversed digits: **15th Melakarta**.
3. **Mechakkalyani:**
   - Syllables: **Me** ($5$) and **Cha** ($6$) $\rightarrow 56$.
   - Reversed digits: **65th Melakarta**.`,
      raga: "Katapayadi System",
    };
  }

  // 2. Sarali Varisalu & Abhyasa Ganam Match
  const isSarali = qLower.includes("sarali") || qLower.includes("సరళి") || qLower.includes("सरलि") || qLower.includes("abhyasa");
  if (isSarali) {
    if (language === "te") {
      return {
        answer: `## సరళి వరుసలు & అభ్యాస గానం (Basic Carnatic Exercises)

### 1. ప్రాథమిక సంగీత సాధనా క్రమం
కర్ణాటక సంగీత పితామహులైన **శ్రీ పురందరదాసు** ప్రారంభ సాధకుల కోసం ప్రాథమిక సంగీత క్రమాన్ని నిర్మించారు. ఇవన్నీ **15వ మేళకర్త మాయామాలవగౌళ** రాగంలో సాధన చేస్తారు.

### 2. అభ్యాస గాన సోపానాలు
1. **సరళి వరుసలు (Sarali Varisalu):** ఏక స్థాయి స్వర సాధన, శ్రుతి శుద్ధత మరియు స్వరస్థానాల స్థిరత్వానికి ఉపయోగపడతాయి.
2. **జంట వరుసలు (Janta Varisalu):** ద్వంద్వ స్వరాల ప్రయోగం (ఉదా: సస రిరి గగ మమ) - స్వర స్పష్టత సాధించడానికి.
3. **దాటు వరుసలు (Dhatu Varisalu):** స్వరాలను దాటుతూ పలకడం (ఉదా: సగ రిమ గప) - గమక స్థిరత్వానికి.
4. **అలంకారములు (Alankarams):** 7 ప్రధాన తాళాలు మరియు 5 లఘు జాతులలో తాళ నడక సాధన.
5. **గీతములు (Geethams):** సాహిత్యంతో కూడిన మొదటి చిన్న స్వర రచనలు.

### 3. సాధనా వేగాలు (3 Speeds)
- **ప్రథమ కాలం (1st Speed):** 1 అక్షరానికి 1 స్వరం.
- **ద్వితీయ కాలం (2nd Speed):** 1 అక్షరానికి 2 స్వరాలు.
- **తృతీయ కాలం (3rd Speed):** 1 అక్షరానికి 4 స్వరాలు.`,
        raga: "Sarali Varisalu",
      };
    }
    return {
      answer: `## Sarali Varisalu & Abhyasa Ganam (Foundational Carnatic Exercises)

### 1. Pedagogical Foundation
Structured by the Pitamaha of Carnatic Music, **Sri Purandara Dasa**, these foundational exercises are set in **Mayamalavagowla (15th Melakarta)** to develop pitch precision and steady rhythm.

### 2. Progressive Learning Stages
1. **Sarali Varisalu:** Single swara exercises for pitch alignment and octave familiarity.
2. **Janta Varisalu:** Doubled swara exercises (e.g. SS RR GG MM) to build vocal force and clarity.
3. **Dhatu Varisalu:** Zigzag swara sequences (e.g. SG RM GP) to refine gamaka control.
4. **Alankarams:** Exercises across 7 main Talas and 5 Jatis for rhythmic mastery.
5. **Geethams:** Simple melodic compositions with lyrics.

### 3. Practice Speeds (Tristhayi Speeds)
- **1st Speed (Prathama Kala):** 1 note per beat count.
- **2nd Speed (Dwitiya Kala):** 2 notes per beat count.
- **3rd Speed (Tritiya Kala):** 4 notes per beat count.`,
      raga: "Sarali Varisalu",
    };
  }

  // 3. Tyagaraja Pancharatna Kritis Match
  const isPancharatna = qLower.includes("pancharatna") || qLower.includes("పంచరత్న") || qLower.includes("पंचरत्न");
  if (isPancharatna) {
    if (language === "te") {
      return {
        answer: `## శ్రీ త్యాగరాజ స్వామి ఘనరాగ పంచరత్న కృతులు

### 1. పంచరత్న కృతుల ప్రాముఖ్యత
శ్రీ త్యాగరాజ స్వామి రచించిన 5 అత్యంత గంభీరమైన ఘనరాగ కృతులను **పంచరత్న కృతులు** అంటారు. ఇవన్నీ ఆది తాళంలో నిర్మించబడ్డాయి.

### 2. 5 ఘనరాగ పంచరత్న కృతుల వివరాలు
1. **జగదానందకారక** - నాట రాగం (ఆది తాళం)
   - సంస్కృత సాహిత్యం. శ్రీరాముని శతనామావళి కీర్తన.
2. **దుడుకుగల నన్నేదొర గైకోనురా** - గౌళ రాగం (ఆది తాళం)
   - ఆత్మనివేదన, మనో నివేదన సారాంశం.
3. **కనకనరుచిరా కనకవసన** - వరాళి రాగం (ఆది తాళం)
   - శ్రీరాముని సౌందర్య వర్ణన.
4. **సమయానికి మరువవే మనసా** - ఆరభి రాగం (ఆది తాళం)
   - భక్తి సారాంశం, భగవంతుని కృపా వర్ణన.
5. **ఎంతరో మహానుభావులు అందరికీ వందనములు** - శ్రీ రాగం (ఆది తాళం)
   - సకల సంగీత కోవిదులకు, భక్తులకు నమస్కరించే విశ్వజనీన కీర్తన.`,
        raga: "Pancharatna Kritis",
        famousKritis: ["జగదానందకారక (నాట)", "దుడుకుగల (గౌళ)", "కనకనరుచిరా (వరాళి)", "సమయానికి మరువవే (ఆరభి)", "ఎంతరో మహానుభావులు (శ్రీ రాగం)"],
      };
    }
    return {
      answer: `## Sri Tyagaraja Swami's Ghanaraga Pancharatna Kritis

### 1. Overview & Significance
Composed by Saint Tyagaraja in the 5 major Ghanaragas (Nata, Gaula, Varali, Arabhi, Sri), these 5 compositions represent the pinnacle of Carnatic devotion and scholarly craftsmanship. All are composed in **Adi Tala**.

### 2. The 5 Pancharatna Compositions
1. **Jagadanandakaraka** - Nata Raga (Adi Tala)
   - Sanskrit lyrics enumerating 108 names of Lord Rama.
2. **Dudukugala Nannedora** - Gaula Raga (Adi Tala)
   - A poignant song of self-introspection and devotion.
3. **Kanakana Ruchira** - Varali Raga (Adi Tala)
   - Celebrates the divine beauty of Lord Rama.
4. **Samayaniki Maruvave** - Arabhi Raga (Adi Tala)
   - Expresses gratitude for timely divine grace.
5. **Endaro Mahanubhavulu** - Sri Raga (Adi Tala)
   - A universal salutation to all great souls and musicians.`,
      raga: "Pancharatna Kritis",
      famousKritis: ["Jagadanandakaraka (Nata)", "Dudukugala (Gaula)", "Kanakana Ruchira (Varali)", "Samayaniki Maruvave (Arabhi)", "Endaro Mahanubhavulu (Sri Raga)"],
    };
  }

  // 4. Shankarabharanam vs Kalyani Query Match
  const isShankaraKalyani =
    (qLower.includes("shankara") || qLower.includes("శంకరాభరణం") || qLower.includes("शंकराभरणम") || qLower.includes("சங்கராபரணம்") || qLower.includes("ಶಂಕರ ಅಭರಣಂ")) &&
    (qLower.includes("kalyani") || qLower.includes("కళ్యాణి") || qLower.includes("कल्याणी") || qLower.includes("கல்யாணி") || qLower.includes("കല്യാണി"));

  if (isShankaraKalyani) {
    if (language === "te") {
      return {
        answer: `## శంకరాభరణం మరియు కళ్యాణి రాగాల వ్యత్యాస విశ్లేషణ

### 1. ప్రధాన వ్యత్యాసం (Key Difference)
- **ధీరశంకరాభరణం (29వ మేళకర్త):** ఇది **శుద్ధ మధ్యమ (మ1)** రాగం. 
- **మేచకళ్యాణి (65వ మేళకర్త):** ఇది **ప్రతి మధ్యమ (మ2)** రాగం.
- శంకరాభరణం రాగంలోని శుద్ధ మధ్యమాన్ని (మ1) ప్రతి మధ్యమంగా (మ2) మార్చితే నేరుగా కళ్యాణి రాగం ఏర్పడుతుంది ($29 + 36 = 65$వ మేళకర్త).

### 2. ఆరోహణ & అవరోహణ పోలిక
- **ధీరశంకరాభరణం (29వ మేళకర్త):**
  - **ఆరోహణ:** స రి2 గా3 మా1 పా దా2 నీ3 స'
  - **అవరోహణ:** స' నీ3 దా2 పా మా1 గా3 రి2 స
  - **స్వరస్థానాలు:** చతుశ్రుతి రిషభం (రి2), అంతర గాంధారం (గా3), **శుద్ధ మధ్యమం (మ1)**, పంచమం (పా), చతుశ్రుతి దైవతం (దా2), కాకలి నిషాదం (నీ3).

- **మేచకళ్యాణి (65వ మేళకర్త):**
  - **ఆరోహణ:** స రి2 గా3 మా2 పా దా2 నీ3 స'
  - **అవరోహణ:** స' నీ3 దా2 పా మా2 గా3 రి2 స
  - **స్వరస్థానాలు:** చతుశ్రుతి రిషభం (రి2), అంతర గాంధారం (గా3), **ప్రతి మధ్యమం (మ2)**, పంచమం (పా), చతుశ్రుతి దైవతం (దా2), కాకలి నిషాదం (నీ3).

### 3. ప్రసిద్ధ కృతులు & గమక ప్రయోగాలు
- **శంకరాభరణం:** *అక్షయలింగ విభో* (ముత్తుస్వామి దీక్షితులు), *ఏదిన ముచ్చట* (త్యాగరాజు), *సరోజదళ నేత్రి* (శ్యామశాస్త్రి).
- **కళ్యాణి:** *వాసుదేవయని* (త్యాగరాజు), *హిమాద్రి సుతే* (శ్యామశాస్త్రి).`,
        raga: "Shankarabharanam vs Kalyani",
        melakartaNumber: 29,
        arohanam: "స రి2 గా3 మా1 పా దా2 నీ3 స' (శంకరాభరణం) | స రి2 గా3 మా2 పా దా2 నీ3 స' (కళ్యాణి)",
        avarohanam: "స' నీ3 దా2 పా మా1 గా3 రి2 స (శంకరాభరణం) | స' నీ3 దా2 పా మా2 గా3 రి2 స (కళ్యాణి)",
        famousKritis: ["అక్షయలింగ విభో (శంకరాభరణం)", "వాసుదేవయని (కళ్యాణి)"],
        practiceTips: ["మధ్యమ స్వర వ్యత్యాసాన్ని (మ1 vs మ2) శ్రుతిపెట్టి శ్రద్ధగా వినండి."],
      };
    }

    return {
      answer: `## Shankarabharanam vs Kalyani Detailed Raga Comparison

### 1. Key Musicological Difference
- **Dheerasankarabharanam (29th Melakarta):** Uses **Shuddha Madhyamam (M1)**.
- **Mechakkalyani (65th Melakarta):** Uses **Prati Madhyamam (M2)**.
- Replacing M1 with M2 in Shankarabharanam directly yields Kalyani ($29 + 36 = 65\text{th Melakarta}$).

### 2. Scale Structure & Swarasthana Breakdown
- **Dheerasankarabharanam (29th Parent Scale):**
  - **Arohana:** S R2 G3 M1 P D2 N3 S'
  - **Avarohana:** S' N3 D2 P M1 G3 R2 S
  - **Swaras:** Chatsruti Rishabha (R2), Antara Gandhara (G3), **Shuddha Madhyama (M1)**, Panchama (P), Chatsruti Dhaivata (D2), Kakali Nishada (N3).

- **Mechakkalyani (65th Parent Scale):**
  - **Arohana:** S R2 G3 M2 P D2 N3 S'
  - **Avarohana:** S' N3 D2 P M2 G3 R2 S
  - **Swaras:** Chatsruti Rishabha (R2), Antara Gandhara (G3), **Prati Madhyama (M2)**, Panchama (P), Chatsruti Dhaivata (D2), Kakali Nishada (N3).

### 3. Famous Classical Compositions
- **Shankarabharanam:** *Akshayalinga Vibho* (Muthuswami Dikshitar), *Eduta Nilchite* (Tyagaraja).
- **Kalyani:** *Vasudevayani* (Tyagaraja), *Himadrisute* (Syama Sastri).`,
      raga: "Shankarabharanam vs Kalyani",
      melakartaNumber: 29,
      arohanam: "S R2 G3 M1 P D2 N3 S' (Shankarabharanam) | S R2 G3 M2 P D2 N3 S' (Kalyani)",
      avarohanam: "S' N3 D2 P M1 G3 R2 S (Shankarabharanam) | S' N3 D2 P M2 G3 R2 S (Kalyani)",
      famousKritis: ["Akshayalinga Vibho (Shankarabharanam)", "Vasudevayani (Kalyani)"],
      practiceTips: ["Sustain M1 and M2 against the Tanpura drone to internalize the microtonal difference."],
    };
  }

  // 5. Mohanam vs Hamsadhwani Query Match
  const isMohanamHamsadhwani =
    (qLower.includes("mohanam") || qLower.includes("మోహనం") || qLower.includes("मोहनम")) &&
    (qLower.includes("hamsadhwani") || qLower.includes("హంసధ్వని") || qLower.includes("हंसध्वनि"));

  if (isMohanamHamsadhwani) {
    if (language === "te") {
      return {
        answer: `## మోహనం మరియు హంసధ్వని రాగాల పోలిక & వ్యత్యాసం

### 1. ప్రధాన వ్యత్యాసం (Key Difference)
- **మోహనం:** ఔడవ రాగం (5 స్వరాలు: స రి2 గా3 పా దా2 స'). **మధ్యమం (మ) మరియు నిషాదం (ని) వర్జ్యం**.
- **హంసధ్వని:** ఔడవ రాగం (5 స్వరాలు: స రి2 గా3 పా నీ3 స'). **మధ్యమం (మ) మరియు దైవతం (ద) వర్జ్యం**.
- మోహనంలో **దైవతం (దా2)** ఉంటుంది, హంసధ్వనిలో దైవతానికి బదులుగా **కాకలి నిషాదం (నీ3)** ఉంటుంది.

### 2. ఆరోహణ & అవరోహణ
- **మోహనం (28వ మేళకర్త హరికాంభోజి జన్యం):**
  - **ఆరోహణ:** స రి2 గా3 పా దా2 స'
  - **అవరోహణ:** స' దా2 పా గా3 రి2 స
- **హంసధ్వని (29వ మేళకర్త ధీరశంకరాభరణం జన్యం):**
  - **ఆరోహణ:** స రి2 గా3 పా నీ3 స'
  - **అవరోహణ:** స' నీ3 పా గా3 రి2 స`,
        raga: "Mohanam vs Hamsadhwani",
        arohanam: "స రి2 గా3 పా దా2 స' (మోహనం) | స రి2 గా3 పా నీ3 స' (హంసధ్వని)",
        avarohanam: "స' దా2 పా గా3 రి2 స (మోహనం) | స' నీ3 పా గా3 రి2 స (హంసధ్వని)",
      };
    }

    return {
      answer: `## Mohanam vs Hamsadhwani Raga Comparison

### 1. Key Difference
- **Mohanam:** Audava scale (5 notes: S R2 G3 P D2 S'). Omits M and N. Derived from Harikambhoji (28th).
- **Hamsadhwani:** Audava scale (5 notes: S R2 G3 P N3 S'). Omits M and D. Derived from Shankarabharanam (29th).
- Mohanam features **Dhaivata (D2)**, whereas Hamsadhwani replaces Dhaivata with **Kakali Nishada (N3)**.

### 2. Scales
- **Mohanam:** S R2 G3 P D2 S' | S' D2 P G3 R2 S
- **Hamsadhwani:** S R2 G3 P N3 S' | S' N3 P G3 R2 S`,
      raga: "Mohanam vs Hamsadhwani",
      arohanam: "S R2 G3 P D2 S' (Mohanam) | S R2 G3 P N3 S' (Hamsadhwani)",
      avarohanam: "S' D2 P G3 R2 S (Mohanam) | S' N3 P G3 R2 S (Hamsadhwani)",
    };
  }

  // 6. Mayamalavagowla Query Match
  const isMayamalavagowla = qLower.includes("mayamala") || qLower.includes("మాయామాలవ") || qLower.includes("मायामालव");
  if (isMayamalavagowla) {
    if (language === "te") {
      return {
        answer: `## మాయామాలవగౌళ రాగం సిద్ధాంత వివరణ (15వ మేళకర్త)

### 1. రాగ స్వరూపం & స్వరస్థానాలు
- **ఆరోహణ:** స రి1 గా3 మా1 పా దా1 నీ3 స'
- **అవరోహణ:** స' నీ3 దా1 పా మా1 గా3 రి1 స
- **స్వరస్థానాలు:** శుద్ధ రిషభం (రి1), అంతర గాంధారం (గా3), శుద్ధ మధ్యమం (మ1), పంచమం (పా), శుద్ధ దైవతం (ద1), కాకలి నిషాదం (నీ3).

### 2. ప్రాముఖ్యత
- కర్ణాటక సంగీత పితామహులైన **శ్రీ పురందరదాసు** ప్రాథమిక సంగీత సాధన (సరళి వరుసలు, జంట వరుసలు, అలంకారాలు, గీతాలు) కోసం ఈ రాగాన్ని ఎంపిక చేశారు.
- రి1-గా3 మరియు ద1-నీ3 స్వరాల మధ్య సమానమైన అర్ధస్వర వ్యత్యాసం ఉండటం వలన ప్రారంభ సాధకులకు శ్రుతి శుద్ధత సులభమవుతుంది.`,
        raga: "Mayamalavagowla",
        melakartaNumber: 15,
        arohanam: "స రి1 గా3 మా1 పా దా1 నీ3 స'",
        avarohanam: "స' నీ3 దా1 పా మా1 గా3 రి1 స",
      };
    }
    return {
      answer: `## Mayamalavagowla Raga Theoretical Profile (15th Melakarta)

### 1. Scale & Swarasthana Structure
- **Arohana:** S R1 G3 M1 P D1 N3 S'
- **Avarohana:** S' N3 D1 P M1 G3 R1 S
- **Swaras:** Shuddha Rishabha (R1), Antara Gandhara (G3), Shuddha Madhyama (M1), Panchama (P), Shuddha Dhaivata (D1), Kakali Nishada (N3).

### 2. Musicological Significance
- Selected by **Sri Purandara Dasa** (Pitamaha of Carnatic Music) as the primary learning raga for beginner exercises (Sarali, Janta, Alankarams, Geethams).
- Features symmetrical semitone intervals (R1-G3 and D1-N3), ideal for training vocal pitch accuracy and shruti alignment.`,
      raga: "Mayamalavagowla",
      melakartaNumber: 15,
      arohanam: "S R1 G3 M1 P D1 N3 S'",
      avarohanam: "S' N3 D1 P M1 G3 R1 S",
    };
  }

  // 7. 35 Suladi Sapta Talas / Tala Matrix Match
  const isTalaMatrixQuery =
    qLower.includes("35") ||
    qLower.includes("sapta") ||
    qLower.includes("suladi") ||
    qLower.includes("tala") ||
    qLower.includes("talas") ||
    qLower.includes("తాళం") ||
    qLower.includes("తాళాలు") ||
    qLower.includes("ताल");

  if (isTalaMatrixQuery) {
    if (language === "te") {
      return {
        answer: `## 35 సుళాది సప్త తాళములు - సంపూర్ణ తాళ వ్యవస్థ

### 1. 7 ప్రధాన తాళాలు (సప్త తాళములు) & అంగాలు
1. **ధ్రువ తాళం:** 1 లఘువు + 1 దృతం + 2 లఘువులు ($I + O + I + I$)
2. **మత్య తాళం:** 1 లఘువు + 1 దృతం + 1 లఘువు ($I + O + I$)
3. **రూపక తాళం:** 1 దృతం + 1 లఘువు ($O + I$)
4. **ఝంప తాళం:** 1 లఘువు + 1 అనుదృతం + 1 దృతం ($I + U + O$)
5. **త్రిపుట తాళం:** 1 లఘువు + 2 దృతములు ($I + O + O$)
6. **అట తాళం:** 2 లఘువులు + 2 దృతములు ($I + I + O + O$)
7. **ఏక తాళం:** 1 లఘువు ($I$)

### 2. 5 లఘు జాతులు (5 Jatis)
లఘువు యొక్క అక్షరకాల సంఖ్య ఆధారంగా 5 జాతులు ఉంటాయి:
- **తిస్ర జాతి:** 3 అక్షరకాలు
- **చతుస్ర జాతి:** 4 అక్షరకాలు
- **ఖండ జాతి:** 5 అక్షరకాలు
- **మిశ్ర జాతి:** 7 అక్షరకాలు
- **సంకీర్ణ జాతి:** 9 అక్షరకాలు

### 3. 35 తాళాల సమగ్ర గుణక శ్రేణి ($7 \times 5 = 35$)
ఏడు సప్త తాళాలను 5 జాతులతో గుణించగా 35 తాళాలు ఏర్పడతాయి.
- ఉదాహరణ: **ఆది తాళం** = చతుస్ర జాతి త్రిపుట తాళం ($4 + 2 + 2 = 8$ అక్షరకాలు).
- **రూపక తాళం (చతుస్ర):** $2 + 4 = 6$ అక్షరకాలు.
- **మిశ్ర చాపు తాళం:** 7 అక్షరకాల లయ ($3 + 4$ దెబ్బల నడక).`,
        raga: "35 Suladi Sapta Talas",
      };
    }

    return {
      answer: `## The 35 Suladi Sapta Talas Matrix

### 1. The 7 Principal Talas (Sapta Talas) & Anga Structures
1. **Dhruva Tala:** 1 Laghu + 1 Dhrutam + 2 Laghus ($I + O + I + I$)
2. **Mathya Tala:** 1 Laghu + 1 Dhrutam + 1 Laghu ($I + O + I$)
3. **Rupaka Tala:** 1 Dhrutam + 1 Laghu ($O + I$)
4. **Jhampa Tala:** 1 Laghu + 1 Anudhrutam + 1 Dhrutam ($I + U + O$)
5. **Triputa Tala:** 1 Laghu + 2 Dhrutams ($I + O + O$)
6. **Ata Tala:** 2 Laghus + 2 Dhrutams ($I + I + O + O$)
7. **Eka Tala:** 1 Laghu ($I$)

### 2. The 5 Laghu Jatis (Beat Varieties)
The duration of the Laghu varies across 5 Jatis:
- **Tisra Jati:** 3 counts per Laghu
- **Chatusra Jati:** 4 counts per Laghu
- **Khanda Jati:** 5 counts per Laghu
- **Misra Jati:** 7 counts per Laghu
- **Sankeerna Jati:** 9 counts per Laghu

### 3. The 35 Talas Matrix ($7 \text{ Talas} \times 5 \text{ Jatis} = 35 \text{ Talas}$)
Multiplying the 7 principal Talas by the 5 Laghu Jatis yields the complete 35 Suladi Sapta Tala system.
- **Adi Tala:** Chatusra Jati Triputa Tala ($4 + 2 + 2 = 8$ counts).
- **Rupaka Tala (Chatusra):** Dhrutam $2$ + Laghu $4 = 6$ counts.
- **Jhampa Tala (Misra):** Laghu $7$ + Anudhrutam $1$ + Dhrutam $2 = 10$ counts.`,
      raga: "35 Suladi Sapta Talas",
    };
  }

  // 8. Hindolam Raga Query Match
  if (qLower.includes("hindolam") || qLower.includes("హిందోళం") || qLower.includes("हिंदोलम")) {
    if (language === "te") {
      return {
        answer: `## హిందోళం రాగం సిద్ధాంత విశ్లేషణ

### 1. రాగ స్వరూపం & జన్యం
- **జన్య రాగం:** 20వ మేళకర్త నాటభైరవి జన్యం (ఔడవ - ఔడవ రాగం).
- **వర్జ్య స్వరాలు:** రిషభం (రి) మరియు పంచమం (ప) వర్జ్యం.
- **ఆరోహణ:** స గా2 మా1 దా1 నీ2 స'
- **అవరోహణ:** స' నీ2 దా1 మా1 గా2 స
- **స్వరస్థానాలు:** సాధారణ గాంధారం (గా2), శుద్ధ మధ్యమం (మా1), శుద్ధ దైవతం (దా1), కైశిక నిషాదం (నీ2).

### 2. ప్రసిద్ధ కృతులు
- *సామజ వర గమనా* (శ్రీ త్యాగరాజ స్వామి)
- *పద్మనాభ పాహి* (స్వాతి తిరునాళ్)
- *గోవర్ధన గిరిధర* (నారాయణ తీర్థులు)`,
        raga: "Hindolam",
        arohanam: "స గా2 మా1 దా1 నీ2 స'",
        avarohanam: "స' నీ2 దా1 మా1 గా2 స",
        famousKritis: ["సామజ వర గమనా", "పద్మనాభ పాహి", "గోవర్ధన గిరిధర"],
      };
    }
    return {
      answer: `## Hindolam Raga Theoretical Profile

### 1. Scale & Swarasthana Structure
- **Parent Scale:** Janya of 20th Melakarta Natabhairavi (Audava-Audava scale).
- **Omitted Notes:** Rishabha (R) & Panchama (P) are omitted.
- **Arohana:** S G2 M1 D1 N2 S'
- **Avarohana:** S' N2 D1 M1 G2 S
- **Swaras:** Sadharana Gandhara (G2), Shuddha Madhyama (M1), Shuddha Dhaivata (D1), Kaisiki Nishada (N2).

### 2. Iconic Compositions
- *Samaja Varagamana* (Tyagaraja)
- *Padmanabha Pahi* (Swathi Thirunal)
- *Goverdhana Giridhara* (Narayana Teertha)`,
      raga: "Hindolam",
      arohanam: "S G2 M1 D1 N2 S'",
      avarohanam: "S' N2 D1 M1 G2 S",
      famousKritis: ["Samaja Varagamana", "Padmanabha Pahi"],
    };
  }

  // 9. Carnatic Trinity & Purandaradasa Query Match
  const isComposerQuery = qLower.includes("tyagaraja") || qLower.includes("dikshitar") || qLower.includes("syama") || qLower.includes("purandara") || qLower.includes("త్యాగరాజ") || qLower.includes("దీక్షితులు") || qLower.includes("శ్యామశాస్త్రి") || qLower.includes("పురందరదాసు");
  if (isComposerQuery) {
    if (language === "te") {
      return {
        answer: `## కర్ణాటక సంగీత త్రిమూర్తులు & పితామహులు

### 1. శ్రీ త్యాగరాజ స్వామి (1767–1847)
- **భాషలు:** తెలుగు, సంస్కృతం. **ముద్ర:** *త్యాగరాజు*.
- **విశిష్టత:** ఘనరాగ పంచరత్న కృతులు (*జగదానందకారక*, *దుడుకుగల*, *కనకనరుచిరా*, *సమయానికిమరవని*, *ఎంతరో మహానుభావులు*).

### 2. శ్రీ ముత్తుస్వామి దీక్షితులు (1775–1835)
- **భాష:** సంస్కృతం. **ముద్ర:** *గురుగుహ*.
- **విశిష్టత:** విళంబ కాల ప్రయోగాలు, రాగముద్ర చేరిక, కమలాంబ నవవర్ణ కృతులు.

### 3. శ్రీ శ్యామశాస్త్రి (1762–1827)
- **భాషలు:** తెలుగు, సంస్కృతం. **ముద్ర:** *శ్యామకృష్ణ*.
- **విశిష్టత:** సంక్లిష్టమైన తాళ ప్రయోగాలు (మిశ్ర చాపు, ఆనందభైరవి).

### 4. శ్రీ పురందరదాసు (1484–1564)
- **కర్ణాటక సంగీత పితామహులు:** మాయామాలవగౌళ రాగంలో సరళి, జంట, అలంకారములు మరియు గీతముల వరుసల రూపశిల్పి.`,
        raga: "Carnatic Composers",
      };
    }
    return {
      answer: `## The Musical Trinity & Pitamaha of Carnatic Music

### 1. Sri Tyagaraja Swami (1767–1847)
- **Languages:** Telugu & Sanskrit. **Mudra:** *Tyagaraja*.
- **Legacy:** Master of the 5 Ghanaraga Pancharatna Kritis (*Jagadanandakaraka*, *Dudukugala*, *Kanakana Ruchira*, *Samayaniki Maruvave*, *Endaro Mahanubhavulu*).

### 2. Sri Muthuswami Dikshitar (1775–1835)
- **Language:** Sanskrit. **Mudra:** *Guruguha*.
- **Legacy:** Renowned for majestic slow-tempo (Vilambita Kala) compositions, Raga Mudra integration, and Kamalamba Navavarna Kritis.

### 3. Sri Syama Sastri (1762–1827)
- **Languages:** Telugu & Sanskrit. **Mudra:** *Syamakrishna*.
- **Legacy:** Master of intricate rhythmic patterns (Misra Chapu, Anandabhairavi, Swarajatis).

### 4. Sri Purandara Dasa (1484–1564)
- **Pitamaha of Carnatic Music:** Systematized the Carnatic music curriculum starting with Sarali, Janta, Alankarams, and Geethams in Mayamalavagowla.`,
      raga: "Carnatic Composers",
    };
  }

  // 10. Deep Clean Dynamic Question Resolution
  if (language === "te") {
    return {
      answer: `## కర్ణాటక సంగీత విశ్లేషణ: ${cleanTopicTitle}

### 1. ప్రశ్నాంశ ముఖ్య వివరణ
మీరు అడిగిన **"${cleanTopicTitle}"** అనే అంశం కర్ణాటక సంగీత సిద్ధాంతం మరియు గాత్ర/వాద్య సాధనకు అత్యంత ప్రాధాన్యమైనది.

### 2. ప్రధాన సంగీత నియమాలు & స్వరస్థానాలు
- **శ్రుతి సంపూర్ణత:** ఆధార షడ్జమంతో (స) తంబూరా శ్రుతి కలిపి సాధన చేయడం ప్రాథమిక నియమం.
- **స్వర శ్రేణి నియమం:** ద్వాదశ స్వరస్థానాలు (స, రి1, రి2, గ1, గ2, మ1, మ2, ప, ద1, ద2, ని1, ని2) మరియు 72 మేళకర్త రాగ వ్యవస్థల పరిధిలో ఈ అంశం రూపుదిద్దుకుంది.

${explicitText ? `### 3. సంబంధిత పాఠ్యాంశ విశ్లేషణ\n${explicitText}\n\n` : ""}### 4. సాధనా సూచనలు
- స్థిరమైన తాళ నడకతో విళంబ కాలంలో (మెల్లగా) సాధన చేసి స్వరస్థానాల స్థిరత్వాన్ని మరియు గమక స్పష్టతను పెంపొందించుకోండి.`,
      raga: cleanTopicTitle,
    };
  }

  if (language === "hi") {
    return {
      answer: `## कर्नाटक संगीत विश्लेषण: ${cleanTopicTitle}

### 1. मुख्य विषय विवरण
आपके प्रश्न **"${cleanTopicTitle}"** का कर्नाटक संगीत शास्त्र में महत्वपूर्ण स्थान है।

${explicitText ? `### 2. पाठ्यक्रम विवरण\n${explicitText}\n\n` : ""}### 3. अभ्यास मार्गदर्शन
- आधार षड्ज (सा) के साथ तानपुरा श्रुति में निरंतर अभ्यास करें।`,
      raga: cleanTopicTitle,
    };
  }

  return {
    answer: `## Carnatic Music Analysis: ${cleanTopicTitle}

### 1. Direct Topic Explanation
Regarding **"${cleanTopicTitle}"**, this is a foundational Carnatic music theory concept.

### 2. Core Musicological Framework
- **Tonic Precision:** Always anchor your fundamental pitch with the Adhara Shadja (S) Tanpura drone.
- **Scale Structure:** Rooted in the 12 Swarasthana pitch positions and the 72 Melakarta parent scale framework.

${explicitText ? `### 3. Official Curriculum Context\n${explicitText}\n\n` : ""}### 4. Pedagogical Recommendations
- Practice in Vilambita Kala (slow tempo) with steady tala count to develop microtonal stability and tonal alignment.`,
    raga: cleanTopicTitle,
  };
}

function parseAiResponse(rawContent: string): AiChatResponse {
  let cleaned = rawContent.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (typeof parsed === "object" && parsed !== null) {
      const answer =
        typeof parsed.answer === "string" && parsed.answer.trim()
          ? parsed.answer.trim()
          : typeof parsed.response === "string" && parsed.response.trim()
          ? parsed.response.trim()
          : typeof parsed.content === "string" && parsed.content.trim()
          ? parsed.content.trim()
          : typeof parsed.text === "string" && parsed.text.trim()
          ? parsed.text.trim()
          : typeof parsed.explanation === "string" && parsed.explanation.trim()
          ? parsed.explanation.trim()
          : typeof parsed.result === "string" && parsed.result.trim()
          ? parsed.result.trim()
          : cleaned;

      return {
        answer,
        raga: typeof parsed.raga === "string" ? parsed.raga : undefined,
        melakartaNumber: typeof parsed.melakartaNumber === "number" ? parsed.melakartaNumber : undefined,
        arohanam: typeof parsed.arohanam === "string" ? parsed.arohanam : undefined,
        avarohanam: typeof parsed.avarohanam === "string" ? parsed.avarohanam : undefined,
        swaras: Array.isArray(parsed.swaras) ? parsed.swaras : undefined,
        famousKritis: Array.isArray(parsed.famousKritis) ? parsed.famousKritis : undefined,
        importantPoints: Array.isArray(parsed.importantPoints) ? parsed.importantPoints : undefined,
        practiceTips: Array.isArray(parsed.practiceTips) ? parsed.practiceTips : undefined,
      };
    }
  } catch {
    // If raw string is not JSON, return as answer directly
  }

  return { answer: cleaned };
}

export async function callGemini(params: {
  systemPrompt: string;
  message: string;
  language?: string;
}): Promise<AiChatResponse | null> {
  const rawApiKey = process.env["GEMINI_API_KEY"];
  const apiKey = rawApiKey ? rawApiKey.trim().replace(/^['"=\s]+|['"\s]+$/g, '') : null;

  if (!apiKey) {
    return null;
  }

  const promptText = `${params.systemPrompt}\n\nUser Question: ${params.message}\n\nRespond in JSON format: { "answer": "...", "raga": "...", "melakartaNumber": null, "arohanam": "...", "avarohanam": "...", "swaras": [], "famousKritis": [], "importantPoints": [], "practiceTips": [] }. Use only fields relevant to the question.`;

  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp", "gemini-1.5-flash-8b"];

  for (const model of models) {
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

      return parseAiResponse(content);
    } catch {
      continue;
    }
  }

  return null;
}

export async function callOpenAI(params: {
  systemPrompt: string;
  message: string;
  language?: string;
}): Promise<AiChatResponse> {
  // 1. Try Gemini API first if configured
  if (process.env["GEMINI_API_KEY"]) {
    const geminiRes = await callGemini(params);
    if (geminiRes) return geminiRes;
  }

  // 2. Try OpenAI API if configured
  const rawApiKey = process.env["OPENAI_API_KEY"];
  const apiKey = rawApiKey ? rawApiKey.trim().replace(/^['"=\s]+|['"\s]+$/g, '') : null;

  if (apiKey) {
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

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return parseAiResponse(content);
        }
      }
    } catch (e) {
      console.warn("OpenAI API query error:", e);
    }
  }

  // 3. Fallback to Multilingual Embedded Carnatic Knowledge Generator
  return generateFallbackStudyNotes(params.message, params.language);
}
