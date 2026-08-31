export const dynamic = "force-dynamic";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NotesPanel } from "@/components/modules/notes-panel";
import { Badge } from "@/components/ui/badge";
import { NotebookPen } from "lucide-react";

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4">
            <NotebookPen className="mr-1 size-3" />
            Notes Generation
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-kumkum">
            Syllabus PDFs & Study Notes
          </h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-2xl">
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
