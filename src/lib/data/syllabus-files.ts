import { createAdminClient } from "@/lib/supabase/admin";

export interface SyllabusFileInfo {
  name: string;
  bucket: string;
  path: string;
  size: number | null;
  chunkCount: number;
  ingested: boolean;
  signedUrl: string | null;
}

const PREFERRED_BUCKETS = ["syllabus", "Music", "music", "notes", "pdfs"] as const;

async function listPdfsInBucket(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
  bucket: string,
  prefix = ""
): Promise<Array<{ name: string; path: string; size: number | null }>> {
  const results: Array<{ name: string; path: string; size: number | null }> = [];

  const { data: entries, error } = await admin.storage.from(bucket).list(prefix, {
    limit: 200,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    console.warn(`[syllabus] list failed for ${bucket}/${prefix}:`, error.message);
    return results;
  }

  for (const entry of entries ?? []) {
    if (entry.name.startsWith(".")) continue;

    const entryPath = prefix ? `${prefix}${entry.name}` : entry.name;

    // Supabase folders typically have null id
    if (entry.id === null && !entry.name.toLowerCase().endsWith(".pdf")) {
      const nested = await listPdfsInBucket(
        admin,
        bucket,
        `${entryPath}/`
      );
      results.push(...nested);
      continue;
    }

    if (!entry.name.toLowerCase().endsWith(".pdf")) continue;

    results.push({
      name: entry.name,
      path: entryPath,
      size: entry.metadata?.size ?? null,
    });
  }

  return results;
}

async function discoverPdfBuckets(
  admin: NonNullable<ReturnType<typeof createAdminClient>>
): Promise<string[]> {
  const discovered = new Set<string>(PREFERRED_BUCKETS);

  const { data: buckets } = await admin.storage.listBuckets();
  for (const bucket of buckets ?? []) {
    discovered.add(bucket.name);
  }

  return [...discovered];
}

export async function listSyllabusFiles(): Promise<SyllabusFileInfo[]> {
  const admin = createAdminClient();
  if (!admin) {
    // Return static mock files when Supabase is not configured
    return [
      {
        name: "carnatic_music_theory1.pdf",
        bucket: "static",
        path: "carnatic_music_theory1.pdf",
        size: null,
        chunkCount: 12,
        ingested: true,
        signedUrl: null,
      },
      {
        name: "diploma_syllabus.pdf",
        bucket: "static",
        path: "diploma_syllabus.pdf",
        size: null,
        chunkCount: 8,
        ingested: true,
        signedUrl: null,
      },
      {
        name: "grade_exam_portions.pdf",
        bucket: "static",
        path: "grade_exam_portions.pdf",
        size: null,
        chunkCount: 5,
        ingested: true,
        signedUrl: null,
      }
    ];
  }

  const ingestedCounts = new Map<string, number>();

  const { data: chunkRows } = await admin
    .from("syllabus_knowledge")
    .select("source_file");

  for (const row of chunkRows ?? []) {
    const key = row.source_file as string;
    ingestedCounts.set(key, (ingestedCounts.get(key) ?? 0) + 1);
  }

  const files: SyllabusFileInfo[] = [];
  const seen = new Set<string>();
  const buckets = await discoverPdfBuckets(admin);

  for (const bucket of buckets) {
    const pdfs = await listPdfsInBucket(admin, bucket);

    for (const pdf of pdfs) {
      const dedupeKey = `${bucket}:${pdf.path}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      const { data: signed } = await admin.storage
        .from(bucket)
        .createSignedUrl(pdf.path, 3600);

      const chunkCount = ingestedCounts.get(pdf.name) ?? ingestedCounts.get(pdf.path) ?? 0;

      files.push({
        name: pdf.name,
        bucket,
        path: pdf.path,
        size: pdf.size,
        chunkCount,
        ingested: chunkCount > 0,
        signedUrl: signed?.signedUrl ?? null,
      });
    }
  }

  // Include files that exist in the database table but are not in Supabase Storage
  for (const [fileName, chunkCount] of ingestedCounts.entries()) {
    const alreadySeen = files.some(
      (f) => f.name === fileName || f.path === fileName
    );
    if (alreadySeen) continue;

    files.push({
      name: fileName,
      bucket: "database",
      path: fileName,
      size: null,
      chunkCount,
      ingested: true,
      signedUrl: null,
    });
  }

  return files.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getSyllabusChunks(sourceFile: string, page?: number) {
  const admin = createAdminClient();
  if (!admin) return [];

  let query = admin
    .from("syllabus_knowledge")
    .select("id, title, section, content, source_file, page_number, chunk_index, language")
    .in("source_file", [
      sourceFile,
      sourceFile.split("/").pop() ?? sourceFile,
    ])
    .order("page_number", { ascending: true })
    .order("chunk_index", { ascending: true });

  if (page !== undefined) {
    query = query.eq("page_number", page);
  }

  const { data, error } = await query.limit(200);
  if (error) {
    console.error("[syllabus] chunk fetch failed:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getIngestedSourceFiles(): Promise<string[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data } = await admin.from("syllabus_knowledge").select("source_file");
  const unique = new Set((data ?? []).map((r) => r.source_file as string));
  return [...unique];
}
