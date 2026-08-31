export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import {
  jsonOk,
  jsonError,
  jsonUnauthorized,
  jsonServerError,
} from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";
import { searchSyllabus } from "@/lib/ai/syllabus";
import { callOpenAI } from "@/lib/ai/context";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const body = await request.json();
    const topic = (body.topic as string)?.trim();
    const save = body.save !== false;

    if (!topic) {
      return jsonError("topic is required");
    }

    const chunks = await searchSyllabus(topic, 8);
    if (chunks.length === 0) {
      return jsonError(
        "No syllabus content found for this topic. Run PDF ingestion from Supabase storage first.",
        404
      );
    }

    const contextText = chunks
      .map(
        (c) =>
          `[Page ${c.page_number}] ${c.title ?? c.section ?? "Section"}:\n${c.content}`
      )
      .join("\n\n---\n\n");

    const systemPrompt = `You are Naadabrahma AI's Notes Generator for Carnatic music students.
Generate clear, structured study notes ONLY from the OFFICIAL SYLLABUS CONTEXT below.
Use markdown headings (##, ###), bullet points, and bold for key terms.
If the syllabus lacks information, say so clearly — do not invent facts.
Include page references where relevant.

OFFICIAL SYLLABUS CONTEXT:
${contextText}`;

    const response = await callOpenAI({
      systemPrompt,
      message: `Generate comprehensive study notes on: ${topic}`,
    });

    const noteContent = response.answer;
    const title = `Notes: ${topic}`;

    let savedNote = null;
    if (save) {
      const supabase = await createClient();
      if (supabase) {
        const { data } = await supabase
          .from("ai_notes")
          .insert({
            user_id: user.id,
            title,
            content: noteContent,
          })
          .select()
          .single();
        savedNote = data;
      }
    }

    return jsonOk({
      title,
      content: noteContent,
      sourceChunks: chunks.length,
      savedNote,
    });
  } catch (error) {
    console.error("[syllabus/generate]", error);
    return jsonServerError("Failed to generate notes");
  }
}
