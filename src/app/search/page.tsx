"use client";

import { useState } from "react";
import Link from "next/link";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  category: {
    name: string;
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setSearching(true);
    try {
      // In a real app, I'd have a search API. For now, I'll fetch all and filter or just mock.
      // But since I have the Prisma client, I should use a server action or API route.
      // Let's create a simple API route for search.
      const res = await fetch(`/api/articles?search=${query}`);
      const data = await res.json();
      setResults(data.articles || []);
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <div className="prompt">$ find / -name &quot;{query || "*"}&quot;</div>
      <h1 style={{ marginBottom: "2rem" }}>SEARCH</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search term..."
          style={{
            flex: 1,
            padding: "0.8rem",
            background: "#000",
            border: "1px solid var(--card-border)",
            borderRadius: "12px",
            color: "var(--foreground)",
            fontFamily: "var(--font-mono)",
            outline: "none",
          }}
        />
        <button
          type="submit"
          className="search-button"
          style={{
            background: "var(--accent)",
            color: "white",
            padding: "0.8rem 2rem",
            border: "none",
            borderRadius: "12px",
            fontFamily: "var(--font-mono)",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          $ search
        </button>
      </form>

      <div>
        {searching ? (
          <p className="blinking-cursor"></p>
        ) : results.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {results.map((article) => (
              <div key={article.id} className="card">
                <h3 style={{ margin: "0" }}>
                  <Link href={`/blogs/${article.slug}`}>{article.title}</Link>
                </h3>
                <p style={{ fontSize: "0.8rem", color: "#8b949e", marginTop: "0.5rem" }}>
                  Category: {article.category.name} | Date: {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : query ? (
          <p style={{ color: "#8b949e" }}>[SYSTEM] No results found for &quot;{query}&quot;. Try another query.</p>
        ) : null}
      </div>
    </div>
  );
}
