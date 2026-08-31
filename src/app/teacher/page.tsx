export const dynamic = "force-dynamic";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function TeacherPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />
      <main className="mx-auto max-w-6xl w-full px-6 py-12">
        <div className="mb-8">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-3 py-1 px-3">
            <Users className="mr-1.5 size-3.5" />
            Carnatic Music Academy • Guru Workspace
          </Badge>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-kumkum">
            Teacher Portal & Guru Command Center
          </h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-3xl leading-relaxed">
            Manage your Carnatic vocal and instrumental batches, assign pitch & rhythm exercises, evaluate student performance, and generate AI-assisted lesson plans.
          </p>
        </div>

        <TeacherDashboard />
      </main>
      <Footer />
    </div>
  );
}
