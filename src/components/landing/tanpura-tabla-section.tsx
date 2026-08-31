"use client";

import { TanpuraTablaPlayer } from "@/components/music/tanpura-tabla-player";
import { Badge } from "@/components/ui/badge";

export function TanpuraTablaSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-8 space-y-3">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum">
            Live Accompaniment Engine
          </Badge>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-kumkum">
            Tanpura & Tabla Accompaniment Setter
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
            Set your Adhara Shadja Sruthi pitch, drone tunings (Panchama / Madhyama / Nishada), dual stereo Tanpura volumes, and Tabla tempo (BPM) live for your vocal or instrumental practice sessions.
          </p>
        </div>

        <TanpuraTablaPlayer />
      </div>
    </section>
  );
}
