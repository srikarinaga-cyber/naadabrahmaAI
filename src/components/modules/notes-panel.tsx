"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  Download,
  FileText,
  Loader2,
  NotebookPen,
  RefreshCw,
  Sparkles,
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

export function NotesPanel() {
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
  const [adminConfigured, setAdminConfigured] = useState(true);
  const [activeTab, setActiveTab] = useState<"pdf" | "topics" | "generate" | "saved">("pdf");

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
    try {
      const res = await fetch("/api/admin/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingestAll: true }),
      });
      const json = await res.json();
      alert(json.data?.message ?? json.error ?? "Ingestion complete");
      await loadFiles();
      if (selectedFile) await loadChunks(selectedFile.name);
    } finally {
      setIngesting(false);
    }
  }

  async function handleGenerateNotes() {
    if (!topic.trim()) return;
    setGenerating(true);
    setGeneratedNote(null);
    try {
      const res = await fetch("/api/syllabus/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setGeneratedNote(json.data.content);
        await loadSavedNotes();
      } else {
        alert(json.error ?? "Failed to generate notes");
      }
    } finally {
      setGenerating(false);
    }
  }

  const tabs = [
    { id: "pdf" as const, label: "Syllabus PDF", icon: FileText },
    { id: "topics" as const, label: "Browse Topics", icon: BookOpen },
    { id: "generate" as const, label: "Generate Notes", icon: Sparkles },
    { id: "saved" as const, label: "My Notes", icon: NotebookPen },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="font-serif text-lg font-bold text-[#800020]">
            Notes & Syllabus Library
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            View official PDF syllabus, browse ingested topics, and generate AI study notes.
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

      {!adminConfigured && (
        <div className="rounded-xl border border-marigold/30 bg-marigold/10 px-4 py-3 text-xs text-[#1A2228]">
          Add <code className="rounded bg-white/60 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
          <code className="rounded bg-white/60 px-1">.env.local</code> to list PDFs from Supabase
          Storage and import syllabus content.
        </div>
      )}

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
                  ? "border-[#800020] bg-[#800020]/5 text-[#800020]"
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

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 border-b border-[#D4AF37]/15 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-[#800020]/10 text-[#800020]"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="size-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* PDF viewer tab */}
      {activeTab === "pdf" && (
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
      )}

      {/* Topics browser tab */}
      {activeTab === "topics" && (
        <div className="space-y-3">
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
            chunks.map((chunk) => (
              <div
                key={chunk.id}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-[10px]">
                    Page {chunk.page_number}
                  </Badge>
                  {chunk.section && (
                    <span className="text-[10px] text-gray-400">{chunk.section}</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-[#800020]">
                  {chunk.title ?? "Untitled section"}
                </p>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-4">
                  {chunk.content}
                </p>
                <button
                  onClick={() => {
                    setTopic(chunk.title ?? chunk.content.slice(0, 60));
                    setActiveTab("generate");
                  }}
                  className="mt-2 text-[10px] font-semibold text-[#800020] hover:underline"
                >
                  Generate notes on this topic →
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Generate notes tab */}
      {activeTab === "generate" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
            <p className="text-xs text-gray-500">
              AI generates study notes from your official syllabus PDF content (RAG-powered).
            </p>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Melakarta ragas, Adi Tala, Purandaradasa..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
            />
            <Button
              onClick={handleGenerateNotes}
              disabled={generating || !topic.trim()}
              className="bg-[#800020] hover:bg-[#9e1b32]"
            >
              {generating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              Generate Study Notes
            </Button>
          </div>

          {generatedNote && (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#FAF6F0] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#800020] mb-3">
                Generated Notes
              </p>
              <div className="prose prose-sm max-w-none text-[#1A2228] whitespace-pre-wrap text-sm leading-relaxed">
                {generatedNote}
              </div>
            </div>
          )}
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
