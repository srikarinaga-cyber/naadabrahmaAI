import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Music, Users } from "lucide-react";
import { getMelakartaByNumber } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/static";
import { MELAKARTA_SEED_DATA } from "@/lib/data/melakartas-seed";
import { SwarasthanaPlayer } from "@/components/music/swarasthana-player";
import { Janya, Kriti } from "@/types/music";

interface JoinedKriti extends Kriti {
  composers?: { name: string };
  talas?: { name: string };
}

interface PageProps {
  params: Promise<{ number: string }>;
}

// Fallback catalog of famous Janya Ragas grouped by parent Janaka (Melakarta) Raga number
const FAMOUS_JANYAS_MAP: Record<number, Janya[]> = {
  8: [
    { id: "j8-1", name: "Asaveri", parentMelakartaId: "8", arohana: "S R1 M1 P D1 S'", avarohana: "S' N2 D1 P M1 G2 R1 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j8-2", name: "Dhanyasi", parentMelakartaId: "8", arohana: "S G2 M1 P N2 S'", avarohana: "S' N2 D1 P M1 G2 R1 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j8-3", name: "Punnagavarali", parentMelakartaId: "8", arohana: "N2 S R1 G2 M1 P D1", avarohana: "D1 P M1 G2 R1 S N2", vakra: true, bhashanga: false, upanga: true },
  ],
  15: [
    { id: "j15-1", name: "Bauli", parentMelakartaId: "15", arohana: "S R1 G3 P D1 S'", avarohana: "S' N3 D1 P G3 R1 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j15-2", name: "Saveri", parentMelakartaId: "15", arohana: "S R1 M1 P D1 S'", avarohana: "S' N3 D1 P M1 G3 R1 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j15-3", name: "Lalitha", parentMelakartaId: "15", arohana: "S R1 G3 M1 D1 N3 S'", avarohana: "S' N3 D1 M1 G3 R1 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j15-4", name: "Revagupti", parentMelakartaId: "15", arohana: "S R1 G3 P D1 S'", avarohana: "S' D1 P G3 R1 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j15-5", name: "Malarani", parentMelakartaId: "15", arohana: "S M1 P D1 N3 S'", avarohana: "S' N3 D1 P M1 S", vakra: false, bhashanga: false, upanga: true },
  ],
  20: [
    { id: "j20-1", name: "Anandabhairavi", parentMelakartaId: "20", arohana: "S G2 R2 G2 M1 P D2 P S'", avarohana: "S' N2 D2 P M1 G2 R2 S", vakra: true, bhashanga: true, upanga: false },
    { id: "j20-2", name: "Bhairavi", parentMelakartaId: "20", arohana: "S R2 G2 M1 P D2 N2 S'", avarohana: "S' N2 D1 P M1 G2 R2 S", vakra: false, bhashanga: true, upanga: false },
    { id: "j20-3", name: "Saramathi", parentMelakartaId: "20", arohana: "S R2 G2 M1 P D1 N2 S'", avarohana: "S' N2 D1 M1 G2 S", vakra: false, bhashanga: false, upanga: true },
  ],
  22: [
    { id: "j22-1", name: "Abheri", parentMelakartaId: "22", arohana: "S G2 M1 P N2 S'", avarohana: "S' N2 D2 P M1 G2 R2 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j22-2", name: "Hindolam", parentMelakartaId: "22", arohana: "S G2 M1 D1 N2 S'", avarohana: "S' N2 D1 M1 G2 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j22-3", name: "Madhyamavati", parentMelakartaId: "22", arohana: "S R2 M1 P N2 S'", avarohana: "S' N2 P M1 R2 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j22-4", name: "Reethigowla", parentMelakartaId: "22", arohana: "S G2 R2 G2 M1 N2 D2 M1 N2 S'", avarohana: "S' N2 D2 M1 G2 M1 P M1 G2 R2 S", vakra: true, bhashanga: false, upanga: true },
    { id: "j22-5", name: "Sriranjani", parentMelakartaId: "22", arohana: "S R2 G2 M1 D2 N2 S'", avarohana: "S' N2 D2 M1 G2 R2 S", vakra: false, bhashanga: false, upanga: true },
  ],
  28: [
    { id: "j28-1", name: "Mohanam", parentMelakartaId: "28", arohana: "S R2 G3 P D2 S'", avarohana: "S' D2 P G3 R2 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j28-2", name: "Kambhoji", parentMelakartaId: "28", arohana: "S R2 G3 M1 P D2 S'", avarohana: "S' N2 D2 P M1 G3 R2 S", vakra: false, bhashanga: true, upanga: false },
    { id: "j28-3", name: "Kedaragowla", parentMelakartaId: "28", arohana: "S R2 M1 P N2 S'", avarohana: "S' N2 D2 P M1 G3 R2 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j28-4", name: "Sahana", parentMelakartaId: "28", arohana: "S R2 G3 M1 P M1 D2 N2 S'", avarohana: "S' N2 D2 P M1 G3 R2 S", vakra: true, bhashanga: false, upanga: true },
    { id: "j28-5", name: "Surutti", parentMelakartaId: "28", arohana: "S R2 M1 P N2 S'", avarohana: "S' N2 D2 P M1 G3 P R2 S", vakra: true, bhashanga: false, upanga: true },
  ],
  29: [
    { id: "j29-1", name: "Hamsadhwani", parentMelakartaId: "29", arohana: "S R2 G3 P N3 S'", avarohana: "S' N3 P G3 R2 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j29-2", name: "Bilahari", parentMelakartaId: "29", arohana: "S R2 G3 P D2 S'", avarohana: "S' N3 D2 P M1 G3 R2 S", vakra: false, bhashanga: true, upanga: false },
    { id: "j29-3", name: "Kadanakutuhalam", parentMelakartaId: "29", arohana: "S R2 M1 D2 N3 G3 P S'", avarohana: "S' N3 D2 P M1 G3 R2 S", vakra: true, bhashanga: false, upanga: true },
    { id: "j29-4", name: "Shuddha Saveri", parentMelakartaId: "29", arohana: "S R2 M1 P D2 S'", avarohana: "S' D2 P M1 R2 S", vakra: false, bhashanga: false, upanga: true },
    { id: "j29-5", name: "Atana", parentMelakartaId: "29", arohana: "S R2 M1 P N3 S'", avarohana: "S' N3 D2 P M1 P G3 R2 S", vakra: true, bhashanga: true, upanga: false },
  ],
  65: [
    { id: "j65-1", name: "Hamirkalyani", parentMelakartaId: "65", arohana: "S S P M2 P N3 S'", avarohana: "S' N3 D2 P M2 G3 M1 R2 S", vakra: true, bhashanga: true, upanga: false },
    { id: "j65-2", name: "Saranga", parentMelakartaId: "65", arohana: "S R2 G3 M2 P D2 N3 S'", avarohana: "S' N3 D2 P M2 P G3 M1 R2 S", vakra: true, bhashanga: true, upanga: false },
    { id: "j65-3", name: "Sunadavinodini", parentMelakartaId: "65", arohana: "S G3 M2 D2 N3 S'", avarohana: "S' N3 D2 M2 G3 S", vakra: false, bhashanga: false, upanga: true },
  ],
};

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
      janyas: FAMOUS_JANYAS_MAP[ragaNumber] || [],
      kritis: [] as JoinedKriti[],
    };
  }

  const { melakarta, janyas, kritis } = melakartaData;
  const displayJanyas = janyas && janyas.length > 0 ? janyas : (FAMOUS_JANYAS_MAP[ragaNumber] || []);

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
              <div className="flex items-center gap-3">
                <Badge className="bg-kumkum/10 text-kumkum border-none">
                  Janaka (Melakarta) Raga #{melakarta.number}
                </Badge>
                <Badge variant="outline" className="border-swara-gold/30 text-marigold">
                  Chakra: {melakarta.chakra}
                </Badge>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-kumkum mt-3">
                {melakarta.name}
              </h1>
              <p className="text-muted-foreground mt-4 leading-relaxed max-w-3xl">
                {melakarta.description || "A foundational 7-note parent Janaka scale in the Carnatic music system."}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Swarasthana Player with Veena & Violin Tones */}
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
            <h3 className="font-serif text-lg font-semibold text-kumkum mb-3 flex items-center gap-2">
              <Music className="size-4 text-swara-gold" /> Arohana (Ascending Swaras)
            </h3>
            <div className="bg-muted/50 p-4 rounded-xl text-center border border-border/50">
              <span className="font-serif text-xl font-bold tracking-widest text-foreground">
                {melakarta.arohana}
              </span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6 bg-card">
            <h3 className="font-serif text-lg font-semibold text-kumkum mb-3 flex items-center gap-2">
              <Music className="size-4 rotate-180 text-swara-gold" /> Avarohana (Descending Swaras)
            </h3>
            <div className="bg-muted/50 p-4 rounded-xl text-center border border-border/50">
              <span className="font-serif text-xl font-bold tracking-widest text-foreground">
                {melakarta.avarohana}
              </span>
            </div>
          </div>
        </div>

        {/* Associated Derived Janya Ragas & Kritis */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Derived Janya Ragas */}
          <div className="glass-panel rounded-2xl border border-swara-gold/20 p-6 bg-card">
            <h3 className="font-serif text-lg font-bold text-kumkum mb-4 flex items-center gap-2">
              <BookOpen className="size-4 text-swara-gold" /> Derived Janya Ragas ({displayJanyas.length})
            </h3>
            {displayJanyas.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                Janya derivatives catalog currently being updated for this Melakarta.
              </p>
            ) : (
              <div className="space-y-3">
                {displayJanyas.map((j: Janya) => (
                  <div
                    key={j.id || j.name}
                    className="p-3.5 rounded-xl border border-swara-gold/20 bg-muted/30 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-sm text-foreground">{j.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                        Aro: {j.arohana} | Ava: {j.avarohana}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-kumkum/20 text-kumkum text-[9px]">
                      Janya
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kritis */}
          <div className="glass-panel rounded-2xl border border-swara-gold/20 p-6 bg-card">
            <h3 className="font-serif text-lg font-bold text-kumkum mb-4 flex items-center gap-2">
              <Users className="size-4 text-swara-gold" /> Famous Compositions (Kritis)
            </h3>
            {kritis.length === 0 ? (
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Classical Compositions:</p>
                <p>Kritis composed by the Tanjore Trinity in {melakarta.name} are taught in upper-level Abhyasa Ganam.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {kritis.map((k: JoinedKriti) => (
                  <div
                    key={k.id}
                    className="p-3.5 rounded-xl border border-swara-gold/20 bg-muted/30"
                  >
                    <p className="font-bold text-sm text-foreground">{k.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Composer: {k.composers?.name || "Trinity"} | Tala: {k.talas?.name || "Adi Tala"}
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
