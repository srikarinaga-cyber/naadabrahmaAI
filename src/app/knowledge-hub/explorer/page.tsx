export const dynamic = "force-dynamic";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RagaTreeExplorer } from "@/components/music/RagaTreeExplorer";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

export default function RagaExplorerPage() {
  return (
    <div className="min-h-screen bg-[#070402] text-amber-50 flex flex-col justify-between">
      <Navbar />
      <main className="mx-auto max-w-6xl w-full px-6 py-10 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Link
              href="/knowledge-hub"
              className="text-xs text-amber-300/60 hover:text-amber-100 transition"
            >
              ← Back to Knowledge Hub
            </Link>
          </div>

          <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] mb-3 py-1 px-3">
            <Sparkles className="mr-1.5 size-3.5" />
            Heritage & Classical Musicology Explorer
          </Badge>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-amber-100">
            Heritage & Raga Relationship Explorer
          </h1>
          <p className="text-amber-200/70 mt-2 text-xs md:text-sm max-w-3xl leading-relaxed">
            Explore the sacred 72 Melakarta parent raga system formulated by Venkatamakhin, inspect ascending (Arohana) and descending (Avarohana) swarasthanas, examine Janya derivatives, and connect directly with your personalized learning path.
          </p>
        </div>

        <RagaTreeExplorer />
      </main>
      <Footer />
    </div>
  );
}
