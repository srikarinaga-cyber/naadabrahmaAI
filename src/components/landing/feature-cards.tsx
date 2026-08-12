"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PlatformFeature } from "@/types/database";

interface FeatureCardsProps {
  features: PlatformFeature[];
}

export function FeatureCards({ features }: FeatureCardsProps) {
  return (
    <section id="features" className="border-y border-swara-gold/15 bg-transparent py-24 dark:bg-transparent">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
            Six Pillars of Naadabrahma
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every module connects students, teachers, and classical heritage in a
            continuous knowledge loop — from ragas to examinations to AI guidance.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = getIcon(feature.icon);
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="group glass-panel traditional-border h-full border-swara-gold/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-kumkum/10 ring-1 ring-swara-gold/20 transition-colors group-hover:bg-kumkum/15">
                        <Icon className="size-5 text-kumkum" aria-hidden />
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-swara-gold/10 text-[10px] font-bold uppercase tracking-wider text-marigold"
                      >
                        {feature.tag}
                      </Badge>
                    </div>
                    <CardTitle className="font-serif text-lg group-hover:text-kumkum">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={feature.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-kumkum transition-colors hover:text-kumkum-light"
                    >
                      Explore Module
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
