"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Languages, Globe, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INSTRUMENTS, type Instrument } from "@/lib/ai/instruments";
import type { AiChatResponse, SupportedLanguage } from "@/lib/ai/context";
import { CarnaticMusicLogo } from "@/components/ui/music-logo";

interface Message {
  role: "user" | "assistant";
  content: string;
  structured?: AiChatResponse;
}

const LANGUAGES: { id: SupportedLanguage; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { id: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { id: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { id: "kn", label: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
  { id: "ml", label: "മലയാളം (Malayalam)", flag: "🇮🇳" },
];

const UI_STRINGS: Record<
  SupportedLanguage,
  {
    headerSub: string;
    instrumentLabel: string;
    welcomeTitle: string;
    welcomeDesc: string;
    arohanamLabel: string;
    avarohanamLabel: string;
    loadingText: string;
    placeholder: string;
    launcherBadge: string;
    sampleHeader: string;
  }
> = {
  en: {
    headerSub: "24/7 AI Carnatic Assistant with Trinity Blessings",
    instrumentLabel: "Instrument:",
    welcomeTitle: "Welcome to Naadabrahma AI Guru!",
    welcomeDesc: "Ask any Carnatic music question in English, Telugu, Hindi, Tamil, Kannada, or Malayalam.",
    arohanamLabel: "Arohana:",
    avarohanamLabel: "Avarohana:",
    loadingText: "AI Guru is analyzing...",
    placeholder: "Ask about ragas, talas, theory in your language...",
    launcherBadge: "Ask AI Guru!",
    sampleHeader: "Sample Prompts:",
  },
  te: {
    headerSub: "సంగీత త్రిమూర్తుల ఆశీస్సులతో 24/7 AI సహాయకం",
    instrumentLabel: "వాద్యం:",
    welcomeTitle: "నాదబ్రహ్మ AI గురు చాట్‌బాట్‌కి స్వాగతం!",
    welcomeDesc: "ఏదైనా కర్ణాటక సంగీత సందేహాన్ని తెలుగు (తెలుగు లిపిలో), ఇంగ్లీష్, హిందీ, తమిళం, కన్నడ, మలయాళంలో అడగండి.",
    arohanamLabel: "ఆరోహణ:",
    avarohanamLabel: "అవరోహణ:",
    loadingText: "AI గురు విశ్లేషిస్తున్నారు...",
    placeholder: "రాగాలు, తాళాలు, సిద్ధాంతం గురించి అడగండి...",
    launcherBadge: "అడిగి తెలుసుకోండి!",
    sampleHeader: "ఉదాహరణ ప్రశ్నలు:",
  },
  hi: {
    headerSub: "संगीत त्रिमूर्ति आशीर्वाद से 24/7 एआई सहायक",
    instrumentLabel: "वाद्य:",
    welcomeTitle: "नादब्रह्म AI गुरु चैटबॉट में आपका स्वागत है!",
    welcomeDesc: "कर्नाटक संगीत का कोई भी प्रश्न हिंदी, अंग्रेजी, तेलुगु या अन्य भाषाओं में पूछें।",
    arohanamLabel: "आरोहण:",
    avarohanamLabel: "अवरोहण:",
    loadingText: "AI गुरु विश्लेषण कर रहे हैं...",
    placeholder: "राग, ताल, सिद्धांत के बारे में पूछें...",
    launcherBadge: "AI गुरु से पूछें!",
    sampleHeader: "उदाहरण प्रश्न:",
  },
  ta: {
    headerSub: "சங்கீத திரிமூர்த்திகளின் ஆசியுடன் 24/7 AI உதவியாளர்",
    instrumentLabel: "வாத்தியம்:",
    welcomeTitle: "நாதபிரம்மா AI குருவுக்கு நல்வரவு!",
    welcomeDesc: "கர்நாடக இசை சந்தேகங்களை தமிழ், ஆங்கிலம் அல்லது பிற மொழிகளில் கேட்கவும்.",
    arohanamLabel: "ஆரோஹணம்:",
    avarohanamLabel: "அவரோஹணம்:",
    loadingText: "AI குரு ஆராய்கிறார்...",
    placeholder: "ராகங்கள், தாளங்கள் பற்றி கேட்கவும்...",
    launcherBadge: "AI குருவிடம் கேட்கவும்!",
    sampleHeader: "மாதிரி கேள்விகள்:",
  },
  kn: {
    headerSub: "ಸಂಗೀತ ತ್ರಿಮೂರ್ತಿಗಳ ಆಶೀರ್ವಾದದೊಂದಿಗೆ 24/7 AI ಸಹಾಯಕ",
    instrumentLabel: "ವಾದ್ಯ:",
    welcomeTitle: "ನಾದಬ್ರಹ್ಮ AI ಗುರು ಚಾಟ್‌ಬಾಟ್‌ಗೆ ಸ್ವಾಗತ!",
    welcomeDesc: "ಕರ್ನಾಟಕ ಸಂಗೀತದ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಇತರ ಭಾಷೆಗಳಲ್ಲಿ ಕೇಳಿ.",
    arohanamLabel: "ಆರೋಹಣ:",
    avarohanamLabel: "ಅವರೋಹಣ:",
    loadingText: "AI ಗುರು ವಿಶ್ಲೇಷಿಸುತ್ತಿದ್ದಾರೆ...",
    placeholder: "ರಾಗಗಳು, ತಾಳಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
    launcherBadge: "AI ಗುರುಗಳನ್ನು ಕೇಳಿ!",
    sampleHeader: "ಉದಾಹರಣೆ ಪ್ರಶ್ನೆಗಳು:",
  },
  ml: {
    headerSub: "സംഗീത ത്രിമൂർത്തികളുടെ അനുഗ്രഹത്തോടെ 24/7 AI സഹായി",
    instrumentLabel: "വാദ്യം:",
    welcomeTitle: "നാദബ്രഹ്മ AI ഗുരു ഹാർദ്ദവമായി സ്വാഗതം ചെയ്യുന്നു!",
    welcomeDesc: "കർണ്ണാടക സംഗീത സംശയങ്ങൾ മലയാളം, ഇംഗ്ലീഷ് അല്ലെങ്കിൽ മറ്റ് ഭാഷകളിൽ ചോദിക്കൂ.",
    arohanamLabel: "ആരോഹണം:",
    avarohanamLabel: "അവരോഹണം:",
    loadingText: "AI ഗുരു വിശകലനം ചെയ്യുന്നു...",
    placeholder: "രാഗങ്ങൾ, താളങ്ങൾ ചോദിക്കൂ...",
    launcherBadge: "AI ഗുരുവിനോട് ചോദിക്കൂ!",
    sampleHeader: "മാതൃകാ ചോദ്യങ്ങൾ:",
  },
};

const SAMPLE_PROMPTS: Record<SupportedLanguage, string[]> = {
  en: [
    "About kalyani raagam",
    "What is the difference between Mohanam and Hamsadhwani?",
    "What are the 35 Suladi Sapta Talas?",
  ],
  te: [
    "కళ్యాణి రాగం గురించి వివరించండి.",
    "శంకరాభరణం మరియు కళ్యాణి రాగాల వ్యత్యాసం ఏమిటి?",
    "35 సుళాది సప్త తాళాలు ఏవి?",
  ],
  hi: [
    "कल्याणी राग का परिचय दें।",
    "35 सुलादि सप्त ताल क्या हैं?",
    "मोहनम और हंसध्वनि में अंतर बताएं।",
  ],
  ta: [
    "கல்யாணி ராகம் பற்றி விளக்குக.",
    "35 சூளாதி சப்த தாளங்கள் எவை?",
    "மோஹனம் மற்றும் ஹம்சத்வனி வித்தியாசம் என்ன?",
  ],
  kn: [
    "ಕಲ್ಯಾಣಿ ರಾಗದ ವಿವರಣೆ ನೀಡಿ.",
    "35 ಸುಳಾದಿ ಸಪ್ತ ತಾಳಗಳು ಯಾವುವು?",
    "ಮೋಹನ ಮತ್ತು ಹಂಸಧ್ವನಿ ವ್ಯತ್ಯಾಸವೇನು?",
  ],
  ml: [
    "കല്യാണി രാഗത്തെ കുറിച്ച് പറയൂ.",
    "35 സുളാദി സപ്ത താളങ്ങൾ ഏവ?",
    "മോഹനം ഹംസധ്വനി വ്യത്യാസം എന്താണ്?",
  ],
};

export function FloatingAiGuruPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [instrument, setInstrument] = useState<Instrument>("vocal");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  async function sendQueryMessage(queryText: string) {
    const userMsg = queryText.trim();
    if (!userMsg) return;

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, instrument, language }),
      });

      const json = await res.json();
      const data = (json.data || json) as AiChatResponse;
      const answerContent =
        data?.answer ||
        (data as unknown as { content?: string })?.content ||
        "Here is the guidance for your query.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answerContent, structured: data },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "AI Guru response generated. Please try again if needed.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    await sendQueryMessage(userMsg);
  }

  const activeUi = UI_STRINGS[language] || UI_STRINGS.en;
  const activeSamplePrompts = SAMPLE_PROMPTS[language] || SAMPLE_PROMPTS.en;

  return (
    <>
      {/* Floating Launcher Icon in Bottom-Right Corner */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div className="hidden md:flex items-center gap-2.5 rounded-2xl border-2 border-swara-gold/50 bg-card/95 px-4 py-2 text-xs font-bold shadow-xl backdrop-blur-md animate-bounce">
            <div className="size-6 rounded-full overflow-hidden bg-black border border-swara-gold/60 shrink-0 flex items-center justify-center p-0.5">
              <img src="/colorful-music-notes.png" alt="AI Guru Music Notes" className="size-full object-contain" />
            </div>
            <span className="font-serif font-extrabold text-[#800020]">AI Guru</span>
            <span className="text-muted-foreground font-bold">{activeUi.launcherBadge}</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex size-15 items-center justify-center rounded-full bg-black text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none ring-4 ring-[#D4AF37]/50 border-2 border-swara-gold/60 overflow-hidden"
          aria-label="Open AI Guru Chat"
        >
          {isOpen ? (
            <div className="flex size-full items-center justify-center bg-gradient-to-tr from-[#800020] to-[#D4AF37]">
              <X className="size-7 text-white" />
            </div>
          ) : (
            <div className="relative flex size-full items-center justify-center p-1 bg-black">
              <img
                src="/colorful-music-notes.png"
                alt="AI Guru Music Notes"
                className="size-full object-contain rounded-full"
              />
              <span className="absolute top-0 right-0 flex size-3.5 z-10">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-300 opacity-75"></span>
                <span className="relative inline-flex size-3.5 rounded-full bg-amber-400 border border-amber-600"></span>
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Floating Chatbot Popup Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[480px] max-h-[620px] h-[580px] flex flex-col rounded-3xl border-2 border-[#D4AF37]/40 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Sangeetha Trimurthulu Background Theme Overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-top bg-no-repeat opacity-[0.25] dark:opacity-[0.20]"
            style={{ backgroundImage: "url('/trinity-theme-bg.png')" }}
          />
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-background/30 via-background/10 to-background/50" />

          {/* Modal Header with Carnatic Music Logo */}
          <div className="relative z-10 flex items-center justify-between border-b border-swara-gold/30 bg-[#800020]/95 px-5 py-3.5 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#800020] p-1 shadow-md border border-amber-300/40 shrink-0">
                <CarnaticMusicLogo className="size-7" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-extrabold tracking-wide text-amber-100 flex items-center gap-1.5">
                  AI Guru Chat Bot
                  <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/40 text-[9px] font-extrabold py-0">
                    Online
                  </Badge>
                </h3>
                <p className="text-[11px] font-bold text-amber-200 leading-tight">
                  {activeUi.headerSub}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors"
                title="Minimize"
              >
                <Minimize2 className="size-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors"
                title="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Settings Bar (Language & Instrument) */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-swara-gold/30 bg-muted/60 px-4 py-2 text-xs backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <Languages className="size-3.5 text-[#800020]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="rounded-lg border-2 border-swara-gold/50 bg-card px-2 py-1 text-xs font-extrabold text-[#800020] focus:outline-none shadow-xs"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold text-foreground">
                {activeUi.instrumentLabel}
              </span>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value as Instrument)}
                className="rounded-lg border-2 border-border bg-card px-2 py-1 text-xs font-extrabold text-foreground shadow-xs"
              >
                {INSTRUMENTS.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sample Prompts Bar */}
          <div className="relative z-10 px-4 py-2.5 bg-muted/30 border-b border-swara-gold/20 flex flex-wrap items-center gap-1.5 backdrop-blur-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#800020] dark:text-amber-300 self-center">
              {activeUi.sampleHeader}
            </span>
            {activeSamplePrompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => sendQueryMessage(promptText)}
                className="text-[10px] font-bold bg-card/95 hover:bg-[#800020] hover:text-white border-2 border-swara-gold/30 text-foreground px-2.5 py-1 rounded-lg transition-all shadow-2xs text-left"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.length === 0 && (
              <div className="text-center py-5 space-y-2.5 bg-card/90 backdrop-blur-md rounded-2xl border-2 border-swara-gold/30 p-4 my-2 shadow-lg relative overflow-hidden">
                <CarnaticMusicLogo className="size-12 mx-auto" />
                
                {/* Colorful Treble Clef Musical Notes Image directly under logo */}
                <div className="mx-auto my-1.5 size-28 flex items-center justify-center rounded-2xl bg-black border-2 border-swara-gold/40 p-1 shadow-md">
                  <img
                    src="/colorful-music-notes.png"
                    alt="Colorful Musical Notes"
                    className="size-full object-contain rounded-xl"
                  />
                </div>

                <h4 className="text-xs font-extrabold text-[#800020] dark:text-amber-200">
                  {activeUi.welcomeTitle}
                </h4>
                <p className="text-[11px] font-bold text-foreground/90 leading-relaxed">
                  {activeUi.welcomeDesc}
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed font-semibold ${
                    msg.role === "user"
                      ? "bg-[#800020] text-white rounded-br-none font-bold"
                      : "bg-card/95 text-card-foreground border-2 border-swara-gold/30 rounded-bl-none backdrop-blur-sm font-sans"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs font-semibold">
                    {msg.content}
                  </div>

                  {msg.structured?.arohanam && (
                    <div className="mt-2.5 pt-2 border-t border-swara-gold/30 text-[11px] font-mono bg-muted/40 p-2 rounded-xl">
                      <p className="text-emerald-800 dark:text-emerald-300 font-extrabold">
                        {activeUi.arohanamLabel} {msg.structured.arohanam}
                      </p>
                      {msg.structured.avarohanam && (
                        <p className="text-emerald-800 dark:text-emerald-300 font-extrabold">
                          {activeUi.avarohanamLabel} {msg.structured.avarohanam}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs font-bold text-foreground bg-card/90 p-2.5 rounded-xl border border-swara-gold/30 w-fit shadow-xs">
                <Sparkles className="size-4 text-[#800020] animate-spin" />
                <span>{activeUi.loadingText}</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Footer Bar */}
          <div className="relative z-10 p-3 bg-background/95 border-t border-swara-gold/30 flex items-center gap-2 backdrop-blur-md">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={activeUi.placeholder}
              className="flex-1 rounded-xl border-2 border-swara-gold/40 bg-card px-3 py-2 text-xs font-extrabold text-foreground placeholder:text-muted-foreground/80 placeholder:font-bold focus:outline-none focus:ring-2 focus:ring-[#800020] shadow-xs"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              size="sm"
              className="rounded-xl bg-[#800020] hover:bg-[#A00028] text-white px-3 py-2 text-xs font-bold shadow-md"
            >
              <Send className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
