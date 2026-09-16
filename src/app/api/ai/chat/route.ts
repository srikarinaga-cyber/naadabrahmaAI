export const dynamic = "force-dynamic";

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
  generateFallbackStudyNotes,
  type SupportedLanguage,
} from "@/lib/ai/context";
import type { Instrument } from "@/lib/ai/instruments";
import { updateStudyStreak } from "@/lib/db/progress";

export async function POST(request: NextRequest) {
  let userMessage = "Carnatic Music Theory";
  let userLanguage: SupportedLanguage = "en";

  try {
    const user = await getSessionUser();

    const body = await request.json();
    const message = body.message as string;
    const ragaId = body.ragaId as string | undefined;
    const instrument = body.instrument as Instrument | undefined;
    const language = (body.language as SupportedLanguage) ?? "en";

    userMessage = message || userMessage;
    userLanguage = language;

    if (!message?.trim()) {
      return jsonError("Message is required");
    }

    const context = await buildMusicContext({ query: message, ragaId });
    const systemPrompt = buildSystemPrompt({ context, instrument, language });
    const response = await callOpenAI({ systemPrompt, message, language });

    if (user) {
      await updateStudyStreak(user.id);
    }

    return jsonOk(response);
  } catch (error) {
    console.error("AI CHAT ROUTE ERROR:", error);
    const fallbackResponse = generateFallbackStudyNotes(userMessage, userLanguage);
    return jsonOk(fallbackResponse);
  }
}
