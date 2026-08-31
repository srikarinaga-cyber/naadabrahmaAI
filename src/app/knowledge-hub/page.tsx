export const dynamic = "force-dynamic";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { getMelakartas } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/static";
import { MELAKARTA_SEED_DATA } from "@/lib/data/melakartas-seed";

export default async function KnowledgeHubPage() {
  const configured = isSupabaseConfigured();
  let melakartas: Array<{ number: number; name: string; chakra: string; arohana: string }> = [];

  if (configured) {
    const { data } = await getMelakartas(1, 72);
    melakartas = data;
  }

  if (!melakartas || melakartas.length === 0) {
    melakartas = MELAKARTA_SEED_DATA;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image: Traditional Carnatic Trinity Artwork */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-15"
        style={{ backgroundImage: "url('/images/knowledge-hub-bg.jpg')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/80 via-background/60 to-background/95" />

      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4">
            Knowledge Hub
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
            72 Janaka Ragas (Melakartas)
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Explore the complete 72 Parent Janaka Ragas system formulation by Venkatamakhin. Click any Melakarta to inspect its Swarasthanas with Veena & Violin audio playback and derived Janya Ragas.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/knowledge-hub"
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-kumkum text-white shadow-sm"
          >
            Janaka Ragas (72 Melakartas)
          </Link>
          <Link
            href="/knowledge-hub/composers"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-card/90 backdrop-blur border border-border text-foreground hover:bg-muted"
          >
            Vaggeyakaras (Composers)
          </Link>
          <Link
            href="/knowledge-hub/talas"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-card/90 backdrop-blur border border-border text-foreground hover:bg-muted"
          >
            35 Suladi Sapta Talas
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {melakartas.map((m) => (
            <Link
              key={m.number}
              href={`/knowledge-hub/melakarta/${m.number}`}
              className="group rounded-2xl border border-swara-gold/25 bg-card/90 backdrop-blur-md p-4 hover:border-kumkum/50 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <p className="text-[10px] font-bold text-kumkum uppercase">#{m.number}</p>
                <p className="text-sm font-bold mt-1 group-hover:text-kumkum transition-colors line-clamp-2">
                  {m.name}
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 font-medium">Chakra: {m.chakra}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
