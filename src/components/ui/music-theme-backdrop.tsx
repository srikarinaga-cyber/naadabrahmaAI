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

      {/* ── MODE 1: RAGA EXPLORER (Deep Cosmic Melakarta Network & Swara Constellation) ── */}
      {isExplorer && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c0704] via-[#1a0e08] to-[#050201]" />
          
          {/* Animated Melakarta Constellation Lines */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <svg className="w-full h-full">
              <line x1="10%" y1="25%" x2="35%" y2="55%" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="6 6" className="animate-pulse" />
              <line x1="35%" y1="55%" x2="70%" y2="30%" stroke="#e5c158" strokeWidth="1.5" strokeDasharray="8 8" className="animate-pulse duration-700" />
              <line x1="35%" y1="55%" x2="65%" y2="75%" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="6 6" className="animate-pulse duration-1000" />
              <line x1="70%" y1="30%" x2="90%" y2="60%" stroke="#800020" strokeWidth="1.5" strokeDasharray="10 10" className="animate-pulse duration-500" />

              {/* Pulsing Constellation Swara Nodes */}
              <circle cx="10%" cy="25%" r="6" fill="#d4af37" className="animate-ping" style={{ animationDuration: "3s" }} />
              <circle cx="35%" cy="55%" r="8" fill="#e5c158" className="animate-ping" style={{ animationDuration: "2.5s" }} />
              <circle cx="70%" cy="30%" r="7" fill="#d4af37" className="animate-ping" style={{ animationDuration: "4s" }} />
              <circle cx="65%" cy="75%" r="6" fill="#800020" className="animate-ping" style={{ animationDuration: "3.5s" }} />
            </svg>
          </div>

          {/* Floating Swara Nodes on background sides */}
          <div className="absolute top-[30%] left-[8%] font-serif text-4xl font-extrabold text-amber-400/50 drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] animate-bounce" style={{ animationDuration: "5s" }}>
            స
          </div>
          <div className="absolute top-[60%] left-[15%] font-serif text-4xl font-extrabold text-amber-300/40 drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] animate-pulse">
            రి
          </div>
          <div className="absolute top-[25%] right-[10%] font-serif text-4xl font-extrabold text-amber-400/50 drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] animate-bounce" style={{ animationDuration: "6s" }}>
            గా
          </div>
          <div className="absolute bottom-[20%] right-[15%] font-serif text-4xl font-extrabold text-amber-300/40 drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] animate-pulse">
            మా
          </div>
        </>
      )}

      {/* ── MODE 2: RAGA COMPARISON (Dual Pitch Wave Resonance & Opposing Spectrum) ── */}
      {isCompare && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#180a06]/40 via-transparent to-[#0a1218]/40 dark:from-background/60 dark:to-background/80" />

          {/* Dual Opposing Sine Waves (Raga 1 vs Raga 2 Pitch Waves) */}
          <div className="absolute inset-0 opacity-50 pointer-events-none">
            <svg className="w-full h-full">
              {/* Left Raga 1 Golden Sine Wave */}
              <path
                d="M -50,220 Q 300,100 650,300 T 1400,220"
                fill="none"
                stroke="#d4af37"
                strokeWidth="3"
                strokeDasharray="16 8"
                style={{ animation: "waveSineFlow 8s linear infinite" }}
              />
              {/* Right Raga 2 Cyan/Crimson Sine Wave */}
              <path
                d="M -50,380 Q 400,500 850,320 T 1600,400"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="16 8"
                style={{ animation: "waveSineFlow 10s linear infinite reverse" }}
              />
            </svg>
          </div>

          {/* Opposing Spectrum Bars along edges */}
          <div className="absolute top-1/3 left-2 h-48 flex flex-col justify-around opacity-40">
            <div className="w-8 h-1.5 rounded bg-amber-500 animate-pulse" />
            <div className="w-14 h-1.5 rounded bg-amber-400 animate-pulse duration-700" />
            <div className="w-10 h-1.5 rounded bg-amber-600 animate-pulse duration-1000" />
          </div>
          <div className="absolute top-1/3 right-2 h-48 flex flex-col justify-around items-end opacity-40">
            <div className="w-10 h-1.5 rounded bg-sky-500 animate-pulse" />
            <div className="w-16 h-1.5 rounded bg-sky-400 animate-pulse duration-700" />
            <div className="w-8 h-1.5 rounded bg-sky-600 animate-pulse duration-1000" />
          </div>
        </>
      )}

      {/* ── MODE 3: COMPOSERS / VAGGEYAKARAS (Trinity Sacred Halo & Temple Rays) ── */}
      {isComposers && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c0d06] via-[#0d0603] to-[#050201]" />
          
          {/* Soft Sweeping Temple Ray Light */}
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-gradient-to-b from-amber-500/15 via-amber-700/5 to-transparent blur-3xl pointer-events-none"
            style={{ animation: "trinityAuraPulse 6s ease-in-out infinite" }}
          />

          {/* Side Floating Musical Emblems */}
          <div className="absolute bottom-12 left-8 text-5xl text-amber-500/30 animate-bounce" style={{ animationDuration: "7s" }}>
            🪕
          </div>
          <div className="absolute bottom-12 right-8 text-5xl text-amber-500/30 animate-bounce" style={{ animationDuration: "6s" }}>
            🕉️
          </div>
        </>
      )}

      {/* ── MODE 4: 35 SULADI SAPTA TALAS (Beat Pulse & Laya Rhythm Radar) ── */}
      {isTalas && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#120804] via-[#080402] to-[#020100]" />

          {/* Expanding Concentric Tala Beat Rings from bottom center */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none">
            <div className="size-80 rounded-full border-2 border-amber-500/25" style={{ animation: "ringExpandPulse 4s linear infinite" }} />
            <div className="size-[500px] rounded-full border border-rose-500/20 absolute inset-0 -m-20" style={{ animation: "ringExpandPulse 4s linear infinite 2s" }} />
          </div>

          {/* Bottom Rhythm Beat Bar Visualizer */}
          <div className="absolute bottom-0 inset-x-0 h-12 flex items-end justify-center gap-2 opacity-30 pointer-events-none">
            {[1, 4, 2, 4, 1, 2, 4, 2, 1, 4, 2, 4].map((beats, idx) => (
              <div
                key={idx}
                className="w-3 rounded-t bg-gradient-to-t from-amber-700 to-amber-400 animate-pulse"
                style={{ height: `${beats * 10}px`, animationDuration: `${0.8 + (idx % 3) * 0.4}s` }}
              />
            ))}
          </div>
        </>
      )}

      {/* ── MODE 5: MELAKARTA DETAIL PAGE (Swarasthana Scale Ladder) ── */}
      {isMelakartaDetail && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#140a04]/40 via-transparent to-[#050201]/60" />

          {/* Floating Swarasthana Scale Nodes on right edge */}
          <div className="absolute top-1/4 right-6 flex flex-col gap-4 font-serif text-xl font-bold text-amber-400/40 pointer-events-none">
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

      {/* ── MODE 6: MULTI-INSTRUMENT STUDIO (Veena Strings & Sound Wave Vibration) ── */}
      {isInstruments && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e0703] via-[#170c06] to-[#080402]" />

          {/* 7 Vertical Plucked Veena Strings */}
          <div className="absolute inset-0 opacity-40 flex justify-around pointer-events-none">
            {[1, 2, 3, 4, 5, 6, 7].map((stringNum) => (
              <div key={stringNum} className="relative w-[1.5px] h-full bg-gradient-to-b from-transparent via-amber-500/60 to-transparent">
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-3 h-20 bg-gradient-to-b from-transparent via-amber-300 to-transparent rounded-full blur-[1px]"
                  style={{ animation: `stringLightTravel ${2 + stringNum * 0.4}s ease-in-out infinite ${stringNum * 0.3}s` }}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── MODE 7: STUDY NOTES (Palm-Leaf Manuscript & Swara Dust) ── */}
      {isNotes && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#180e07] via-[#0d0703] to-[#040201]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-amber-700/10 blur-3xl pointer-events-none" />
        </>
      )}

      {/* ── MODE 8: TEACHER PORTAL (Gurukulam Diyah Glow) ── */}
      {isTeacher && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#150a04] via-[#0a0402] to-[#030100]" />
          <div className="absolute bottom-10 right-10 text-4xl text-amber-500/30 animate-pulse">
            🪔
          </div>
        </>
      )}

      {/* ── DEFAULT / KNOWLEDGE HUB MAIN (72 Melakarta Swara Chakra & Audio Visualizer) ── */}
      {!isExplorer && !isCompare && !isComposers && !isTalas && !isMelakartaDetail && !isInstruments && !isNotes && !isTeacher && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-opacity duration-700"
            style={{
              backgroundImage: "url('/trinity-theme-bg.png')",
              animation: "trinityAuraPulse 5s ease-in-out infinite",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/20 via-transparent to-[#FAF6F0]/50 dark:from-background/30 dark:via-transparent dark:to-background/50" />

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
