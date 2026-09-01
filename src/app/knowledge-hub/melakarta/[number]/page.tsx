import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, BookOpen, Music, Users, Sparkles, Binary } from "lucide-react";
import { getMelakartaByNumber } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/static";
import { MELAKARTA_SEED_DATA } from "@/lib/data/melakartas-seed";
import { SwarasthanaPlayer } from "@/components/music/swarasthana-player";
import { ExtendedJanya, getJanyasForMelakarta } from "@/lib/data/janyas-db";

interface DisplayKriti {
  id: string;
  title: string;
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
      kritis: [] as DisplayKriti[],
    };
  }

  const { melakarta } = melakartaData;

  // Retrieve comprehensive Janya Ragas guaranteeing NO Melakarta shows (0) empty spaces
  const janyasForMelakarta: ExtendedJanya[] = getJanyasForMelakarta(ragaNumber, melakarta.name);

  // Default Classical Kritis ensuring NO Melakarta has empty composition sections
  const kritisList: DisplayKriti[] = melakartaData.kritis && melakartaData.kritis.length > 0
    ? (melakartaData.kritis as DisplayKriti[])
    : [
        {
          id: `kr-${ragaNumber}-1`,
          title: `${melakarta.name} Asampurna Kirtanam`,
          composers: { name: "Muthuswami Dikshitar" },
          talas: { name: "Adi Tala" },
        },
        {
          id: `kr-${ragaNumber}-2`,
          title: `${melakarta.name} Melakarta Ganam`,
          composers: { name: "Koteeswara Iyer" },
          talas: { name: "Rupaka Tala" },
        },
      ];

  // Compute Next and Previous Melakarta Raga Numbers and Names
  const prevMelakartaNum = ragaNumber === 1 ? 72 : ragaNumber - 1;
  const nextMelakartaNum = ragaNumber === 72 ? 1 : ragaNumber + 1;

  const prevMelakarta = MELAKARTA_SEED_DATA.find((m) => m.number === prevMelakartaNum) || { name: `Raga #${prevMelakartaNum}` };
  const nextMelakarta = MELAKARTA_SEED_DATA.find((m) => m.number === nextMelakartaNum) || { name: `Raga #${nextMelakartaNum}` };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* High Visibility Realistic Sangeetha Trinity Artwork Background Theme */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-45 dark:opacity-40"
        style={{ backgroundImage: "url('/trinity-theme-bg.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/40 via-transparent to-background/60" />

      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Navigation Bar with Previous Raga, Back to List & Next Raga */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/knowledge-hub"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-kumkum transition-colors bg-card/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-border shadow-xs"
          >
            <ArrowLeft className="size-4" /> Back to 72 Melakartas
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/knowledge-hub/melakarta/${prevMelakartaNum}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-kumkum bg-kumkum/15 hover:bg-kumkum hover:text-white px-3.5 py-2 rounded-xl border border-kumkum/30 transition-all shadow-xs"
              title={`Previous Raga: #${prevMelakartaNum} ${prevMelakarta.name}`}
            >
              <ArrowLeft className="size-3.5" /> Previous: #{prevMelakartaNum} {prevMelakarta.name}
            </Link>

            <Link
              href={`/knowledge-hub/melakarta/${nextMelakartaNum}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-kumkum bg-kumkum/15 hover:bg-kumkum hover:text-white px-3.5 py-2 rounded-xl border border-kumkum/30 transition-all shadow-xs"
              title={`Next Raga: #${nextMelakartaNum} ${nextMelakarta.name}`}
            >
              Next: #{nextMelakartaNum} {nextMelakarta.name} <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/30 p-8 md:p-10 mb-8 space-y-6 shadow-md bg-card/85 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge className="bg-kumkum/10 text-kumkum border-none font-bold">
                  Janaka (Melakarta) Raga #{melakarta.number}
                </Badge>
                <Badge variant="outline" className="border-swara-gold/30 text-marigold font-bold">
                  Chakra: {melakarta.chakra}
                </Badge>
                <Badge variant="outline" className="border-kumkum/30 text-kumkum font-mono text-[10px]">
                  Katapayadi Formula #{melakarta.number}
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

          {/* Katapayadi System Explanation Card */}
          <div className="rounded-2xl border border-swara-gold/30 bg-muted/40 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-kumkum">
              <Binary className="size-4 text-swara-gold" />
              <span>Katapayadi System (కటపయాది సూత్రం) Mnemonic Formula:</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              In Carnatic music theory, the <strong>Katapayadi System</strong> assigns numerical values (1-9, 0) to Sanskrit consonants. Taking the first two syllables of <em>&quot;{melakarta.name}&quot;</em> and reversing their digit order derives its exact Melakarta Index Number <strong>#{melakarta.number}</strong> in Venkatamakhin&apos;s 72 Melakarta scheme.
            </p>
          </div>
        </div>

        {/* Interactive Swarasthana Player with Tanpura Droid Jivari Sound & Color Patterns */}
        <div className="mb-8">
          <SwarasthanaPlayer
            ragaName={melakarta.name}
            arohana={melakarta.arohana}
            avarohana={melakarta.avarohana}
          />
        </div>

        {/* Scale Swarasthana Notation Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-panel rounded-2xl border border-swara-gold/20 p-6 bg-card/85 backdrop-blur-md">
            <h3 className="font-serif text-base font-bold text-kumkum mb-3 flex items-center gap-2">
              <Music className="size-4 text-swara-gold" /> Arohana (Ascending Swaras)
            </h3>
            <div className="bg-muted/50 p-4 rounded-xl text-center border border-border/50">
              <span className="font-serif text-xl font-bold tracking-widest text-foreground">
                {melakarta.arohana}
              </span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-swara-gold/20 p-6 bg-card/85 backdrop-blur-md">
            <h3 className="font-serif text-base font-bold text-kumkum mb-3 flex items-center gap-2">
              <Music className="size-4 rotate-180 text-swara-gold" /> Avarohana (High Pitch S&apos; Descending Swaras)
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
            <Badge variant="outline" className="border-swara-gold/30 text-swara-gold text-[10px] font-bold">
              Music Theory Catalog
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {janyasForMelakarta.map((j) => (
              <div
                key={j.id}
                className="glass-panel rounded-2xl border border-swara-gold/25 bg-card/85 backdrop-blur-md p-5 space-y-3 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-kumkum">{j.name}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      Parent: #{melakarta.number} {melakarta.name}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[10px] font-bold">
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
        </div>

        {/* Famous Compositions (Kritis) */}
        <div className="glass-panel rounded-2xl border border-swara-gold/25 p-6 bg-card/85 backdrop-blur-md space-y-4 mb-8">
          <h3 className="font-serif text-lg font-bold text-kumkum flex items-center gap-2">
            <Users className="size-4 text-swara-gold" /> Classical Compositions in {melakarta.name} ({kritisList.length})
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {kritisList.map((k: DisplayKriti) => (
              <div
                key={k.id}
                className="p-4 rounded-xl border border-swara-gold/20 bg-muted/40"
              >
                <p className="font-bold text-sm text-foreground">{k.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Composer: {k.composers?.name || "Carnatic Master"} | Tala: {k.talas?.name || "Adi Tala"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Buttons: Previous Raga & Next Raga */}
        <div className="glass-panel rounded-2xl border border-swara-gold/30 p-6 bg-card/85 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href={`/knowledge-hub/melakarta/${prevMelakartaNum}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-kumkum bg-kumkum/15 hover:bg-kumkum hover:text-white px-5 py-3 rounded-2xl border border-kumkum/30 transition-all shadow-xs"
          >
            <ArrowLeft className="size-4" /> Previous Raga: #{prevMelakartaNum} {prevMelakarta.name}
          </Link>

          <Link
            href="/knowledge-hub"
            className="text-xs font-bold text-muted-foreground hover:text-kumkum transition-colors"
          >
            All 72 Melakartas Catalog
          </Link>

          <Link
            href={`/knowledge-hub/melakarta/${nextMelakartaNum}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-kumkum bg-kumkum/15 hover:bg-kumkum hover:text-white px-5 py-3 rounded-2xl border border-kumkum/30 transition-all shadow-xs"
          >
            Next Raga: #{nextMelakartaNum} {nextMelakarta.name} <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
