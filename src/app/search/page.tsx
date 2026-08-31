"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SearchResults {
  melakartas: Array<{ id: string; number: number; name: string }>;
  janyas: Array<{ id: string; name: string }>;
  composers: Array<{ id: string; name: string }>;
  talas: Array<{ id: string; name: string }>;
  kritis: Array<{ id: string; title: string }>;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const json = await res.json();
      setResults(json.data ?? null);
    } finally {
      setLoading(false);
    }
  }

  const totalResults = results
    ? results.melakartas.length +
      results.janyas.length +
      results.composers.length +
      results.talas.length +
      results.kritis.length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8 text-center">
          <Badge variant="outline" className="border-kumkum/20 text-kumkum mb-4">
            Global Search
          </Badge>
          <h1 className="font-serif text-3xl font-bold text-kumkum">Search Carnatic Music</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Find ragas, talas, composers, and kritis across the Knowledge Hub.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ragas, talas, composers, kritis..."
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kumkum/30"
          />
          <Button type="submit" disabled={loading} className="bg-kumkum hover:bg-kumkum-light shrink-0">
            <Search className="size-4" />
          </Button>
        </form>

        {results && (
          <div className="space-y-6">
            <p className="text-xs text-muted-foreground">{totalResults} results for &quot;{query}&quot;</p>

            {results.melakartas.length > 0 && (
              <ResultGroup title="Melakarta Ragas">
                {results.melakartas.map((m) => (
                  <Link
                    key={m.id}
                    href={`/knowledge-hub/melakarta/${m.number}`}
                    className="block rounded-lg border border-border bg-card px-4 py-3 text-sm hover:border-kumkum/30 transition-colors"
                  >
                    <span className="text-kumkum font-semibold">#{m.number}</span> {m.name}
                  </Link>
                ))}
              </ResultGroup>
            )}

            {results.composers.length > 0 && (
              <ResultGroup title="Composers">
                {results.composers.map((c) => (
                  <Link
                    key={c.id}
                    href="/knowledge-hub/composers"
                    className="block rounded-lg border border-border bg-card px-4 py-3 text-sm hover:border-kumkum/30"
                  >
                    {c.name}
                  </Link>
                ))}
              </ResultGroup>
            )}

            {results.talas.length > 0 && (
              <ResultGroup title="Talas">
                {results.talas.map((t) => (
                  <Link
                    key={t.id}
                    href="/knowledge-hub/talas"
                    className="block rounded-lg border border-border bg-card px-4 py-3 text-sm hover:border-kumkum/30"
                  >
                    {t.name}
                  </Link>
                ))}
              </ResultGroup>
            )}

            {results.janyas.length > 0 && (
              <ResultGroup title="Janya Ragas">
                {results.janyas.map((j) => (
                  <div key={j.id} className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
                    {j.name}
                  </div>
                ))}
              </ResultGroup>
            )}

            {results.kritis.length > 0 && (
              <ResultGroup title="Kritis">
                {results.kritis.map((k) => (
                  <div key={k.id} className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
                    {k.title}
                  </div>
                ))}
              </ResultGroup>
            )}

            {totalResults === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No results found.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-sm font-bold text-kumkum mb-2">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
