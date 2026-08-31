"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function MusicBackground() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting to avoid server mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Determine active module from path
  let activeModule = "home";
  if (pathname === "/") activeModule = "home";
  else if (pathname.startsWith("/knowledge-hub")) activeModule = "knowledge-hub";
  else if (pathname.startsWith("/notes")) activeModule = "notes";
  else if (pathname.startsWith("/ai-guru")) activeModule = "ai-guru";
  else if (pathname.startsWith("/instruments")) activeModule = "instruments";
  else if (pathname.startsWith("/student")) activeModule = "student";
  else if (pathname.startsWith("/teacher")) activeModule = "teacher";
  else if (pathname.startsWith("/admin")) activeModule = "admin";

  return (
    <div className="fixed inset-0 -z-20 h-full w-full overflow-hidden pointer-events-none select-none">
      {/* Dynamic Background Colors/Gradients */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 h-full w-full"
        >
          {activeModule === "home" && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#faf6f0] via-[#faf6f0] to-[#f3ebe0] dark:from-[#0b1120] dark:via-[#0b1120] dark:to-[#141c2e]">
              <div className="absolute top-1/4 right-1/4 size-[500px] rounded-full bg-gradient-to-r from-[#e68a00]/8 to-[#800020]/8 blur-[120px] dark:from-[#e68a00]/5 dark:to-[#800020]/5" />
            </div>
          )}

          {activeModule === "knowledge-hub" && (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#faf6f0] via-[#f7f0e6] to-[#f3ebe0] dark:from-[#0b1120] dark:via-[#0f192e] dark:to-[#141c2e]">
              <div className="absolute bottom-1/4 left-1/4 size-[400px] rounded-full bg-[#d4af37]/8 blur-[100px] dark:bg-[#d4af37]/5" />
            </div>
          )}

          {activeModule === "notes" && (
            <div className="absolute inset-0 bg-[#faf6f0] dark:bg-[#0b1120] chandan-grid">
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#f3ebe0]/40 to-transparent dark:from-[#141c2e]/30" />
            </div>
          )}

          {activeModule === "ai-guru" && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f0] via-[#fdfbf7] to-[#faf6f0] dark:from-[#0b1120] dark:via-[#141c2e] dark:to-[#0b1120]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-gradient-to-r from-[#800020]/5 to-[#e68a00]/5 blur-[120px] dark:from-[#9e1b32]/4 dark:to-[#d4af37]/4" />
            </div>
          )}

          {activeModule === "instruments" && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf6f0] via-[#fdfbf7] to-[#faf6f0] dark:from-[#0b1120] dark:via-[#101b35] dark:to-[#0b1120]">
              <div className="absolute right-0 bottom-0 size-[450px] rounded-full bg-[#e68a00]/6 blur-[90px] dark:bg-[#e68a00]/4" />
            </div>
          )}

          {activeModule === "student" && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f0] via-[#faf6f0] to-[#fff3e0] dark:from-[#0b1120] dark:via-[#0b1120] dark:to-[#1c182b]">
              <div className="absolute bottom-0 inset-x-0 h-[300px] bg-gradient-to-t from-[#f0a500]/6 to-transparent dark:from-[#e68a00]/4" />
            </div>
          )}

          {activeModule === "teacher" && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#faf6f0] to-[#f3ebe0] dark:from-[#0b1120] to-[#1a1724]">
              <div className="absolute top-0 inset-x-0 h-[250px] bg-gradient-to-b from-[#800020]/5 to-transparent dark:from-[#9e1b32]/4" />
            </div>
          )}

          {activeModule === "admin" && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f0] to-[#f3ebe0] dark:from-[#0b1120] to-[#121b2d]">
              <div className="absolute inset-y-0 left-0 w-[150px] bg-gradient-to-r from-[#d4af37]/4 to-transparent dark:from-[#d4af37]/2" />
              <div className="absolute inset-y-0 right-0 w-[150px] bg-gradient-to-l from-[#d4af37]/4 to-transparent dark:from-[#d4af37]/2" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dynamic SVG Artworks and Patterns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule + "-art"}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 h-full w-full flex items-center justify-center"
        >
          {activeModule === "home" && (
            <div className="absolute right-[-100px] top-[10%] opacity-[0.06] dark:opacity-[0.03] select-none pointer-events-none rotate-12 transition-transform duration-1000">
              {/* Mandala Art */}
              <svg width="600" height="600" viewBox="0 0 200 200" fill="none" stroke="currentColor" className="text-[#800020] dark:text-[#d4af37] animate-[spin_180s_linear_infinite]">
                <circle cx="100" cy="100" r="90" strokeWidth="0.5" strokeDasharray="1 1" />
                <circle cx="100" cy="100" r="80" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="60" strokeWidth="0.5" strokeDasharray="3 3" />
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 360) / 24;
                  return (
                    <g key={i} transform={`rotate(${angle} 100 100)`}>
                      <path d="M100 20 C103 40, 97 40, 100 60 C97 40, 103 40, 100 20" strokeWidth="0.5" />
                      <line x1="100" y1="20" x2="100" y2="10" strokeWidth="0.25" />
                      <circle cx="100" cy="10" r="1" fill="currentColor" />
                    </g>
                  );
                })}
                {Array.from({ length: 48 }).map((_, i) => {
                  const angle = (i * 360) / 48;
                  return (
                    <line
                      key={i}
                      x1="100"
                      y1="80"
                      x2="100"
                      y2="90"
                      strokeWidth="0.25"
                      transform={`rotate(${angle} 100 100)`}
                    />
                  );
                })}
              </svg>
            </div>
          )}

          {activeModule === "knowledge-hub" && (
            <>
              {/* Notation lines with Swaras */}
              <div className="absolute left-[5%] top-[25%] w-[90%] h-[300px] opacity-[0.08] dark:opacity-[0.04]">
                <svg width="100%" height="100%" viewBox="0 0 800 200" fill="none" stroke="currentColor" className="text-[#800020] dark:text-[#d4af37]">
                  {/* Swara Lines */}
                  <line x1="0" y1="40" x2="800" y2="40" strokeWidth="0.5" />
                  <line x1="0" y1="80" x2="800" y2="80" strokeWidth="0.5" />
                  <line x1="0" y1="120" x2="800" y2="120" strokeWidth="0.5" />
                  <line x1="0" y1="160" x2="800" y2="160" strokeWidth="0.5" />
                  
                  {/* Swara Letters */}
                  <text x="50" y="35" fontFamily="serif" fontSize="16" fill="currentColor" fontWeight="bold">S</text>
                  <text x="180" y="75" fontFamily="serif" fontSize="16" fill="currentColor" fontWeight="bold">R</text>
                  <text x="310" y="115" fontFamily="serif" fontSize="16" fill="currentColor" fontWeight="bold">G</text>
                  <text x="440" y="155" fontFamily="serif" fontSize="16" fill="currentColor" fontWeight="bold">M</text>
                  <text x="570" y="75" fontFamily="serif" fontSize="16" fill="currentColor" fontWeight="bold">P</text>
                  <text x="680" y="35" fontFamily="serif" fontSize="16" fill="currentColor" fontWeight="bold">D</text>
                  <text x="750" y="115" fontFamily="serif" fontSize="16" fill="currentColor" fontWeight="bold">N</text>
                </svg>
              </div>
              {/* Veena Outline */}
              <div className="absolute right-[2%] bottom-[5%] opacity-[0.06] dark:opacity-[0.03]">
                <svg width="350" height="350" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-[#800020] dark:text-[#d4af37]">
                  {/* Stylized Veena */}
                  <path d="M20 50 C20 35, 35 20, 50 20 C65 20, 80 35, 80 50 C80 65, 65 80, 50 80 C35 80, 20 65, 20 50 Z" strokeWidth="0.5" />
                  <path d="M50 20 C50 10, 48 5, 45 5 C42 5, 40 10, 40 20" strokeWidth="0.5" />
                  <path d="M45 5 L55 5 M43 10 L57 10" strokeWidth="0.5" />
                  <line x1="50" y1="20" x2="50" y2="80" strokeWidth="1" />
                  <path d="M30 65 C30 55, 40 50, 50 50 C60 50, 70 55, 70 65" strokeWidth="0.5" />
                  <circle cx="50" cy="88" r="6" strokeWidth="0.5" />
                  <path d="M44 88 L56 88" strokeWidth="0.5" />
                </svg>
              </div>
            </>
          )}

          {activeModule === "notes" && (
            <div className="absolute right-[5%] top-[15%] opacity-[0.08] dark:opacity-[0.04]">
              {/* Peacock Feather */}
              <svg width="250" height="400" viewBox="0 0 100 200" fill="none" stroke="currentColor" className="text-[#800020] dark:text-[#d4af37]">
                <path d="M50 190 C50 150, 48 100, 50 20" strokeWidth="0.75" />
                {/* Feathery barbs */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const y = 30 + i * 5;
                  const curve = Math.sin(i * 0.2) * 15;
                  return (
                    <g key={i}>
                      <path d={`M50 ${y} C${50 - 15 - curve} ${y - 10}, ${50 - 25 - curve} ${y - 30}, ${30 - curve} ${y - 45}`} strokeWidth="0.3" />
                      <path d={`M50 ${y} C${50 + 15 + curve} ${y - 10}, ${50 + 25 + curve} ${y - 30}, ${70 + curve} ${y - 45}`} strokeWidth="0.3" />
                    </g>
                  );
                })}
                {/* Eye of the feather */}
                <path d="M50 20 C35 20, 35 45, 50 55 C65 45, 65 20, 50 20 Z" strokeWidth="0.75" />
                <path d="M50 26 C40 26, 40 40, 50 47 C60 40, 60 26, 50 26 Z" fill="currentColor" fillOpacity="0.2" strokeWidth="0.5" />
                <circle cx="50" cy="35" r="4" fill="currentColor" fillOpacity="0.4" />
              </svg>
            </div>
          )}

          {activeModule === "ai-guru" && (
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] dark:opacity-[0.04]">
              {/* Soundwaves Concentric circles */}
              <svg width="80%" height="80%" viewBox="0 0 200 200" fill="none" stroke="currentColor" className="text-[#800020] dark:text-[#d4af37]">
                <motion.circle
                  cx="100"
                  cy="100"
                  r="20"
                  strokeWidth="0.5"
                  animate={{ r: [20, 95, 20], strokeWidth: [1, 0.2, 1] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="40"
                  strokeWidth="0.5"
                  animate={{ r: [40, 95, 20, 40], strokeWidth: [0.8, 0.1, 1, 0.8] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="60"
                  strokeWidth="0.5"
                  animate={{ r: [60, 95, 20, 60], strokeWidth: [0.6, 0.1, 1, 0.6] }}
                  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="80"
                  strokeWidth="0.5"
                  animate={{ r: [80, 95, 20, 80], strokeWidth: [0.4, 0.1, 1, 0.4] }}
                  transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Crosshairs */}
                <line x1="100" y1="5" x2="100" y2="195" strokeWidth="0.2" strokeDasharray="2 2" />
                <line x1="5" y1="100" x2="195" y2="100" strokeWidth="0.2" strokeDasharray="2 2" />
              </svg>
            </div>
          )}

          {activeModule === "instruments" && (
            <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]">
              {/* Four instrument icon vectors */}
              <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" stroke="currentColor" className="text-[#800020] dark:text-[#d4af37]">
                {/* Top Left: Flute outline */}
                <g transform="translate(100, 100) rotate(-30)">
                  <rect x="0" y="10" width="180" height="8" rx="2" strokeWidth="0.75" />
                  <circle cx="20" cy="14" r="1.5" fill="currentColor" />
                  <circle cx="50" cy="14" r="1.2" fill="currentColor" />
                  <circle cx="70" cy="14" r="1.2" fill="currentColor" />
                  <circle cx="90" cy="14" r="1.2" fill="currentColor" />
                  <circle cx="110" cy="14" r="1.2" fill="currentColor" />
                  <circle cx="130" cy="14" r="1.2" fill="currentColor" />
                  <circle cx="150" cy="14" r="1.2" fill="currentColor" />
                  <path d="M175 10 L175 18" strokeWidth="0.5" />
                </g>
                {/* Bottom Left: Violin outline */}
                <g transform="translate(80, 350)">
                  <path d="M30 10 C35 5, 45 5, 50 10 C55 5, 65 5, 70 10 C75 20, 75 35, 68 45 C73 55, 73 70, 65 80 C58 88, 42 88, 35 80 C27 70, 27 55, 32 45 C25 35, 25 20, 30 10 Z" strokeWidth="0.75" />
                  <path d="M50 10 L50 -20 C50 -25, 47 -28, 47 -32" strokeWidth="0.5" />
                  <circle cx="47" cy="-32" r="2.5" strokeWidth="0.5" />
                  <line x1="38" y1="-23" x2="62" y2="-23" strokeWidth="0.5" />
                  {/* F-holes */}
                  <path d="M37 32 C35 40, 42 42, 40 50" strokeWidth="0.5" />
                  <path d="M63 32 C65 40, 58 42, 60 50" strokeWidth="0.5" />
                </g>
                {/* Bottom Right: Mridangam outline */}
                <g transform="translate(580, 380) rotate(15)">
                  <path d="M10 20 C10 10, 20 5, 50 5 C80 5, 90 10, 90 20 L90 50 C90 60, 80 65, 50 65 C20 65, 10 60, 10 50 Z" strokeWidth="0.75" />
                  {/* Left Head */}
                  <ellipse cx="10" cy="35" rx="4" ry="15" strokeWidth="0.75" />
                  <ellipse cx="10" cy="35" rx="2.5" ry="9" fill="currentColor" fillOpacity="0.3" />
                  {/* Right Head */}
                  <ellipse cx="90" cy="35" rx="4" ry="15" strokeWidth="0.75" />
                  <ellipse cx="90" cy="35" rx="2" ry="7" fill="currentColor" fillOpacity="0.4" />
                  {/* Straps */}
                  {Array.from({ length: 8 }).map((_, idx) => {
                    const yOffset = 5 + idx * 7.5;
                    return (
                      <line key={idx} x1="10" y1="35" x2="90" y2={yOffset} strokeWidth="0.3" />
                    );
                  })}
                </g>
              </svg>
            </div>
          )}

          {activeModule === "student" && (
            <div className="absolute right-[5%] bottom-[5%] opacity-[0.08] dark:opacity-[0.04]">
              {/* Lotus Art */}
              <svg width="220" height="220" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-[#800020] dark:text-[#d4af37]">
                {/* Center Petal */}
                <path d="M50 20 C45 35, 45 65, 50 80 C55 65, 55 35, 50 20 Z" strokeWidth="0.75" />
                {/* Left Petals */}
                <path d="M50 30 C30 40, 25 65, 50 80 C32 65, 42 45, 50 30 Z" strokeWidth="0.6" />
                <path d="M50 45 C15 50, 15 70, 50 80 C20 70, 35 55, 50 45 Z" strokeWidth="0.5" />
                {/* Right Petals */}
                <path d="M50 30 C70 40, 75 65, 50 80 C68 65, 58 45, 50 30 Z" strokeWidth="0.6" />
                <path d="M50 45 C85 50, 85 70, 50 80 C80 70, 65 55, 50 45 Z" strokeWidth="0.5" />
                {/* Base leaves */}
                <path d="M25 80 C35 75, 65 75, 75 80 C65 85, 35 85, 25 80 Z" strokeWidth="0.5" />
              </svg>
            </div>
          )}

          {activeModule === "teacher" && (
            <div className="absolute inset-x-0 top-0 opacity-[0.08] dark:opacity-[0.04]">
              {/* Temple Torana / Archway */}
              <svg width="100%" height="80" viewBox="0 0 1000 80" preserveAspectRatio="none" fill="none" stroke="currentColor" className="text-[#800020] dark:text-[#d4af37]">
                <path d="M0 10 Q250 30, 500 10 Q750 30, 1000 10" strokeWidth="1" />
                <path d="M0 18 Q250 38, 500 18 Q750 38, 1000 18" strokeWidth="0.5" strokeDasharray="3 3" />
                {Array.from({ length: 20 }).map((_, i) => {
                  const x = 25 + i * 50;
                  return (
                    <g key={i} transform={`translate(${x}, 20)`}>
                      <path d="M0 0 C-10 10, -5 25, 0 30 C5 25, 10 10, 0 0 Z" strokeWidth="0.5" />
                      <circle cx="0" cy="35" r="1.5" fill="currentColor" />
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {activeModule === "admin" && (
            <div className="absolute inset-y-0 inset-x-0 flex justify-between opacity-[0.08] dark:opacity-[0.04]">
              {/* Pillars Left */}
              <svg width="120" height="100%" viewBox="0 0 80 500" preserveAspectRatio="none" fill="none" stroke="currentColor" className="text-[#800020] dark:text-[#d4af37]">
                <line x1="20" y1="0" x2="20" y2="500" strokeWidth="1.5" />
                <line x1="28" y1="0" x2="28" y2="500" strokeWidth="0.5" />
                <line x1="48" y1="0" x2="48" y2="500" strokeWidth="0.5" />
                <line x1="56" y1="0" x2="56" y2="500" strokeWidth="1.5" />
                {Array.from({ length: 10 }).map((_, i) => {
                  const y = 30 + i * 50;
                  return (
                    <g key={i} transform={`translate(20, ${y})`}>
                      <rect x="0" y="0" width="36" height="8" strokeWidth="0.75" />
                      <line x1="18" y1="0" x2="18" y2="8" strokeWidth="0.5" />
                    </g>
                  );
                })}
              </svg>
              {/* Pillars Right */}
              <svg width="120" height="100%" viewBox="0 0 80 500" preserveAspectRatio="none" fill="none" stroke="currentColor" className="text-[#800020] dark:text-[#d4af37] scale-x-[-1]">
                <line x1="20" y1="0" x2="20" y2="500" strokeWidth="1.5" />
                <line x1="28" y1="0" x2="28" y2="500" strokeWidth="0.5" />
                <line x1="48" y1="0" x2="48" y2="500" strokeWidth="0.5" />
                <line x1="56" y1="0" x2="56" y2="500" strokeWidth="1.5" />
                {Array.from({ length: 10 }).map((_, i) => {
                  const y = 30 + i * 50;
                  return (
                    <g key={i} transform={`translate(20, ${y})`}>
                      <rect x="0" y="0" width="36" height="8" strokeWidth="0.75" />
                      <line x1="18" y1="0" x2="18" y2="8" strokeWidth="0.5" />
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
