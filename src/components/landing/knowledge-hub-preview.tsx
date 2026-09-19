"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { parseMelakartaMetadata } from "@/lib/utils/melakarta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Melakarta } from "@/types/database";
import { useLanguage } from "@/components/providers/language-provider";
import { translateSwaraNotation } from "@/lib/data/knowledge-hub-i18n";

interface KnowledgeHubPreviewProps {
  featuredRaga: Melakarta | null;
}

export function KnowledgeHubPreview({ featuredRaga }: KnowledgeHubPreviewProps) {
  const { language } = useLanguage();
  const isTe = language === "te";

  const metadata = featuredRaga
    ? parseMelakartaMetadata(featuredRaga.metadata)
    : null;

  const highlights = isTe
    ? [
        {
          title: "72 జనక మేళకర్త రాగాలు",
          desc: "ఖచ్చితమైన స్వరస్థానాలు, ఆరోహణ-అవరోహణ మరియు శ్రుతి నాద అమరిక.",
        },
        {
          title: "జన్య రాగ వర్గీకరణ విశ్లేషణ",
          desc: "వక్ర, భాషాంగ మరియు వర్జ్య రాగ సంబంధాలను అన్వేషించండి.",
        },
        {
          title: "వాగ్గేయకారులు, కీర్తనలు & 35 తాళాలు",
          desc: "సంగీత సాహిత్యం, తాళ విశేషాలు మరియు కీర్తనల సమాచారం.",
        },
      ]
    : [
        {
          title: "72 Melakarta Parent Scales",
          desc: "Rigorous pitch profiles with swara notation and microtone mapping.",
        },
        {
          title: "Janya Scale Lineage Tracker",
          desc: "Trace vakra and bhashanga variations across derived ragas.",
        },
        {
          title: "Composers, Kritis & Talas",
          desc: "Full catalog with audio references, lyrics, and classification.",
        },
      ];

  return (
    <section id="knowledge-hub" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="border-[#800020]/30 text-[#800020] dark:text-amber-200 font-extrabold text-xs">
              {isTe ? "జ్ఞాన నిధి (Knowledge Hub)" : "Knowledge Hub"}
            </Badge>
            <h2 className="font-serif text-3xl font-extrabold text-[#800020] dark:text-amber-100 md:text-4xl">
              {isTe ? "మేళకర్త రాగ సంగీత శాస్త్ర గ్రాఫ్" : "Melakarta Raga Knowledge Graph"}
            </h2>
            <p className="leading-relaxed text-foreground/90 font-medium text-sm">
              {isTe
                ? "ప్రతి కర్ణాటక సంగీత కీర్తన 72 మేళకర్త జనక రాగాలకు అనుసంధానించబడింది. మా నాలెడ్జ్ బేస్ రాగ సంబంధాలు, స్వరస్థానాలు మరియు వాగ్గేయకారుల కీర్తనల వివరాలను అందిస్తుంది."
                : "Every Carnatic composition maps back to the 72 Melakarta parent scales. Our database acts as an interactive graph — revealing melodic lineage, critical notations, and related composer kritis."}
            </p>

            <ul className="space-y-4">
              {highlights.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-0.5 text-swara-gold" aria-hidden>
                    ✦
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-[#800020] dark:text-amber-200">{item.title}</p>
                    <p className="text-xs text-foreground/80 font-semibold">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button
              className="bg-[#800020] hover:bg-[#A00028] text-white font-extrabold rounded-2xl px-6 py-3 shadow-md text-xs md:text-sm"
              nativeButton={false}
              render={<Link href="/knowledge-hub" />}
            >
              {isTe ? "జ్ఞాన నిధిని అన్వేషించండి" : "Browse Knowledge Hub"}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </motion.div>

          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="traditional-border relative overflow-hidden rounded-3xl border-2 border-swara-gold/40 bg-card/95 p-6 shadow-xl backdrop-blur-xl dark:bg-card/80">
              <div className="absolute top-0 right-0 size-32 rounded-bl-full bg-[#800020]/10" />

              {featuredRaga ? (
                <>
                  <div className="relative mb-6 flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#800020] dark:text-amber-300">
                        {isTe ? `మేళకర్త రాగం #${featuredRaga.number}` : `Melakarta Raga #${featuredRaga.number}`}
                      </p>
                      <h3 className="font-serif text-2xl font-extrabold text-[#800020] dark:text-amber-100">
                        {featuredRaga.name}
                      </h3>
                    </div>
                    <Badge variant="secondary" className="text-xs font-extrabold bg-swara-gold/15 text-[#800020]">
                      {isTe ? `చక్రం: ${featuredRaga.chakra}` : `Chakra ${featuredRaga.chakra}`}
                    </Badge>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between border-b border-swara-gold/20 py-2">
                      <span className="text-foreground/80 font-bold">{isTe ? "ఆరోహణ" : "Arohana"}</span>
                      <span className="font-extrabold text-[#800020] dark:text-amber-300">
                        {translateSwaraNotation(featuredRaga.arohana, language)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-swara-gold/20 py-2">
                      <span className="text-foreground/80 font-bold">{isTe ? "అవరోహణ" : "Avarohana"}</span>
                      <span className="font-extrabold text-[#800020] dark:text-amber-300">
                        {translateSwaraNotation(featuredRaga.avarohana, language)}
                      </span>
                    </div>
                    {metadata?.western_equivalent && (
                      <div className="flex justify-between py-2">
                        <span className="text-foreground/80 font-bold">{isTe ? "పాశ్చాత్య సమానం" : "Western Equiv."}</span>
                        <span className="font-extrabold text-amber-600">
                          {metadata.western_equivalent}
                        </span>
                      </div>
                    )}
                  </div>

                  {metadata?.popular_janyas && (
                    <div className="mt-6 rounded-2xl border border-swara-gold/30 bg-muted/50 p-4">
                      <p className="text-xs leading-relaxed text-foreground/90 font-medium">
                        <Sparkles className="mr-1 inline size-3.5 text-swara-gold" />
                        <span className="font-extrabold text-[#800020] dark:text-amber-200">
                          {isTe ? "ప్రసిద్ధ జన్య రాగాలు: " : "Popular Janyas: "}
                        </span>{" "}
                        {metadata.popular_janyas.join(", ")}.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground font-bold">
                  {isTe ? "ప్రధాన మేళకర్త రాగ వివరాలు లోడ్ అవుతున్నాయి..." : "Loading featured Melakarta raga details..."}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
