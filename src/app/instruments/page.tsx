export const dynamic = "force-dynamic";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music4 } from "lucide-react";
import { MusicThemeBackdrop } from "@/components/ui/music-theme-backdrop";

export default function InstrumentsStubPage() {
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col justify-between">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-24 text-center relative z-10 flex-1">
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/30 p-10 md:p-12 bg-card/90 backdrop-blur-md shadow-xl">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#800020]/15 ring-1 ring-swara-gold/40">
            <Music4 className="size-8 text-[#800020] dark:text-amber-200" />
          </div>
          
          <Badge variant="outline" className="border-[#800020]/30 text-[#800020] dark:text-amber-200 mb-4 font-bold">
            Module Preview
          </Badge>
          
          <h1 className="font-serif text-3xl font-extrabold text-[#800020] dark:text-amber-100 mb-4">
            Multi-Instrument Studio
          </h1>
          
          <p className="text-foreground/90 font-medium leading-relaxed mb-8 text-sm">
            The Multi-Instrument support system is currently under active development. This module brings interactive tuning helpers, octave analysis, and visual drone overlays customized specifically for Vocalists, Veena players, and Violinists.
          </p>

          <Button
            size="sm"
            className="bg-[#800020] hover:bg-[#A00028] text-white font-bold rounded-xl px-5 py-2.5"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <ArrowLeft className="mr-2 size-4" /> Go back to Home
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
