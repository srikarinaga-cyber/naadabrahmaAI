"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Send, Save, Globe, Languages, CheckCircle2 } from "lucide-react";
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

interface AiGuruChatProps {
  requireAuth?: boolean;
}

const LANGUAGES: { id: SupportedLanguage; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { id: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { id: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { id: "kn", label: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
  { id: "ml", label: "മലയാളം (Malayalam)", flag: "🇮🇳" },
];

const SAMPLE_PROMPTS: Record<SupportedLanguage, string[]> = {
  en: [
    "What is the difference between Mohanam and Hamsadhwani?",
    "Explain the 72 Melakarta System by Venkatamakhin.",
    "What are the 35 Suladi Sapta Talas?",
  ],
  te: [
    "మాయామాలవగౌళ రాగం స్వరస్థానాలు తెలపండి.",
    "శంకరాభరణం మరియు కళ్యాణి రాగాల వ్యత్యాసం ఏమిటి?",
    "ఆది తాళం లఘు మరియు దృతం వివరణ ఇవ్వండి.",
  ],
  hi: [
    "मायामालवगौल राग का परिचय और स्वर स्थान बताएं।",
    "72 मेलकर्ता राग प्रणाली क्या है?",
    "मोहनम और हंसध्वनि राग में क्या अंतर है?",
  ],
  ta: [
    "மாயாமாளவகௌள ராகத்தின் ஆரோஹணம் அவரோஹணம் என்ன?",
    "72 மேளகர்த்தா ராக அமைப்பு விளக்குக.",
    "ஆதி தாளத்தின் அங்கம் மற்றும் அக்ஷரம் விளக்குக.",
  ],
  kn: [
    "ಮಾಯಾಮಾಳವಗೌಳ ರಾಗದ ಸ್ವರಸ್ಥಾನಗಳು ಯಾವುವು?",
    "ಹಂಸಧ್ವನಿ ರಾಗದ ಪರಿಚಯ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ ನೀಡಿ.",
    "72 ಮೇಳಕರ್ತ ರಾಗ ವ್ಯವಸ್ಥೆಯನ್ನು ವಿವರಿಸಿ.",
  ],
  ml: [
    "മായാമാളവഗൗള രാഗത്തിന്റെ സ്വരസ്ഥാനങ്ങൾ എന്തൊക്കെയാണ്?",
    "72 മേളകർത്താ രാഗങ്ങളെ കുറിച്ച് പറയൂ.",
    "മോഹനം ഹംസധ്വനി രാഗങ്ങളുടെ വ്യത്യാസം എന്താണ്?",
  ],
};

export function AiGuruChat({ requireAuth = false }: AiGuruChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [instrument, setInstrument] = useState<Instrument>("vocal");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query");
  const queryTriggered = useRef(false);

  useEffect(() => {
    const storedName = typeof window !== "undefined" ? localStorage.getItem("naada_user_name") : null;
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (initialQuery && !queryTriggered.current) {
      queryTriggered.current = true;
      sendQueryMessage(initialQuery);
    }
  }, [initialQuery]);

  async function sendQueryMessage(queryText: string) {
    const userMsg = queryText.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, instrument, language }),
      });

      if (res.status === 401 && requireAuth) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Please sign in to use AI Guru chat." },
        ]);
        return;
      }

      const json = await res.json();
      const data = (json.data || json) as AiChatResponse;
      const answerContent = data?.answer || (data as unknown as { content?: string })?.content || "Here is the guidance for your query.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answerContent, structured: data },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "AI Guru response generated. Please try again if needed." },
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

  async function saveAsNote(msg: Message, msgIdx: number) {
    if (!msg.content) return;
    const noteTitle = msg.structured?.raga ? `Notes: ${msg.structured.raga}` : "AI Guru Carnatic Notes";
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noteTitle,
          content: msg.content,
        }),
      });
      if (res.ok) {
        setSavedIndex(msgIdx);
        setTimeout(() => setSavedIndex(null), 3000);
      }
    } catch (e) {
      console.warn("Save note error:", e);
    }
  }

  const activeSamplePrompts = SAMPLE_PROMPTS[language] || SAMPLE_PROMPTS.en;

  return (
    <div className="relative traditional-glow overflow-hidden rounded-3xl border-2 border-swara-gold/40 bg-card/98 shadow-2xl">
      {/* Sangeetha Trimurthulu Background Theme Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-top bg-no-repeat opacity-[0.20] dark:opacity-[0.15]"
        style={{ backgroundImage: "url('/trinity-theme-bg.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-swara-gold/30 bg-[#800020]/10 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#800020] to-[#D4AF37] p-1 shadow-md border border-amber-300/40">
            <CarnaticMusicLogo className="size-7" />
          </div>
          <div>
            <p className="font-serif text-base font-extrabold text-[#800020] dark:text-amber-200">Multilingual AI Carnatic Guru</p>
            <p className="text-xs font-bold text-foreground/90">
              {userName ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                  Welcome {userName}! Full access and note saving active.
                </span>
              ) : (
                "Ask doubts in Telugu, Tamil, Kannada, Malayalam, Hindi, or English"
              )}
            </p>
          </div>
        </div>

        <Badge className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 text-[11px] font-extrabold px-3 py-1">
          24/7 AI Guru Online
        </Badge>
      </div>

      {/* Multilingual & Instrument Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-swara-gold/30 bg-muted/60 px-6 py-3 text-xs font-bold backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Languages className="size-4 text-[#800020]" />
          <span className="text-xs font-extrabold text-[#800020] dark:text-amber-200">Select Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="rounded-xl border-2 border-swara-gold/50 bg-card px-3 py-1.5 text-xs font-extrabold text-[#800020] focus:outline-none focus:ring-2 focus:ring-[#800020] shadow-sm"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-foreground">Instrument:</span>
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value as Instrument)}
            className="rounded-xl border-2 border-border bg-card px-3 py-1.5 text-xs font-extrabold text-foreground shadow-sm"
          >
            {INSTRUMENTS.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Multilingual Sample Prompt Chips */}
      <div className="px-6 py-3 bg-muted/40 border-b border-swara-gold/20 flex flex-wrap items-center gap-2 backdrop-blur-sm">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#800020] dark:text-amber-300 self-center">
          SAMPLE PROMPTS:
        </span>
        {activeSamplePrompts.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => sendQueryMessage(promptText)}
            className="text-xs font-bold bg-card/95 hover:bg-[#800020] hover:text-white border-2 border-swara-gold/40 text-foreground px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="h-96 overflow-y-auto space-y-4 p-6 relative z-10">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-3 bg-card/85 backdrop-blur-md rounded-3xl border-2 border-swara-gold/30 p-6 my-2 shadow-lg max-w-lg mx-auto">
            <CarnaticMusicLogo className="size-16 mx-auto mb-2" />
            <p className="text-base font-extrabold text-[#800020] dark:text-amber-200">
              Welcome to Naadabrahma Multilingual AI Guru!
            </p>
            <p className="text-xs font-bold text-foreground/90 leading-relaxed max-w-md mx-auto">
              Ask any Carnatic music question in <strong className="text-[#800020] dark:text-amber-300 font-extrabold">Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Hindi (हिन्दी), or English</strong>.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-semibold leading-relaxed shadow-sm ${
              msg.role === "user" ? "bg-[#800020] text-white font-bold" : "bg-card/95 text-card-foreground border-2 border-swara-gold/30 backdrop-blur-md font-medium"
            }`}>
              <p className="whitespace-pre-wrap font-sans text-xs font-semibold">{msg.content}</p>
              {msg.structured?.arohanam && (
                <div className="mt-2.5 pt-2 border-t border-swara-gold/30 text-xs space-y-1 font-mono bg-muted/40 p-2.5 rounded-xl">
                  {msg.structured.arohanam && <p className="font-bold text-emerald-800 dark:text-emerald-300"><strong>Arohanam:</strong> {msg.structured.arohanam}</p>}
                  {msg.structured.avarohanam && <p className="font-bold text-emerald-800 dark:text-emerald-300"><strong>Avarohanam:</strong> {msg.structured.avarohanam}</p>}
                  {msg.structured.practiceTips && msg.structured.practiceTips.length > 0 && (
                    <p className="font-sans font-bold text-foreground"><strong>Tips:</strong> {msg.structured.practiceTips.join("; ")}</p>
                  )}
                </div>
              )}
              {msg.role === "assistant" && (
                <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between">
                  <button
                    onClick={() => saveAsNote(msg, i)}
                    className="flex items-center gap-1 text-[11px] text-[#800020] dark:text-amber-300 hover:underline font-extrabold"
                  >
                    <Save className="size-3.5" /> Save to Study Notes
                  </button>
                  {savedIndex === i && (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Saved to Notes!
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card/90 rounded-2xl px-4 py-3 text-xs font-bold text-foreground flex items-center gap-2 border border-swara-gold/30 shadow-sm">
              <span className="size-3.5 border-2 border-[#800020] border-t-transparent rounded-full animate-spin" />
              AI Guru is composing answer in {LANGUAGES.find((l) => l.id === language)?.label}...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="border-t border-swara-gold/30 px-6 py-4 bg-background/90 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              language === "te"
                ? "సందేహాలు అడగండి (ఉదా: రాగం, తాళం)..."
                : language === "hi"
                ? "प्रश्न पूछें (उदा: राग, ताल, स्वर)..."
                : language === "ta"
                ? "கேள்விகள் கேட்கவும் (எ.கா: ராகம், தாளம்)..."
                : language === "kn"
                ? "ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ (ಉದಾ: ರಾಗ, ತಾಳ)..."
                : language === "ml"
                ? "ചോദ്യങ്ങൾ ചോദിക്കൂ (ഉദാ: രാഗം, താളം)..."
                : "Ask about ragas, talas, theory in your language..."
            }
            className="flex-1 rounded-2xl border-2 border-swara-gold/40 bg-card px-4 py-3 text-xs font-extrabold text-foreground placeholder:text-muted-foreground/80 placeholder:font-bold focus:outline-none focus:ring-2 focus:ring-[#800020] shadow-sm"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            size="icon"
            className="bg-[#800020] hover:bg-[#A00028] text-white shrink-0 rounded-2xl size-11 shadow-md"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
