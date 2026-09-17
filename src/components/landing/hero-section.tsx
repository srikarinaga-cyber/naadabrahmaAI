"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-16 md:py-24 lg:flex-row lg:items-center relative z-10">
      <motion.div
        className="flex-1 space-y-8 text-center lg:text-left"
        initial="hidden"
        animate="visible"
      >
        <motion.div custom={0} variants={fadeUp}>
          <Badge
            variant="outline"
            className="border-[#800020]/30 bg-[#800020]/10 px-3.5 py-1.5 text-[#800020] dark:text-amber-200 font-extrabold text-xs shadow-xs"
          >
            <Sparkles className="mr-1.5 size-3.5 text-[#800020] dark:text-amber-300" aria-hidden />
            {t.heroTagline}
          </Badge>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          className="font-serif text-3xl font-extrabold leading-[1.12] tracking-tight md:text-5xl lg:text-6xl text-[#800020] dark:text-amber-100"
        >
          {t.heroTitle}
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="mx-auto max-w-xl text-sm md:text-base leading-relaxed text-foreground/90 font-bold lg:mx-0 bg-card/75 backdrop-blur-md p-4 rounded-2xl border border-swara-gold/30 shadow-sm"
        >
          {t.heroSubtitle}
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-4 lg:justify-start"
        >
          <Button
            size="lg"
            className="bg-[#800020] hover:bg-[#A00028] text-white font-extrabold rounded-2xl px-6 py-3 shadow-md text-xs md:text-sm"
            nativeButton={false}
            render={<Link href="/knowledge-hub" />}
          >
            <BookOpen className="mr-2 size-4" />
            {t.heroBtnExplore}
            <ArrowRight className="ml-2 size-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-2 border-swara-gold/50 bg-card/90 font-extrabold text-[#800020] dark:text-amber-200 hover:bg-[#800020] hover:text-white rounded-2xl px-6 py-3 shadow-sm text-xs md:text-sm backdrop-blur-md"
            nativeButton={false}
            render={<Link href="/ai-guru" />}
          >
            <Bot className="mr-2 size-4 text-[#800020]" />
            {t.heroBtnGuru}
          </Button>
        </motion.div>
      </motion.div>

      {/* Decorative Visual Card */}
      <motion.div
        className="flex-1 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative rounded-3xl border-2 border-swara-gold/40 bg-card/95 p-6 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between border-b border-swara-gold/20 pb-4">
            <span className="font-serif font-extrabold text-sm text-[#800020] dark:text-amber-200 flex items-center gap-2">
              <span className="text-xl">🪕</span> Sangeetha Sadhana Assistant
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px]">
              Active 24/7
            </Badge>
          </div>

          <div className="space-y-3 font-bold text-xs">
            <div className="p-3.5 bg-muted/60 rounded-2xl border border-swara-gold/20">
              <p className="text-[10px] uppercase font-extrabold text-[#800020] tracking-wider mb-1">
                Melakarta Raga #15
              </p>
              <p className="font-serif text-base font-extrabold text-foreground">
                Mayamalavagowla (మాయామాలవగౌళ)
              </p>
              <p className="font-mono text-emerald-800 dark:text-emerald-300 text-[11px] mt-1.5 font-bold">
                Arohana: S R1 G3 M1 P D1 N3 S&apos;
              </p>
            </div>

            <div className="p-3.5 bg-muted/60 rounded-2xl border border-swara-gold/20">
              <p className="text-[10px] uppercase font-extrabold text-[#800020] tracking-wider mb-1">
                Tala System
              </p>
              <p className="font-serif text-sm font-extrabold text-foreground">
                35 Suladi Sapta Talas Matrix (7 Talas × 5 Jatis)
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
