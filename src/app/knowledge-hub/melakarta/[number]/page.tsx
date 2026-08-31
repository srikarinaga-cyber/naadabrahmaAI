import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, BookOpen, Users, Star, Info, GitBranch } from "lucide-react";
import { getMelakartaByNumber } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/static";
import { MELAKARTA_SEED_DATA } from "@/lib/data/melakartas-seed";
import { Janya, Kriti } from "@/types/music";

interface JoinedKriti extends Kriti {
  composers?: { name: string };
  talas?: { name: string };
}

interface PageProps {
  params: Promise<{ number: string }>;
}

// Swara note color mapping for visual display
const SWARA_COLORS: Record<string, string> = {
  S: "bg-kumkum/15 text-kumkum border-kumkum/30",
  R: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/20 dark:text-orange-300",
  G: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300",
  M: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-300",
  P: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300",
  D: "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/20 dark:text-purple-300",
  N: "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/20 dark:text-pink-300",
};

function SwaraNote({ note }: { note: string }) {
  const first = note.charAt(0);
  const color = SWARA_COLORS[first] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg border text-xs font-black tracking-wider ${color}`}>
      {note}
    </span>
  );
}

function ScaleDisplay({ scale }: { scale: string }) {
  const notes = scale.split(" ").filter(Boolean);
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {notes.map((note, i) => <SwaraNote key={i} note={note} />)}
    </div>
  );
}

export default async function MelakartaDetailPage({ params }: PageProps) {
  const { number } = await params;
  const ragaNumber = parseInt(number, 10);

  if (isNaN(ragaNumber) || ragaNumber < 1 || ragaNumber > 72) notFound();

  const configured = isSupabaseConfigured();
  let melakartaData = null;

  if (configured) {
    melakartaData = await getMelakartaByNumber(ragaNumber);
  }

  // Fallback to rich seed data
  if (!melakartaData) {
    const seed = MELAKARTA_SEED_DATA.find((m) => m.number === ragaNumber);
    if (!seed) notFound();
    melakartaData = {
      melakarta: seed,
      janyas: [] as Janya[],
      kritis: [] as JoinedKriti[],
    };
  }

  const { melakarta, janyas, kritis } = melakartaData;
  const seed = MELAKARTA_SEED_DATA.find((m) => m.number === ragaNumber);
  const popularJanyas = seed?.metadata?.popular_janyas ?? [];
  const westernEquiv = seed?.metadata?.western_equivalent;

  // Prev / Next navigation
  const prevNum = ragaNumber > 1 ? ragaNumber - 1 : null;
  const nextNum = ragaNumber < 72 ? ragaNumber + 1 : null;
  const prevSeed = prevNum ? MELAKARTA_SEED_DATA.find(m => m.number === prevNum) : null;
  const nextSeed = nextNum ? MELAKARTA_SEED_DATA.find(m => m.number === nextNum) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10 pb-20">

        {/* Back link */}
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-kumkum mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to All 72 Melakartas
        </Link>

        {/* ── Hero Card ── */}
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/20 p-8 md:p-10 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-kumkum/15 text-kumkum border-kumkum/25 font-black text-xs px-3 py-1">
                  Melakarta #{melakarta.number}
                </Badge>
                <Badge variant="outline" className="border-swara-gold/40 text-swara-gold font-bold">
                  Chakra: {melakarta.chakra}
                </Badge>
                {westernEquiv && (
                  <Badge variant="outline" className="border-blue-300/50 text-blue-600 dark:text-blue-400 font-bold">
                    ≈ {westernEquiv}
                  </Badge>
                )}
              </div>

              {/* Raga Name */}
              <h1 className="font-serif text-4xl md:text-5xl font-black text-kumkum tracking-tight mb-3">
                {melakarta.name}
              </h1>

              {/* Description */}
              <p className="text-foreground/80 font-semibold leading-relaxed text-base max-w-2xl">
                {melakarta.description || `${melakarta.name} is the ${melakarta.number}${["st","nd","rd"][((melakarta.number+90)%100-10)%10-1]||"th"} Melakarta raga in the Venkatamakhin system, belonging to the ${melakarta.chakra} chakra.`}
              </p>
            </div>

            {/* Number badge */}
            <div className="hidden md:flex size-24 items-center justify-center rounded-2xl border-2 border-swara-gold/30 bg-swara-gold/10 shrink-0">
              <span className="font-serif text-4xl font-black text-swara-gold">
                {String(melakarta.number).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Scale Display ── */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6">
            <h3 className="font-serif text-base font-extrabold text-kumkum mb-1 flex items-center gap-2">
              <Music className="size-4" /> Arohana
              <span className="text-xs font-bold text-muted-foreground">(Ascending)</span>
            </h3>
            <ScaleDisplay scale={melakarta.arohana} />
          </div>
          <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6">
            <h3 className="font-serif text-base font-extrabold text-kumkum mb-1 flex items-center gap-2">
              <Music className="size-4 rotate-180" /> Avarohana
              <span className="text-xs font-bold text-muted-foreground">(Descending)</span>
            </h3>
            <ScaleDisplay scale={melakarta.avarohana} />
          </div>
        </div>

        {/* ── Info Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Chakra", value: melakarta.chakra, icon: "🔵" },
            { label: "Position", value: `#${melakarta.number} of 72`, icon: "📍" },
            { label: "Madhyama", value: melakarta.number <= 36 ? "Shuddha (M1)" : "Prati (M2)", icon: "🎼" },
            { label: "Janya Ragas", value: janyas.length > 0 ? `${janyas.length} found` : popularJanyas.length > 0 ? `${popularJanyas.length} known` : "Cataloguing", icon: "🌿" },
          ].map(item => (
            <div key={item.label} className="glass-panel rounded-xl border border-swara-gold/15 p-4 text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">{item.label}</p>
              <p className="font-black text-foreground mt-1 text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        {/* ── Janya Ragas Section ── */}
        <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6 mb-6">
          <h2 className="font-serif text-xl font-extrabold text-kumkum mb-4 flex items-center gap-2">
            <GitBranch className="size-5" /> Janya Ragas
            <span className="text-sm font-bold text-muted-foreground">(Derived from {melakarta.name})</span>
          </h2>

          {/* From Supabase */}
          {janyas.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {(janyas as Janya[]).map((j) => (
                <div key={j.id} className="rounded-xl border border-swara-gold/20 bg-card/60 p-4 hover:border-kumkum/30 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-extrabold text-foreground">{j.name}</p>
                      {j.arohana && (
                        <p className="text-xs font-bold text-muted-foreground mt-1">
                          ↑ {j.arohana}
                        </p>
                      )}
                      {j.avarohana && (
                        <p className="text-xs font-bold text-muted-foreground">
                          ↓ {j.avarohana}
                        </p>
                      )}
                    </div>
                    <Badge className="bg-kumkum/10 text-kumkum border-none text-[10px] font-black shrink-0">
                      Janya
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : popularJanyas.length > 0 ? (
            /* Fallback: seed popular janyas */
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-muted-foreground mb-3">
                <Info className="size-3.5" />
                Well-known Janya ragas derived from {melakarta.name}:
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {popularJanyas.map((name, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-swara-gold/20 bg-card/60 p-4">
                    <div className="size-8 rounded-full bg-kumkum/10 flex items-center justify-center shrink-0">
                      <Star className="size-3.5 text-kumkum" />
                    </div>
                    <div>
                      <p className="font-extrabold text-foreground">{name}</p>
                      <p className="text-[11px] font-bold text-muted-foreground">Derived from {melakarta.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm font-bold text-muted-foreground italic">
              Janya ragas for {melakarta.name} are being catalogued in the database.
            </p>
          )}
        </div>

        {/* ── Kritis ── */}
        {kritis.length > 0 && (
          <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6 mb-6">
            <h2 className="font-serif text-xl font-extrabold text-kumkum mb-4 flex items-center gap-2">
              <Users className="size-5" /> Famous Compositions (Kritis)
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(kritis as JoinedKriti[]).map((k) => (
                <div key={k.id} className="rounded-xl border border-swara-gold/20 bg-card/60 p-4">
                  <p className="font-extrabold text-foreground">{k.title}</p>
                  <div className="flex gap-3 mt-1">
                    {k.composers?.name && (
                      <span className="text-xs font-bold text-muted-foreground">
                        🎤 {k.composers.name}
                      </span>
                    )}
                    {k.talas?.name && (
                      <span className="text-xs font-bold text-muted-foreground">
                        🥁 {k.talas.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Knowledge Card ── */}
        <div className="glass-panel rounded-2xl border border-swara-gold/15 p-6 mb-8">
          <h3 className="font-serif text-base font-extrabold text-kumkum mb-3 flex items-center gap-2">
            <BookOpen className="size-4" /> About the {melakarta.chakra} Chakra
          </h3>
          <p className="text-sm font-semibold text-foreground/80 leading-relaxed">
            {melakarta.name} belongs to the <strong>{melakarta.chakra}</strong> chakra — one of the 12 chakras 
            (groups of 6) in the Venkatamakhin Melakarta system. Each chakra contains 6 ragas sharing 
            the same Rishabha and Gandhara combination. Raga #{melakarta.number} is the{" "}
            <strong>{["1st","2nd","3rd","4th","5th","6th"][(melakarta.number - 1) % 6]}</strong> raga 
            of its chakra.
          </p>
        </div>

        {/* ── Prev / Next Navigation ── */}
        <div className="flex justify-between gap-4">
          {prevSeed ? (
            <Link
              href={`/knowledge-hub/melakarta/${prevSeed.number}`}
              className="flex-1 glass-panel rounded-xl border border-swara-gold/15 p-4 hover:border-kumkum/30 transition-all group"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                ← Previous
              </p>
              <p className="font-black text-foreground group-hover:text-kumkum transition-colors">
                #{prevSeed.number} {prevSeed.name}
              </p>
              <p className="text-xs font-bold text-muted-foreground">{prevSeed.chakra} Chakra</p>
            </Link>
          ) : <div className="flex-1" />}

          {nextSeed ? (
            <Link
              href={`/knowledge-hub/melakarta/${nextSeed.number}`}
              className="flex-1 glass-panel rounded-xl border border-swara-gold/15 p-4 hover:border-kumkum/30 transition-all text-right group"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                Next →
              </p>
              <p className="font-black text-foreground group-hover:text-kumkum transition-colors">
                #{nextSeed.number} {nextSeed.name}
              </p>
              <p className="text-xs font-bold text-muted-foreground">{nextSeed.chakra} Chakra</p>
            </Link>
          ) : <div className="flex-1" />}
        </div>

      </main>
      <Footer />
    </div>
  );
}
