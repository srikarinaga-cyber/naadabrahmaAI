"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function MusicThemeBackdrop() {
  const pathname = usePathname();

  // Exclude Home page ('/'), AI Guru ('/ai-guru'), and Student Portal ('/student' & sub-routes)
  const isExcludedPage =
    pathname === "/" ||
    pathname.startsWith("/ai-guru") ||
    pathname.startsWith("/student");

  if (isExcludedPage) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. High-Visibility Realistic Classical Sangeetha Trinity Artwork Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat opacity-55 dark:opacity-45 transition-opacity duration-1000"
        style={{ backgroundImage: "url('/trinity-theme-bg.png')" }}
      />

      {/* 2. Sandalwood & Gold Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/40 via-transparent to-[#FAF6F0]/60 dark:from-background/40 dark:via-transparent dark:to-background/60" />

      {/* 3. Animated Classical Soundwave Frequency Lines */}
      <div className="absolute inset-0 opacity-35 dark:opacity-30 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="swara-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
              <stop offset="50%" stopColor="#800020" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M -100,180 Q 350,90 800,220 T 1600,180"
            fill="none"
            stroke="url(#swara-gold-grad)"
            strokeWidth="2.5"
            className="animate-pulse"
          />
          <path
            d="M -100,420 Q 450,520 950,380 T 1700,450"
            fill="none"
            stroke="url(#swara-gold-grad)"
            strokeWidth="2"
            className="animate-pulse duration-1000"
          />
        </svg>
      </div>

      {/* 4. Animated Vibrating Tanpura & Veena Strings Glow Rays */}
      <div className="absolute inset-0 opacity-30 dark:opacity-35 flex justify-around pointer-events-none">
        <div className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent animate-pulse" style={{ animationDuration: "3s" }} />
        <div className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-[#800020] to-transparent animate-pulse" style={{ animationDuration: "2.2s" }} />
        <div className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent animate-pulse" style={{ animationDuration: "2.8s" }} />
        <div className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-[#800020] to-transparent animate-pulse" style={{ animationDuration: "3.4s" }} />
      </div>

      {/* 5. Animated Floating Carnatic Swaras (స రి గా మా పా దా నీ) & Ornaments */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Swaras in Telugu Script */}
        <div className="absolute top-[14%] left-[6%] font-serif text-3xl font-extrabold text-[#800020]/50 dark:text-amber-400/50 animate-bounce" style={{ animationDuration: "4s" }}>
          స
        </div>
        <div className="absolute top-[28%] right-[7%] font-serif text-3xl font-extrabold text-[#800020]/45 dark:text-amber-400/45 animate-pulse" style={{ animationDuration: "5s" }}>
          రి
        </div>
        <div className="absolute top-[48%] left-[5%] font-serif text-4xl font-extrabold text-[#800020]/45 dark:text-amber-400/45 animate-bounce" style={{ animationDuration: "6s" }}>
          గా
        </div>
        <div className="absolute bottom-[36%] right-[10%] font-serif text-3xl font-extrabold text-[#800020]/50 dark:text-amber-400/50 animate-pulse" style={{ animationDuration: "4.5s" }}>
          మా
        </div>
        <div className="absolute bottom-[18%] left-[12%] font-serif text-4xl font-extrabold text-[#800020]/45 dark:text-amber-400/45 animate-bounce" style={{ animationDuration: "5.5s" }}>
          పా
        </div>
        <div className="absolute top-[68%] right-[5%] font-serif text-3xl font-extrabold text-[#800020]/40 dark:text-amber-400/40 animate-pulse" style={{ animationDuration: "6.5s" }}>
          దా
        </div>
        <div className="absolute bottom-[8%] right-[20%] font-serif text-3xl font-extrabold text-[#800020]/50 dark:text-amber-400/50 animate-bounce" style={{ animationDuration: "4.8s" }}>
          నీ
        </div>

        {/* Floating Carnatic Musical Icons */}
        <div className="absolute top-20 right-[24%] text-[#800020]/45 dark:text-amber-400/45 text-3xl animate-bounce" style={{ animationDuration: "7s" }}>
          🎵
        </div>
        <div className="absolute top-1/3 left-[16%] text-[#800020]/40 dark:text-amber-400/40 text-4xl animate-pulse" style={{ animationDuration: "6s" }}>
          🎼
        </div>
        <div className="absolute bottom-1/4 right-[16%] text-[#800020]/45 dark:text-amber-400/45 text-3xl animate-bounce" style={{ animationDuration: "8s" }}>
          🎶
        </div>
        <div className="absolute top-1/2 left-[7%] text-[#800020]/40 dark:text-amber-400/40 text-5xl font-serif animate-pulse" style={{ animationDuration: "9s" }}>
          🪕
        </div>
        <div className="absolute bottom-20 left-[22%] text-[#800020]/45 dark:text-amber-400/45 text-3xl font-serif animate-bounce" style={{ animationDuration: "5.2s" }}>
          🕉️
        </div>
      </div>
    </div>
  );
}
