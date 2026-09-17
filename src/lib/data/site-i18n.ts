import type { SupportedLanguage } from "@/lib/ai/context";

export const SITE_LANGUAGES: { id: SupportedLanguage; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { id: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { id: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { id: "kn", label: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
  { id: "ml", label: "മലയാളം (Malayalam)", flag: "🇮🇳" },
];

export const SITE_I18N: Record<
  SupportedLanguage,
  {
    navHome: string;
    navKnowledgeHub: string;
    navAiGuru: string;
    navInstruments: string;
    navNotes: string;
    navStudentPortal: string;
    navSignIn: string;
    navGetStarted: string;
    navLogout: string;
    heroTagline: string;
    heroTitle: string;
    heroSubtitle: string;
    heroBtnExplore: string;
    heroBtnGuru: string;
    featureTitle: string;
    featureDesc: string;
    tanpuraTitle: string;
    tanpuraSubtitle: string;
    footerRights: string;
  }
> = {
  en: {
    navHome: "Home",
    navKnowledgeHub: "Knowledge Hub",
    navAiGuru: "AI Guru Chat",
    navInstruments: "Instruments",
    navNotes: "Study Notes",
    navStudentPortal: "Student Portal",
    navSignIn: "Sign In",
    navGetStarted: "Get Started",
    navLogout: "Log Out",
    heroTagline: "SANATANA CARNATIC MUSICOLOGY & AI GURU",
    heroTitle: "Master Carnatic Music with AI & Sacred Tradition",
    heroSubtitle: "Explore the 72 Melakartas, 35 Suladi Sapta Talas, interactive Tanpura-Tabla drone synthesizer, and ask 24/7 doubts to AI Guru with Tanjore Trinity Blessings.",
    heroBtnExplore: "Explore Knowledge Hub",
    heroBtnGuru: "Ask AI Guru Chatbot",
    featureTitle: "Sacred Features for Carnatic Practitioners",
    featureDesc: "Designed for vocalists, Veena & Violin practitioners, research scholars, and students preparing for exams.",
    tanpuraTitle: "Interactive Tanpura & Tabla Studio",
    tanpuraSubtitle: "Adjust Shruti (Sa-Pa, Sa-Ma), tempo, and rhythm patterns for daily Sadhana.",
    footerRights: "© 2026 Naadabrahma AI. All rights reserved. Built for Carnatic Musicology.",
  },
  te: {
    navHome: "హోమ్",
    navKnowledgeHub: "జ్ఞాన నిధి (Knowledge Hub)",
    navAiGuru: "AI గురు చాట్",
    navInstruments: "వాద్యములు",
    navNotes: "పాఠ్యాంశ నోట్స్",
    navStudentPortal: "విద్యార్థి పోర్టల్",
    navSignIn: "లాగిన్",
    navGetStarted: "ప్రారంభించండి",
    navLogout: "లాగౌట్",
    heroTagline: "సనాతన కర్ణాటక సంగీత శాస్త్రము & AI గురువు",
    heroTitle: "సంగీత త్రిమూర్తుల ఆశీస్సులతో కర్ణాటక సంగీత సాధన",
    heroSubtitle: "72 మేళకర్త రాగాలు, 35 సుళాది సప్త తాళాలు, శ్రుతి సాధన కోసం తంబూరా-తబలా సింథసైజర్ మరియు 24/7 AI గురు చాట్‌బాట్ సహాయం.",
    heroBtnExplore: "జ్ఞాన నిధిని అన్వేషించండి",
    heroBtnGuru: "AI గురుని అడగండి",
    featureTitle: "కర్ణాటక సంగీత సాధకుల కోసం పవిత్ర ఫీచర్లు",
    featureDesc: "గాత్రం, వీణ, వయోలిన్ సాధకులు, పరిశోధకులు మరియు పరీక్షలకు సిద్ధమయ్యే విద్యార్థుల కోసం రూపొందించబడింది.",
    tanpuraTitle: "తంబూరా & తబలా శ్రుతి సాధన స్టూడియో",
    tanpuraSubtitle: "దినచర్య సాధన కోసం శ్రుతి (స-ప, స-మ) మరియు తాళ వేగం సరిచేసుకోండి.",
    footerRights: "© 2026 నాదబ్రహ్మ AI. సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.",
  },
  hi: {
    navHome: "होम",
    navKnowledgeHub: "ज्ञान केंद्र",
    navAiGuru: "एआई गुरु चैट",
    navInstruments: "वाद्य यंत्र",
    navNotes: "अध्ययन नोट्स",
    navStudentPortal: "छात्र पोर्टल",
    navSignIn: "साइन इन",
    navGetStarted: "प्रारंभ करें",
    navLogout: "लॉग आउट",
    heroTagline: "सनातन कर्नाटक संगीत शास्त्र एवं एआई गुरु",
    heroTitle: "एआई एवं शास्त्रीय परंपरा से सीखें कर्नाटक संगीत",
    heroSubtitle: "72 मेलकर्ता राग, 35 सुलादि सप्त ताल, तानपुरा-तबला श्रुति एवं 24/7 एआई गुरु चैटबॉट सहायता।",
    heroBtnExplore: "ज्ञान केंद्र देखें",
    heroBtnGuru: "एआई गुरु से पूछें",
    featureTitle: "संगीत साधकों के लिए पवित्र विशेषताएं",
    featureDesc: "गायन, वीणा, वायलिन साधकों एवं शोधकर्ताओं के लिए विशेष रूप से निर्मित।",
    tanpuraTitle: "तानपुरा एवं तबला रियाज़ स्टूडियो",
    tanpuraSubtitle: "नियमित अभ्यास के लिए श्रुति (सा-प, सा-म) एवं ताल गति समायोजित करें।",
    footerRights: "© 2026 नादब्रह्म AI. सर्वाधिकार सुरक्षित।",
  },
  ta: {
    navHome: "முகப்பு",
    navKnowledgeHub: "அறிவு மையம்",
    navAiGuru: "AI குரு அரட்டை",
    navInstruments: "இசைக்கருவிகள்",
    navNotes: "பாடக் குறிப்புகள்",
    navStudentPortal: "மாணவர் தளம்",
    navSignIn: "உள்நுழைக",
    navGetStarted: "தொடங்கவும்",
    navLogout: "வெளியேறு",
    heroTagline: "கர்நாடக இசை சாஸ்திரம் & AI குரு",
    heroTitle: "கர்நாடக இசையை AI உதவியுடன் கற்கவும்",
    heroSubtitle: "72 மேளகர்த்தா ராகங்கள், 35 சூளாதி சப்த தாளங்கள், தம்பூரா-தபலா ஸ்ருதி மற்றும் 24/7 AI குரு உதவி.",
    heroBtnExplore: "அறிவு மையம் பார்க்க",
    heroBtnGuru: "AI குருவிடம் கேட்க",
    featureTitle: "இசை சாதகர்களுக்கான சிறப்பம்சங்கள்",
    featureDesc: "பாடகர்கள், வீணை, வயலின் கலைஞர்கள் மற்றும் மாணவர்களுக்காக வடிவமைக்கப்பட்டது.",
    tanpuraTitle: "தம்பூரா & தபலா பயிற்சி அரங்கம்",
    tanpuraSubtitle: "தினசரி சாதகத்திற்கு ஸ்ருதி மற்றும் தாள வேகம் சரிசெய்யவும்.",
    footerRights: "© 2026 நாதபிரம்மா AI. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
  },
  kn: {
    navHome: "ಮುಖಪುಟ",
    navKnowledgeHub: "ಜ್ಞಾನ ಕೇಂದ್ರ",
    navAiGuru: "AI ಗುರು ಚಾಟ್",
    navInstruments: "ವಾದ್ಯಗಳು",
    navNotes: "ಅಧ್ಯಯನ ಟಿಪ್ಪಣಿಗಳು",
    navStudentPortal: "ವಿದ್ಯಾರ್ಥಿ ಪೋರ್ಟಲ್",
    navSignIn: "ಸೈನ್ ಇನ್",
    navGetStarted: "ಪ್ರಾರಂಭಿಸಿ",
    navLogout: "ಲಾಗ್ ಔಟ್",
    heroTagline: "ಸನಾತನ ಕರ್ನಾಟಕ ಸಂಗೀತ ಶಾಸ್ತ್ರ & AI ಗುರು",
    heroTitle: "ಕರ್ನಾಟಕ ಸಂಗೀತವನ್ನು ಶಾಸ್ತ್ರೀಯವಾಗಿ ಕಲಿಯಿರಿ",
    heroSubtitle: "72 ಮೇಳಕರ್ತ ರಾಗಗಳು, 35 ಸುಳಾದಿ ಸಪ್ತ ತಾಳಗಳು, ತಂಬೂರಿ-ತಬಲಾ ಶ್ರುತಿ ಮತ್ತು 24/7 AI ಗುರು ನೆರವು.",
    heroBtnExplore: "ಜ್ಞಾನ ಕೇಂದ್ರ ವೀಕ್ಷಿಸಿ",
    heroBtnGuru: "AI ಗುರುಗಳನ್ನು ಕೇಳಿ",
    featureTitle: "ಸಂಗೀತ ಸಾಧಕರಿಗೆ ವಿಶೇಷ ವೈಶಿಷ್ಟ್ಯಗಳು",
    featureDesc: "ಗಾಯನ, ವೀಣೆ, ಪಿಟೀಲು ಸಾಧಕರು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.",
    tanpuraTitle: "ತಂಬೂರಿ & ತಬಲಾ ರಿಯಾಝ್ ಸ್ಟುಡಿಯೋ",
    tanpuraSubtitle: "ದೈನಂದಿನ ಸಾಧನೆಗಾಗಿ ಶ್ರುತಿ ಮತ್ತು ತಾಳ ವೇಗವನ್ನು ಸರಿಹೊಂದಿಸಿ.",
    footerRights: "© 2026 ನಾದಬ್ರಹ್ಮ AI. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
  },
  ml: {
    navHome: "ഹോം",
    navKnowledgeHub: "ജ്ഞാന കേന്ദ്രം",
    navAiGuru: "AI ഗുരു ചാറ്റ്",
    navInstruments: "വാദ്യങ്ങൾ",
    navNotes: "പഠന നോട്ടുകൾ",
    navStudentPortal: "വിദ്യാർത്ഥി പോർട്ടൽ",
    navSignIn: "സൈൻ ഇൻ",
    navGetStarted: "ആരംഭിക്കൂ",
    navLogout: "ലോഗ് ഔട്ട്",
    heroTagline: "സനാതന കർണ്ണാടക സംഗീത ശാസ്ത്രവും AI ഗുരുവും",
    heroTitle: "കർണ്ണാടക സംഗീതം ശാസ്ത്രീയമായി പഠിക്കൂ",
    heroSubtitle: "72 മേളകർത്താ രാഗങ്ങൾ, 35 സുളാദി സപ്ത താളങ്ങൾ, തമ്പുരു-തബല ശ്രുതി, 24/7 AI ഗുരു സഹായം.",
    heroBtnExplore: "ജ്ഞാന കേന്ദ്രം കാണുക",
    heroBtnGuru: "AI ഗുരുവിനോട് ചോദിക്കൂ",
    featureTitle: "സംഗീത സാധകർക്കായുള്ള പ്രത്യേക ഫീച്ചറുകൾ",
    featureDesc: "വായ്പാട്ട്, വീണ, വയലിൻ സാധകർക്കും വിദ്യാർത്ഥികൾക്കുമായി നിർമ്മിച്ചത്.",
    tanpuraTitle: "തമ്പുരു & തബല സാധന സ്റ്റുഡിയോ",
    tanpuraSubtitle: "ദിനചര്യ സാധനയ്ക്കായി ശ്രുതിയും താള വേഗവും ക്രമീകരിക്കൂ.",
    footerRights: "© 2026 നാദബ്രഹ്മ AI. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
  },
};
