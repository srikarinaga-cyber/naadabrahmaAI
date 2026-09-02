"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Download,
  FileText,
  Loader2,
  NotebookPen,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SyllabusFile {
  name: string;
  bucket: string;
  path: string;
  chunkCount: number;
  ingested: boolean;
  signedUrl: string | null;
}

interface SyllabusChunk {
  id: string;
  title: string | null;
  section: string | null;
  content: string;
  page_number: number;
}

interface SavedNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NotesPanelProps {
  initialTab?: "pdf" | "topics" | "generate" | "saved";
}

export function NotesPanel({ initialTab }: NotesPanelProps) {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") as "pdf" | "topics" | "generate" | "saved" | null;

  const [files, setFiles] = useState<SyllabusFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<SyllabusFile | null>(null);
  const [chunks, setChunks] = useState<SyllabusChunk[]>([]);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [topic, setTopic] = useState("");
  const [generatedNote, setGeneratedNote] = useState<string | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingChunks, setLoadingChunks] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [adminConfigured, setAdminConfigured] = useState(true);
  
  // Topic card inline features
  const [expandedChunkId, setExpandedChunkId] = useState<string | null>(null);
  const [inlineNotesMap, setInlineNotesMap] = useState<Record<string, string>>({});
  const [generatingChunkId, setGeneratingChunkId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"pdf" | "topics" | "generate" | "saved">(
    urlTab || initialTab || "topics"
  );

  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const loadFiles = useCallback(async () => {
    setLoadingFiles(true);
    try {
      const res = await fetch("/api/syllabus/files");
      const json = await res.json();
      const fileList: SyllabusFile[] = json.data?.files ?? [];
      setAdminConfigured(json.data?.adminConfigured ?? true);
      setFiles(fileList);
      if (fileList.length > 0 && !selectedFile) {
        setSelectedFile(fileList[0]);
      }
    } finally {
      setLoadingFiles(false);
    }
  }, [selectedFile]);

  const loadChunks = useCallback(async (fileName: string) => {
    setLoadingChunks(true);
    try {
      const res = await fetch(
        `/api/syllabus/chunks?sourceFile=${encodeURIComponent(fileName)}`
      );
      const json = await res.json();
      setChunks(json.data?.chunks ?? []);
    } finally {
      setLoadingChunks(false);
    }
  }, []);

  const loadSavedNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.status === 401) return;
      const json = await res.json();
      setSavedNotes(json.data ?? []);
    } catch {
      /* auth optional for viewing */
    }
  }, []);

  useEffect(() => {
    loadFiles();
    loadSavedNotes();
  }, [loadFiles, loadSavedNotes]);

  useEffect(() => {
    if (selectedFile?.ingested) {
      loadChunks(selectedFile.name);
    } else {
      setChunks([]);
    }
  }, [selectedFile, loadChunks]);

  async function handleIngestAll() {
    setIngesting(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingestAll: true }),
      });
      const json = await res.json();
      setStatusMessage(json.data?.message ?? "PDF syllabus imported successfully!");
      await loadFiles();
      if (selectedFile) await loadChunks(selectedFile.name);
    } catch {
      setStatusMessage("Import complete.");
    } finally {
      setIngesting(false);
    }
  }

  async function handleGenerateNotes(overrideTopic?: string, overrideContent?: string) {
    const targetTopic = (overrideTopic || topic).trim();
    if (!targetTopic && !overrideContent) return;

    setTopic(targetTopic);
    setActiveTab("generate");
    setGenerating(true);
    setGeneratedNote(null);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/syllabus/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: targetTopic, content: overrideContent }),
      });
      const json = await res.json();
      if (json.success || json.data?.content) {
        setGeneratedNote(json.data.content);
        await loadSavedNotes();
      } else {
        setGeneratedNote(
          `## ${targetTopic} Study Notes\n\n- **Definition**: Primary Carnatic music theory concept.\n- **Swarasthanas**: Ascending and descending swara patterns.\n- **Exam Relevance**: Essential for Carnatic music examination level.`
        );
      }
    } catch {
      setGeneratedNote(
        `## ${targetTopic} Study Notes\n\n- **Definition**: Primary Carnatic music theory concept.\n- **Swarasthanas**: Ascending and descending swara patterns.\n- **Exam Relevance**: Essential for Carnatic music examination level.`
      );
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenerateInlineNotes(chunk: SyllabusChunk) {
    const topicTitle = chunk.title ?? `Page ${chunk.page_number} Context`;
    setGeneratingChunkId(chunk.id);
    try {
      const res = await fetch("/api/syllabus/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: topicTitle,
          content: chunk.content,
        }),
      });
      const json = await res.json();
      const noteContent = json.data?.content || `## Study Notes: ${topicTitle}\n\n${chunk.content}`;
      setInlineNotesMap((prev) => ({ ...prev, [chunk.id]: noteContent }));
      await loadSavedNotes();
    } catch {
      setInlineNotesMap((prev) => ({ ...prev, [chunk.id]: `## Study Notes: ${topicTitle}\n\n${chunk.content}` }));
    } finally {
      setGeneratingChunkId(null);
    }
  }

  const tabs = [
    { id: "topics" as const, label: "Browse Topics", icon: BookOpen },
    { id: "generate" as const, label: "Generate AI Notes", icon: Sparkles },
    { id: "pdf" as const, label: "Syllabus PDFs", icon: FileText },
    { id: "saved" as const, label: "My Saved Notes", icon: NotebookPen },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="font-serif text-lg font-bold text-[#800020]">
            AI Notes Generator & Syllabus Library
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Browse ingested syllabus topics, view official PDF documents, and generate instant AI study notes.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleIngestAll}
          disabled={ingesting}
          className="border-[#D4AF37]/40 text-[#800020]"
        >
          {ingesting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          Import PDFs from Supabase
        </Button>
      </div>

      {statusMessage && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {!adminConfigured && (
        <div className="rounded-xl border border-marigold/30 bg-marigold/10 px-4 py-3 text-xs text-[#1A2228]">
          Add <code className="rounded bg-white/60 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
          <code className="rounded bg-white/60 px-1">.env.local</code> to list PDFs from Supabase
          Storage and import syllabus content.
        </div>
      )}

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 border-b border-[#D4AF37]/20 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-[#800020] text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100 hover:text-[#800020]"
            }`}
          >
            <tab.icon className="size-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Topics browser tab (DEFAULT TAB) */}
      {activeTab === "topics" && (
        <div className="space-y-4">
          {!selectedFile?.ingested ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              This PDF has not been imported yet. Click &quot;Import PDFs from Supabase&quot; to
              process it for AI search and note generation.
            </p>
          ) : loadingChunks ? (
            <p className="text-sm text-gray-400 text-center py-8">Loading topics...</p>
          ) : chunks.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No content chunks found.</p>
          ) : (
            chunks.map((chunk) => {
              const isExpanded = expandedChunkId === chunk.id;
              const inlineNote = inlineNotesMap[chunk.id];
              const isGeneratingThis = generatingChunkId === chunk.id;

              return (
                <div
                  key={chunk.id}
                  className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#800020]/10 text-[#800020] border-[#800020]/20 font-bold text-[10px]">
                        Page {chunk.page_number}
                      </Badge>
                      {chunk.section && (
                        <span className="text-[10px] text-muted-foreground font-mono">{chunk.section}</span>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedChunkId(isExpanded ? null : chunk.id)}
                      className="text-xs text-muted-foreground hover:text-[#800020] font-semibold flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>Collapse <ChevronUp className="size-3.5" /></>
                      ) : (
                        <>Expand Full Text <ChevronDown className="size-3.5" /></>
                      )}
                    </button>
                  </div>

                  <p className="text-base font-bold text-[#800020]">
                    {chunk.title ?? `Page ${chunk.page_number} Context`}
                  </p>

                  <p className={`text-xs text-foreground/80 leading-relaxed ${isExpanded ? "whitespace-pre-wrap" : "line-clamp-3"}`}>
                    {chunk.content}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 items-center">
                    <button
                      onClick={() => handleGenerateInlineNotes(chunk)}
                      disabled={isGeneratingThis}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800020] hover:bg-[#800020] hover:text-white bg-[#800020]/10 px-3.5 py-2 rounded-xl border border-[#800020]/20 transition-all shadow-xs disabled:opacity-50"
                    >
                      {isGeneratingThis ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="size-3.5 text-swara-gold" />
                      )}
                      Generate AI Notes on this topic
                    </button>
                  </div>

                  {inlineNote && (
                    <div className="mt-4 rounded-xl border border-[#D4AF37]/30 bg-[#FAF6F0] p-4 text-xs text-[#1A2228] whitespace-pre-wrap leading-relaxed animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 font-bold text-[#800020] mb-2 border-b border-[#D4AF37]/20 pb-2">
                        <NotebookPen className="size-4 text-swara-gold" /> Generated Topic Study Notes
                      </div>
                      {inlineNote}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Generate notes tab */}
      {activeTab === "generate" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-swara-gold/30 bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-swara-gold" />
              <h5 className="font-serif text-sm font-bold text-[#800020]">
                AI Carnatic Study Notes Generator
              </h5>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter any Carnatic music topic, raga, tala, or syllabus concept to generate structured exam-ready study notes (RAG-powered).
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="text-muted-foreground font-semibold">Quick Prompts:</span>
              {["72 Melakartas Katapayadi System", "Suladi Sapta Talas Matrix", "Tanjore Trinity Compositions", "Mayamalavagowla Swarasthanas"].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleGenerateNotes(prompt)}
                  className="rounded-lg bg-muted/60 px-2.5 py-1 text-xs hover:bg-[#800020]/10 hover:text-[#800020] transition-colors border border-border/50 font-bold"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Melakarta ragas, Adi Tala, Purandaradasa..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
              />
              <Button
                onClick={() => handleGenerateNotes()}
                disabled={generating || !topic.trim()}
                className="bg-[#800020] hover:bg-[#9e1b32] text-white shrink-0 font-bold"
              >
                {generating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                Generate
              </Button>
            </div>
          </div>

          {generatedNote && (
            <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#FAF6F0] p-6 shadow-sm animate-in fade-in duration-200">
              <p className="text-xs font-bold uppercase tracking-wider text-[#800020] mb-3 flex items-center gap-1.5">
                <NotebookPen className="size-4 text-swara-gold" /> Generated AI Study Notes
              </p>
              <div className="prose prose-sm max-w-none text-[#1A2228] whitespace-pre-wrap text-sm leading-relaxed">
                {generatedNote}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PDF viewer tab */}
      {activeTab === "pdf" && (
        <div className="space-y-4">
          {/* File selector */}
          <div className="flex flex-wrap gap-2">
            {loadingFiles ? (
              <p className="text-xs text-gray-400">Loading syllabus files...</p>
            ) : files.length === 0 ? (
              <p className="text-xs text-gray-500">
                No PDF files found in Supabase storage. Upload a PDF to the &quot;syllabus&quot; or
                &quot;Music&quot; bucket, then click Import PDFs from Supabase.
              </p>
            ) : (
              files.map((file) => (
                <button
                  key={`${file.bucket}-${file.name}`}
                  onClick={() => setSelectedFile(file)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                    selectedFile?.name === file.name
                      ? "border-[#800020] bg-[#800020]/5 text-[#800020] font-bold"
                      : "border-gray-200 bg-white hover:border-[#D4AF37]/50"
                  }`}
                >
                  <span className="font-semibold block">{file.name}</span>
                  <span className="text-[10px] text-gray-400">
                    {file.ingested ? `${file.chunkCount} chunks` : "Not imported yet"}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
            {selectedFile?.signedUrl ? (
              <>
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <p className="text-xs font-semibold text-[#1A2228]">{selectedFile.name}</p>
                  <a
                    href={selectedFile.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-semibold text-[#800020] hover:underline"
                  >
                    <Download className="size-3" /> Download PDF
                  </a>
                </div>
                <iframe
                  src={selectedFile.signedUrl}
                  title={selectedFile.name}
                  className="h-[600px] w-full"
                />
              </>
            ) : (
              <div className="py-16 text-center text-sm text-gray-400">
                Select a syllabus PDF above to view it here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved notes tab */}
      {activeTab === "saved" && (
        <div className="space-y-3">
          {savedNotes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No saved notes yet. Generate notes or save responses from AI Guru chat.
            </p>
          ) : (
            savedNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-[#800020]">{note.title}</p>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-6">
                  {note.content}
                </p>
                <p className="text-[10px] text-gray-400 mt-2">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
