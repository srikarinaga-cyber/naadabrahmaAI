import { jsonOk, jsonServerError } from "@/lib/api/response";
import { getTalas } from "@/lib/db/catalog";

export async function GET() {
  try {
    const talas = await getTalas();
    return jsonOk(talas);
  } catch {
    return jsonServerError();
  }
}
