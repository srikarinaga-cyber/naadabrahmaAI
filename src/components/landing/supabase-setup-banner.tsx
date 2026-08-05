import { AlertCircle } from "lucide-react";

export function SupabaseSetupBanner() {
  return (
    <div className="border-b border-marigold/30 bg-marigold/10 px-6 py-3">
      <div className="mx-auto flex max-w-7xl items-center gap-3 text-sm">
        <AlertCircle className="size-4 shrink-0 text-marigold" aria-hidden />
        <p className="text-foreground/80">
          <span className="font-semibold">Supabase not configured.</span> Copy{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.env.example</code>{" "}
          to <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.env.local</code>{" "}
          and run migrations to load landing page content from the database.
        </p>
      </div>
    </div>
  );
}
