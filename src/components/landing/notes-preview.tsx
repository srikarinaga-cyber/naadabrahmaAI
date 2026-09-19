"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, NotebookPen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";

export function NotesPreview() {
  const { language } = useLanguage();
  const isTe = language === "te";

  const highlights = isTe
    ? [
        "అధికారిక పాఠ్యాంశ PDFలను సురక్షితంగా నిర్వహించడం",
        "AI ఆధారిత అంశాల సంగ్రహణ మరియు నోట్స్ ప్రతిపాదన",
        "అధ్యయన నోట్స్ సేవ్ చేసుకొని ఏ సమయంలోనైనా పునఃపరిశీలించడం",
      ]
    : [
        "Official syllabus PDFs stored in Supabase Storage",
        "RAG-powered topic extraction for AI note generation",
        "Save and revisit generated study notes",
      ];

  return (
    <section id="notes" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="traditional-glow overflow-hidden rounded-3xl border-2 border-swara-gold/40 bg-card/95 shadow-xl backdrop-blur-xl dark:bg-card/80">
              <div className="flex items-center gap-3 border-b border-swara-gold/30 bg-[#800020]/10 px-5 py-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#800020]/20">
                  <FileText className="size-4 text-[#800020] dark:text-amber-200" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#800020] dark:text-amber-100">
                    {isTe ? "పాఠ్యాంశ PDF లైబ్రరీ" : "Syllabus PDF Library"}
                  </p>
                  <p className="text-xs text-foreground/80 font-semibold">
                    {isTe ? "కర్ణాటక సంగీత సిద్ధాంత నోట్స్" : "Carnatic music theory notes"}
                  </p>
                </div>
                <Badge className="ml-auto bg-swara-gold/15 text-[#800020] border border-swara-gold/40 font-extrabold" variant="secondary">
                  PDF
                </Badge>
              </div>

              <div className="space-y-3 p-5">
                {[
                  "carnatic_music_theory1.pdf",
                  "diploma_syllabus.pdf",
                  "grade_exam_portions.pdf",
                ].map((file) => (
                  <div
                    key={file}
                    className="flex items-center gap-3 rounded-2xl border border-swara-gold/30 bg-muted/50 px-4 py-3"
                  >
                    <FileText className="size-4 text-[#800020] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-extrabold text-foreground">{file}</p>
                      <p className="text-[10px] text-foreground/70 font-semibold">{isTe ? "పాఠ్యాంశ నిధి నుండి నమోదు చేయబడింది" : "Imported from Supabase"}</p>
                    </div>
                    <Sparkles className="size-3.5 text-swara-gold shrink-0" />
                  </div>
                ))}
              </div>

              <div className="border-t border-swara-gold/30 px-5 py-4">
                <p className="text-xs text-foreground/90 font-medium">
                  {isTe
                    ? "PDFలను పరిశీలించండి, అంశాలను అన్వేషించండి మరియు పరీక్షల కోసం నోట్స్ పొందుపరచండి."
                    : "View PDFs, browse topics, and generate AI study notes from your syllabus."}
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
            <Badge variant="outline" className="border-[#800020]/30 text-[#800020] dark:text-amber-200 font-extrabold text-xs">
              <NotebookPen className="mr-1 size-3.5" />
              {isTe ? "నోట్స్ సాధన విధానం" : "Notes Generation"}
            </Badge>
            <h2 className="font-serif text-3xl font-extrabold text-[#800020] dark:text-amber-100 md:text-4xl">
              {isTe ? "పాఠ్యాంశ PDFలు & AI అధ్యయన నోట్స్" : "Syllabus PDFs & AI Study Notes"}
            </h2>
            <p className="leading-relaxed text-foreground/90 font-medium text-sm">
              {isTe
                ? "అధికారిక పరీక్షల పాఠ్యాంశ PDFలను అప్‌లోడ్ చేసి, ప్రతి అధ్యాయాన్ని పేజీ-పేజీ విశ్లేషించి మీ కోసం ప్రత్యేక సిద్ధాంత నోట్స్ తయారు చేసుకోండి."
                : "Upload official exam syllabus PDFs to Supabase Storage. Naadabrahma imports the content, lets you browse topics page-by-page, and generates personalized study notes using RAG over your curriculum."}
            </p>

            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex gap-3 text-xs md:text-sm font-semibold text-foreground/90">
                  <span className="mt-0.5 text-swara-gold" aria-hidden>
                    ✦
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Button
              className="bg-[#800020] hover:bg-[#A00028] text-white font-extrabold rounded-2xl px-6 py-3 shadow-md text-xs md:text-sm"
              nativeButton={false}
              render={<Link href="/notes" />}
            >
              {isTe ? "నోట్స్ లైబ్రరీ తెరవండి" : "Open Notes Library"}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
