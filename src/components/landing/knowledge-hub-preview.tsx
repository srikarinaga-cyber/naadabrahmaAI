"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { parseMelakartaMetadata } from "@/lib/utils/melakarta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Melakarta } from "@/types/database";

interface KnowledgeHubPreviewProps {
  featuredRaga: Melakarta | null;
}

export function KnowledgeHubPreview({ featuredRaga }: KnowledgeHubPreviewProps) {
  const metadata = featuredRaga
    ? parseMelakartaMetadata(featuredRaga.metadata)
    : null;

  const highlights = [
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
            <Badge variant="outline" className="border-kumkum/20 text-kumkum">
              Knowledge Hub
            </Badge>
            <h2 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
              Melakarta Raga Knowledge Graph
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Every Carnatic composition maps back to the 72 Melakarta parent
              scales. Our database acts as an interactive graph — revealing melodic
              lineage, critical notations, and related composer kritis.
            </p>

            <ul className="space-y-4">
              {highlights.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-0.5 text-swara-gold" aria-hidden>
                    ✦
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button
              className="bg-kumkum hover:bg-kumkum-light"
              render={<Link href="/knowledge-hub" />}
            >
              Browse Knowledge Hub
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="traditional-border relative overflow-hidden rounded-2xl border-swara-gold/20 bg-card p-6 shadow-sm dark:bg-card/80">
              <div className="absolute top-0 right-0 size-32 rounded-bl-full bg-kumkum/5" />

              {featuredRaga ? (
                <>
                  <div className="relative mb-6 flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-kumkum">
                        Melakarta Raga #{featuredRaga.number}
                      </p>
                      <h3 className="font-serif text-2xl font-bold">
                        {featuredRaga.name}
                      </h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Chakra {featuredRaga.chakra}
                    </Badge>
                  </div>

                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex justify-between border-b border-border py-2">
                      <span className="text-muted-foreground">Arohana</span>
                      <span className="font-semibold text-kumkum">
                        {featuredRaga.arohana}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border py-2">
                      <span className="text-muted-foreground">Avarohana</span>
                      <span className="font-semibold text-kumkum">
                        {featuredRaga.avarohana}
                      </span>
                    </div>
                    {metadata?.western_equivalent && (
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Western Equiv.</span>
                        <span className="font-medium text-marigold">
                          {metadata.western_equivalent}
                        </span>
                      </div>
                    )}
                  </div>

                  {metadata?.popular_janyas && (
                    <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        <Sparkles className="mr-1 inline size-3.5 text-swara-gold" />
                        <span className="font-semibold text-foreground">
                          Popular Janyas:
                        </span>{" "}
                        {metadata.popular_janyas.join(", ")}.
                        {featuredRaga.description &&
                          ` ${featuredRaga.description.slice(0, 120)}…`}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Connect Supabase and run migrations to load featured raga data.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
