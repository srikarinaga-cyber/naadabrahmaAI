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
  },
  {
    icon: GitCompare,
    title: "Compare Ragas",
    description: "Side-by-side analysis of Melakarta and Janya ragas with swara differences highlighted.",
  },
  {
    icon: NotebookPen,
    title: "Generate Notes & Quizzes",
    description: "AI-crafted study notes and practice quizzes tailored to your exam level.",
  },
  {
    icon: Calendar,
    title: "Practice Schedules",
    description: "Personalized daily practice plans based on your progress and weak areas.",
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
            <h2 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
              Your Personal Carnatic Music Guru
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Powered by GPT with RAG architecture over our curated music database.
              Ask doubts, compare ragas, generate quizzes, and receive theory
              explanations — available 24/7 for every instrument.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="rounded-xl border border-swara-gold/15 bg-card/60 p-4 backdrop-blur-sm dark:bg-card/40"
                >
                  <cap.icon className="mb-2 size-5 text-kumkum" aria-hidden />
                  <p className="text-sm font-semibold">{cap.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>

            <Button
              className="bg-kumkum hover:bg-kumkum-light"
              nativeButton={false}
              render={<Link href="/ai-guru" />}
            >
              Chat with AI Guru
              <ArrowRight className="size-4" />
            </Button>
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
                  <p className="text-sm font-semibold">AI Guru</p>
                  <p className="text-xs text-muted-foreground">
                    Carnatic music assistant
                  </p>
                </div>
                <Badge className="ml-auto bg-marigold/15 text-marigold" variant="secondary">
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
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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

              <div className="border-t border-border px-5 py-4">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  Ask about ragas, talas, theory...
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
