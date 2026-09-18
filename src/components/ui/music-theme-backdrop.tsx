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
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-28px) translateX(12px) rotate(6deg) scale(1.12); }
          50% { transform: translateY(-14px) translateX(-14px) rotate(-4deg) scale(1.05); }
          75% { transform: translateY(-35px) translateX(8px) rotate(8deg) scale(1.15); }
        }
        @keyframes floatSwaraReverse {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(30px) translateX(-15px) rotate(-6deg) scale(1.1); }
          50% { transform: translateY(15px) translateX(15px) rotate(5deg) scale(1.04); }
          75% { transform: translateY(38px) translateX(-10px) rotate(-8deg) scale(1.14); }
        }
        @keyframes waveSineFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -600; }
        }
        @keyframes stringLightTravel {
          0% { top: -15%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 115%; opacity: 0; }
        }
        @keyframes trinityAuraPulse {
          0%, 100% { opacity: 0.80; filter: brightness(1) saturate(1.1); }
          50% { opacity: 0.95; filter: brightness(1.15) saturate(1.25); }
        }
        @keyframes eqBounce {
          0%, 100% { height: 12px; opacity: 0.4; }
          50% { height: 55px; opacity: 0.9; }
        }
        @keyframes spinChakra {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes sparkFloatVertical {
          0% { transform: translateY(0px) scale(0.6); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { transform: translateY(-140px) scale(1.4); opacity: 0; }
        }
      `}</style>

      {/* 1. Ultra-High Vibrancy Sangeetha Trinity Artwork with Pulsing Aura */}
      <div
        className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-opacity duration-700"
        style={{
          backgroundImage: "url('/trinity-theme-bg.png')",
          animation: "trinityAuraPulse 5s ease-in-out infinite",
        }}
      />

      {/* 2. Warm Sandalwood & Marigold Soft Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/20 via-transparent to-[#FAF6F0]/50 dark:from-background/30 dark:via-transparent dark:to-background/50" />

      {/* 3. Rotating Golden Swara Chakra (సంగీత స్వర చక్రం) in Background */}
      <div
        className="absolute -top-32 -right-32 size-[420px] rounded-full border-2 border-dashed border-[#d4af37]/30 opacity-40 flex items-center justify-center pointer-events-none"
        style={{ animation: "spinChakra 40s linear infinite" }}
      >
        <div className="size-[300px] rounded-full border border-dotted border-[#800020]/40 flex items-center justify-center">
          <span className="font-serif text-sm font-bold text-[#d4af37]">స రి గా మా పా దా నీ</span>
        </div>
      </div>

      {/* 4. Animated Moving Soundwave Frequencies (SVG Sine Wave Waves) */}
      <div className="absolute inset-0 opacity-60 dark:opacity-50 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="swara-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
              <stop offset="30%" stopColor="#800020" stopOpacity="1" />
              <stop offset="70%" stopColor="#d4af37" stopOpacity="1" />
              <stop offset="100%" stopColor="#800020" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M -100,160 Q 350,70 800,210 T 1700,160"
            fill="none"
            stroke="url(#swara-gold-grad)"
            strokeWidth="4"
            strokeDasharray="18 12"
            style={{ animation: "waveSineFlow 9s linear infinite" }}
          />
          <path
            d="M -100,410 Q 450,520 950,370 T 1800,430"
            fill="none"
            stroke="url(#swara-gold-grad)"
            strokeWidth="3"
            strokeDasharray="22 14"
            style={{ animation: "waveSineFlow 12s linear infinite reverse" }}
          />
          <path
            d="M -100,650 Q 500,560 1050,680 T 1900,620"
            fill="none"
            stroke="url(#swara-gold-grad)"
            strokeWidth="2.5"
            strokeDasharray="16 10"
            style={{ animation: "waveSineFlow 15s linear infinite" }}
          />
        </svg>
      </div>

      {/* 5. Plucked Tanpura & Veena Strings with Traveling Laser Beams */}
      <div className="absolute inset-0 opacity-60 dark:opacity-50 flex justify-around pointer-events-none">
        {/* String 1 */}
        <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3.5 h-24 bg-gradient-to-b from-transparent via-amber-300 to-transparent rounded-full blur-[1px]"
            style={{ animation: "stringLightTravel 2.8s ease-in-out infinite" }}
          />
        </div>
        {/* String 2 */}
        <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#800020] to-transparent">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3.5 h-24 bg-gradient-to-b from-transparent via-red-500 to-transparent rounded-full blur-[1px]"
            style={{ animation: "stringLightTravel 2.2s ease-in-out infinite 0.6s" }}
          />
        </div>
        {/* String 3 */}
        <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3.5 h-24 bg-gradient-to-b from-transparent via-amber-300 to-transparent rounded-full blur-[1px]"
            style={{ animation: "stringLightTravel 3.2s ease-in-out infinite 1.2s" }}
          />
        </div>
        {/* String 4 */}
        <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#800020] to-transparent">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3.5 h-24 bg-gradient-to-b from-transparent via-amber-200 to-transparent rounded-full blur-[1px]"
            style={{ animation: "stringLightTravel 2.5s ease-in-out infinite 0.3s" }}
          />
        </div>
        {/* String 5 */}
        <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3.5 h-24 bg-gradient-to-b from-transparent via-amber-400 to-transparent rounded-full blur-[1px]"
            style={{ animation: "stringLightTravel 3s ease-in-out infinite 1.8s" }}
          />
        </div>
      </div>

      {/* 6. Live Rhythmic Audio Equalizer Visualizer Bars Along Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-16 opacity-35 dark:opacity-30 flex items-end justify-center gap-1.5 px-4 pointer-events-none">
        {[2.1, 1.4, 3.2, 1.8, 2.7, 1.2, 3.5, 2.3, 1.6, 2.9, 3.1, 1.5, 2.4, 1.9, 3.3, 2.0].map((dur, idx) => (
          <div
            key={idx}
            className="w-2.5 rounded-t-lg bg-gradient-to-t from-[#800020] via-[#d4af37] to-amber-300"
            style={{ animation: `eqBounce ${dur}s ease-in-out infinite ${idx * 0.15}s` }}
          />
        ))}
      </div>

      {/* 7. Ultra-Vibrant Animated Carnatic Swaras (స రి గా మా పా దా నీ) Floating Drifts */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Swara 1: స (Shadjama) */}
        <div
          className="absolute top-[10%] left-[5%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]"
          style={{ animation: "floatSwaraSlow 4s ease-in-out infinite" }}
        >
          స
        </div>

        {/* Swara 2: రి (Rishabha) */}
        <div
          className="absolute top-[22%] right-[5%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]"
          style={{ animation: "floatSwaraReverse 4.8s ease-in-out infinite 0.5s" }}
        >
          రి
        </div>

        {/* Swara 3: గా (Gandhara) */}
        <div
          className="absolute top-[42%] left-[4%] font-serif text-6xl md:text-7xl font-extrabold text-[#800020] dark:text-amber-200 drop-shadow-[0_0_25px_rgba(128,0,32,0.8)]"
          style={{ animation: "floatSwaraSlow 5.2s ease-in-out infinite 1s" }}
        >
          గా
        </div>

        {/* Swara 4: మా (Madhyama) */}
        <div
          className="absolute bottom-[32%] right-[7%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]"
          style={{ animation: "floatSwaraReverse 4.2s ease-in-out infinite 0.2s" }}
        >
          మా
        </div>

        {/* Swara 5: పా (Panchama) */}
        <div
          className="absolute bottom-[16%] left-[9%] font-serif text-6xl md:text-7xl font-extrabold text-[#800020] dark:text-amber-200 drop-shadow-[0_0_25px_rgba(212,175,55,0.85)]"
          style={{ animation: "floatSwaraSlow 5.6s ease-in-out infinite 0.8s" }}
        >
          పా
        </div>

        {/* Swara 6: దా (Dhaivata) */}
        <div
          className="absolute top-[62%] right-[4%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_20px_rgba(128,0,32,0.8)]"
          style={{ animation: "floatSwaraReverse 6s ease-in-out infinite 1.5s" }}
        >
          దా
        </div>

        {/* Swara 7: నీ (Nishada) */}
        <div
          className="absolute bottom-[6%] right-[16%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]"
          style={{ animation: "floatSwaraSlow 4.6s ease-in-out infinite 1.2s" }}
        >
          నీ
        </div>

        {/* Extra Center Floating Swaras for Rich Canvas Fill */}
        <div
          className="absolute top-[18%] left-[45%] font-serif text-3xl font-extrabold text-amber-700/70 dark:text-amber-300/70 drop-shadow-md"
          style={{ animation: "floatSwaraSlow 6.5s ease-in-out infinite 1.7s" }}
        >
          స'
        </div>
        <div
          className="absolute bottom-[48%] left-[40%] font-serif text-3xl font-extrabold text-rose-700/70 dark:text-amber-200/70 drop-shadow-md"
          style={{ animation: "floatSwaraReverse 5.8s ease-in-out infinite 0.9s" }}
        >
          మ2
        </div>

        {/* Floating Animated Musical Icons & Instruments */}
        <div
          className="absolute top-16 right-[22%] text-4xl md:text-5xl text-amber-700 dark:text-amber-300 drop-shadow-lg"
          style={{ animation: "floatSwaraSlow 6s ease-in-out infinite 0.3s" }}
        >
          🎵
        </div>
        <div
          className="absolute top-1/3 left-[12%] text-5xl md:text-6xl text-amber-700 dark:text-amber-300 drop-shadow-lg"
          style={{ animation: "floatSwaraReverse 5.5s ease-in-out infinite 0.9s" }}
        >
          🎼
        </div>
        <div
          className="absolute bottom-1/4 right-[14%] text-4xl md:text-5xl text-amber-700 dark:text-amber-300 drop-shadow-lg"
          style={{ animation: "floatSwaraSlow 6.8s ease-in-out infinite 1.6s" }}
        >
          🎶
        </div>
        <div
          className="absolute top-1/2 left-[5%] text-6xl md:text-7xl text-amber-800 dark:text-amber-200 drop-shadow-xl"
          style={{ animation: "floatSwaraReverse 7.2s ease-in-out infinite 0.4s" }}
        >
          🪕
        </div>
        <div
          className="absolute bottom-24 left-[18%] text-4xl md:text-5xl text-amber-800 dark:text-amber-300 drop-shadow-lg"
          style={{ animation: "floatSwaraSlow 5.2s ease-in-out infinite 1.1s" }}
        >
          🕉️
        </div>
        <div
          className="absolute top-[75%] left-[80%] text-4xl md:text-5xl text-amber-700 dark:text-amber-300 drop-shadow-lg"
          style={{ animation: "floatSwaraReverse 6.4s ease-in-out infinite 1.9s" }}
        >
          🪘
        </div>

        {/* Rising Golden Music Sparks Stream */}
        <div className="absolute top-[25%] left-[35%] size-3 bg-amber-400 rounded-full blur-[1px]" style={{ animation: "sparkFloatVertical 3s infinite" }} />
        <div className="absolute top-[52%] left-[65%] size-3.5 bg-amber-300 rounded-full blur-[1px]" style={{ animation: "sparkFloatVertical 3.8s infinite 0.8s" }} />
        <div className="absolute top-[70%] left-[20%] size-3 bg-amber-400 rounded-full blur-[1px]" style={{ animation: "sparkFloatVertical 3.2s infinite 1.6s" }} />
        <div className="absolute top-[40%] left-[82%] size-2.5 bg-amber-300 rounded-full blur-[1px]" style={{ animation: "sparkFloatVertical 4s infinite 2.2s" }} />
      </div>
    </div>
  );
}
