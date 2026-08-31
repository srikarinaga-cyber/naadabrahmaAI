"use client";

import React from "react";
import dynamic from "next/dynamic";

const MusicBackground = dynamic(
  () => import("@/components/music/MusicBackground").then((mod) => mod.MusicBackground),
  { ssr: false }
);

const FloatingTanpura = dynamic(
  () => import("@/components/music/FloatingTanpura"),
  { ssr: false }
);

export function ClientLayoutProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MusicBackground />
      {children}
      <FloatingTanpura />
    </>
  );
}
