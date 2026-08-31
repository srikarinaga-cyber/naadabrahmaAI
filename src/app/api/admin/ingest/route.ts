import { NextRequest } from "next/server";
import {
  jsonOk,
  jsonError,
  jsonServerError,
  jsonForbidden,
} from "@/lib/api/response";
import { requireRole } from "@/lib/api/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEmbedding } from "@/lib/ai/syllabus";

import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin client is not configured" });
    }

    const { data: buckets, error: err1 } = await supabaseAdmin.storage.listBuckets();
    const { data: files, error: err2 } = await supabaseAdmin.storage.from("syllabus").list();
    const { data: musicFiles, error: err3 } = await supabaseAdmin.storage.from("Music").list();

    return NextResponse.json({
      buckets,
      bucketsError: err1 ? err1.message : null,
      files,
      filesError: err2 ? err2.message : null,
      musicFiles,
      musicFilesError: err3 ? err3.message : null
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

export const maxDuration = 300; // Allow serverless route to run up to 5 minutes if supported

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate & Authorize
    const isDev = process.env.NODE_ENV === "development";
    const hasSecret =
      process.env.INGESTION_SECRET &&
      request.nextUrl.searchParams.get("secret") === process.env.INGESTION_SECRET;

    if (!hasSecret) {
      const authResult = await requireRole(["platform_admin"]);
      if (!authResult && !isDev) {
        return jsonForbidden("Only platform administrators can perform ingestion.");
      }
    }

    // 2. Parse request body
    let body: {
      sourceFile?: string;
      forceReingest?: boolean;
      ingestAll?: boolean;
      sourceBucket?: string;
      sourcePath?: string;
    } = {};
    try {
      body = await request.json();
    } catch {
      // Accept empty body
    }

    const supabaseAdmin = createAdminClient();
    if (!supabaseAdmin) {
      return jsonServerError("Admin Supabase client is not configured.");
    }

    if (body.ingestAll) {
      const buckets = await discoverIngestBuckets(supabaseAdmin);
      const results: Array<{ file: string; bucket: string; ingested: boolean; chunksCount?: number; error?: string }> = [];

      for (const bucket of buckets) {
        const pdfs = await listIngestPdfs(supabaseAdmin, bucket);
        for (const pdf of pdfs) {
          const { count } = await supabaseAdmin
            .from("syllabus_knowledge")
            .select("*", { count: "exact", head: true })
            .or(`source_file.eq.${pdf.name},source_file.eq.${pdf.path}`);

          if (count && count > 0 && !body.forceReingest) {
            results.push({ file: pdf.name, bucket, ingested: false, chunksCount: count });
            continue;
          }

          try {
            const result = await ingestSingleFile(
              supabaseAdmin,
              pdf.name,
              bucket,
              !!body.forceReingest,
              pdf.path
            );
            results.push({ file: pdf.name, bucket, ingested: true, chunksCount: result.chunksCount });
          } catch (err) {
            results.push({
              file: pdf.name,
              bucket,
              ingested: false,
              error: err instanceof Error ? err.message : "Ingestion failed",
            });
          }
        }
      }

      return jsonOk({
        message: "Batch ingestion complete",
        results,
        ingested: results.filter((r) => r.ingested).length,
        skipped: results.filter((r) => !r.ingested && !r.error).length,
      });
    }

    const fileName = body.sourceFile || "carnatic_music_theory1.pdf";
    const sourceBucket = body.sourceBucket || "syllabus";
    const forceReingest = !!body.forceReingest;
    const sourcePath = body.sourcePath || fileName;

    // 3. Prevent duplicate ingestion if not forced
    const { count, error: countError } = await supabaseAdmin
      .from("syllabus_knowledge")
      .select("*", { count: "exact", head: true })
      .or(`source_file.eq.${fileName},source_file.eq.${sourcePath}`);

    if (countError) {
      console.error("Count check failed:", countError.message);
    }

    if (count !== null && count > 0 && !forceReingest) {
      return jsonOk({
        message: `Syllabus file '${fileName}' is already ingested (${count} chunks found). Set forceReingest: true to overwrite.`,
        chunksCount: count,
        ingested: false,
      });
    }

    const result = await ingestSingleFile(
      supabaseAdmin,
      fileName,
      sourceBucket,
      forceReingest,
      sourcePath
    );

    return jsonOk({
      message: `Successfully ingested syllabus from '${fileName}'.`,
      chunksCount: result.chunksCount,
      ingested: true,
      hasEmbeddings: !!process.env.OPENAI_API_KEY,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "An unexpected error occurred during ingestion.";
    console.error("Ingestion server action exception:", error);
    return jsonServerError(errMsg);
  }
}

type SupabaseAdmin = NonNullable<ReturnType<typeof createAdminClient>>;

const INGEST_BUCKETS = ["syllabus", "Music", "music", "notes", "pdfs"];

async function discoverIngestBuckets(admin: SupabaseAdmin): Promise<string[]> {
  const buckets = new Set<string>(INGEST_BUCKETS);
  const { data } = await admin.storage.listBuckets();
  for (const bucket of data ?? []) {
    buckets.add(bucket.name);
  }
  return [...buckets];
}

async function listIngestPdfs(
  admin: SupabaseAdmin,
  bucket: string,
  prefix = ""
): Promise<Array<{ name: string; path: string }>> {
  const results: Array<{ name: string; path: string }> = [];
  const { data: entries, error } = await admin.storage.from(bucket).list(prefix, { limit: 200 });

  if (error) return results;

  for (const entry of entries ?? []) {
    if (entry.name.startsWith(".")) continue;
    const entryPath = prefix ? `${prefix}${entry.name}` : entry.name;

    if (entry.id === null && !entry.name.toLowerCase().endsWith(".pdf")) {
      results.push(...(await listIngestPdfs(admin, bucket, `${entryPath}/`)));
      continue;
    }

    if (!entry.name.toLowerCase().endsWith(".pdf")) continue;
    results.push({ name: entry.name, path: entryPath });
  }

  return results;
}

async function ingestSingleFile(
  supabaseAdmin: SupabaseAdmin,
  fileName: string,
  bucketName: string,
  forceReingest: boolean,
  storagePath?: string
): Promise<{ chunksCount: number }> {
  const downloadPath = storagePath ?? fileName;

  const { count } = await supabaseAdmin
    .from("syllabus_knowledge")
    .select("*", { count: "exact", head: true })
    .or(`source_file.eq.${fileName},source_file.eq.${downloadPath}`);

  if (count !== null && count > 0 && forceReingest) {
    await supabaseAdmin
      .from("syllabus_knowledge")
      .delete()
      .or(`source_file.eq.${fileName},source_file.eq.${downloadPath}`);
  }

  console.log(`Downloading '${downloadPath}' from bucket '${bucketName}'...`);
  let downloadResult = await supabaseAdmin.storage.from(bucketName).download(downloadPath);

  if (downloadResult.error) {
    downloadResult = await supabaseAdmin.storage
      .from(bucketName)
      .download(`${bucketName}/${downloadPath}`);
  }

  if (downloadResult.error) {
    throw new Error(
      `Failed to retrieve '${downloadPath}' from storage: ${downloadResult.error.message}`
    );
  }

  const pdfBuffer = Buffer.from(await downloadResult.data.arrayBuffer());

  // Polyfill browser APIs that pdfjs-dist checks for but doesn't use in text-only mode
  if (typeof globalThis.DOMMatrix === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).DOMMatrix = class DOMMatrix {
      // Minimal stub so pdfjs-dist loads without throwing
    };
  }

  // Use require-style import to avoid ESM .default issues
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse: (buf: Buffer) => Promise<{ text: string; numpages: number }> =
    (await import("pdf-parse" as string) as any).default ??
    (await import("pdf-parse" as string) as any);
  const pdfData = await pdfParse(pdfBuffer);

  // pdf-parse gives us the full text; split by form-feed chars to approximate pages
  const rawPages = pdfData.text.split(/\f/);
  const pageTexts = rawPages
    .map((text: string, i: number) => ({
      pageNumber: i + 1,
      text: text.trim(),
    }))
    .filter((p: { pageNumber: number; text: string }) => p.text.length > 0);

  const allChunks: Array<{
    title: string;
    section: string;
    content: string;
    page_number: number;
    source_file: string;
    language: string;
  }> = [];

  for (const page of pageTexts) {
    allChunks.push(...chunkPageText(page.text, page.pageNumber, fileName));
  }

  if (allChunks.length === 0) {
    throw new Error("PDF parsing yielded no text or chunks.");
  }

  const batchSize = 10;
  const processedChunks: Array<{
    title: string;
    section: string;
    content: string;
    page_number: number;
    chunk_index: number;
    source_file: string;
    language: string;
    embedding: number[] | null;
  }> = [];

  for (let i = 0; i < allChunks.length; i += batchSize) {
    const batch = allChunks.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (chunk, indexInBatch) => {
        const absoluteIndex = i + indexInBatch;
        let embedding: number[] | null = null;
        if (process.env.OPENAI_API_KEY) {
          embedding = await getEmbedding(chunk.content);
        }
        return {
          title: chunk.title,
          section: chunk.section,
          content: chunk.content,
          page_number: chunk.page_number,
          chunk_index: absoluteIndex,
          source_file: chunk.source_file,
          language: chunk.language,
          embedding,
        };
      })
    );
    processedChunks.push(...batchResults);
  }

  const { error: insertError } = await supabaseAdmin
    .from("syllabus_knowledge")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(processedChunks as any);

  if (insertError) {
    throw new Error(`Database insertion failed: ${insertError.message}`);
  }

  return { chunksCount: processedChunks.length };
}

