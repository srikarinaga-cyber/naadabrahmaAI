import { NextRequest } from "next/server";
import { jsonOk, jsonError, jsonNotFound, jsonServerError } from "@/lib/api/response";
import { getMelakartas, getMelakartaByNumber, getJanyaById } from "@/lib/db/catalog";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type") ?? "melakarta";
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const number = searchParams.get("number");
    const id = searchParams.get("id");

    if (type === "melakarta" && number) {
      const data = await getMelakartaByNumber(parseInt(number, 10));
      if (!data) return jsonNotFound("Melakarta not found");
      return jsonOk(data);
    }

    if (type === "janya" && id) {
      const data = await getJanyaById(id);
      if (!data) return jsonNotFound("Janya raga not found");
      return jsonOk(data);
    }

    if (type === "melakarta") {
      const { data, total } = await getMelakartas(page);
      return jsonOk({ items: data, total, page });
    }

    return jsonError("Invalid type parameter. Use type=melakarta or type=janya");
  } catch {
    return jsonServerError();
  }
}
