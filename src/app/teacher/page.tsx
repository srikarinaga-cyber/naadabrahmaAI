import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

export default function TeacherStubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="glass-panel traditional-glow rounded-3xl border border-swara-gold/15 p-10 md:p-12">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-kumkum/10 ring-1 ring-swara-gold/30">
            <Users className="size-8 text-kumkum" />
          </div>
          
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4">
            Module Preview
          </Badge>
          
          <h1 className="font-serif text-3xl font-bold text-kumkum mb-4">
            Teacher Portal
          </h1>
          
          <p className="text-muted-foreground leading-relaxed mb-8">
            The Teacher Portal is under development. Soon, gurus will be able to manage students, distribute assignments, evaluate pitch practice sessions, and track class progress in a single unified dashboard.
          </p>

          <Button
            size="sm"
            className="bg-kumkum hover:bg-kumkum-light"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <ArrowLeft className="mr-2 size-4" /> Go back to Home
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
