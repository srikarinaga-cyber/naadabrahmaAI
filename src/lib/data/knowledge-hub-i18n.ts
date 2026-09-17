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
