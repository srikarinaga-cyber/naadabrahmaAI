"use client";

import Image from "next/image";
import { TanpuraDroidStandalonePlayer } from "@/components/music/tanpura-droid-player";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function TanpuraTablaSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 relative z-10">
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center gap-2">
            <Badge variant="outline" className="border-[#800020]/30 text-[#800020] dark:text-amber-200 font-extrabold text-xs">
              Standalone Studio Drone
            </Badge>
            <Badge variant="outline" className="border-swara-gold/50 text-[#800020] dark:text-amber-300 font-extrabold flex items-center gap-1 text-xs">
              <Smartphone className="size-3" /> Modeled after: Tanpura Droid App
            </Badge>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#800020] dark:text-amber-100">
            {t.tanpuraTitle}
          </h2>
          <p className="text-foreground/90 font-bold text-xs md:text-sm max-w-2xl mx-auto leading-relaxed bg-card/75 backdrop-blur-md p-4 rounded-2xl border border-swara-gold/30 shadow-sm">
            {t.tanpuraSubtitle}
          </p>
        </div>

        {/* Tanpura Instrument Feature Card Banner */}
        <div className="rounded-3xl border-2 border-swara-gold/40 bg-card/90 backdrop-blur-md p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-swara-gold/60 shadow-md bg-black">
              <Image
                src="/tanpura-instrument.png"
                alt="Acoustic Miraj Tanpura"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#800020] dark:text-amber-300 flex items-center gap-1">
                <Sparkles className="size-3" /> Acoustic Miraj Tanpura
              </span>
              <h3 className="font-serif text-xl font-extrabold text-[#800020] dark:text-amber-200">Classical 4-String Drone Synthesizer</h3>
              <p className="text-xs font-bold text-foreground/80 mt-0.5">Authentic Jivari acoustic thread buzz & SA-PA-SA tuning</p>
            </div>
          </div>
        </div>

        <TanpuraDroidStandalonePlayer />
      </div>
    </section>
  );
}
