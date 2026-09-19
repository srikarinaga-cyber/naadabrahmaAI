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
import { useLanguage } from "@/components/providers/language-provider";

export function AiGuruPreview() {
  const { language } = useLanguage();
  const isTe = language === "te";

  const capabilities = isTe
    ? [
        {
          icon: HelpCircle,
          title: "సంగీత సందేహాలు అడగండి",
          description: "రాగ సిద్ధాంతం, స్వర అమరికలు మరియు గాత్ర విశేషాలపై తక్షణ వివరణలు పొందండి.",
          href: "/ai-guru",
        },
        {
          icon: GitCompare,
          title: "రాగాల వ్యత్యాస విశ్లేషణ",
          description: "మేళకర్త మరియు జన్య రాగాల స్వరస్థాన పోలికలు పక్కపక్కనే చూడండి.",
          href: "/knowledge-hub/compare",
        },
        {
          icon: NotebookPen,
          title: "నోట్స్ & క్విజ్‌లు రూపొందించండి",
          description: "మీ పరీక్షా స్థాయికి అనుగుణంగా AI ద్వారా రూపొందించబడిన అధ్యయన నోట్స్.",
          href: "/notes?tab=generate",
        },
        {
          icon: Calendar,
          title: "సాధన షెడ్యూల్స్",
          description: "మీ పురోగతి ఆధారంగా ప్రతిరోజూ పాటించవలసిన సాధన ప్రణాళికలు.",
          href: "/student",
        },
      ]
    : [
        {
          icon: HelpCircle,
          title: "Ask Music Doubts",
          description: "Get instant explanations for raga theory, swara patterns, and performance nuances.",
          href: "/ai-guru",
        },
        {
          icon: GitCompare,
          title: "Compare Ragas Side-by-Side",
          description: "Side-by-side analysis of Melakarta and Janya ragas with swara differences highlighted.",
          href: "/knowledge-hub/compare",
        },
        {
          icon: NotebookPen,
          title: "Generate Notes & Quizzes",
          description: "AI-crafted study notes and practice quizzes tailored to your exam level.",
          href: "/notes?tab=generate",
        },
        {
          icon: Calendar,
          title: "Practice Schedules",
          description: "Personalized daily practice plans based on your progress and weak areas.",
          href: "/student",
        },
      ];

  const sampleConversation = isTe
    ? [
        {
          role: "user" as const,
          message: "మోహనం మరియు హంసధ్వని రాగాల మధ్య వ్యత్యాసం ఏమిటి?",
        },
        {
          role: "assistant" as const,
          message:
            "రెండు రాగాలు 29వ మేళకర్త ధీరశంకరాభరణం నుండి ఉద్భవించిన ఔడవ రాగాలు. మోహనం 'స రి2 గా3 ప దా2 స' కాగా, హంసధ్వని 'స రి2 గా3 ప నీ3 స' స్వరాలను ఉపయోగిస్తుంది. ప్రధాన వ్యత్యాసం నిషాదం (నీ3) vs దైవతం (దా2).",
        },
      ]
    : [
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
            <Badge variant="outline" className="border-[#800020]/30 text-[#800020] dark:text-amber-200 font-extrabold text-xs">
              <Bot className="mr-1 size-3.5" />
              {isTe ? "AI గురు చాట్" : "AI Guru"}
            </Badge>
            <h2 className="font-serif text-3xl font-extrabold text-[#800020] dark:text-amber-100 md:text-4xl">
              {isTe ? "మీ స్వంత కర్ణాటక సంగీత AI గురువు" : "Your Personal Carnatic Music Guru"}
            </h2>
            <p className="leading-relaxed text-foreground/90 font-medium text-sm">
              {isTe
                ? "సంగీత నిధిపై RAG ఆర్కిటెక్చర్‌తో రూపొందించబడిన 24/7 AI గురువు. సందేహాలు అడగండి, రాగాలను పోల్చండి మరియు సిద్ధాంత విశేషాలను తెలుసుకోండి."
                : "Powered by GPT with RAG architecture over our curated music database. Ask doubts, compare ragas, generate quizzes, and receive theory explanations — available 24/7 for every instrument."}
            </p>

            {/* 4 Interactive Feature Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {capabilities.map((cap) => (
                <Link
                  key={cap.title}
                  href={cap.href}
                  className="group rounded-2xl border border-swara-gold/30 bg-card/90 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#800020] hover:shadow-lg dark:bg-card/70 block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <cap.icon className="size-5 text-[#800020] dark:text-amber-300 transition-transform group-hover:scale-110" aria-hidden />
                    <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-[#800020] transition-all transform -translate-x-1 group-hover:translate-x-0" />
                  </div>
                  <p className="text-xs font-extrabold text-[#800020] dark:text-amber-100 group-hover:text-[#A00028] transition-colors">
                    {cap.title}
                  </p>
                  <p className="mt-1 text-xs text-foreground/80 font-medium leading-relaxed">
                    {cap.description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/notes?tab=generate"
                className="inline-flex items-center gap-2 bg-[#800020] hover:bg-[#A00028] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
              >
                {isTe ? "నోట్స్ తయారు చేయండి" : "Generate Study Notes"}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/knowledge-hub/compare"
                className="inline-flex items-center gap-2 border border-swara-gold/40 text-[#800020] dark:text-amber-200 hover:bg-[#800020] hover:text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
              >
                {isTe ? "రాగాల పోలికలు చూడండి" : "Compare Ragas Side-by-Side"}
                <GitCompare className="size-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Link href="/ai-guru" className="block group">
              <div className="traditional-glow overflow-hidden rounded-3xl border-2 border-swara-gold/40 bg-card/95 shadow-xl dark:bg-card/80 transition-all duration-300 group-hover:border-[#800020] group-hover:shadow-2xl">
                <div className="flex items-center gap-3 border-b border-swara-gold/30 bg-[#800020]/10 px-5 py-4">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#800020]/20">
                    <Sparkles className="size-4 text-[#800020] dark:text-amber-200" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#800020] dark:text-amber-100">AI Guru</p>
                    <p className="text-xs text-foreground/80 font-semibold">
                      {isTe ? "కర్ణాటక సంగీత AI సహాయకుడు" : "Carnatic music assistant"}
                    </p>
                  </div>
                  <Badge className="ml-auto bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px]" variant="secondary">
                    {isTe ? "సహాకారి సిద్ధం" : "Online"}
                  </Badge>
                </div>

                <div className="space-y-4 p-5">
                  {sampleConversation.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-bold ${
                          msg.role === "user"
                            ? "bg-[#800020] text-white"
                            : "bg-muted/80 text-foreground border border-swara-gold/30"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-swara-gold/30 px-5 py-4">
                  <div className="flex items-center justify-between gap-2 rounded-2xl border border-swara-gold/40 bg-muted/50 px-4 py-3 text-xs text-foreground/80 font-bold group-hover:border-[#800020] transition-colors">
                    <span>{isTe ? "రాగాలు, తాళాలు, సిద్ధాంతం గురించి అడగండి..." : "Ask about ragas, talas, theory..."}</span>
                    <span className="text-xs font-extrabold text-[#800020] dark:text-amber-300 flex items-center gap-1">
                      {isTe ? "చాట్ ప్రారంభించండి" : "Start Chat"} <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
