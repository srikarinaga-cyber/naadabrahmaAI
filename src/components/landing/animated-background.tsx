"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Background Image: Classical Carnatic Instruments Artwork */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 dark:opacity-20 transition-opacity duration-700"
        style={{ backgroundImage: "url('/images/landing-bg.jpg')" }}
      />

      {/* Warm Sandalwood & Kumkum Gradient Overlays for High Text Contrast */}
      <div className="chandan-grid absolute inset-0 opacity-40 dark:opacity-25" />

      <motion.div
        className="absolute -top-32 -right-32 size-[520px] rounded-full bg-kumkum/10 blur-3xl dark:bg-kumkum/20"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 size-[480px] rounded-full bg-marigold/12 blur-3xl dark:bg-marigold/20"
        animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/90" />
    </div>
  );
}
