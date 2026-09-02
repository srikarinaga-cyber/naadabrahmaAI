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
  let cleanTopic = "Carnatic Music Theory";
  let rawExplicitText = "";

  if (userQuestion.includes("TOPIC:")) {
    const afterTopic = userQuestion.split("TOPIC:")[1] || "";
    cleanTopic = afterTopic.split("\n")[0]?.trim() || "Carnatic Music Theory";
  } else if (!userQuestion.includes("EXACT SYLLABUS TEXT CONTEXT:")) {
    cleanTopic = userQuestion.trim();
  }

  if (userQuestion.includes("EXACT SYLLABUS TEXT CONTEXT:")) {
    rawExplicitText = userQuestion.split("EXACT SYLLABUS TEXT CONTEXT:")[1]?.trim() || "";
  }

  rawExplicitText = rawExplicitText.replace(/^TOPIC:.*$/gm, "").trim();
  const explicitText = translateSyllabusContext(rawExplicitText, language);

  if (language === "te") {
    return {
      answer: `## కర్ణాటక సంగీత పాఠ్యాంశ నోట్స్: ${cleanTopic}\n\n### 1. సిద్ధాంత వివరణ & ముఖ్యాంశాలు\nఈ అంశం కర్ణాటక సంగీత సిద్ధాంతంలోని ప్రధాన నియమాలు, స్వరస్థానాల వర్గీకరణ మరియు తాళ అంగాల అమరికను వివరిస్తుంది.\n\n${explicitText ? `${explicitText}\n\n` : ""}### 2. సాధనా నియమాలు & పరీక్షా ముఖ్యాంశాలు\n- **నాదం & శ్రుతి:** ఆధార షడ్జమంతో శ్రుతిని కలిపి సాధన చేయాలి.\n- **ద్వాదశ స్వరస్థానములు:** స, రి1, రి2, గ1, గ2, మ1, మ2, ప, ద1, ద2, ని1, ని2 స్థానాలను శ్రద్ధగా గుర్తుంచుకోవాలి.`,
      raga: cleanTopic,
      arohanam: "స రి గ మ ప ద ని స'",
      avarohanam: "స' ని ద ప మ గ రి స",
    };
  }

  if (language === "hi") {
    return {
      answer: `## कर्नाटक संगीत अध्ययन नोट्स: ${cleanTopic}\n\n### 1. सिद्धांत एवं परिचय\nयह विषय कर्नाटक संगीत पाठ्यक्रम के स्वरस्थानों, राग नियमों और ताल प्रणाली को स्पष्ट करता है।\n\n${explicitText ? `${explicitText}\n\n` : ""}### 2. अभ्यास निर्देश एवं परीक्षा के मुख्य बिंदु\n- तानपुरा श्रुति के साथ अभ्यास करें।\n- 12 स्वरस्थानों और ताल अंगों को समझें।`,
      raga: cleanTopic,
      arohanam: "सा री गा मा पा ढा नी सा'",
      avarohanam: "सा' नी ढा पा मा गा री सा",
    };
  }

  if (language === "ta") {
    return {
      answer: `## கர்நாடக இசை பாடக் குறிப்புகள்: ${cleanTopic}\n\n### 1. அறிமுகம் மற்றும் விதிகள்\nஇந்த பகுதி கர்நாடக இசையின் ஸ்வரஸ்தானங்கள் மற்றும் தாள அமைப்புகளை விளக்குகிறது.\n\n${explicitText ? `${explicitText}\n\n` : ""}### 2. பயிற்சி முறைகள்\n- ஸ்ருதி சுத்தமாக பாடிப் பழகவும்.`,
      raga: cleanTopic,
    };
  }

  if (language === "kn") {
    return {
      answer: `## ಕರ್ನಾಟಕ ಸಂಗೀತ ಅಧ್ಯಯನ ಟಿಪ್ಪಣಿಗಳು: ${cleanTopic}\n\n### 1. ಸಿದ್ಧಾಂತ ಪರಿಚಯ\nಈ ವಿಷಯವು ಕರ್ನಾಟಕ ಸಂಗೀತದ ಸ್ವರಸ್ಥಾನಗಳು ಮತ್ತು ತಾಳ ಪದ್ಧತಿಯನ್ನು ಒಳಗೊಂಡಿದೆ.\n\n${explicitText ? `${explicitText}\n\n` : ""}### 2. ಅಭ್ಯಾಸದ ಮಾರ್ಗದರ್ಶನ\n- ಶ್ರುತಿಬದ್ಧವಾಗಿ ಅಭ್ಯಾಸ ಮಾಡಿ.`,
      raga: cleanTopic,
    };
  }

  if (language === "ml") {
    return {
      answer: `## കർണാടക സംഗീത പഠന കുറിപ്പുകൾ: ${cleanTopic}\n\n### 1. വിഷയാവലോകനം\nഈ വിഷയം കർണാടക സംഗീതത്തിലെ സ്വരസ്ഥാനങ്ങളും താള വിഭജനങ്ങളും വ്യക്തമാക്കുന്നു.\n\n${explicitText ? `${explicitText}\n\n` : ""}### 2. പരിശീലന കുറിപ്പുകൾ\n- തമ്പുരു ശ്രുതിയിൽ കൃത്യമായി പരിശീലിക്കുക.`,
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
