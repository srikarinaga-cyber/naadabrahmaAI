import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Music, Users } from "lucide-react";
import { getMelakartaByNumber } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { MELAKARTA_SEED_DATA } from "@/lib/data/melakartas-seed";
import { Janya, Kriti } from "@/types/music";

interface JoinedKriti extends Kriti {
  composers?: { name: string };
  talas?: { name: string };
}

interface PageProps {
  params: Promise<{ number: string }>;
}

export default async function MelakartaDetailPage({ params }: PageProps) {
  const { number } = await params;
  const ragaNumber = parseInt(number, 10);
  
  if (isNaN(ragaNumber) || ragaNumber < 1 || ragaNumber > 72) {
    notFound();
  }

  const configured = isSupabaseConfigured();
  let melakartaData = null;

  if (configured) {
    melakartaData = await getMelakartaByNumber(ragaNumber);
  }

  // Fallback to seed data if Supabase isn't configured or query returned null
  if (!melakartaData) {
    const seed = MELAKARTA_SEED_DATA.find((m) => m.number === ragaNumber);
    if (!seed) {
      notFound();
    }
    melakartaData = {
      melakarta: seed,
      janyas: [] as Janya[],
      kritis: [] as JoinedKriti[]
    };
  }

  const { melakarta, janyas, kritis } = melakartaData;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-kumkum mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Catalog
        </Link>

        {/* Hero Section */}
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/15 p-8 md:p-10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <Badge className="bg-kumkum/10 text-kumkum border-none">
                  Melakarta #{melakarta.number}
                </Badge>
                <Badge variant="outline" className="border-swara-gold/30 text-marigold">
                  Chakra: {melakarta.chakra}
                </Badge>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-kumkum mt-3">
                {melakarta.name}
              </h1>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {melakarta.description || "A primary scale in the Carnatic music system."}
              </p>
            </div>
          </div>
        </div>

        {/* Scale Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6">
            <h3 className="font-serif text-lg font-semibold text-kumkum mb-4 flex items-center gap-2">
              <Music className="size-4" /> Arohana (Scale Ascending)
            </h3>
            <div className="bg-muted/40 p-4 rounded-xl text-center">
              <span className="font-serif text-xl font-bold tracking-widest text-foreground">
                {melakarta.arohana}
              </span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6">
            <h3 className="font-serif text-lg font-semibold text-kumkum mb-4 flex items-center gap-2">
              <Music className="size-4 rotate-180" /> Avarohana (Scale Descending)
            </h3>
            <div className="bg-muted/40 p-4 rounded-xl text-center">
              <span className="font-serif text-xl font-bold tracking-widest text-foreground">
                {melakarta.avarohana}
              </span>
            </div>
          </div>
        </div>

        {/* Associated Janyas & Kritis */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Janyas */}
          <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6">
            <h3 className="font-serif text-lg font-semibold text-kumkum mb-4 flex items-center gap-2">
              <BookOpen className="size-4" /> Janya Derivatives
            </h3>
            {janyas.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No Janya ragas currently catalogued for {melakarta.name}.
              </p>
            ) : (
              <div className="space-y-3">
                {janyas.map((j: Janya) => (
                  <div
                    key={j.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-swara-gold/10 bg-card/50"
                  >
                    <div>
                      <p className="font-semibold text-sm">{j.name}</p>
                      <p className="text-[10px] text-muted-foreground">{j.arohana} | {j.avarohana}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kritis */}
          <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6">
            <h3 className="font-serif text-lg font-semibold text-kumkum mb-4 flex items-center gap-2">
              <Users className="size-4" /> Compositions (Kritis)
            </h3>
            {kritis.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No kritis currently catalogued in this raga.
              </p>
            ) : (
              <div className="space-y-3">
                {kritis.map((k: JoinedKriti) => (
                  <div
                    key={k.id}
                    className="p-3 rounded-xl border border-swara-gold/10 bg-card/50"
                  >
                    <p className="font-semibold text-sm">{k.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Composer: {k.composers?.name || "Unknown"} | Tala: {k.talas?.name || "Unknown"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
