import { NextRequest } from "next/server";
import {
  jsonOk,
  jsonError,
  jsonUnauthorized,
  jsonServerError,
} from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";
import { createClient } from "@/lib/supabase/server";
import { mapNote } from "@/lib/mappers";

// In-memory notes fallback store for active sessions when database is offline
const MEMORY_NOTES_STORE: Array<{
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}> = [
  {
    id: "n-default-1",
    user_id: "demo-user-session",
    title: "Mohanam vs Hamsadhwani Analysis",
    content: "Mohanam uses S R2 G3 P D2 S (Chatusruti Dhaivata) while Hamsadhwani uses S R2 G3 P N3 S (Kakali Nishada).",
    created_at: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    try {
      const supabase = await createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("ai_notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          return jsonOk(data.map(mapNote));
        }
      }
    } catch (e) {
      console.warn("Supabase notes fetch warning:", e);
    }

    // Return in-memory notes for active user session
    const userNotes = MEMORY_NOTES_STORE.filter((n) => n.user_id === user.id || user.id === "demo-user-session");
    return jsonOk(userNotes.map(mapNote));
  } catch {
    return jsonServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const body = await request.json();
    if (!body.title || !body.content) {
      return jsonError("title and content are required");
    }

    try {
      const supabase = await createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("ai_notes")
          .insert({
            user_id: user.id,
            title: body.title,
            content: body.content,
            source_raga_id: body.sourceRagaId ?? null,
            source_kriti_id: body.sourceKritiId ?? null,
          })
          .select()
          .single();

        if (!error && data) {
          return jsonOk(mapNote(data as Record<string, unknown>));
        }
      }
    } catch (e) {
      console.warn("Supabase notes insert warning:", e);
    }

    // Fallback save note to session store
    const newNote = {
      id: `note-${Date.now()}`,
      user_id: user.id,
      title: body.title,
      content: body.content,
      created_at: new Date().toISOString(),
    };
    MEMORY_NOTES_STORE.unshift(newNote);

    return jsonOk(mapNote(newNote as Record<string, unknown>));
  } catch {
    return jsonServerError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return jsonUnauthorized();

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return jsonError("Note id is required");

    try {
      const supabase = await createClient();
      if (supabase) {
        await supabase.from("ai_notes").delete().eq("id", id).eq("user_id", user.id);
      }
    } catch (e) {
      console.warn("Supabase notes delete warning:", e);
    }

    const index = MEMORY_NOTES_STORE.findIndex((n) => n.id === id);
    if (index !== -1) {
      MEMORY_NOTES_STORE.splice(index, 1);
    }

    return jsonOk({ deleted: true });
  } catch {
    return jsonServerError();
  }
}
