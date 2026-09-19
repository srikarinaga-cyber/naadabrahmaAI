"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NotesPanel } from "@/components/modules/notes-panel";
import { Badge } from "@/components/ui/badge";
import { NotebookPen, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export default function NotesPage() {
  const { language } = useLanguage();

  const isTe = language === "te";

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col justify-between">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16 flex-1 w-full relative z-10">
        <div className="mb-8 bg-card/85 backdrop-blur-xl border border-swara-gold/30 p-6 rounded-3xl shadow-xl">
          <Badge variant="outline" className="border-[#800020]/30 text-[#800020] dark:text-amber-200 mb-4 font-bold">
            <NotebookPen className="mr-1 size-3.5" />
            {isTe ? "నోట్స్ సాధన విధానం" : "Notes Generation"}
          </Badge>
          <h1 className="font-serif text-3xl font-extrabold text-[#800020] dark:text-amber-100">
            {isTe ? "పాఠ్యాంశ PDFలు & అధ్యయన నోట్స్" : "Syllabus PDFs & Study Notes"}
          </h1>
          <p className="text-foreground/90 font-medium mt-2 text-sm max-w-2xl leading-relaxed">
            {isTe
              ? "అధికారిక పాఠ్యాంశ PDFలను అన్వేషించండి, AI అన్వేషణ కోసం నమోదు చేసుకోండి మరియు పరీక్షల కోసం ప్రత్యేక నోట్స్ తయారు చేసుకోండి."
              : "Browse official syllabus PDFs from Supabase Storage, import content for AI search, and generate exam-ready study notes."}
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-8 animate-spin text-[#800020]" />
            </div>
          }
        >
          <NotesPanel />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
