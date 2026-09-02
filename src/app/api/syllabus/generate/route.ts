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
    const explicitContent = (body.content as string)?.trim();
    const language = (body.language as string) || "en";
    const save = body.save !== false;

    if (!topic && !explicitContent) {
      return jsonError("topic or content is required");
    }

    const targetTopic = topic || (explicitContent ? explicitContent.slice(0, 50) + "..." : "Carnatic Music Theory");

    let contextText = explicitContent || "";
    let chunksCount = 0;

    if (!contextText) {
      let chunks: SyllabusChunkItem[] = [];
      try {
        chunks = await searchSyllabus(targetTopic, 8);
        chunksCount = chunks.length;
      } catch (e) {
        console.warn("Syllabus search warning:", e);
      }

      contextText = chunks.length > 0
        ? chunks
            .map(
              (c) =>
                `[Page ${c.page_number}] ${c.title ?? c.section ?? "Section"}:\n${c.content}`
            )
            .join("\n\n---\n\n")
        : `Carnatic Music Syllabus Knowledge Base Topic: ${targetTopic}`;
    } else {
      chunksCount = 1;
    }

    let languageInstruction = "Respond in clear English.";
    if (language === "te") {
      languageInstruction = "LANGUAGE REQUIREMENT: Respond fluently in TELUGU script (తెలుగు) with standard Carnatic music terms.";
    } else if (language === "hi") {
      languageInstruction = "LANGUAGE REQUIREMENT: Respond fluently in HINDI script (हिन्दी) with standard Carnatic music terms.";
    } else if (language === "ta") {
      languageInstruction = "LANGUAGE REQUIREMENT: Respond fluently in TAMIL script (தமிழ்) with standard Carnatic music terms.";
    } else if (language === "kn") {
      languageInstruction = "LANGUAGE REQUIREMENT: Respond fluently in KANNADA script (ಕನ್ನಡ) with standard Carnatic music terms.";
    } else if (language === "ml") {
      languageInstruction = "LANGUAGE REQUIREMENT: Respond fluently in MALAYALAM script (മലയാളം) with standard Carnatic music terms.";
    }

    const systemPrompt = `You are Naadabrahma AI's Notes Generator for Carnatic music students.
Generate clear, structured, exam-ready study notes specifically for the requested SYLLABUS TOPIC and EXACT CONTEXT TEXT provided.
${languageInstruction}
Do NOT substitute with unrelated topics. Focus 100% on the exact concept, definitions, swaras, talas, or syllabus rules described in the context text.
Structure the notes into:
1. Topic Overview & Definitions
2. Key Musicological & Theoretical Rules
3. Practical Application & Exam Highlights`;

    const response = await callOpenAI({
      systemPrompt,
      message: `TOPIC: ${targetTopic}\n\nEXACT SYLLABUS TEXT CONTEXT:\n${contextText}`,
      language,
    });

    const noteContent = response.answer;
    const title = `Notes: ${targetTopic}`;

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
      sourceChunks: chunksCount,
      savedNote,
    });
  } catch (error) {
    console.error("[syllabus/generate]", error);
    return jsonServerError("Failed to generate notes");
  }
}
