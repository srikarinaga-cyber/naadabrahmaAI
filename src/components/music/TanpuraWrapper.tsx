"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the TanpuraPlayer with SSR disabled in this client-side wrapper
const TanpuraPlayer = dynamic(
  () => import("./TanpuraPlayer"),
  { ssr: false, loading: () => (
    <div className="glass-panel traditional-border traditional-glow rounded-2xl p-6 max-w-sm w-full h-[320px] flex items-center justify-center">
      <div className="text-center space-y-2">
        <span className="text-2xl animate-spin inline-block">🕉️</span>
        <p className="text-xs text-[#800020] font-semibold tracking-wider">Loading Tanpura Drone...</p>
      </div>
    </div>
  )}
);

export default function TanpuraWrapper() {
  return <TanpuraPlayer />;
}
