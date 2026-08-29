export const dynamic = "force-dynamic";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AiGuruChat } from "@/components/ai-guru/chat-panel";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";

export default function AiGuruPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8 text-center">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4">
            <Bot className="mr-1 size-3" />
            AI Guru
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-kumkum">Chat with AI Guru</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Ask Carnatic music questions.{" "}
            <Link href="/login" className="text-kumkum font-semibold hover:underline">
              Sign in
            </Link>{" "}
            for full access and note saving.
          </p>
        </div>
        <AiGuruChat />
      </main>
      <Footer />
    </div>
  );
}
