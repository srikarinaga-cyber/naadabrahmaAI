import { NextRequest } from "next/server";
import { jsonOk, jsonServerError } from "@/lib/api/response";
import { getKritis } from "@/lib/db/catalog";

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10);
    const { data, total } = await getKritis(page);
    return jsonOk({ items: data, total, page });
  } catch {
    return jsonServerError();
  }
}
