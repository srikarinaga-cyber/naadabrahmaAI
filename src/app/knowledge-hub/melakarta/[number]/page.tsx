import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Music, Users, Sparkles, HelpCircle } from "lucide-react";
import { getMelakartaByNumber } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/static";
import { MELAKARTA_SEED_DATA } from "@/lib/data/melakartas-seed";
import { SwarasthanaPlayer } from "@/components/music/swarasthana-player";
import { CARNATIC_JANYA_DATABASE, ExtendedJanya } from "@/lib/data/janyas-db";
import { Kriti } from "@/types/music";

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

  if (!melakartaData) {
    const seed = MELAKARTA_SEED_DATA.find((m) => m.number === ragaNumber);
    if (!seed) {
      notFound();
    }
    melakartaData = {
      melakarta: seed,
      janyas: [],
      kritis: [] as JoinedKriti[],
    };
  }

  const { melakarta, kritis } = melakartaData;

  // Retrieve comprehensive Janya Ragas from the Carnatic Janya Database
  const janyasForMelakarta: ExtendedJanya[] = CARNATIC_JANYA_DATABASE.filter(
    (j) => j.melakartaNumber === ragaNumber
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-kumkum mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Janaka Ragas (72 Melakartas)
        </Link>

        {/* Hero Section */}
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/20 p-8 md:p-10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-kumkum/10 text-kumkum border-none font-bold">
                  Janaka (Melakarta) Raga #{melakarta.number}
                </Badge>
                <Badge variant="outline" className="border-swara-gold/30 text-marigold">
                  Chakra: {melakarta.chakra}
                </Badge>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-kumkum mt-1">
                {melakarta.name}
              </h1>
              <p className="text-muted-foreground mt-3 leading-relaxed max-w-3xl text-sm">
                {melakarta.description || "A primary parent Janaka scale in the Carnatic music system formulation by Venkatamakhin."}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Swarasthana Player with Physical Modeling Veena & Violin Audio */}
        <div className="mb-8">
          <SwarasthanaPlayer
            ragaName={melakarta.name}
            arohana={melakarta.arohana}
            avarohana={melakarta.avarohana}
          />
        </div>

        {/* Scale Swarasthana Notation Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6 bg-card">
            <h3 className="font-serif text-base font-bold text-kumkum mb-3 flex items-center gap-2">
              <Music className="size-4 text-swara-gold" /> Arohana (Ascending Swaras)
            </h3>
            <div className="bg-muted/50 p-4 rounded-xl text-center border border-border/50">
              <span className="font-serif text-xl font-bold tracking-widest text-foreground">
                {melakarta.arohana}
              </span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6 bg-card">
            <h3 className="font-serif text-base font-bold text-kumkum mb-3 flex items-center gap-2">
              <Music className="size-4 rotate-180 text-swara-gold" /> Avarohana (Descending Swaras)
            </h3>
            <div className="bg-muted/50 p-4 rounded-xl text-center border border-border/50">
              <span className="font-serif text-xl font-bold tracking-widest text-foreground">
                {melakarta.avarohana}
              </span>
            </div>
          </div>
        </div>

        {/* Derived Janya Ragas List with Music Theory Notes */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-serif text-xl font-bold text-kumkum flex items-center gap-2">
              <BookOpen className="size-5 text-swara-gold" /> Derived Janya Ragas of {melakarta.name} ({janyasForMelakarta.length})
            </h3>
            <Badge variant="outline" className="border-swara-gold/30 text-swara-gold text-[10px]">
              Music Theory Catalog
            </Badge>
          </div>

          {janyasForMelakarta.length === 0 ? (
            <div className="p-6 rounded-2xl bg-card border border-dashed border-border text-center text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Janya Derivatives Information:</p>
              <p>Janya derivatives for {melakarta.name} are taught in specialized Carnatic Abhyasa Ganam theory modules.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {janyasForMelakarta.map((j) => (
                <div
                  key={j.id}
                  className="glass-panel rounded-2xl border border-swara-gold/20 bg-card p-5 space-y-3 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-kumkum">{j.name}</h4>
                      <p className="text-[11px] text-muted-foreground">
                        Parent: #{melakarta.number} {melakarta.name}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[10px]">
                      {j.classification}
                    </Badge>
                  </div>

                  <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1 font-mono border border-border/40">
                    <p><span className="text-muted-foreground font-sans font-bold">Arohana:</span> {j.arohana}</p>
                    <p><span className="text-muted-foreground font-sans font-bold">Avarohana:</span> {j.avarohana}</p>
                  </div>

                  {j.jeevaSwara && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-foreground">Jeeva Swara:</span>
                      <span className="text-kumkum font-serif font-bold">{j.jeevaSwara}</span>
                    </div>
                  )}

                  {j.musicTheoryNotes && (
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/50">
                      💡 <strong className="text-foreground">Theory Note:</strong> {j.musicTheoryNotes}
                    </p>
                  )}

                  {j.famousKriti && (
                    <div className="text-[11px] text-foreground bg-swara-gold/10 p-2 rounded-lg border border-swara-gold/20 flex items-center gap-1.5">
                      <Sparkles className="size-3 text-swara-gold shrink-0" />
                      <span><strong className="font-bold">Key Composition:</strong> {j.famousKriti}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Famous Compositions (Kritis) */}
        <div className="glass-panel rounded-2xl border border-swara-gold/20 p-6 bg-card space-y-4">
          <h3 className="font-serif text-lg font-bold text-kumkum flex items-center gap-2">
            <Users className="size-4 text-swara-gold" /> Classical Compositions in {melakarta.name}
          </h3>
          {kritis.length === 0 ? (
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Trinity Kritis:</p>
              <p>Compositions in {melakarta.name} by Saint Tyagaraja, Muthuswami Dikshitar, and Syama Sastri form the cornerstone of Carnatic performance.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {kritis.map((k: JoinedKriti) => (
                <div
                  key={k.id}
                  className="p-4 rounded-xl border border-swara-gold/20 bg-muted/30"
                >
                  <p className="font-bold text-sm text-foreground">{k.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Composer: {k.composers?.name || "Carnatic Master"} | Tala: {k.talas?.name || "Adi Tala"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
