import type { SupportedLanguage } from "@/lib/ai/context";

export const KH_LANGUAGES: { id: SupportedLanguage; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { id: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { id: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { id: "kn", label: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
  { id: "ml", label: "മലയാളം (Malayalam)", flag: "🇮🇳" },
];

export const KH_UI_STRINGS: Record<
  SupportedLanguage,
  {
    badge: string;
    mainTitle: string;
    mainSubtitle: string;
    tabMelakartas: string;
    tabExplorer: string;
    tabCompare: string;
    tabComposers: string;
    tabTalas: string;
    chakraLabel: string;
    arohanaLabel: string;
    avarohanaLabel: string;
    searchPlaceholder: string;
    noResults: string;
    viewDetails: string;
    composersTitle: string;
    composersSubtitle: string;
    talasTitle: string;
    talasSubtitle: string;
    explorerTitle: string;
    explorerSubtitle: string;
    compareTitle: string;
    compareSubtitle: string;
  }
> = {
  en: {
    badge: "Carnatic Musicology Knowledge Hub",
    mainTitle: "72 Janaka Ragas (Melakartas) & Tools",
    mainSubtitle: "Explore the complete 72 Parent Janaka Ragas system formulation by Venkatamakhin. Inspect swarasthanas, derived Janya Ragas, or compare ragas side-by-side.",
    tabMelakartas: "Janaka Ragas (72 Melakartas)",
    tabExplorer: "✨ Raga Relationship Explorer",
    tabCompare: "Compare Ragas Side-by-Side",
    tabComposers: "Vaggeyakaras (Composers)",
    tabTalas: "35 Suladi Sapta Talas",
    chakraLabel: "Chakra:",
    arohanaLabel: "Arohana:",
    avarohanaLabel: "Avarohana:",
    searchPlaceholder: "Search Melakarta by name, number, or swaras...",
    noResults: "No matching ragas found.",
    viewDetails: "View Full Raga Profile →",
    composersTitle: "Vaggeyakaras (Classical Composers)",
    composersSubtitle: "Learn about the Trinity of Carnatic Music (Tyagaraja, Dikshitar, Syama Sastri) and Purandara Dasa.",
    talasTitle: "35 Suladi Sapta Talas System",
    talasSubtitle: "Understand the 7 principal Talas, 5 Laghu Jatis, and beat duration structures.",
    explorerTitle: "Raga Relationship Explorer",
    explorerSubtitle: "Discover parent-child scales, Western equivalent scales, and Janya derivatives.",
    compareTitle: "Side-by-Side Raga Comparison",
    compareSubtitle: "Compare two ragas side-by-side to analyze swarasthana microtonal differences.",
  },
  te: {
    badge: "కర్ణాటక సంగీత జ్ఞాన నిధి (Knowledge Hub)",
    mainTitle: "72 జనక రాగాలు (మేళకర్తలు) & సంగీత పరికరాలు",
    mainSubtitle: "వెంకటమఖి రూపొందించిన 72 మేళకర్త రాగ వ్యవస్థను పరిశీలించండి. స్వరస్థానాలు, జన్య రాగాలు, తాళాలు మరియు రాగ పోలికలను అన్వేషించండి.",
    tabMelakartas: "జనక రాగాలు (72 మేళకర్తలు)",
    tabExplorer: "✨ రాగ సంబంధాల ఎక్స్‌ప్లోరర్",
    tabCompare: "రాగాల వ్యత్యాస పోలిక",
    tabComposers: "వాగ్గేయకారులు (రచయితలు)",
    tabTalas: "35 సుళాది సప్త తాళాలు",
    chakraLabel: "చక్రం:",
    arohanaLabel: "ఆరోహణ:",
    avarohanaLabel: "అవరోహణ:",
    searchPlaceholder: "రాగం పేరు, సంఖ్య లేదా స్వరాల ద్వారా వెతకండి...",
    noResults: "ఏలాంటి రాగాలు లభించలేదు.",
    viewDetails: "రాగ వివరాలు చూడండి →",
    composersTitle: "వాగ్గేయకారులు (మహానటులు & సంగీత కర్తలు)",
    composersSubtitle: "కర్ణాటక సంగీత త్రిమూర్తులు (త్యాగరాజు, దీక్షితులు, శ్యామశాస్త్రి) మరియు పురందరదాసు చరిత్ర.",
    talasTitle: "35 సుళాది సప్త తాళ వ్యవస్థ",
    talasSubtitle: "7 ప్రధాన తాళాలు, 5 లఘు జాతులు మరియు అక్షరకాల గుణకార విధానం.",
    explorerTitle: "రాగ వర్గీకరణ & అనుబంధ ఎక్స్‌ప్లోరర్",
    explorerSubtitle: "జనక-జన్య రాగ సంబంధాలు మరియు పాశ్చాత్య స్కేల్ పోలికలను తెలుసుకోండి.",
    compareTitle: "రాగాల ముఖాముఖి వ్యత్యాస విశ్లేషణ",
    compareSubtitle: "రెండు రాగాలను పక్కపక్కనే ఉంచి స్వరస్థాన వ్యత్యాసాలను (మ1 vs మ2) విశ్లేషించండి.",
  },
  hi: {
    badge: "कर्नाटक संगीत ज्ञान केंद्र",
    mainTitle: "72 जनक राग (मेलकर्ता) एवं साधन",
    mainSubtitle: "वेंकटमखी द्वारा निर्मित 72 मेलकर्ता राग प्रणाली का अन्वेषण करें। स्वरस्थान, जन्य राग एवं तालों का अध्ययन करें।",
    tabMelakartas: "जनक राग (72 मेलकर्ता)",
    tabExplorer: "✨ राग संबंध एक्सप्लोरर",
    tabCompare: "राग तुलना (Side-by-Side)",
    tabComposers: "वाग्गेयकार (रचयिता)",
    tabTalas: "35 सुलादि सप्त ताल",
    chakraLabel: "चक्र:",
    arohanaLabel: "आरोहण:",
    avarohanaLabel: "अवरोहण:",
    searchPlaceholder: "राग का नाम या संख्या खोजें...",
    noResults: "कोई राग नहीं मिला।",
    viewDetails: "पूर्ण विवरण देखें →",
    composersTitle: "वाग्गेयकार (शास्त्रीय रचयिता)",
    composersSubtitle: "संगीत त्रिमूर्ति (त्यागराज, दीक्षितर, श्याम शास्त्री) एवं पुरंदर दास का परिचय।",
    talasTitle: "35 सुलादि सप्त ताल प्रणाली",
    talasSubtitle: "7 मुख्य ताल एवं 5 लघु जातियों की संरचना समझें।",
    explorerTitle: "राग संबंध एक्सप्लोरर",
    explorerSubtitle: "जनक-जन्य राग संबंध एवं पश्चिमी संगीत समकक्षता देखें।",
    compareTitle: "राग तुलना विश्लेषण",
    compareSubtitle: "दो रागों के स्वरस्थानों की तुलना करें।",
  },
  ta: {
    badge: "கர்நாடக இசை அறிவு மையம்",
    mainTitle: "72 ஜனக ராகங்கள் (மேளகர்த்தாக்கள்)",
    mainSubtitle: "வெங்கடமகி உருவாக்கிய 72 மேளகர்த்தா ராக அமைப்பை ஆராய்க. ஸ்வரஸ்தானங்கள், ஜன்ய ராகங்கள் மற்றும் தாளங்களை அறிக.",
    tabMelakartas: "ஜனக ராகங்கள் (72 மேளகர்த்தா)",
    tabExplorer: "✨ ராக இணைப்பு எக்ஸ்ப்ளோரர்",
    tabCompare: "ராக ஒப்பீடு",
    tabComposers: "வாக்கேயக்காரர்கள் (இசையமைப்பாளர்கள்)",
    tabTalas: "35 சூளாதி சப்த தாளங்கள்",
    chakraLabel: "சக்கரம்:",
    arohanaLabel: "ஆரோஹணம்:",
    avarohanaLabel: "அவரோஹணம்:",
    searchPlaceholder: "ராகத்தின் பெயர் அல்லது எண் தேடவும்...",
    noResults: "ராகங்கள் எதுவும் கிடைக்கவில்லை.",
    viewDetails: "முழு விவரம் பார்க்க →",
    composersTitle: "வாக்கேயக்காரர்கள் (இசை மேதைகள்)",
    composersSubtitle: "சங்கீத திரிமூர்த்திகள் (தியாகராஜர், தீக்ஷிதர், சியாமா சாஸ்திரி) பற்றிய வரலாறு.",
    talasTitle: "35 சூளாதி சப்த தாள முறை",
    talasSubtitle: "7 முதன்மை தாளங்கள் மற்றும் 5 லகு ஜாதிகள் விளக்குக.",
    explorerTitle: "ராக தொடர்பு எக்ஸ்ப்ளோரர்",
    explorerSubtitle: "ஜனக-ஜன்ய ராக தொடர்புகளை ஆராய்க.",
    compareTitle: "ராக ஒப்பீட்டு ஆய்வு",
    compareSubtitle: "இரண்டு ராகங்களின் ஸ்வர வேறுபாடுகளை ஒப்பிடுக.",
  },
  kn: {
    badge: "ಕರ್ನಾಟಕ ಸಂಗೀತ ಜ್ಞಾನ ಕೇಂದ್ರ",
    mainTitle: "72 ಜನಕ ರಾಗಗಳು (ಮೇಳಕರ್ತಗಳು)",
    mainSubtitle: "ವೆಂಕಟಮಖಿ ರೂಪಿಸಿದ 72 ಮೇಳಕರ್ತ ರಾಗ ವ್ಯವಸ್ಥೆಯನ್ನು ಪರಿಶೀಲಿಸಿ. ಸ್ವರಸ್ಥಾನಗಳು ಮತ್ತು ತಾಳಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
    tabMelakartas: "ಜನಕ ರಾಗಗಳು (72 ಮೇಳಕರ್ತ)",
    tabExplorer: "✨ ರಾಗ ಸಂಬಂಧ ಎಕ್ಸ್‌ಪ್ಲೋರರ್",
    tabCompare: "ರಾಗ ಹೋಲಿಕೆ",
    tabComposers: "ವಾಗ್ಗೇಯಕಾರರು (ರಚನೆಕಾರರು)",
    tabTalas: "35 ಸುಳಾದಿ ಸಪ್ತ ತಾಳಗಳು",
    chakraLabel: "ಚಕ್ರ:",
    arohanaLabel: "ಆರೋಹಣ:",
    avarohanaLabel: "ಅವರೋಹಣ:",
    searchPlaceholder: "ರಾಗದ ಹೆಸರು ಅಥವಾ ಸಂಖ್ಯೆ ಹುಡುಕಿ...",
    noResults: "ಯಾವುದೇ ರಾಗಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    viewDetails: "ಪೂರ್ಣ ವಿವರ ವೀಕ್ಷಿಸಿ →",
    composersTitle: "ವಾಗ್ಗೇಯಕಾರರು (ಕರ್ನಾಟಕ ಸಂಗೀತದ ಶ್ರೇಷ್ಠರು)",
    composersSubtitle: "ಸಂಗೀತ ತ್ರಿಮೂರ್ತಿಗಳು ಮತ್ತು ಪುರಂದರದಾಸರ ಇತಿಹಾಸ.",
    talasTitle: "35 ಸುಳಾದಿ ಸಪ್ತ ತಾಳ ವ್ಯವಸ್ಥೆ",
    talasSubtitle: "7 ಪ್ರಮುಖ ತಾಳಗಳು ಮತ್ತು 5 ಲಘು ಜಾತಿಗಳ ವಿವರಣೆ.",
    explorerTitle: "ರಾಗ ಸಂಬಂಧ ಎಕ್ಸ್‌ಪ್ಲೋರರ್",
    explorerSubtitle: "ಜನಕ-ಜನ್ಯ ರಾಗ ಸಂಬಂಧಗಳನ್ನು ತಿಳಿದುಕೊಳ್ಳಿ.",
    compareTitle: "ರಾಗ ಹೋಲಿಕೆ ವಿಶ್ಲೇಷಣೆ",
    compareSubtitle: "ಎರಡು ರಾಗಗಳ ಸ್ವರಸ್ಥಾನ ವ್ಯತ್ಯಾಸಗಳನ್ನು ಹೋಲಿಸಿ.",
  },
  ml: {
    badge: "കർണ്ണാടക സംഗീത ജ്ഞാന കേന്ദ്രം",
    mainTitle: "72 ജനക രാഗങ്ങൾ (മേളകർത്താക്കൾ)",
    mainSubtitle: "വെങ്കടമഖി നിർമ്മിച്ച 72 മേളകർത്താ രാഗ വ്യവസ്ഥ പഠിക്കൂ. സ്വരസ്ഥാനങ്ങൾ, ജന്യ രാഗങ്ങൾ എന്നിവ കാണുക.",
    tabMelakartas: "ജനക രാഗങ്ങൾ (72 മേളകർത്താ)",
    tabExplorer: "✨ രാഗ ബന്ധ എക്സ്പ്ലോറർ",
    tabCompare: "രാഗ താരതമ്യം",
    tabComposers: "വാഗ്ഗേയകാരന്മാർ (രചയിതാക്കൾ)",
    tabTalas: "35 സുളാദി സപ്ത താളങ്ങൾ",
    chakraLabel: "ചക്രം:",
    arohanaLabel: "ആരോഹണം:",
    avarohanaLabel: "അവരോഹണം:",
    searchPlaceholder: "രാഗത്തിന്റെ പേരോ നമ്പറോ തിരയൂ...",
    noResults: "രാഗങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല.",
    viewDetails: "പൂർണ്ണ വിവരങ്ങൾ കാണുക →",
    composersTitle: "വാഗ്ഗേയകാരന്മാർ",
    composersSubtitle: "സംഗീത ത്രിമൂർത്തികൾ, പുരന്ദരദാസൻ എന്നിവരുടെ വിവരണം.",
    talasTitle: "35 സുളാദി സപ്ത താള വ്യവസ്ഥ",
    talasSubtitle: "7 പ്രധാന താളങ്ങളും 5 ലഘു ജാതികളും.",
    explorerTitle: "രാഗ ബന്ധ എക്സ്പ്ലോറർ",
    explorerSubtitle: "ജനക-ജന്യ രാഗ ബന്ധങ്ങൾ മനസ്സിലാക്കൂ.",
    compareTitle: "രാഗ താരതമ്യ വിശകലനം",
    compareSubtitle: "രണ്ട് രാഗങ്ങളുടെ സ്വര വ്യത്യാസങ്ങൾ താരതമ്യം ചെയ്യൂ.",
  },
};

export function translateSwaraNotation(arohana: string, lang: SupportedLanguage): string {
  if (lang === "en" || !arohana) return arohana;

  if (lang === "te") {
    return arohana
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

  if (lang === "hi") {
    return arohana
      .replace(/S'/g, "सा'")
      .replace(/S/g, "सा")
      .replace(/R1/g, "रे1")
      .replace(/R2/g, "रे2")
      .replace(/R3/g, "रे3")
      .replace(/R/g, "रे")
      .replace(/G1/g, "ग1")
      .replace(/G2/g, "ग2")
      .replace(/G3/g, "ग3")
      .replace(/G/g, "ग")
      .replace(/M1/g, "म1")
      .replace(/M2/g, "म2")
      .replace(/M/g, "म")
      .replace(/P/g, "प")
      .replace(/D1/g, "ध1")
      .replace(/D2/g, "ध2")
      .replace(/D3/g, "ध3")
      .replace(/D/g, "ध")
      .replace(/N1/g, "नि1")
      .replace(/N2/g, "नि2")
      .replace(/N3/g, "नि3")
      .replace(/N/g, "नि");
  }

  return arohana;
}

export const EXPLORER_I18N: Record<
  SupportedLanguage,
  {
    backToHub: string;
    badge: string;
    mainTitle: string;
    mainDesc: string;
    taxonomy: string;
    treeTitle: string;
    treeDesc: string;
    searchPlaceholder: string;
    chakraLabel: string;
    parentMelakartas: string;
    parentMelakarta: string;
    chakraSuffix: string;
    recommendedForPath: string;
    askAiGuru: string;
    arohana: string;
    avarohana: string;
    derivedJanyas: string;
    parentLabel: string;
    selectedJanyaDetail: string;
    musicologicalNotes: string;
    famousKriti: string;
    janyaUnavailable: string;
  }
> = {
  en: {
    backToHub: "← Back to Knowledge Hub",
    badge: "Heritage & Classical Musicology Explorer",
    mainTitle: "Heritage & Raga Relationship Explorer",
    mainDesc: "Explore the sacred 72 Melakarta parent raga system formulated by Venkatamakhin, inspect ascending (Arohana) and descending (Avarohana) swarasthanas, examine Janya derivatives, and connect directly with your personalized learning path.",
    taxonomy: "Classical Indian Musicology Taxonomy",
    treeTitle: "72 Melakarta Heritage Relationship Tree",
    treeDesc: "Explore Venkatamakhin's 72 Parent Melakartas and their musicological Janya derivatives",
    searchPlaceholder: "Search Raga name or # (e.g. 15, Mayamalavagowla)...",
    chakraLabel: "Chakra:",
    parentMelakartas: "72 Parent Melakartas",
    parentMelakarta: "Parent Melakarta #",
    chakraSuffix: "Chakra",
    recommendedForPath: "Recommended for your path",
    askAiGuru: "Ask AI Guru About",
    arohana: "Arohana (Ascending Scale)",
    avarohana: "Avarohana (Descending Scale)",
    derivedJanyas: "Derived Janya Ragas",
    parentLabel: "Parent:",
    selectedJanyaDetail: "Selected Janya Raga Detail",
    musicologicalNotes: "Musicological Characteristics & Notes:",
    famousKriti: "Famous Composition:",
    janyaUnavailable: "Janya Relationship Data Unavailable",
  },
  te: {
    backToHub: "← జ్ఞాన నిధికి తిరిగి వెళ్ళండి",
    badge: "సనాతన & శాస్త్రీయ రాగ వర్గీకరణ ఎక్స్‌ప్లోరర్",
    mainTitle: "సనాతన రాగ అనుబంధ & వర్గీకరణ ఎక్స్‌ప్లోరర్",
    mainDesc: "వెంకటమఖి ప్రతిపాదించిన 72 మేళకర్త రాగ వ్యవస్థను అన్వేషించండి. ఆరోహణ-అవరోహణ స్వరస్థానాలు, జన్య రాగాలు మరియు మీ వ్యక్తిగత సాధన మార్గాన్ని తెలుసుకోండి.",
    taxonomy: "భారతీయ శాస్త్రీయ సంగీత వర్గీకరణ",
    treeTitle: "72 మేళకర్త రాగ అనుబంధ వృక్షం",
    treeDesc: "వెంకటమఖి 72 మేళకర్త రాగాలు మరియు వాటి జన్య రాగాల వివరాలు",
    searchPlaceholder: "రాగం పేరు లేదా సంఖ్య వెతకండి (ఉదా: 15, మాయామాళవగౌళ)...",
    chakraLabel: "చక్రం:",
    parentMelakartas: "72 జనక మేళకర్తలు",
    parentMelakarta: "జనక మేళకర్త #",
    chakraSuffix: "చక్రం",
    recommendedForPath: "మీ సాధన మార్గానికి సిఫార్సు చేయబడింది",
    askAiGuru: "AI గురుని అడగండి:",
    arohana: "ఆరోహణ (ఆరోహణ స్వర క్రమం)",
    avarohana: "అవరోహణ (అవరోహణ స్వర క్రమం)",
    derivedJanyas: "ఉత్పత్తి జన్య రాగాలు",
    parentLabel: "జనక రాగం:",
    selectedJanyaDetail: "ఎంచుకున్న జన్య రాగ వివరాలు",
    musicologicalNotes: "సంగీత శాస్త్ర లక్షణాలు & విశేషాలు:",
    famousKriti: "ప్రసిద్ధ కీర్తన/రచన:",
    janyaUnavailable: "జన్య రాగ వివరాలు అందుబాటులో లేవు",
  },
  hi: {
    backToHub: "← ज्ञान केंद्र पर वापस जाएं",
    badge: "सनातन एवं शास्त्रीय राग वर्गीकरण एक्सप्लोरर",
    mainTitle: "सनातन राग संबंध एवं वर्गीकरण एक्सप्लोरर",
    mainDesc: "वेंकटमखी द्वारा निर्मित 72 मेलकर्ता राग प्रणाली का अध्ययन करें। आरोहण-अवरोहण स्वरस्थान एवं जन्य रागों को देखें।",
    taxonomy: "भारतीय शास्त्रीय संगीत वर्गीकरण",
    treeTitle: "72 मेलकर्ता राग संबंध वृक्ष",
    treeDesc: "वेंकटमखी के 72 मेलकर्ता राग एवं जन्य रागों का विवरण",
    searchPlaceholder: "राग का नाम या संख्या खोजें (जैसे: 15, मायामालवगौड़ा)...",
    chakraLabel: "चक्र:",
    parentMelakartas: "72 जनक मेलकर्ता",
    parentMelakarta: "जनक मेलकर्ता #",
    chakraSuffix: "चक्र",
    recommendedForPath: "आपके अध्ययन मार्ग के लिए अनुशंसित",
    askAiGuru: "एआई गुरु से पूछें:",
    arohana: "आरोहण (आरोही स्वर)",
    avarohana: "अवरोहण (अवरोही स्वर)",
    derivedJanyas: "उत्पन्न जन्य राग",
    parentLabel: "जनक राग:",
    selectedJanyaDetail: "चयनित जन्य राग का विवरण",
    musicologicalNotes: "संगीत शास्त्रीय विशेषताएं एवं टिप्पणी:",
    famousKriti: "प्रसिद्ध रचना:",
    janyaUnavailable: "जन्य राग विवरण उपलब्ध नहीं है",
  },
  ta: {
    backToHub: "← அறிவு மையத்திற்கு திரும்பு",
    badge: "கர்நாடக ராக தொடர்பு எக்ஸ்ப்ளோரர்",
    mainTitle: "ராக தொடர்பு மற்றும் வகைப்பாடு எக்ஸ்ப்ளோரர்",
    mainDesc: "வெங்கடமகி உருவாக்கிய 72 மேளகர்த்தா ராக முறையை ஆராய்க. ஆரோஹணம்-அவரோஹணம் மற்றும் ஜன்ய ராகங்களை அறிக.",
    taxonomy: "இந்திய இசை சாஸ்திர வகைப்பாடு",
    treeTitle: "72 மேளகர்த்தா ராக இணைப்பு மரம்",
    treeDesc: "வெங்கடமகியின் 72 மேளகர்த்தா ராகங்கள் மற்றும் ஜன்ய ராகங்கள்",
    searchPlaceholder: "ராகத்தின் பெயர் அல்லது எண் தேடவும்...",
    chakraLabel: "சக்கரம்:",
    parentMelakartas: "72 ஜனக மேளகர்த்தாக்கள்",
    parentMelakarta: "ஜனக மேளகர்த்தா #",
    chakraSuffix: "சக்கரம்",
    recommendedForPath: "உங்கள் பயிற்சி பாதைக்கு பரிந்துரைக்கப்பட்டது",
    askAiGuru: "AI குருவிடம் கேட்க:",
    arohana: "ஆரோஹணம் (ஏறு வரிசை)",
    avarohana: "அவரோஹணம் (இறங்கு வரிசை)",
    derivedJanyas: "ஜன்ய ராகங்கள்",
    parentLabel: "ஜனக ராகம்:",
    selectedJanyaDetail: "தேர்ந்தெடுக்கப்பட்ட ஜன்ய ராக விவரம்",
    musicologicalNotes: "இசை சாஸ்திர இயல்புகள் & குறிப்புகள்:",
    famousKriti: "புகழ்பெற்ற கீர்த்தனை:",
    janyaUnavailable: "ஜன்ய ராக விவரங்கள் இல்லை",
  },
  kn: {
    backToHub: "← ಜ್ಞಾನ ಕೇಂದ್ರಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    badge: "ಕರ್ನಾಟಕ ರಾಗ ಸಂಬಂಧ ಎಕ್ಸ್‌ಪ್ಲೋರರ್",
    mainTitle: "ರಾಗ ಸಂಬಂಧ ಮತ್ತು ವರ್ಗೀಕರಣ ಎಕ್ಸ್‌ಪ್ಲೋರರ್",
    mainDesc: "ವೆಂಕಟಮಖಿ ರೂಪಿಸಿದ 72 ಮೇಳಕರ್ತ ರಾಗ ವ್ಯವಸ್ಥೆಯನ್ನು ಅನ್ವೇಷಿಸಿ. ಆರೋಹಣ-ಅವರೋಹಣ ಸ್ವರಸ್ಥಾನಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    taxonomy: "ಭಾರತೀಯ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ ವರ್ಗೀಕರಣ",
    treeTitle: "72 ಮೇಳಕರ್ತ ರಾಗ ಸಂಬಂಧ ವೃಕ್ಷ",
    treeDesc: "ವೆಂಕಟಮಖಿಯ 72 ಮೇಳಕರ್ತ ರಾಗಗಳು ಮತ್ತು ಜನ್ಯ ರಾಗಗಳು",
    searchPlaceholder: "ರಾಗದ ಹೆಸರು ಅಥವಾ ಸಂಖ್ಯೆ ಹುಡುಕಿ...",
    chakraLabel: "ಚಕ್ರ:",
    parentMelakartas: "72 ಜನಕ ಮೇಳಕರ್ತಗಳು",
    parentMelakarta: "ಜನಕ ಮೇಳಕರ್ತ #",
    chakraSuffix: "ಚಕ್ರ",
    recommendedForPath: "ನಿಮ್ಮ ಅಭ್ಯಾಸ ಮಾರ್ಗಕ್ಕೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
    askAiGuru: "AI ಗುರುಗಳನ್ನು ಕೇಳಿ:",
    arohana: "ಆರೋಹಣ (ಆರೋಹಣ ಸ್ವರಗಳು)",
    avarohana: "ಅವರೋಹಣ (ಅವರೋಹಣ ಸ್ವರಗಳು)",
    derivedJanyas: "ಉತ್ಪನ್ನ ಜನ್ಯ ರಾಗಗಳು",
    parentLabel: "ಜನಕ ರಾಗ:",
    selectedJanyaDetail: "ಆಯ್ಕೆಮಾಡಿದ ಜನ್ಯ ರಾಗದ ವಿವರ",
    musicologicalNotes: "ಸಂಗೀತ ಶಾಸ್ತ್ರೀಯ ಲಕ್ಷಣಗಳು & ಟಿಪ್ಪಣಿಗಳು:",
    famousKriti: "ಪ್ರಸಿದ್ಧ ಕೃತಿ:",
    janyaUnavailable: "ಜನ್ಯ ರಾಗದ ವಿವರ ಲಭ್ಯವಿಲ್ಲ",
  },
  ml: {
    backToHub: "← ജ്ഞാന കേന്ദ്രത്തിലേക്ക് മടങ്ങുക",
    badge: "കർണ്ണാടക രാഗ ബന്ധ എക്സ്പ്ലോറർ",
    mainTitle: "രാഗ ബന്ധവും വർഗ്ഗീകരണവും എക്സ്പ്ലോറർ",
    mainDesc: "വെങ്കടമഖി നിർമ്മിച്ച 72 മേളകർത്താ രാഗ വ്യവസ്ഥ പഠിക്കൂ. ആരോഹണം-അവരോഹണം, ജന്യ രാഗങ്ങൾ കാണുക.",
    taxonomy: "ഇന്ത്യൻ സംഗീത ശാസ്ത്ര വർഗ്ഗീകരണം",
    treeTitle: "72 മേളകർത്താ രാഗ ബന്ധ വൃക്ഷം",
    treeDesc: "വെങ്കടമഖിയുടെ 72 മേളകർത്താ രാഗങ്ങളും ജന്യ രാഗങ്ങളും",
    searchPlaceholder: "രാഗത്തിന്റെ പേരോ നമ്പറോ തിരയൂ...",
    chakraLabel: "ചക്രം:",
    parentMelakartas: "72 ജനക മേളകർത്താക്കൾ",
    parentMelakarta: "ജനക മേളകർത്താ #",
    chakraSuffix: "ചക്രം",
    recommendedForPath: "നിങ്ങളുടെ പഠന വഴിക്കായി ശുപാർശ ചെയ്തത്",
    askAiGuru: "AI ഗുരുവിനോട് ചോദിക്കൂ:",
    arohana: "ആരോഹണം (ആരോഹണ സ്വരങ്ങൾ)",
    avarohana: "അവരോഹണം (അവരോഹണ സ്വരങ്ങൾ)",
    derivedJanyas: "ഉത്ഭവിച്ച ജന്യ രാഗങ്ങൾ",
    parentLabel: "ജനക രാഗം:",
    selectedJanyaDetail: "തിരഞ്ഞെടുത്ത ജന്യ രാഗ വിവരങ്ങൾ",
    musicologicalNotes: "സംഗീത ശാസ്ത്രീയ സവിശേഷതകൾ & കുറിപ്പുകൾ:",
    famousKriti: "പ്രസിദ്ധമായ കീർത്തനം:",
    janyaUnavailable: "ജന്യ രാഗ വിവരങ്ങൾ ലഭ്യമല്ല",
  },
};

