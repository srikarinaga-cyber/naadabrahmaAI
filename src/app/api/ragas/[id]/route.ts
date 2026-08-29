import { NextRequest } from "next/server";
import { jsonOk, jsonNotFound, jsonServerError } from "@/lib/api/response";
import { getMelakartaByNumber, getJanyaById } from "@/lib/db/catalog";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const asNumber = parseInt(id, 10);
    if (!isNaN(asNumber) && asNumber >= 1 && asNumber <= 72) {
      const data = await getMelakartaByNumber(asNumber);
      if (!data) return jsonNotFound("Melakarta not found");
      return jsonOk(data);
    }

    const janya = await getJanyaById(id);
    if (!janya) return jsonNotFound("Raga not found");
    return jsonOk(janya);
  } catch {
    return jsonServerError();
  }
}
