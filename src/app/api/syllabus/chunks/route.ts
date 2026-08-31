export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { jsonOk, jsonError, jsonServerError } from "@/lib/api/response";
import { getSyllabusChunks } from "@/lib/data/syllabus-files";

export async function GET(request: NextRequest) {
  try {
    const sourceFile = request.nextUrl.searchParams.get("sourceFile");
    if (!sourceFile) {
      return jsonError("sourceFile query parameter is required");
    }

    const pageParam = request.nextUrl.searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : undefined;

    const chunks = await getSyllabusChunks(sourceFile, page);
    return jsonOk({ chunks, sourceFile });
  } catch (error) {
    console.error("[syllabus/chunks]", error);
    return jsonServerError("Failed to load syllabus content");
  }
}
