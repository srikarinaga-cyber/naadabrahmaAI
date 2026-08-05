"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  return (
    <section className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-20 md:py-32 lg:flex-row lg:items-center">
      <motion.div
        className="flex-1 space-y-8 text-center lg:text-left"
        initial="hidden"
        animate="visible"
      >
        <motion.div custom={0} variants={fadeUp}>
          <Badge
            variant="outline"
            className="border-kumkum/20 bg-kumkum/5 px-3 py-1 text-kumkum"
          >
            <Sparkles className="mr-1.5 size-3" aria-hidden />
            The Future of Indian Classical Music Education
          </Badge>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          className="font-serif text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl"
        >
          Preserving Heritage.{" "}
          <span className="bg-gradient-to-r from-kumkum via-kumkum-light to-marigold bg-clip-text text-transparent">
            Empowering Minds.
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground lg:mx-0 lg:text-lg"
        >
          Naadabrahma AI is a startup-grade SaaS platform for Carnatic music
          students, teachers, and academies — spanning vocal, veena, violin,
          flute, mridangam, and keyboard with AI-powered learning.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
        >
          <Button size="lg" className="h-11 bg-kumkum px-6 hover:bg-kumkum-light">
            Launch Learning Portal
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 border-swara-gold/40 text-kumkum hover:bg-sandalwood-dark/50"
            render={<Link href="#knowledge-hub" />}
          >
            Explore Knowledge Hub
          </Button>
        </motion.div>

        <motion.div
          custom={4}
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
        >
          {["Vocal", "Veena", "Violin", "Flute", "Mridangam", "Keyboard"].map(
            (instrument) => (
              <span
                key={instrument}
                className="rounded-full border border-swara-gold/25 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
              >
                {instrument}
              </span>
            )
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className="relative flex-1"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        <div className="glass-panel traditional-glow relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl p-8 dark:bg-card/40">
          <div className="absolute inset-0 bg-gradient-to-br from-kumkum/5 via-transparent to-marigold/10" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-kumkum">
                Melakarta Raga
              </p>
              <p className="font-serif text-3xl font-bold">Sa Ri Ga Ma</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The foundation of Carnatic melody
              </p>
            </div>

            <div className="space-y-3 font-mono text-sm">
              {[
                { label: "Arohana", swaras: "S R2 G3 M1 P D2 N3 S" },
                { label: "Avarohana", swaras: "S N3 D2 P M1 G3 R2 S" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-xl border border-swara-gold/15 bg-background/50 px-4 py-2.5 backdrop-blur-sm"
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-semibold text-kumkum">{row.swaras}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-swara-gold/15 bg-kumkum/5 p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">72 Melakarta Ragas</span>{" "}
                form the complete parent scale system — every Janya raga traces its
                lineage back to these roots.
              </p>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute -right-4 -bottom-4 rounded-2xl border border-swara-gold/25 bg-card p-4 shadow-lg backdrop-blur-md"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-swara-gold">
            AI Guru
          </p>
          <p className="font-serif text-sm font-semibold">Ask any raga doubt</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
