export const dynamic = "force-dynamic";

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
      <AiGuruChat requireAuth />
    </div>
  );
}
