"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, NotebookPen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const highlights = [
  "Official syllabus PDFs stored in Supabase Storage",
  "RAG-powered topic extraction for AI note generation",
  "Save and revisit generated study notes",
];

export function NotesPreview() {
  const [files, setFiles] = useState<string[]>([
    "carnatic_music_theory1.pdf",
    "diploma_syllabus.pdf",
    "grade_exam_portions.pdf",
  ]);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch("/api/syllabus/files");
        const json = await res.json();
        const fileList = json.data?.files ?? [];
        if (fileList.length > 0) {
          setFiles(fileList.map((f: any) => f.name));
        }
      } catch (err) {
        console.error("[NotesPreview] Failed to fetch syllabus files:", err);
      }
    }
    fetchFiles();
  }, []);

  return (
    <section id="notes" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="traditional-glow overflow-hidden rounded-2xl border border-swara-gold/20 bg-card shadow-lg dark:bg-card/80">
              <div className="flex items-center gap-3 border-b border-border bg-kumkum/5 px-5 py-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-kumkum/15">
                  <FileText className="size-4 text-kumkum" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Syllabus PDF Library</p>
                  <p className="text-xs text-muted-foreground">Carnatic music theory notes</p>
                </div>
                <Badge className="ml-auto bg-marigold/15 text-marigold" variant="secondary">
                  PDF
                </Badge>
              </div>

              <div className="space-y-3 p-5">
                {files.map((file) => (
                  <div
                    key={file}
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3"
                  >
                    <FileText className="size-4 text-kumkum shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{file}</p>
                      <p className="text-[10px] text-muted-foreground">Imported from Supabase</p>
                    </div>
                    <Sparkles className="size-3.5 text-swara-gold shrink-0" />
                  </div>
                ))}
              </div>

              <div className="border-t border-border px-5 py-4">
                <p className="text-xs text-muted-foreground">
                  View PDFs, browse topics, and generate AI study notes from your syllabus.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="border-kumkum/20 text-kumkum">
              <NotebookPen className="mr-1 size-3" />
              Notes Generation
            </Badge>
            <h2 className="font-serif text-3xl font-bold text-kumkum md:text-4xl">
              Syllabus PDFs & AI Study Notes
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Upload official exam syllabus PDFs to Supabase Storage. Naadabrahma imports the
              content, lets you browse topics page-by-page, and generates personalized study notes
              using RAG over your curriculum.
            </p>

            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="mt-0.5 text-swara-gold" aria-hidden>
                    ✦
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Button
              className="bg-kumkum hover:bg-kumkum-light"
              render={<Link href="/notes" />}
            >
              Open Notes Library
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
