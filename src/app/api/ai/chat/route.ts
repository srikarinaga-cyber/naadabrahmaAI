import { NextRequest } from "next/server";
import {
  jsonOk,
  jsonError,
  jsonServerError,
} from "@/lib/api/response";
import { getSessionUser } from "@/lib/api/auth";
import {
  buildMusicContext,
  buildSystemPrompt,
  callOpenAI,
} from "@/lib/ai/context";
import type { Instrument } from "@/lib/ai/instruments";
import { updateStudyStreak } from "@/lib/db/progress";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();

    const body = await request.json();
    const message = body.message as string;
    const ragaId = body.ragaId as string | undefined;
    const instrument = body.instrument as Instrument | undefined;
    const language = (body.language as "te" | "en") ?? "en";

    if (!message?.trim()) {
      return jsonError("Message is required");
    }

    const context = await buildMusicContext({ query: message, ragaId });
    const systemPrompt = buildSystemPrompt({ context, instrument, language });
    const response = await callOpenAI({ systemPrompt, message });

    if (user) {
      await updateStudyStreak(user.id);
    }

    return jsonOk(response);
  } catch {
    return jsonServerError();
  }
}
