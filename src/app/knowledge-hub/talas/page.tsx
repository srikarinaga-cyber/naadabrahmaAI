export const dynamic = "force-dynamic";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { TalaMatrixPlayer } from "@/components/music/tala-matrix-player";

export default function TalasPage() {
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
        <Link
          href="/knowledge-hub"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-kumkum mb-8 transition-colors bg-card/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border"
        >
          <ArrowLeft className="size-4" /> Back to Janaka Ragas
        </Link>

        <div className="mb-10">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4 font-bold">
            Suladi Sapta Tala System
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
            35 Suladi Sapta Talas Matrix & Beat Synthesizer
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
            The foundational 35 rhythmic cycles of Carnatic music formed by combining the 7 Principal Tala Types (Dhruva, Matya, Rupaka, Jhampa, Triputa, Ata, Eka) across the 5 Jathis (Tisra, Chatusra, Khanda, Misra, Sankeerna). Select any Tala to play its exact Anga beat sound signature.
          </p>
        </div>

        <TalaMatrixPlayer />
      </main>
      <Footer />
    </div>
  );
}
