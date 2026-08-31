export const dynamic = "force-dynamic";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Music2 } from "lucide-react";
import { getComposers } from "@/lib/db/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/static";
import { Composer } from "@/types/music";

const FALLBACK_COMPOSERS = [
  {
    id: "1",
    name: "Saint Tyagaraja",
    era: "18th Century (1767–1847)",
    biography: "The most prolific of the Tanjore Trinity of Carnatic music. Composed thousands of sublime devotional kritis primarily in Telugu in praise of Lord Rama, pioneering the Pancharatna Kritis.",
    mudra: "Tyagaraja",
  },
  {
    id: "2",
    name: "Muthuswami Dikshitar",
    era: "18th Century (1775–1835)",
    biography: "One of the Trinity of Carnatic Music. Composed majestic, deeply spiritual kritis in Sanskrit with gamaka-rich, slow-tempo (Vilambita-kala) phrasing and intricate raga structures.",
    mudra: "Guruguha",
  },
  {
    id: "3",
    name: "Syama Sastri",
    era: "18th Century (1762–1827)",
    biography: "The oldest of the Trinity. Devotee of Goddess Kamakshi of Kanchipuram, renowned for intricate rhythmic mastery, Swarajathis, and rare tala structures in Misra Chapu.",
    mudra: "Syama Krishna",
  },
  {
    id: "4",
    name: "Purandara Dasa",
    era: "15th-16th Century (1484–1564)",
    biography: "Revered as the Pitamaha (Grandfather) of Carnatic music. Systematized the vocal foundation exercises (Sarali, Janta, Alankaram, Geetham) and composed thousands of Kannada Devaranamanis.",
    mudra: "Purandara Vittala",
  },
  {
    id: "5",
    name: "Swathi Thirunal Rama Varma",
    era: "19th Century (1813–1846)",
    biography: "The scholarly Maharaja of Travancore who composed over 400 musical works in 8 languages, including Varnams, Padams, Tillanas, and Navaratri Kritis.",
    mudra: "Padmanabha / Sree Padmanabha",
  },
  {
    id: "6",
    name: "Tallapaka Annamacharya",
    era: "15th Century (1408–1503)",
    biography: "The Padakavitha Pitamaha who composed over 32,000 Sankeertanas in praise of Lord Venkateswara of Tirumala in Telugu and Sanskrit.",
    mudra: "Venkateswara / Venkatadri",
  },
  {
    id: "7",
    name: "Papanasam Sivan",
    era: "20th Century (1890–1973)",
    biography: "Acclaimed as the 'Tamil Tyagaraja' of modern times. Composed over 800 soul-stirring Tamil classical kritis and movie compositions.",
    mudra: "Ramadasan",
  },
  {
    id: "8",
    name: "Bhadrachala Ramadasu (Kancherla Gopanna)",
    era: "17th Century (1620–1680)",
    biography: "Famous Carnatic saint-poet who built the Bhadrachalam Rama temple and composed legendary devotional Keerthanas that directly inspired Saint Tyagaraja.",
    mudra: "Ramadasu",
  },
  {
    id: "9",
    name: "Patnam Subramania Iyer",
    era: "19th-20th Century (1845–1902)",
    biography: "Revered master composer of snappy Varnams and Tillanas. Created new ragas like Kadana Kutoohalam and composed in over 100 ragas.",
    mudra: "Venkatesa",
  },
  {
    id: "10",
    name: "Lalgudi Jayaraman",
    era: "20th Century (1930–2013)",
    biography: "Legendary Carnatic violin maestro and genius composer of modern Tillanas, Varnams, and orchestral classical compositions.",
    mudra: "Lalgudi",
  },
  {
    id: "11",
    name: "Koteeswara Iyer",
    era: "19th-20th Century (1869–1938)",
    biography: "Pioneering composer who accomplished the monumental feat of composing kritis in all 72 Melakarta Ragas in Tamil.",
    mudra: "Kavi Kunjara",
  },
  {
    id: "12",
    name: "Harikesanallur Muthaiah Bhagavatar",
    era: "19th-20th Century (1877–1945)",
    biography: "Renowned Harikatha exponent and composer of Chamundamba Ashtottara kritis, creator of new ragas such as Hamsanandi, Niroshta, and Mohanakalyani.",
    mudra: "Harikesha",
  },
];

export default async function ComposersPage() {
  const configured = isSupabaseConfigured();
  let composers: Composer[] = [];

  if (configured) {
    composers = await getComposers();
  }

  if (!composers || composers.length === 0) {
    composers = FALLBACK_COMPOSERS;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-kumkum mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Janaka Ragas
        </Link>

        <div className="mb-10">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4">
            Carnatic Music Master Composers
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
            Great Vaggeyakaras (Composers)
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
            Meet the iconic architects of Carnatic classical music, from Purandara Dasa (Pitamaha) and the Tanjore Trinity (Tyagaraja, Dikshitar, Syama Sastri) to modern maestros.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {composers.map((c: Composer) => (
            <div
              key={c.id}
              className="glass-panel traditional-glow rounded-3xl p-6 border border-swara-gold/20 bg-card flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-kumkum/10 ring-1 ring-swara-gold/30">
                    <User className="size-5 text-kumkum" />
                  </div>
                  <Badge variant="outline" className="border-swara-gold/30 text-marigold text-[10px]">
                    {c.era}
                  </Badge>
                </div>
                <h3 className="font-serif text-xl font-bold text-kumkum mb-2">{c.name}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-4">{c.biography}</p>
              </div>

              {c.mudra && (
                <div className="border-t border-border/60 pt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                    <Music2 className="size-3 text-swara-gold" /> Mudra (Signature):
                  </span>
                  <span className="font-serif font-bold text-kumkum bg-kumkum/10 px-2.5 py-1 rounded-lg">
                    {c.mudra}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
