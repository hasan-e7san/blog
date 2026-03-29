import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface CategoryDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({ params }: CategoryDetailProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { articles: { where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, include: { author: true } } },
  });

  if (!category) {
    notFound();
  }

  return (
    <div>
      <div className="prompt">$ ls -l /var/www/html/categories/{slug}</div>
      <h1 style={{ marginBottom: "2rem" }}>CATEGORY: {category.name}</h1>
      <p style={{ color: "#8b949e", marginBottom: "3rem", fontSize: "1.1rem" }}>{category.description}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {category.articles.length === 0 ? (
          <p style={{ color: "#8b949e", fontStyle: "italic" }}>[SYSTEM] No articles found in this category.</p>
        ) : (
          category.articles.map((article) => (
            <article key={article.id} className="card">
              <div style={{ fontSize: "0.8rem", color: "var(--accent-color)", marginBottom: "0.5rem" }}>
                {article.publishedAt?.toLocaleDateString()} | Author: {article.author.name}
              </div>
              <h3 style={{ margin: "0.5rem 0" }}>
                <Link href={`/blogs/${article.slug}`}>{article.title}</Link>
              </h3>
              <p style={{ color: "#8b949e", fontSize: "0.95rem" }}>{article.excerpt}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
