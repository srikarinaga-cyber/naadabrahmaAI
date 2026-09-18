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

  // Determine specific page mode for unique classical music backgrounds
  const isExplorer = pathname.startsWith("/knowledge-hub/explorer");
  const isCompare = pathname.startsWith("/knowledge-hub/compare");
  const isComposers = pathname.startsWith("/knowledge-hub/composers");
  const isTalas = pathname.startsWith("/knowledge-hub/talas");
  const isMelakartaDetail = pathname.startsWith("/knowledge-hub/melakarta");
  const isInstruments = pathname.startsWith("/instruments");
  const isNotes = pathname.startsWith("/notes");
  const isTeacher = pathname.startsWith("/teacher");

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
          50% { height: 60px; opacity: 0.95; }
        }
        @keyframes spinChakra {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ringExpandPulse {
          0% { transform: scale(0.6); opacity: 0.9; }
          50% { opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes sparkFloatVertical {
          0% { transform: translateY(0px) scale(0.6); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { transform: translateY(-140px) scale(1.4); opacity: 0; }
        }
      `}</style>

      {/* ── BASE CLASSICAL MUSIC HERITAGE WALLPAPER (Visible across all pages) ── */}
      <div
        className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat opacity-65 dark:opacity-75 transition-opacity duration-700"
        style={{
          backgroundImage: "url('/trinity-theme-bg.png')",
          animation: "trinityAuraPulse 6s ease-in-out infinite",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/40 via-[#FAF6F0]/20 to-[#FAF6F0]/60 dark:from-background/50 dark:via-background/30 dark:to-background/70" />

      {/* ── MODE 1: RAGA EXPLORER (Melakarta Network & Swara Constellation + Swara Chakra) ── */}
      {isExplorer && (
        <>
          {/* Rotating Swara Chakra on top right */}
          <div
            className="absolute -top-24 -right-24 size-[380px] rounded-full border-2 border-dashed border-amber-500/50 opacity-60 flex items-center justify-center pointer-events-none"
            style={{ animation: "spinChakra 35s linear infinite" }}
          >
            <div className="size-[260px] rounded-full border border-dotted border-amber-700/60 flex items-center justify-center">
              <span className="font-serif text-xs font-bold text-amber-600 dark:text-amber-300">స రి గా మా పా దా నీ</span>
            </div>
          </div>

          {/* Animated Melakarta Constellation Lines */}
          <div className="absolute inset-0 opacity-55 pointer-events-none">
            <svg className="w-full h-full">
              <line x1="12%" y1="22%" x2="38%" y2="52%" stroke="#d4af37" strokeWidth="2" strokeDasharray="6 6" className="animate-pulse" />
              <line x1="38%" y1="52%" x2="72%" y2="28%" stroke="#800020" strokeWidth="2" strokeDasharray="8 8" className="animate-pulse duration-700" />
              <line x1="38%" y1="52%" x2="68%" y2="78%" stroke="#d4af37" strokeWidth="2" strokeDasharray="6 6" className="animate-pulse duration-1000" />

              <circle cx="12%" cy="22%" r="7" fill="#d4af37" className="animate-ping" style={{ animationDuration: "3s" }} />
              <circle cx="38%" cy="52%" r="9" fill="#e5c158" className="animate-ping" style={{ animationDuration: "2.5s" }} />
              <circle cx="72%" cy="28%" r="8" fill="#d4af37" className="animate-ping" style={{ animationDuration: "4s" }} />
              <circle cx="68%" cy="78%" r="7" fill="#800020" className="animate-ping" style={{ animationDuration: "3.5s" }} />
            </svg>
          </div>

          {/* Drifting Golden Swaras */}
          <div className="absolute top-[28%] left-[6%] font-serif text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] animate-bounce" style={{ animationDuration: "5s" }}>
            స
          </div>
          <div className="absolute top-[58%] left-[12%] font-serif text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] animate-pulse">
            రి
          </div>
          <div className="absolute top-[22%] right-[8%] font-serif text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] animate-bounce" style={{ animationDuration: "6s" }}>
            గా
          </div>
          <div className="absolute bottom-[18%] right-[12%] font-serif text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] animate-pulse">
            మా
          </div>
        </>
      )}

      {/* ── MODE 2: RAGA COMPARISON (Dual Pitch Wave Resonance & Side Spectrum) ── */}
      {isCompare && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-sky-500/10" />

          {/* Dual Opposing Pitch Sine Waves (Raga 1 vs Raga 2) */}
          <div className="absolute inset-0 opacity-60 pointer-events-none">
            <svg className="w-full h-full">
              <path
                d="M -50,200 Q 300,80 650,280 T 1400,200"
                fill="none"
                stroke="#d4af37"
                strokeWidth="3.5"
                strokeDasharray="16 8"
                style={{ animation: "waveSineFlow 8s linear infinite" }}
              />
              <path
                d="M -50,360 Q 400,480 850,300 T 1600,380"
                fill="none"
                stroke="#800020"
                strokeWidth="3.5"
                strokeDasharray="16 8"
                style={{ animation: "waveSineFlow 10s linear infinite reverse" }}
              />
            </svg>
          </div>

          {/* Bouncing Audio Spectrum Side Bars */}
          <div className="absolute top-1/3 left-3 h-52 flex flex-col justify-around opacity-60">
            <div className="w-10 h-2 rounded bg-amber-500 animate-pulse" />
            <div className="w-16 h-2 rounded bg-amber-400 animate-pulse duration-700" />
            <div className="w-12 h-2 rounded bg-amber-600 animate-pulse duration-1000" />
          </div>
          <div className="absolute top-1/3 right-3 h-52 flex flex-col justify-around items-end opacity-60">
            <div className="w-12 h-2 rounded bg-rose-600 animate-pulse" />
            <div className="w-18 h-2 rounded bg-rose-500 animate-pulse duration-700" />
            <div className="w-10 h-2 rounded bg-rose-700 animate-pulse duration-1000" />
          </div>

          <div className="absolute bottom-[20%] left-[8%] font-serif text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-md animate-bounce">
            స
          </div>
          <div className="absolute bottom-[20%] right-[8%] font-serif text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-md animate-bounce" style={{ animationDuration: "4.5s" }}>
            పా
          </div>
        </>
      )}

      {/* ── MODE 3: COMPOSERS / VAGGEYAKARAS (Trinity Sacred Aura & Temple Rays) ── */}
      {isComposers && (
        <>
          {/* Temple Ray Light Sweep */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-amber-500/20 via-amber-700/10 to-transparent blur-3xl pointer-events-none"
            style={{ animation: "trinityAuraPulse 5s ease-in-out infinite" }}
          />

          {/* Side Floating Musical Emblems */}
          <div className="absolute bottom-16 left-10 text-6xl text-amber-700 dark:text-amber-300 drop-shadow-xl animate-bounce" style={{ animationDuration: "6s" }}>
            🪕
          </div>
          <div className="absolute bottom-16 right-10 text-6xl text-amber-700 dark:text-amber-300 drop-shadow-xl animate-bounce" style={{ animationDuration: "5s" }}>
            🕉️
          </div>
          <div className="absolute top-1/3 left-6 font-serif text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-md animate-pulse">
            స
          </div>
          <div className="absolute top-1/3 right-6 font-serif text-5xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-md animate-pulse" style={{ animationDuration: "4s" }}>
            గా
          </div>
        </>
      )}

      {/* ── MODE 4: 35 SULADI SAPTA TALAS (Beat Pulse & Laya Rhythm Radar) ── */}
      {isTalas && (
        <>
          {/* Expanding Concentric Tala Beat Rings */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none">
            <div className="size-80 rounded-full border-4 border-amber-500/35" style={{ animation: "ringExpandPulse 3.5s linear infinite" }} />
            <div className="size-[500px] rounded-full border-2 border-rose-600/30 absolute inset-0 -m-20" style={{ animation: "ringExpandPulse 3.5s linear infinite 1.75s" }} />
          </div>

          {/* Bottom Rhythm Beat Bar Visualizer */}
          <div className="absolute bottom-0 inset-x-0 h-16 flex items-end justify-center gap-2.5 opacity-50 pointer-events-none">
            {[2, 5, 3, 5, 2, 3, 5, 3, 2, 5, 3, 5, 2].map((beats, idx) => (
              <div
                key={idx}
                className="w-3.5 rounded-t-lg bg-gradient-to-t from-[#800020] via-amber-600 to-amber-300 animate-pulse"
                style={{ height: `${beats * 12}px`, animationDuration: `${0.7 + (idx % 3) * 0.3}s` }}
              />
            ))}
          </div>
        </>
      )}

      {/* ── MODE 5: MELAKARTA DETAIL PAGE (Swarasthana Scale Ladder) ── */}
      {isMelakartaDetail && (
        <>
          <div className="absolute top-1/4 right-8 flex flex-col gap-3.5 font-serif text-2xl font-extrabold text-[#800020] dark:text-amber-300 pointer-events-none drop-shadow-md">
            <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>స'</span>
            <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>నీ</span>
            <span className="animate-bounce" style={{ animationDelay: "0.5s" }}>దా</span>
            <span className="animate-bounce" style={{ animationDelay: "0.7s" }}>పా</span>
            <span className="animate-bounce" style={{ animationDelay: "0.9s" }}>మా</span>
            <span className="animate-bounce" style={{ animationDelay: "1.1s" }}>గా</span>
            <span className="animate-bounce" style={{ animationDelay: "1.3s" }}>రి</span>
            <span className="animate-bounce" style={{ animationDelay: "1.5s" }}>స</span>
          </div>
        </>
      )}

      {/* ── MODE 6: MULTI-INSTRUMENT STUDIO (Veena Strings & Sound Vibration) ── */}
      {isInstruments && (
        <>
          {/* 7 Vertical Plucked Veena Strings */}
          <div className="absolute inset-0 opacity-55 flex justify-around pointer-events-none">
            {[1, 2, 3, 4, 5, 6, 7].map((stringNum) => (
              <div key={stringNum} className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent">
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-3.5 h-24 bg-gradient-to-b from-transparent via-amber-300 to-transparent rounded-full blur-[1px]"
                  style={{ animation: `stringLightTravel ${2 + stringNum * 0.3}s ease-in-out infinite ${stringNum * 0.25}s` }}
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-16 left-12 text-6xl text-amber-700 animate-bounce" style={{ animationDuration: "4s" }}>
            🪕
          </div>
          <div className="absolute bottom-16 right-12 text-6xl text-amber-700 animate-bounce" style={{ animationDuration: "4.5s" }}>
            🎻
          </div>
        </>
      )}

      {/* ── MODE 7: STUDY NOTES (Palm-Leaf Manuscript & Swara Dust) ── */}
      {isNotes && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-amber-600/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-16 left-10 text-5xl text-amber-800 dark:text-amber-300 animate-pulse">
            📜 నాదబ్రహ్మ లక్ష్మీ గ్రంథాలు
          </div>
        </>
      )}

      {/* ── MODE 8: TEACHER PORTAL (Gurukulam Diyah Glow) ── */}
      {isTeacher && (
        <>
          <div className="absolute bottom-12 right-12 text-5xl text-amber-700 dark:text-amber-300 animate-pulse">
            🪔 పవిత్ర గురుకుల సాధన
          </div>
        </>
      )}

      {/* ── DEFAULT / KNOWLEDGE HUB MAIN (72 Melakarta Swara Chakra & Audio Visualizer) ── */}
      {!isExplorer && !isCompare && !isComposers && !isTalas && !isMelakartaDetail && !isInstruments && !isNotes && !isTeacher && (
        <>
          {/* Rotating Swara Chakra */}
          <div
            className="absolute -top-32 -right-32 size-[420px] rounded-full border-2 border-dashed border-[#d4af37]/40 opacity-50 flex items-center justify-center pointer-events-none"
            style={{ animation: "spinChakra 40s linear infinite" }}
          >
            <div className="size-[300px] rounded-full border border-dotted border-[#800020]/50 flex items-center justify-center">
              <span className="font-serif text-sm font-bold text-[#d4af37]">స రి గా మా పా దా నీ</span>
            </div>
          </div>

          {/* Sine Wave Frequency Lines */}
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
            </svg>
          </div>

          {/* Plucked Tanpura Strings */}
          <div className="absolute inset-0 opacity-60 dark:opacity-50 flex justify-around pointer-events-none">
            <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent">
              <div
                className="absolute left-1/2 -translate-x-1/2 w-3.5 h-24 bg-gradient-to-b from-transparent via-amber-300 to-transparent rounded-full blur-[1px]"
                style={{ animation: "stringLightTravel 2.8s ease-in-out infinite" }}
              />
            </div>
            <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#800020] to-transparent">
              <div
                className="absolute left-1/2 -translate-x-1/2 w-3.5 h-24 bg-gradient-to-b from-transparent via-red-500 to-transparent rounded-full blur-[1px]"
                style={{ animation: "stringLightTravel 2.2s ease-in-out infinite 0.6s" }}
              />
            </div>
            <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#d4af37] to-transparent">
              <div
                className="absolute left-1/2 -translate-x-1/2 w-3.5 h-24 bg-gradient-to-b from-transparent via-amber-300 to-transparent rounded-full blur-[1px]"
                style={{ animation: "stringLightTravel 3.2s ease-in-out infinite 1.2s" }}
              />
            </div>
            <div className="relative w-[2px] h-full bg-gradient-to-b from-transparent via-[#800020] to-transparent">
              <div
                className="absolute left-1/2 -translate-x-1/2 w-3.5 h-24 bg-gradient-to-b from-transparent via-amber-200 to-transparent rounded-full blur-[1px]"
                style={{ animation: "stringLightTravel 2.5s ease-in-out infinite 0.3s" }}
              />
            </div>
          </div>

          {/* Bottom Equalizer Visualizer */}
          <div className="absolute bottom-0 inset-x-0 h-16 opacity-45 dark:opacity-35 flex items-end justify-center gap-1.5 px-4 pointer-events-none">
            {[2.1, 1.4, 3.2, 1.8, 2.7, 1.2, 3.5, 2.3, 1.6, 2.9, 3.1, 1.5, 2.4, 1.9, 3.3, 2.0].map((dur, idx) => (
              <div
                key={idx}
                className="w-2.5 rounded-t-lg bg-gradient-to-t from-[#800020] via-[#d4af37] to-amber-300"
                style={{ animation: `eqBounce ${dur}s ease-in-out infinite ${idx * 0.15}s` }}
              />
            ))}
          </div>

          {/* Vibrant Telugu Swaras Drifting */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-[10%] left-[5%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]"
              style={{ animation: "floatSwaraSlow 4s ease-in-out infinite" }}
            >
              స
            </div>
            <div
              className="absolute top-[22%] right-[5%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]"
              style={{ animation: "floatSwaraReverse 4.8s ease-in-out infinite 0.5s" }}
            >
              రి
            </div>
            <div
              className="absolute top-[42%] left-[4%] font-serif text-6xl md:text-7xl font-extrabold text-[#800020] dark:text-amber-200 drop-shadow-[0_0_25px_rgba(128,0,32,0.8)]"
              style={{ animation: "floatSwaraSlow 5.2s ease-in-out infinite 1s" }}
            >
              గా
            </div>
            <div
              className="absolute bottom-[32%] right-[7%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]"
              style={{ animation: "floatSwaraReverse 4.2s ease-in-out infinite 0.2s" }}
            >
              మా
            </div>
            <div
              className="absolute bottom-[16%] left-[9%] font-serif text-6xl md:text-7xl font-extrabold text-[#800020] dark:text-amber-200 drop-shadow-[0_0_25px_rgba(212,175,55,0.85)]"
              style={{ animation: "floatSwaraSlow 5.6s ease-in-out infinite 0.8s" }}
            >
              పా
            </div>
            <div
              className="absolute top-[62%] right-[4%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_20px_rgba(128,0,32,0.8)]"
              style={{ animation: "floatSwaraReverse 6s ease-in-out infinite 1.5s" }}
            >
              దా
            </div>
            <div
              className="absolute bottom-[6%] right-[16%] font-serif text-5xl md:text-6xl font-extrabold text-[#800020] dark:text-amber-300 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]"
              style={{ animation: "floatSwaraSlow 4.6s ease-in-out infinite 1.2s" }}
            >
              నీ
            </div>

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

            <div className="absolute top-[25%] left-[35%] size-3 bg-amber-400 rounded-full blur-[1px]" style={{ animation: "sparkFloatVertical 3s infinite" }} />
            <div className="absolute top-[52%] left-[65%] size-3.5 bg-amber-300 rounded-full blur-[1px]" style={{ animation: "sparkFloatVertical 3.8s infinite 0.8s" }} />
            <div className="absolute top-[70%] left-[20%] size-3 bg-amber-400 rounded-full blur-[1px]" style={{ animation: "sparkFloatVertical 3.2s infinite 1.6s" }} />
          </div>
        </>
      )}
    </div>
  );
}
