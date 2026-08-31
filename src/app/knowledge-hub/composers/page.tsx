export const dynamic = "force-dynamic";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";

interface Vaggeyakara {
  name: string;
  era: string;
  mudra: string;
  contributions: string;
  famousKriti: string;
}

const FAMOUS_VAGGEYAKARAS: Vaggeyakara[] = [
  {
    name: "Saint Tyagaraja",
    era: "1767 – 1847 AD (Trinity Era)",
    mudra: "Tyagaraja",
    contributions: "Composed thousands of Kritis, Divya Nama Kirthanas, and Pancharatna Kritis primarily in Telugu. Perfected the Sangati ornamentations.",
    famousKriti: "Endaro Mahanubhavulu (Sri Raga / Adi Tala)",
  },
  {
    name: "Muthuswami Dikshitar",
    era: "1775 – 1835 AD (Trinity Era)",
    mudra: "Guruguha",
    contributions: "Composed majestic Sanskrit Kritis, Kamalamba Navavarna Kritis, and 72 Melakarta Kritis. Master of Vilambita Kala and Venkatamakhin raga system.",
    famousKriti: "Vatapi Ganapatim (Hamsadhwani / Adi Tala)",
  },
  {
    name: "Syama Sastri",
    era: "1762 – 1827 AD (Trinity Era)",
    mudra: "Shyamakrishna",
    contributions: "Master of intricate rhythm (Tala-Prasthara), Swarajathis, and Anandabhairavi compositions. Known for profound devotion to Goddess Kamakshi.",
    famousKriti: "Kamakshi Swarajathi (Bhairavi / Chapu Tala)",
  },
  {
    name: "Purandara Dasa",
    era: "1484 – 1564 AD (Father of Carnatic Music)",
    mudra: "Purandara Vittala",
    contributions: "Systematized Carnatic music pedagogy by introducing Sarali, Janti, Alankara varisai, Pillari Geethams in Mayamalavagowla raga.",
    famousKriti: "Sri Gananatha (Malahari / Rupaka Tala)",
  },
  {
    name: "Swathi Thirunal Rama Varma",
    era: "1813 – 1846 AD (King of Travancore)",
    mudra: "Padmanabha / Sripadmanabha",
    contributions: "Composed Navaratri Kritis, Utsava Prabandhams, Tillanas, and Hindustani-style Padams across 8 languages.",
    famousKriti: "Bhavayami Raghuramam (Ragamalika / Rupaka Tala)",
  },
  {
    name: "Tallapaka Annamacharya",
    era: "1408 – 1503 AD (Padakavitha Pitamaha)",
    mudra: "Venkata / Venkateswara",
    contributions: "Composed over 32,000 Sankeertanas in praise of Lord Venkateswara at Tirumala in Telugu and Sanskrit.",
    famousKriti: "Brahmam Okate (Bouli / Adi Tala)",
  },
  {
    name: "Bhadrachala Ramadasu (Kancharla Gopanna)",
    era: "1620 – 1680 AD",
    mudra: "Ramadasu",
    contributions: "Pioneer of Carnatic Kirthana form and Bhakti movement songs, inspiring Saint Tyagaraja.",
    famousKriti: "Ikshvaku Kula Tilaka (Yadukulakambhoji / Adi Tala)",
  },
  {
    name: "Papanasam Sivan",
    era: "1890 – 1973 AD (Modern Trinity)",
    mudra: "Ramadasan",
    contributions: "Composed over 800 soul-stirring Tamil Kritis and film classical compositions earning him the title Tamil Tyagayya.",
    famousKriti: "Karpagame Kanparaai (Madhyamavati / Adi Tala)",
  },
  {
    name: "Patnam Subramania Iyer",
    era: "1845 – 1902 AD",
    mudra: "Venkatesesa",
    contributions: "Creator of popular concert Varnams and vibrant ragas like Kadanakutuhalam.",
    famousKriti: "Raghuvamsa Sudha (Kadanakutuhalam / Adi Tala)",
  },
  {
    name: "Koteeswara Iyer",
    era: "1869 – 1938 AD",
    mudra: "Kavirakshasa",
    contributions: "First vaggeyakara to compose Kritis in all 72 Melakarta ragas in Tamil (Kanda Ganam).",
    famousKriti: "Kanaka Mmayura (Kanakangi / Adi Tala)",
  },
  {
    name: "Lalgudi G. Jayaraman",
    era: "1930 – 2013 AD (Violin Maestro)",
    mudra: "Lalgudi",
    contributions: "Violin virtuoso who revolutionized Tillana compositions with rhythmic foot-tapping intricate swara patterns.",
    famousKriti: "Thillana in Mand (Mand / Adi Tala)",
  },
  {
    name: "Harikesanallur Muthaiah Bhagavatar",
    era: "1877 – 1955 AD",
    mudra: "Harikesa",
    contributions: "Scholar-composer who created new ragas like Niroshta (omitting labial swaras M & P) and Chamundamba Kritis.",
    famousKriti: "Raja Raja Radhite (Niroshta / Adi Tala)",
  },
];

export default function ComposersPage() {
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
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-kumkum mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Janaka Ragas
        </Link>

        <div className="mb-10">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4">
            Vaggeyakaras Directory
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
            Great Carnatic Music Composers
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
            The revered masters (Vaggeyakaras) who authored lyrics, musical notations, and rhythmic structures. From Purandara Dasa to the Tanjore Trinity (Saint Tyagaraja, Muthuswami Dikshitar, Syama Sastri) and modern masters.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FAMOUS_VAGGEYAKARAS.map((c) => (
            <div
              key={c.name}
              className="glass-panel rounded-2xl border border-swara-gold/25 bg-card/90 backdrop-blur-md p-6 flex flex-col justify-between hover:border-kumkum/50 hover:shadow-lg transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-kumkum/10 text-kumkum border-none text-[10px]">
                    Mudra: {c.mudra}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">{c.era}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-kumkum">{c.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.contributions}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 text-xs flex items-center gap-2 text-foreground">
                <Sparkles className="size-3.5 text-swara-gold shrink-0" />
                <span>
                  <strong className="font-bold">Signature:</strong> {c.famousKriti}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