/**
 * Split text on a page into semantic paragraphs/sentences of ~1000-1500 chars with ~200 chars overlap
 */
function chunkPageText(pageText: string, pageNumber: number, sourceFile: string) {
  // Normalize whitespace
  const text = pageText.replace(/\s+/g, " ").trim();
  if (!text) return [];

  // Split into sentences using punctuation + whitespace
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text];

  const chunks: Array<{
    title: string;
    section: string;
    content: string;
    page_number: number;
    source_file: string;
    language: string;
  }> = [];

  let currentChunkText = "";
  let sentencesInChunk: string[] = [];

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;

    if (currentChunkText.length + sentence.length > 1200 && currentChunkText.length > 0) {
      chunks.push({
        title: detectHeading(currentChunkText) || `Syllabus Page ${pageNumber}`,
        section: "Music Theory",
        content: currentChunkText,
        page_number: pageNumber,
        source_file: sourceFile,
        language: "English",
      });

      // Implement overlap: start the next chunk with the last 2 sentences
      const overlapSentences = sentencesInChunk.slice(-2);
      currentChunkText = overlapSentences.join(" ");
      sentencesInChunk = [...overlapSentences];
    }

    currentChunkText = currentChunkText ? `${currentChunkText} ${sentence}` : sentence;
    sentencesInChunk.push(sentence);
  }

  // Add remaining text
  if (currentChunkText.trim()) {
    chunks.push({
      title: detectHeading(currentChunkText) || `Syllabus Page ${pageNumber}`,
      section: "Music Theory",
      content: currentChunkText,
      page_number: pageNumber,
      source_file: sourceFile,
      language: "English",
    });
  }

  return chunks;
}

/**
 * Attempt to detect a syllabus topic heading at the start of a chunk
 */
function detectHeading(chunkText: string): string | null {
  const firstLine = chunkText.split(/[.!?]/)[0].trim();
  if (firstLine.length > 0 && firstLine.length < 80) {
    const hasKeyTerms = /raga|tala|composer|sruti|swara|melakarta|laya|nada|theory|syllabus|gita|varnam|kriti/i.test(firstLine);
    const words = firstLine.split(" ");
    const isMostlyCaps = firstLine === firstLine.toUpperCase() || 
      (words.filter(w => w[0] === w[0]?.toUpperCase()).length / words.length) > 0.7;
    
    if (hasKeyTerms || isMostlyCaps) {
      return firstLine;
    }
  }
  return null;
}
