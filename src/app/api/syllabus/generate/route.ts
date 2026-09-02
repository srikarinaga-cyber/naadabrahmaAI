export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import {
  jsonOk,
  jsonError,
  jsonServerError,
} from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";
import { searchSyllabus } from "@/lib/ai/syllabus";
import { callOpenAI } from "@/lib/ai/context";
import { createClient } from "@/lib/supabase/server";

interface SyllabusChunkItem {
  page_number: number;
  title: string | null;
  section: string | null;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const topic = (body.topic as string)?.trim();
    const save = body.save !== false;

    if (!topic) {
      return jsonError("topic is required");
    }

    let chunks: SyllabusChunkItem[] = [];
    try {
      chunks = await searchSyllabus(topic, 8);
    } catch (e) {
      console.warn("Syllabus search warning:", e);
    }

    const contextText = chunks.length > 0
      ? chunks
          .map(
            (c) =>
              `[Page ${c.page_number}] ${c.title ?? c.section ?? "Section"}:\n${c.content}`
          )
          .join("\n\n---\n\n")
      : `Carnatic Music Syllabus Knowledge Base Topic: ${topic}`;

    const systemPrompt = `You are Naadabrahma AI's Notes Generator for Carnatic music students.
Generate clear, structured, exam-ready study notes for Carnatic music students on the given topic.
Use markdown headings (##, ###), bullet points, and bold for key terms.
Structure the notes into:
1. Overview & Theoretical Definition
2. Key Swarasthana & Musicological Rules
3. Practical Application & Exam Highlights
4. Classical Compositions & Practice Guidance`;

    const response = await callOpenAI({
      systemPrompt,
      message: `Generate comprehensive study notes on: ${topic}\n\nContext: ${contextText}`,
    });

    const noteContent = response.answer;
    const title = `Notes: ${topic}`;

    let savedNote = null;
    if (save) {
      try {
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
      } catch (e) {
        console.warn("Supabase note insert warning:", e);
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
