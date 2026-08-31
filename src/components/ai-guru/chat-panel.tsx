"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Send, Save, Globe, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INSTRUMENTS, type Instrument } from "@/lib/ai/instruments";
import type { AiChatResponse, SupportedLanguage } from "@/lib/ai/context";

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
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query");
  const queryTriggered = useRef(false);

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
      const data = json.data as AiChatResponse;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, structured: data },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
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

  async function saveAsNote(msg: Message) {
    if (!msg.structured) return;
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: msg.structured.raga ? `Notes: ${msg.structured.raga}` : "AI Guru Notes",
        content: msg.content,
      }),
    });
  }

  const activeSamplePrompts = SAMPLE_PROMPTS[language] || SAMPLE_PROMPTS.en;

  return (
    <div className="traditional-glow overflow-hidden rounded-3xl border border-swara-gold/25 bg-card shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-kumkum/5 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-kumkum/15">
            <Sparkles className="size-5 text-kumkum" />
          </div>
          <div>
            <p className="font-serif text-base font-bold text-kumkum">Multilingual AI Carnatic Guru</p>
            <p className="text-xs text-muted-foreground">Ask doubts in Telugu, Tamil, Kannada, Malayalam, Hindi, or English</p>
          </div>
        </div>

        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
          24/7 AI Guru Online
        </Badge>
      </div>

      {/* Multilingual & Instrument Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-6 py-3">
        <div className="flex items-center gap-2">
          <Languages className="size-4 text-swara-gold" />
          <span className="text-xs font-semibold text-foreground">Select Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="rounded-xl border border-swara-gold/30 bg-background px-3 py-1.5 text-xs font-bold text-kumkum focus:outline-none focus:ring-1 focus:ring-kumkum"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Instrument:</span>
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value as Instrument)}
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium"
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
      <div className="px-6 py-2.5 bg-muted/20 border-b border-border/50 flex flex-wrap gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground self-center">
          Sample Prompts:
        </span>
        {activeSamplePrompts.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => sendQueryMessage(promptText)}
            className="text-[11px] bg-card hover:bg-kumkum/10 hover:border-kumkum/30 border border-swara-gold/20 text-foreground px-3 py-1 rounded-xl transition-all shadow-xs"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="h-96 overflow-y-auto space-y-4 p-6">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <Globe className="size-10 text-kumkum/40 mx-auto" />
            <p className="text-sm font-semibold text-foreground">
              Welcome to Naadabrahma Multilingual AI Guru!
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Ask any Carnatic music question in <strong className="text-kumkum">Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Hindi (हिन्दी), or English</strong>.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user" ? "bg-kumkum text-white" : "bg-muted text-foreground"
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.structured?.arohanam && (
                <div className="mt-2 pt-2 border-t border-border/50 text-xs space-y-1 font-mono">
                  {msg.structured.arohanam && <p><strong>Arohanam:</strong> {msg.structured.arohanam}</p>}
                  {msg.structured.avarohanam && <p><strong>Avarohanam:</strong> {msg.structured.avarohanam}</p>}
                  {msg.structured.practiceTips && msg.structured.practiceTips.length > 0 && (
                    <p className="font-sans"><strong>Tips:</strong> {msg.structured.practiceTips.join("; ")}</p>
                  )}
                </div>
              )}
              {msg.role === "assistant" && msg.structured && (
                <button
                  onClick={() => saveAsNote(msg)}
                  className="mt-2 flex items-center gap-1 text-[10px] text-kumkum hover:underline font-bold"
                >
                  <Save className="size-3" /> Save to Study Notes
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
              <span className="size-3 border-2 border-kumkum border-t-transparent rounded-full animate-spin" />
              AI Guru is composing answer in {LANGUAGES.find((l) => l.id === language)?.label}...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="border-t border-border px-6 py-4">
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
            className="flex-1 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kumkum/30"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            size="icon"
            className="bg-kumkum hover:bg-kumkum-light shrink-0 rounded-2xl size-11"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
