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
    let body: { sourceFile?: string; forceReingest?: boolean } = {};
    try {
      body = await request.json();
    } catch {
      // Accept empty body
    }

    const fileName = body.sourceFile || "carnatic_music_theory1.pdf";
    const forceReingest = !!body.forceReingest;

    const supabaseAdmin = createAdminClient();
    if (!supabaseAdmin) {
      return jsonServerError("Admin Supabase client is not configured.");
    }

    // 3. Prevent duplicate ingestion if not forced
    const { count, error: countError } = await supabaseAdmin
      .from("syllabus_knowledge")
      .select("*", { count: "exact", head: true })
      .eq("source_file", fileName);

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

    // 4. Download file from Supabase Storage bucket 'syllabus'
    const bucketName = "syllabus";
    console.log(`Downloading '${fileName}' from Supabase Storage bucket '${bucketName}'...`);
    
    let downloadResult = await supabaseAdmin.storage.from(bucketName).download(fileName);
    
    // Fallback: If it failed, try with 'syllabus/' prefix path
    if (downloadResult.error) {
      console.warn(`Could not download ${fileName} directly: ${downloadResult.error.message}. Trying syllabus/${fileName} path...`);
      downloadResult = await supabaseAdmin.storage.from(bucketName).download(`syllabus/${fileName}`);
    }

    if (downloadResult.error) {
      console.error("Storage download failed:", downloadResult.error);
      return jsonError(`Failed to retrieve '${fileName}' from storage: ${downloadResult.error.message}`, 404);
    }

    const pdfBuffer = Buffer.from(await downloadResult.data.arrayBuffer());
    console.log(`Successfully downloaded PDF buffer. Size: ${pdfBuffer.length} bytes.`);

    // 5. Parse PDF page-by-page
    console.log("Parsing PDF file...");
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: pdfBuffer });
    const textResult = await parser.getText();

    const pageTexts = textResult.pages.map((p) => ({
      pageNumber: p.num,
      text: p.text,
    }));
    console.log(`Parsed PDF. Total pages extracted: ${pageTexts.length}`);

    // 6. Chunk each page into logically sized segments
    const allChunks: Array<{
      title: string;
      section: string;
      content: string;
      page_number: number;
      source_file: string;
      language: string;
    }> = [];

    for (const page of pageTexts) {
      const pageChunks = chunkPageText(page.text, page.pageNumber, fileName);
      allChunks.push(...pageChunks);
    }

    console.log(`Generated ${allChunks.length} content chunks from PDF.`);

    if (allChunks.length === 0) {
      return jsonError("PDF parsing yielded no text or chunks.");
    }

    // 7. Clear existing records for this file if re-ingesting
    if (count !== null && count > 0 && forceReingest) {
      console.log(`Clearing old chunks for '${fileName}'...`);
      const { error: deleteError } = await supabaseAdmin
        .from("syllabus_knowledge")
        .delete()
        .eq("source_file", fileName);

      if (deleteError) {
        return jsonServerError(`Failed to clean up old syllabus knowledge: ${deleteError.message}`);
      }
    }

    // 8. Generate embeddings and save to database
    console.log("Generating embeddings and saving to Supabase...");
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
      const promises = batch.map(async (chunk, indexInBatch) => {
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
      });

      const batchResults = await Promise.all(promises);
      processedChunks.push(...batchResults);
    }

    // Insert into table
    const { error: insertError } = await supabaseAdmin
      .from("syllabus_knowledge")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(processedChunks as any);

    if (insertError) {
      console.error("Database insertion failed:", insertError.message);
      return jsonServerError(`Database insertion failed: ${insertError.message}`);
    }

    return jsonOk({
      message: `Successfully ingested syllabus from '${fileName}'.`,
      chunksCount: processedChunks.length,
      ingested: true,
      hasEmbeddings: !!process.env.OPENAI_API_KEY,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "An unexpected error occurred during ingestion.";
    console.error("Ingestion server action exception:", error);
    return jsonServerError(errMsg);
  }
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
