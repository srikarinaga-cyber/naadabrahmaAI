"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getIcon } from "@/lib/icons";
import type { PlatformStatistic } from "@/types/database";

interface StatisticsSectionProps {
  statistics: PlatformStatistic[];
}

function AnimatedCounter({
  value,
  suffix,
  inView,
}: {
  value: string;
  suffix: string | null;
  inView: boolean;
}) {
  const numericPart = parseInt(value.replace(/\D/g, ""), 10);
  const isNumeric = !Number.isNaN(numericPart) && /^\d+$/.test(value);
  const [display, setDisplay] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!inView) return;
    if (!isNumeric) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const totalFrames = 40;
    const interval = setInterval(() => {
      frame += 1;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(numericPart * eased));
      if (frame >= totalFrames) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [inView, isNumeric, numericPart, value]);

  return (
    <span className="font-serif text-4xl font-bold text-kumkum md:text-5xl">
      {isNumeric ? display : display}
      {suffix}
    </span>
  );
}

export function StatisticsSection({ statistics }: StatisticsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto mb-14 max-w-xl text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-3xl font-bold md:text-4xl">
            Built for Scale
          </h2>
          <p className="mt-3 text-muted-foreground">
            A comprehensive Carnatic music knowledge base, designed for academies
            and independent learners alike.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statistics.map((stat, index) => {
            const Icon = getIcon(stat.icon);
            return (
              <motion.div
                key={stat.id}
                className="glass-panel traditional-glow rounded-2xl p-6 text-center dark:bg-card/50"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-kumkum/10">
                  <Icon className="size-5 text-kumkum" aria-hidden />
                </div>
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
