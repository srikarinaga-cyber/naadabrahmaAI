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
      {/* High-Visibility Realistic Sangeetha Trinity Background Theme showing all 3 Saints */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-[center_top] bg-no-repeat opacity-50 dark:opacity-45"
        style={{ backgroundImage: "url('/trinity-theme-bg.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/30 via-transparent to-background/50" />

      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4 font-bold">
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
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-card/85 backdrop-blur-md border border-border text-foreground hover:bg-muted"
          >
            Vaggeyakaras (Composers)
          </Link>
          <Link
            href="/knowledge-hub/talas"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-card/85 backdrop-blur-md border border-border text-foreground hover:bg-muted"
          >
            35 Suladi Sapta Talas
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {melakartas.map((m) => (
            <Link
              key={m.number}
              href={`/knowledge-hub/melakarta/${m.number}`}
              className="glass-panel group rounded-2xl border border-swara-gold/25 p-5 transition-all hover:border-kumkum hover:bg-kumkum/10 hover:shadow-lg bg-card/80 backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-[10px] text-kumkum border-kumkum/30 font-bold">
                  #{m.number}
                </Badge>
                <span className="text-[10px] font-bold uppercase tracking-wider text-swara-gold">
                  Chakra: {m.chakra}
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold text-foreground group-hover:text-kumkum mt-2">
                {m.name}
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-3 line-clamp-1 border-t border-border/40 pt-2">
                Arohana: {m.arohana}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
