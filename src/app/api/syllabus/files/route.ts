export const dynamic = "force-dynamic";

import { jsonOk, jsonServerError } from "@/lib/api/response";
import { createAdminClient } from "@/lib/supabase/admin";
import { listSyllabusFiles } from "@/lib/data/syllabus-files";

export async function GET() {
  try {
    const adminConfigured = Boolean(createAdminClient());
    const files = await listSyllabusFiles();
    return jsonOk({ files, adminConfigured });
  } catch (error) {
    console.error("[syllabus/files]", error);
    return jsonServerError("Failed to list syllabus files");
  }
}
