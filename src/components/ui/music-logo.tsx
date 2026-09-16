"use client";

import React from "react";

export function CarnaticMusicLogo({
  className = "size-8",
}: {
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Outer Radiant Glowing Circle */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="url(#music-logo-grad)"
          stroke="#D4AF37"
          strokeWidth="2"
        />

        {/* Veena / Tanpura Sound Bowl (Gudam) */}
        <ellipse
          cx="32"
          cy="46"
          rx="13"
          ry="10"
          fill="url(#bowl-grad)"
          stroke="#FFE89C"
          strokeWidth="1.5"
        />

        {/* Sound Bowl Center Rosette */}
        <circle cx="32" cy="46" r="3" fill="#D4AF37" />

        {/* Neck (Dandi) */}
        <rect x="30" y="12" width="4" height="28" rx="2" fill="#FFE89C" />

        {/* Yali Scroll / Top Curve */}
        <path
          d="M 28 14 C 26 10, 32 6, 36 10 C 38 12, 34 16, 32 16"
          stroke="#FFE89C"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Tuning Pegs (Khutai) */}
        <line
          x1="26"
          y1="16"
          x2="38"
          y2="16"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="27"
          y1="22"
          x2="37"
          y2="22"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Golden Strings */}
        <line x1="31" y1="16" x2="31" y2="44" stroke="#FFF" strokeWidth="0.8" opacity="0.9" />
        <line x1="33" y1="16" x2="33" y2="44" stroke="#FFF" strokeWidth="0.8" opacity="0.9" />

        {/* Floating Musical Notes */}
        <path
          d="M 13 22 Q 17 18 19 22 T 23 22"
          stroke="#FFE89C"
          strokeWidth="1.5"
          fill="none"
          opacity="0.85"
        />
        <circle cx="13" cy="22" r="2" fill="#FFE89C" />
        <path
          d="M 43 25 Q 47 21 49 25 T 53 25"
          stroke="#FFE89C"
          strokeWidth="1.5"
          fill="none"
          opacity="0.85"
        />
        <circle cx="53" cy="25" r="2" fill="#FFE89C" />

        {/* Gradients */}
        <defs>
          <linearGradient
            id="music-logo-grad"
            x1="0"
            y1="0"
            x2="64"
            y2="64"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#800020" />
            <stop offset="0.6" stopColor="#A00028" />
            <stop offset="1" stopColor="#D4AF37" />
          </linearGradient>
          <linearGradient
            id="bowl-grad"
            x1="18"
            y1="35"
            x2="46"
            y2="57"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D4AF37" />
            <stop offset="1" stopColor="#800020" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
