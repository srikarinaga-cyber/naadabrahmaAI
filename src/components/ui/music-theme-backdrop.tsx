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
      <style>{`
        @keyframes floatSwaraSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-24px) rotate(5deg) scale(1.1); }
        }
        @keyframes floatSwaraReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(24px) rotate(-5deg) scale(1.08); }
        }
        @keyframes waveSineFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -400; }
        }
        @keyframes stringLightTravel {
          0% { top: -10%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes trinityAuraPulse {
          0%, 100% { opacity: 0.75; filter: brightness(1); }
          50% { opacity: 0.90; filter: brightness(1.1); }
        }
        @keyframes sparkRise {
          0% { transform: translateY(0px) scale(0.8); opacity: 0.2; }
          50% { opacity: 0.9; }
          100% { transform: translateY(-90px) scale(1.3); opacity: 0; }
        }
      `}</style>

      {/* 1. High-Vibrancy Realistic Classical Sangeetha Trinity Artwork Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: "url('/trinity-theme-bg.png')",
          animation: "trinityAuraPulse 6s ease-in-out infinite",
        }}
      />

      {/* 2. Soft Sandalwood & Marigold Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/20 via-transparent to-[#FAF6F0]/50 dark:from-background/30 dark:via-transparent dark:to-background/50" />

      {/* 3. Realistic Flowing Soundwave Sine Frequencies */}
      <div className="absolute inset-0 opacity-55 dark:opacity-45 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="swara-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
              <stop offset="35%" stopColor="#800020" stopOpacity="1" />
              <stop offset="70%" stopColor="#d4af37" stopOpacity="1" />
              <stop offset="100%" stopColor="#800020" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M -100,200 Q 350,110 800,240 T 1700,200"
            fill="none"
            stroke="url(#swara-gold-grad)"
            strokeWidth="3.5"
            strokeDasharray="16 12"
            style={{ animation: "waveSineFlow 12s linear infinite" }}
          />
          <path
            d="M -100,440 Q 450,540 950,400 T 1800,460"
            fill="none"
            stroke="url(#swara-gold-grad)"
            strokeWidth="2.5"
            strokeDasharray="20 14"
            style={{ animation: "waveSineFlow 16s linear infinite reverse" }}
          />
        </svg>
      </div>

      {/* 4. Realistic Plucked Tanpura & Veena Vibrating Strings with Moving Light Pulses */}
      <div className="absolute inset-0 opacity-50 dark:opacity-45 flex justify-around pointer-events-none">
        {/* String 1 (Sa) */}
        <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-20 bg-gradient-to-b from-transparent via-amber-300 to-transparent rounded-full blur-[1px]"
            style={{ animation: "stringLightTravel 3.5s ease-in-out infinite" }}
          />
        </div>
        {/* String 2 (Pa) */}
        <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#800020] to-transparent">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-20 bg-gradient-to-b from-transparent via-red-500 to-transparent rounded-full blur-[1px]"
            style={{ animation: "stringLightTravel 2.8s ease-in-out infinite 0.8s" }}
          />
        </div>
        {/* String 3 (Sa upper) */}
        <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-20 bg-gradient-to-b from-transparent via-amber-300 to-transparent rounded-full blur-[1px]"
            style={{ animation: "stringLightTravel 4s ease-in-out infinite 1.5s" }}
          />
        </div>
        {/* String 4 (Main Drone) */}
        <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#800020] to-transparent">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-20 bg-gradient-to-b from-transparent via-amber-200 to-transparent rounded-full blur-[1px]"
            style={{ animation: "stringLightTravel 3.2s ease-in-out infinite 0.3s" }}
          />
        </div>
      </div>

      {/* 5. Realistic Floating Carnatic Swaras (స రి గా మా పా దా నీ) with 3D Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Swara 1: స (Shadjama) */}
        <div
          className="absolute top-[12%] left-[5%] font-serif text-4xl md:text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.7)]"
          style={{ animation: "floatSwaraSlow 4.5s ease-in-out infinite" }}
        >
          స
        </div>

        {/* Swara 2: రి (Rishabha) */}
        <div
          className="absolute top-[26%] right-[6%] font-serif text-4xl md:text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.7)]"
          style={{ animation: "floatSwaraReverse 5.5s ease-in-out infinite 0.7s" }}
        >
          రి
        </div>

        {/* Swara 3: గా (Gandhara) */}
        <div
          className="absolute top-[46%] left-[4%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-200 drop-shadow-[0_0_20px_rgba(128,0,32,0.7)]"
          style={{ animation: "floatSwaraSlow 6s ease-in-out infinite 1.2s" }}
        >
          గా
        </div>

        {/* Swara 4: మా (Madhyama) */}
        <div
          className="absolute bottom-[35%] right-[8%] font-serif text-4xl md:text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.7)]"
          style={{ animation: "floatSwaraReverse 5s ease-in-out infinite 0.3s" }}
        >
          మా
        </div>

        {/* Swara 5: పా (Panchama) */}
        <div
          className="absolute bottom-[18%] left-[10%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-200 drop-shadow-[0_0_20px_rgba(212,175,55,0.7)]"
          style={{ animation: "floatSwaraSlow 6.2s ease-in-out infinite 1s" }}
        >
          పా
        </div>

        {/* Swara 6: దా (Dhaivata) */}
        <div
          className="absolute top-[66%] right-[4%] font-serif text-4xl md:text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_15px_rgba(128,0,32,0.7)]"
          style={{ animation: "floatSwaraReverse 6.8s ease-in-out infinite 1.8s" }}
        >
          దా
        </div>

        {/* Swara 7: నీ (Nishada) */}
        <div
          className="absolute bottom-[8%] right-[18%] font-serif text-4xl md:text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.7)]"
          style={{ animation: "floatSwaraSlow 5.2s ease-in-out infinite 1.5s" }}
        >
          నీ
        </div>

        {/* Floating Carnatic Musical Icons */}
        <div
          className="absolute top-20 right-[24%] text-3xl md:text-4xl text-amber-700 dark:text-amber-300 drop-shadow-md"
          style={{ animation: "floatSwaraSlow 7s ease-in-out infinite 0.3s" }}
        >
          🎵
        </div>
        <div
          className="absolute top-1/3 left-[14%] text-4xl md:text-5xl text-amber-700 dark:text-amber-300 drop-shadow-md"
          style={{ animation: "floatSwaraReverse 6.5s ease-in-out infinite 1.1s" }}
        >
          🎼
        </div>
        <div
          className="absolute bottom-1/4 right-[15%] text-3xl md:text-4xl text-amber-700 dark:text-amber-300 drop-shadow-md"
          style={{ animation: "floatSwaraSlow 7.8s ease-in-out infinite 2s" }}
        >
          🎶
        </div>
        <div
          className="absolute top-1/2 left-[6%] text-5xl md:text-6xl text-amber-800 dark:text-amber-200 drop-shadow-lg"
          style={{ animation: "floatSwaraReverse 8.2s ease-in-out infinite 0.6s" }}
        >
          🪕
        </div>
        <div
          className="absolute bottom-20 left-[20%] text-3xl md:text-4xl text-amber-800 dark:text-amber-300 drop-shadow-md"
          style={{ animation: "floatSwaraSlow 5.8s ease-in-out infinite 1.3s" }}
        >
          🕉️
        </div>

        {/* Golden Music Dust Sparks */}
        <div className="absolute top-[28%] left-[38%] size-2.5 bg-amber-400 rounded-full blur-[1px]" style={{ animation: "sparkRise 3.5s infinite" }} />
        <div className="absolute top-[58%] left-[68%] size-3 bg-amber-400 rounded-full blur-[1px]" style={{ animation: "sparkRise 4.5s infinite 1.2s" }} />
        <div className="absolute top-[72%] left-[22%] size-2.5 bg-amber-500 rounded-full blur-[1px]" style={{ animation: "sparkRise 4s infinite 2.2s" }} />
      </div>
    </div>
  );
}
