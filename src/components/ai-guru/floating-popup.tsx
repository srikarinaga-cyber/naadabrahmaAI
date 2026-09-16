"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, MessageSquare, X, Send, Languages, Globe, Minimize2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INSTRUMENTS, type Instrument } from "@/lib/ai/instruments";
import type { AiChatResponse, SupportedLanguage } from "@/lib/ai/context";

interface Message {
  role: "user" | "assistant";
  content: string;
  structured?: AiChatResponse;
}

const LANGUAGES: { id: SupportedLanguage; label: string; flag: string }[] = [
  { id: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { id: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { id: "kn", label: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
  { id: "ml", label: "മലയാളം (Malayalam)", flag: "🇮🇳" },
];

const SAMPLE_PROMPTS: Record<SupportedLanguage, string[]> = {
  te: [
    "కళ్యాణి రాగం గురించి వివరించండి.",
    "శంకరాభరణం మరియు కళ్యాణి రాగాల వ్యత్యాసం ఏమిటి?",
    "35 సుళాది సప్త తాళాలు ఏవి?",
  ],
  en: [
    "About kalyani raagam",
    "What is the difference between Mohanam and Hamsadhwani?",
    "What are the 35 Suladi Sapta Talas?",
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
  const [language, setLanguage] = useState<SupportedLanguage>("te");
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
        "హియర్ ఈజ్ ది గైడెన్స్ ఫోర్ యువర్ క్వెరీ.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answerContent, structured: data },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "AI గురు సమాధానం సిద్ధమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
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

  const activeSamplePrompts = SAMPLE_PROMPTS[language] || SAMPLE_PROMPTS.te;

  return (
    <>
      {/* Floating Launcher Icon in Bottom-Right Corner */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div className="hidden md:flex items-center gap-2 rounded-2xl border border-swara-gold/40 bg-card/90 px-4 py-2 text-xs font-semibold shadow-xl backdrop-blur-md animate-bounce">
            <span className="text-kumkum font-serif">🕉️ AI Guru</span>
            <span className="text-muted-foreground">అడిగి తెలుసుకోండి!</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#800020] via-[#A00028] to-[#D4AF37] text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none ring-4 ring-[#D4AF37]/30"
          aria-label="Open AI Guru Chat"
        >
          {isOpen ? (
            <X className="size-6 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Sparkles className="size-6 text-yellow-200 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-yellow-500"></span>
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

          {/* Modal Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-swara-gold/30 bg-[#800020]/90 px-5 py-3.5 text-white shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Sparkles className="size-5 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold tracking-wide text-amber-100 flex items-center gap-1.5">
                  AI Guru Chat Bot
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-[9px] font-bold py-0">
                    Online
                  </Badge>
                </h3>
                <p className="text-[10px] text-amber-200/80">
                  సం సంగీత త్రిమూర్తుల ఆశీస్సులతో 24/7 AI సహాయకం
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors"
              >
                <Minimize2 className="size-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Settings Bar (Language & Instrument) */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-muted/40 px-4 py-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Languages className="size-3.5 text-[#800020]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="rounded-lg border border-swara-gold/40 bg-background/90 px-2 py-1 text-xs font-bold text-[#800020] focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground">వాద్యం:</span>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value as Instrument)}
                className="rounded-lg border border-border bg-background/90 px-2 py-1 text-xs font-medium"
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
          <div className="relative z-10 px-4 py-2 bg-muted/20 border-b border-border/40 flex flex-wrap gap-1.5">
            {activeSamplePrompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => sendQueryMessage(promptText)}
                className="text-[10px] bg-card/90 hover:bg-[#800020]/10 hover:border-[#800020]/40 border border-swara-gold/30 text-foreground px-2.5 py-1 rounded-lg transition-all shadow-2xs text-left"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-2 bg-card/60 backdrop-blur-sm rounded-2xl border border-swara-gold/20 p-4 my-2">
                <Globe className="size-8 text-[#800020]/60 mx-auto" />
                <h4 className="text-xs font-bold text-foreground">
                  నాదబ్రహ్మ AI గురు చాట్‌బాట్‌కి స్వాగతం!
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  ఏదైనా కర్ణాటక సంగీత సందేహాన్ని <strong className="text-[#800020]">తెలుగు (తెలుగు లిపిలో), ఇంగ్లీష్, హిందీ, తమిళం, కన్నడ, మలయాళంలో</strong> టైప్ చేసి అడగండి.
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
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#800020] text-white rounded-br-none"
                      : "bg-card/95 text-card-foreground border border-swara-gold/30 rounded-bl-none backdrop-blur-sm font-sans"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs">
                    {msg.content}
                  </div>

                  {msg.structured?.arohanam && (
                    <div className="mt-2.5 pt-2 border-t border-swara-gold/30 text-[11px] font-mono bg-muted/40 p-2 rounded-xl">
                      <p className="text-emerald-700 dark:text-emerald-400 font-bold">
                        ఆరోహణ: {msg.structured.arohanam}
                      </p>
                      {msg.structured.avarohanam && (
                        <p className="text-emerald-700 dark:text-emerald-400 font-bold">
                          అవరోహణ: {msg.structured.avarohanam}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/80 p-2.5 rounded-xl border border-swara-gold/20 w-fit">
                <Sparkles className="size-4 text-[#800020] animate-spin" />
                <span>AI గురు విశ్లేషిస్తున్నారు...</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Footer Bar */}
          <div className="relative z-10 p-3 bg-background/95 border-t border-border/80 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="రాగాలు, తాళాలు, సిద్ధాంతం గురించి అడగండి..."
              className="flex-1 rounded-xl border border-swara-gold/40 bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#800020]"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              size="sm"
              className="rounded-xl bg-[#800020] hover:bg-[#A00028] text-white px-3 py-2 text-xs"
            >
              <Send className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
