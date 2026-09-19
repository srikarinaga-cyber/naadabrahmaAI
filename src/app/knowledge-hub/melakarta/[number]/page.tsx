import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getMelakartaByNumber } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/static";
import { MELAKARTA_SEED_DATA } from "@/lib/data/melakartas-seed";
import { ExtendedJanya, getJanyasForMelakarta } from "@/lib/data/janyas-db";
import { MelakartaDetailClientView } from "@/components/knowledge-hub/melakarta-detail-client-view";

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
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 w-full">
        <MelakartaDetailClientView
          melakarta={melakarta}
          prevMelakartaNum={prevMelakartaNum}
          prevMelakartaName={prevMelakarta.name}
          nextMelakartaNum={nextMelakartaNum}
          nextMelakartaName={nextMelakarta.name}
          janyasForMelakarta={janyasForMelakarta}
          kritisList={kritisList}
        />
      </main>
      <Footer />
    </div>
  );
}
