"use client";

import { TanpuraDroidStandalonePlayer } from "@/components/music/tanpura-droid-player";
import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";

export function TanpuraTablaSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-8 space-y-3">
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

        <TanpuraDroidStandalonePlayer />
      </div>
    </section>
  );
}
