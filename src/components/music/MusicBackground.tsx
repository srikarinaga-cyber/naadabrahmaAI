"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Per-module overlay colors — tinted on top of the instruments image
const MODULE_OVERLAYS: Record<string, { light: string; dark: string }> = {
  "home":          { light: "rgba(253,246,236,0.55)", dark: "rgba(26,14,5,0.72)"  },
  "knowledge-hub": { light: "rgba(249,237,224,0.60)", dark: "rgba(31,8,8,0.75)"   },
  "notes":         { light: "rgba(240,248,244,0.62)", dark: "rgba(7,26,18,0.75)"  },
  "ai-guru":       { light: "rgba(240,238,255,0.62)", dark: "rgba(13,8,32,0.78)"  },
  "instruments":   { light: "rgba(255,243,232,0.55)", dark: "rgba(26,8,0,0.72)"   },
  "student":       { light: "rgba(255,248,240,0.58)", dark: "rgba(26,10,0,0.74)"  },
  "teacher":       { light: "rgba(255,252,232,0.58)", dark: "rgba(20,15,0,0.74)"  },
  "admin":         { light: "rgba(240,244,248,0.62)", dark: "rgba(4,10,24,0.78)"  },
};

export function MusicBackground() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  // Determine active module from path
  let activeModule = "home";
  if (pathname === "/")                            activeModule = "home";
  else if (pathname.startsWith("/knowledge-hub"))  activeModule = "knowledge-hub";
  else if (pathname.startsWith("/notes"))          activeModule = "notes";
  else if (pathname.startsWith("/ai-guru"))        activeModule = "ai-guru";
  else if (pathname.startsWith("/instruments"))    activeModule = "instruments";
  else if (pathname.startsWith("/student"))        activeModule = "student";
  else if (pathname.startsWith("/teacher"))        activeModule = "teacher";
  else if (pathname.startsWith("/admin"))          activeModule = "admin";

  const overlay = MODULE_OVERLAYS[activeModule] ?? MODULE_OVERLAYS["home"];
  const overlayColor = isDark ? overlay.dark : overlay.light;

  return (
    <div className="fixed inset-0 -z-20 h-full w-full pointer-events-none select-none">

      {/* ── Base: Carnatic Instruments Image ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/carnatic-bg.png')" }}
      />

      {/* ── Per-module tinted overlay — smooth transition ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor }}
        />
      </AnimatePresence>

      {/* ── Subtle vignette for depth ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.18) 100%)"
        }}
      />
    </div>
  );
}
