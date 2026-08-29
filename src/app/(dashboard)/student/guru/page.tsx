export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { AiGuruChat } from "@/components/ai-guru/chat-panel";

export default function StudentGuruPage() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-serif text-lg font-bold text-[#800020]">AI Guru Chat</h4>
        <p className="text-xs text-gray-500 mt-1">
          Ask doubts, compare ragas, get practice tips — powered by our music database.
        </p>
      </div>
      <Suspense fallback={<div className="text-sm text-gray-400 py-6">Loading AI Guru...</div>}>
        <AiGuruChat requireAuth />
      </Suspense>
    </div>
  );
}
