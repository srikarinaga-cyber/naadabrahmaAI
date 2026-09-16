export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AiGuruChat } from "@/components/ai-guru/chat-panel";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";

export default function AiGuruPage() {
  return (
    <div className="relative min-h-screen bg-[#FAF6F0] dark:bg-background flex flex-col overflow-hidden">
      {/* High-Visibility Sangeetha Trimurthulu Background Theme Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-[center_top] bg-no-repeat opacity-[0.45] dark:opacity-[0.35]"
        style={{ backgroundImage: "url('/trinity-theme-bg.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#FAF6F0]/40 via-[#FAF6F0]/20 to-[#FAF6F0]/60 dark:from-background/60 dark:via-background/40 dark:to-background/80" />

      {/* Floating Musical Note Ornaments */}
      <div className="pointer-events-none fixed top-24 left-10 text-3xl opacity-30 animate-bounce text-[#D4AF37]">🎵</div>
      <div className="pointer-events-none fixed top-40 right-12 text-3xl opacity-30 animate-pulse text-[#800020]">🎼</div>
      <div className="pointer-events-none fixed bottom-20 left-16 text-3xl opacity-30 animate-pulse text-[#D4AF37]">🎶</div>
      <div className="pointer-events-none fixed bottom-32 right-20 text-3xl opacity-30 animate-bounce text-[#800020]">🕉️</div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 py-12 flex-1">
        <div className="mb-8 text-center bg-white/60 dark:bg-card/80 backdrop-blur-md p-6 rounded-3xl border border-[#D4AF37]/30 shadow-md">
          <Badge variant="outline" className="border-[#800020]/30 text-[#800020] mb-3 px-3 py-1 font-serif text-xs font-bold">
            <Bot className="mr-1.5 size-3.5" />
            AI Guru (24/7 Carnatic Assistant)
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#800020] tracking-tight">
            Chat with AI Guru
          </h1>
          <p className="text-muted-foreground mt-2 text-xs sm:text-sm max-w-lg mx-auto">
            Ask doubts in Telugu, Tamil, Kannada, Malayalam, Hindi, or English.{" "}
            <Link href="/login" className="text-[#800020] font-bold underline hover:text-[#A00028]">
              Sign in
            </Link>{" "}
            for full access and note saving.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-sm text-muted-foreground font-semibold">Loading AI Guru...</div>}>
          <AiGuruChat />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
