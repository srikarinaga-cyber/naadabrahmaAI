"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Send, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSTRUMENTS, type Instrument } from "@/lib/ai/instruments";
import type { AiChatResponse } from "@/lib/ai/context";

interface Message {
  role: "user" | "assistant";
  content: string;
  structured?: AiChatResponse;
}

interface AiGuruChatProps {
  requireAuth?: boolean;
}

export function AiGuruChat({ requireAuth = false }: AiGuruChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [instrument, setInstrument] = useState<Instrument>("vocal");
  const [language, setLanguage] = useState<"te" | "en" | "hi" | "kn" | "ta">("en");
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

  return (
    <div className="traditional-glow overflow-hidden rounded-2xl border border-swara-gold/20 bg-card shadow-lg">
      <div className="flex items-center gap-3 border-b border-border bg-kumkum/5 px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-full bg-kumkum/15">
          <Sparkles className="size-4 text-kumkum" />
        </div>
        <div>
          <p className="text-sm font-extrabold">AI Guru</p>
          <p className="text-xs font-bold text-muted-foreground">Multilingual Carnatic assistant • EN / TE / HI / KN / TA</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3">
        <select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value as Instrument)}
          className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
        >
          {INSTRUMENTS.map((i) => (
            <option key={i.id} value={i.id}>{i.label}</option>
          ))}
        </select>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "te" | "en" | "hi" | "kn" | "ta")}
          className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-bold"
        >
          <option value="en">🇬🇧 English</option>
          <option value="te">🇮🇳 తెలుగు (Telugu)</option>
          <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
          <option value="kn">🇮🇳 ಕನ್ನಡ (Kannada)</option>
          <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
        </select>
      </div>

      <div className="h-96 overflow-y-auto space-y-4 p-5">
        {messages.length === 0 && (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm font-bold text-muted-foreground">
              Ask about ragas, talas, theory, or practice tips...
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "What is Mayamalavagowla?",
                "Explain Adi Tala",
                "Famous kritis of Tyagaraja",
                "Kalyani raga arohana",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-xs font-bold px-3 py-1.5 rounded-full border border-swara-gold/30 bg-swara-gold/10 text-swara-gold hover:bg-swara-gold/20 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user" ? "bg-kumkum text-white" : "bg-muted text-foreground"
            }`}>
              <p>{msg.content}</p>
              {msg.structured?.arohanam && (
                <div className="mt-2 pt-2 border-t border-border/50 text-xs space-y-1">
                  {msg.structured.arohanam && <p><strong>Arohanam:</strong> {msg.structured.arohanam}</p>}
                  {msg.structured.avarohanam && <p><strong>Avarohanam:</strong> {msg.structured.avarohanam}</p>}
                  {msg.structured.practiceTips && msg.structured.practiceTips.length > 0 && (
                    <p><strong>Tips:</strong> {msg.structured.practiceTips.join("; ")}</p>
                  )}
                </div>
              )}
              {msg.role === "assistant" && msg.structured && (
                <button
                  onClick={() => saveAsNote(msg)}
                  className="mt-2 flex items-center gap-1 text-[10px] text-kumkum hover:underline"
                >
                  <Save className="size-3" /> Save as note
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-3 text-sm text-muted-foreground">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about ragas, talas, theory..."
            className="flex-1 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kumkum/30"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            size="icon"
            className="bg-kumkum hover:bg-kumkum-light shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
