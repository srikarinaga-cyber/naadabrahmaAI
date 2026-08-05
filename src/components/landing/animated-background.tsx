"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="chandan-grid absolute inset-0 opacity-60 dark:opacity-30" />

      <motion.div
        className="absolute -top-32 -right-32 size-[520px] rounded-full bg-kumkum/8 blur-3xl dark:bg-kumkum/15"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 size-[480px] rounded-full bg-marigold/10 blur-3xl dark:bg-marigold/15"
        animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 size-72 -translate-x-1/2 rounded-full bg-swara-gold/8 blur-3xl dark:bg-swara-gold/10"
        animate={{ y: [0, -24, 0], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/80" />
    </div>
  );
}
