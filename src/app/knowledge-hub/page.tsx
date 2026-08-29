import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { getMelakartas } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { MELAKARTA_SEED_DATA } from "@/lib/data/melakartas-seed";

export const revalidate = 3600;

export default async function KnowledgeHubPage() {
  const configured = isSupabaseConfigured();
  let melakartas: Array<{ number: number; name: string; chakra: string; arohana: string }> = [];

  if (configured) {
    const { data } = await getMelakartas(1, 72);
    melakartas = data;
  } else {
    melakartas = MELAKARTA_SEED_DATA;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4">
            Knowledge Hub
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
            72 Melakarta Ragas
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Explore the complete Venkatamakhin Melakarta system. Each raga links to its Janya derivatives and associated kritis.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Link href="/knowledge-hub?tab=janyas" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-kumkum/10 text-kumkum hover:bg-kumkum/15">
            Janya Ragas
          </Link>
          <Link href="/knowledge-hub/composers" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80">
            Composers
          </Link>
          <Link href="/knowledge-hub/talas" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80">
            Talas
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {melakartas.map((m) => (
            <Link
              key={m.number}
              href={`/knowledge-hub/melakarta/${m.number}`}
              className="group rounded-xl border border-swara-gold/15 bg-card p-4 hover:border-kumkum/30 hover:shadow-sm transition-all"
            >
              <p className="text-[10px] font-bold text-kumkum uppercase">#{m.number}</p>
              <p className="text-sm font-semibold mt-1 group-hover:text-kumkum transition-colors line-clamp-2">
                {m.name}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{m.chakra}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
