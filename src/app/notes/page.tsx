export const dynamic = "force-dynamic";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NotesPanel } from "@/components/modules/notes-panel";
import { Badge } from "@/components/ui/badge";
import { NotebookPen } from "lucide-react";
import { MusicThemeBackdrop } from "@/components/ui/music-theme-backdrop";

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16 flex-1 w-full relative z-10">
        <div className="mb-8 bg-card/85 backdrop-blur-xl border border-swara-gold/30 p-6 rounded-3xl shadow-xl">
          <Badge variant="outline" className="border-[#800020]/30 text-[#800020] dark:text-amber-200 mb-4 font-bold">
            <NotebookPen className="mr-1 size-3.5" />
            Notes Generation
          </Badge>
          <h1 className="font-serif text-3xl font-extrabold text-[#800020] dark:text-amber-100">
            Syllabus PDFs & Study Notes
          </h1>
          <p className="text-foreground/90 font-medium mt-2 text-sm max-w-2xl leading-relaxed">
            Browse official syllabus PDFs from Supabase Storage, import content for AI search,
            and generate exam-ready study notes.
          </p>
        </div>
        <NotesPanel />
      </main>
      <Footer />
    </div>
  );
}
