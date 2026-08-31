export const dynamic = "force-dynamic";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock } from "lucide-react";
import { getTalas } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/static";
import { Tala } from "@/types/music";

const FALLBACK_TALAS = [
  {
    id: "1",
    name: "Adi Tala",
    beats: 8,
    angas: "I4 O O",
    description: "The most common rhythmic cycle in Carnatic music. Composed of 8 beats, represented by a Laghu of size 4 (1 beat + 3 finger counts) followed by two Dhrutams (1 beat + 1 wave each)."
  },
  {
    id: "2",
    name: "Rupaka Tala",
    beats: 6,
    angas: "O I4",
    description: "A popular rhythmic cycle composed of 6 beats. It contains a Dhrutam (2 beats) followed by a Laghu (4 beats)."
  },
  {
    id: "3",
    name: "Triputa Tala",
    beats: 7,
    angas: "I3 O O",
    description: "A rhythmic cycle of 7 beats. Contains a Laghu of size 3 followed by two Dhrutams. The primary rhythm framework for Alapana geethams."
  },
  {
    id: "4",
    name: "Dhruva Tala",
    beats: 14,
    angas: "I4 O I4 I4",
    description: "A majestic and long rhythmic cycle composed of 14 beats. It contains a Laghu, a Dhrutam, followed by two more Laghus."
  }
];

export default async function TalasPage() {
  const configured = isSupabaseConfigured();
  let talas: Tala[] = [];

  if (configured) {
    talas = await getTalas();
  }

  if (talas.length === 0) {
    talas = FALLBACK_TALAS;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-kumkum mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Catalog
        </Link>

        <div className="mb-10">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4">
            Knowledge Hub
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
            Talas (Rhythmic Cycles)
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Explore the rhythmic structures of Carnatic music. Talas govern the tempo, structural format, and pulse of compositions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           {talas.map((t: Tala) => (
            <div
              key={t.id}
              className="glass-panel traditional-border rounded-2xl p-6 border-swara-gold/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-kumkum/10 ring-1 ring-swara-gold/20">
                    <Clock className="size-5 text-kumkum" />
                  </div>
                  <Badge className="bg-kumkum/10 text-kumkum border-none font-bold">
                    {t.beats} Beats
                  </Badge>
                </div>
                <h3 className="font-serif text-xl font-bold text-kumkum mb-2">
                  {t.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {t.description}
                </p>
              </div>
              
              {t.angas && (
                <div className="border-t border-swara-gold/10 pt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Anga Structure notation:</span>
                  <span className="font-serif font-bold text-kumkum bg-kumkum/5 px-2.5 py-1 rounded-md">
                    {t.angas}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
