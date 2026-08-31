"use client";

import React from "react";
import { MusicBackground } from "@/components/music/MusicBackground";
import { FloatingTanpura } from "@/components/music/FloatingTanpura";

export function ClientLayoutProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MusicBackground />
      {children}
      <FloatingTanpura />
    </>
  );
}
