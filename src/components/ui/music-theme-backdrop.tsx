"use client";

import React from "react";

export function MusicThemeBackdrop() {
  return (
    <>
      {/* Sangeetha Trimurthulu Background Overlay showing the 3 Classical Saints */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-[center_top] bg-no-repeat opacity-45 dark:opacity-35"
        style={{ backgroundImage: "url('/trinity-theme-bg.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/40 via-transparent to-background/60 backdrop-blur-[0.5px]" />

      {/* Floating Golden Carnatic Musical Ornaments */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-16 left-[8%] text-amber-500/25 text-3xl animate-bounce">🎵</div>
        <div className="absolute top-1/4 right-[6%] text-amber-500/20 text-4xl animate-pulse">🎼</div>
        <div className="absolute bottom-1/3 left-[4%] text-amber-500/20 text-3xl animate-bounce">🎶</div>
        <div className="absolute bottom-16 right-[10%] text-amber-500/25 text-4xl animate-pulse">🕉️</div>
        <div className="absolute top-1/2 left-[15%] text-amber-500/15 text-5xl font-serif">🪕</div>
        <div className="absolute top-1/3 right-[18%] text-amber-500/15 text-3xl font-serif">🎶</div>
      </div>
    </>
  );
}
