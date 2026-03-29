import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Authors",
  description:
    "Meet the authors and contributors behind the published articles on Hasan Ehsan Cloud.",
  path: "/authors",
  keywords: ["authors", "contributors", "Hasan Ehsan", "blog authors"],
});

export default async function AuthorsPage() {
  const authors = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "AUTHOR"] } },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <div className="prompt">$ finger --all users</div>
      <h1 style={{ marginBottom: "2rem" }}>AUTHORS</h1>

      <div className="content-grid">
        {authors.map((author) => (
          <div key={author.id} className="card">
            <div style={{ color: "var(--accent-color)", marginBottom: "0.5rem" }}>$ whois {author.name?.toLowerCase().replace(/ /g, "_")}</div>
            <h3 style={{ margin: "0.5rem 0" }}>{author.name}</h3>
            <p style={{ fontSize: "0.9rem", color: "#8b949e" }}>{author.bio || "System intelligence providing deep insights."}</p>
            <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--command-color)" }}>
              {author._count.articles} articles published
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
