import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AuthorsPage() {
  const authors = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "AUTHOR"] } },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <div className="prompt">$ finger --all users</div>
      <h1 style={{ marginBottom: "2rem" }}>AUTHORS</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
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
