"use client";

import Image from "next/image";
import { TanpuraDroidStandalonePlayer } from "@/components/music/tanpura-droid-player";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Sparkles } from "lucide-react";

export function TanpuraTablaSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center gap-2">
            <Badge variant="outline" className="border-kumkum/20 text-kumkum font-bold">
              Standalone Studio Drone
            </Badge>
            <Badge variant="outline" className="border-swara-gold/40 text-swara-gold font-bold flex items-center gap-1">
              <Smartphone className="size-3" /> Modeled after: Tanpura Droid App
            </Badge>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-kumkum">
            Acoustic Tanpura Droid Player
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
            Set your Adhara Shadja Sruthi pitch key, octave modes (Male / Female), classical <strong className="text-kumkum font-bold">SA - PA - SA</strong> swara tuning patterns, and Jivari cotton thread buzz physics live for your practice sessions.
          </p>
        </div>

        {/* Tanpura Instrument Feature Card Banner */}
        <div className="rounded-3xl border border-swara-gold/30 bg-gradient-to-r from-kumkum/10 via-amber-500/10 to-kumkum/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-swara-gold/50 shadow-md bg-kumkum/20">
              <Image
                src="/tanpura-instrument.png"
                alt="Acoustic Miraj Tanpura"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-swara-gold flex items-center gap-1">
                <Sparkles className="size-3" /> Acoustic Miraj Tanpura
              </span>
              <h3 className="font-serif text-xl font-bold text-kumkum">Classical 4-String Drone Synthesizer</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Authentic Jivari acoustic thread buzz & SA-PA-SA tuning</p>
            </div>
          </div>
        </div>

        <TanpuraDroidStandalonePlayer />
      </div>
    </section>
  );
}
