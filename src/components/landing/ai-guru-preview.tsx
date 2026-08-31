"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Calendar,
  GitCompare,
  HelpCircle,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  {
    icon: HelpCircle,
    title: "Ask Music Doubts",
    description: "Get instant explanations for raga theory, swara patterns, and performance nuances.",
    // Opens AI Guru with a sample music doubt query
    href: "/ai-guru?query=Explain+raga+theory+and+swara+patterns+in+Carnatic+music",
    color: "hover:border-kumkum/40 hover:bg-kumkum/5",
    badge: "Ask →",
  },
  {
    icon: GitCompare,
    title: "Compare Ragas",
    description: "Side-by-side analysis of Melakarta and Janya ragas with swara differences highlighted.",
    href: "/ai-guru?query=Compare+Mohanam+and+Hamsadhwani+ragas+with+swara+differences",
    color: "hover:border-marigold/40 hover:bg-marigold/5",
    badge: "Compare →",
  },
  {
    icon: NotebookPen,
    title: "Generate Notes & Quizzes",
    description: "AI-crafted study notes and practice quizzes tailored to your exam level.",
    href: "/student/notes",
    color: "hover:border-swara-gold/40 hover:bg-swara-gold/5",
    badge: "Generate →",
  },
  {
    icon: Calendar,
    title: "Practice Schedules",
    description: "Personalized daily practice plans based on your progress and weak areas.",
    href: "/ai-guru?query=Create+a+7-day+Carnatic+music+practice+schedule+for+a+beginner",
    color: "hover:border-green-500/40 hover:bg-green-500/5",
    badge: "Plan →",
  },
];

const sampleConversation = [
  {
    role: "user" as const,
    message: "What is the difference between Mohanam and Hamsadhwani?",
  },
  {
    role: "assistant" as const,
    message:
      "Both are pentatonic Janya ragas derived from Dheerasankarabharanam (29th Melakarta). Mohanam uses S R2 G3 P D2 S while Hamsadhwani uses S R2 G3 P N3 S — the key difference is D2 vs N3 in the ascent.",
  },
];

export function AiGuruPreview() {
  return (
    <section
      id="ai-guru"
      className="border-y border-swara-gold/15 bg-sandalwood-dark/40 py-24 dark:bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row-reverse">
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="border-kumkum/20 text-kumkum">
              <Bot className="mr-1 size-3" />
              AI Guru
            </Badge>
            <h2 className="font-serif text-3xl font-black text-kumkum md:text-4xl">
              Your Personal Carnatic Music Guru
            </h2>
            <p className="leading-relaxed font-semibold text-muted-foreground">
              Powered by Gemini AI with RAG architecture over our curated music database.
              Ask doubts, compare ragas, generate quizzes, and receive theory
              explanations — available 24/7 for every instrument.
            </p>

            {/* ── 4 Clickable Module Cards ── */}
            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={cap.href}
                    className={`group flex flex-col rounded-xl border border-swara-gold/15 bg-card/60 p-4 backdrop-blur-sm transition-all duration-200 dark:bg-card/40 ${cap.color} cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <cap.icon className="size-5 text-kumkum group-hover:scale-110 transition-transform" aria-hidden />
                      <span className="text-[10px] font-black uppercase tracking-widest text-kumkum/60 group-hover:text-kumkum transition-colors">
                        {cap.badge}
                      </span>
                    </div>
                    <p className="text-sm font-extrabold text-foreground group-hover:text-kumkum transition-colors">
                      {cap.title}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground leading-relaxed">
                      {cap.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-kumkum hover:bg-kumkum-light font-bold"
                render={<Link href="/student/notes" />}
              >
                Generate Study Notes
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="border-swara-gold/40 text-kumkum font-bold"
                render={<Link href="/ai-guru" />}
              >
                Chat with AI Guru
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="traditional-glow overflow-hidden rounded-2xl border border-swara-gold/20 bg-card shadow-lg dark:bg-card/80">
              <div className="flex items-center gap-3 border-b border-border bg-kumkum/5 px-5 py-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-kumkum/15">
                  <Sparkles className="size-4 text-kumkum" />
                </div>
                <div>
                  <p className="text-sm font-extrabold">AI Guru</p>
                  <p className="text-xs font-bold text-muted-foreground">
                    Multilingual Carnatic assistant
                  </p>
                </div>
                <Badge className="ml-auto bg-marigold/15 text-marigold font-bold" variant="secondary">
                  Online
                </Badge>
              </div>

              <div className="space-y-4 p-5">
                {sampleConversation.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-semibold leading-relaxed ${
                        msg.role === "user"
                          ? "bg-kumkum text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick action chips inside preview card */}
              <div className="border-t border-border px-5 py-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Ask in Telugu", "Compare Ragas", "Practice Plan"].map(label => (
                    <Link
                      key={label}
                      href={`/ai-guru?query=${encodeURIComponent(label)}`}
                      className="text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-swara-gold/30 bg-swara-gold/10 text-swara-gold hover:bg-swara-gold/20 transition-all"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/ai-guru"
                  className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm font-bold text-muted-foreground hover:border-kumkum/30 hover:text-kumkum transition-all"
                >
                  Ask about ragas, talas, theory...
                  <ArrowRight className="size-3.5 ml-auto" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
