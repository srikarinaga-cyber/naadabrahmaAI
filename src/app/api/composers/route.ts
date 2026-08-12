import { jsonOk, jsonServerError } from "@/lib/api/response";
import { getComposers } from "@/lib/db/catalog";

export async function GET() {
  try {
    const composers = await getComposers();
    return jsonOk(composers);
  } catch {
    return jsonServerError();
  }
}
