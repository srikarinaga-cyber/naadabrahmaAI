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
