export const dynamic = "force-dynamic";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User } from "lucide-react";
import { getComposers } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/static";
import { Composer } from "@/types/music";

const FALLBACK_COMPOSERS = [
  {
    id: "1",
    name: "Saint Tyagaraja",
    era: "18th Century",
    biography: "One of the greatest composers of Carnatic music. He was prolific and highly influential in the development of the classical music tradition, composing thousands of devotional compositions (mostly in Telugu) in praise of Lord Rama.",
    mudra: "Tyagaraja"
  },
  {
    id: "2",
    name: "Muthuswami Dikshitar",
    era: "18th Century",
    biography: "A legendary poet and composer of Carnatic music, and one of the Trinity of Carnatic Music. His compositions (mostly in Sanskrit) are known for their deep philosophical content, intricate raga structures, and majestic speed transitions.",
    mudra: "Guruguha"
  },
  {
    id: "3",
    name: "Syama Sastri",
    era: "18th Century",
    biography: "The oldest of the Trinity of Carnatic music. He was a great devotee of Goddess Kamakshi and composed beautiful, rhythmically complex kritis (mostly in Telugu) with unique structures like swarajathi.",
    mudra: "Syama Krishna"
  },
  {
    id: "4",
    name: "Purandara Dasa",
    era: "15th-16th Century",
    biography: "Widely regarded as the Pitamaha (Grandfather) of Carnatic music. He formulated the structured lessons (Sarali, Janta, Alankara) used to teach students to this day, and composed thousands of songs in Kannada.",
    mudra: "Purandara Vittala"
  }
];

export default async function ComposersPage() {
  const configured = isSupabaseConfigured();
  let composers: Composer[] = [];

  if (configured) {
    composers = await getComposers();
  }

  if (composers.length === 0) {
    composers = FALLBACK_COMPOSERS;
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
            Vaggeyakaras (Composers)
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Meet the architects of Carnatic classical music, from the early systematizers to the legendary Trinity of Tanjore.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {composers.map((c: Composer) => (
            <div
              key={c.id}
              className="glass-panel traditional-border rounded-2xl p-6 border-swara-gold/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-kumkum/10 ring-1 ring-swara-gold/20">
                    <User className="size-5 text-kumkum" />
                  </div>
                  <Badge variant="outline" className="border-swara-gold/30 text-marigold">
                    {c.era}
                  </Badge>
                </div>
                <h3 className="font-serif text-xl font-bold text-kumkum mb-2">
                  {c.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {c.biography}
                </p>
              </div>
              
              {c.mudra && (
                <div className="border-t border-swara-gold/10 pt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Composer Signature (Mudra):</span>
                  <span className="font-serif font-bold text-kumkum bg-kumkum/5 px-2.5 py-1 rounded-md">
                    {c.mudra}
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
