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
} from "@/lib/ai/context";
import type { Instrument } from "@/lib/ai/instruments";
import { updateStudyStreak } from "@/lib/db/progress";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const rawApiKey = process.env["GEMINI_API_KEY"];
    const apiKey = rawApiKey ? rawApiKey.trim().replace(/^['"=\s]+|['"\s]+$/g, '') : null;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" });
    }
    const res = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const json = await res.json();
    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

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
  } catch (error) {
    console.error("AI CHAT ROUTE ERROR:", error);
    return jsonServerError();
  }
}
