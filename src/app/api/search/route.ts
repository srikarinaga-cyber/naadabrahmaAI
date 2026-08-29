import { NextRequest } from "next/server";
import { jsonOk, jsonServerError } from "@/lib/api/response";
import { searchMusicCatalog } from "@/lib/db/catalog";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") ?? "";
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "20", 10);

    if (!q.trim()) {
      return jsonOk({
        melakartas: [],
        janyas: [],
        composers: [],
        talas: [],
        kritis: [],
      });
    }

    const results = await searchMusicCatalog(q, limit);
    return jsonOk(results);
  } catch {
    return jsonServerError();
  }
}
