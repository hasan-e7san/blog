import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Categories",
  description:
    "Explore blog categories covering AI, development, storytelling, and practical technology topics.",
  path: "/categories",
  keywords: ["blog categories", "AI topics", "technology topics", "article categories"],
});

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <div className="prompt">$ ls -F /var/www/html/categories/</div>
      <h1 style={{ marginBottom: "2rem" }}>CATEGORIES</h1>

      <div className="content-grid">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`} className="card" style={{ display: "block" }}>
            <div style={{ color: "var(--accent-color)", marginBottom: "0.5rem" }}>$ cd {cat.slug}/</div>
            <h3 style={{ margin: "0.5rem 0" }}>{cat.name}</h3>
            <p style={{ fontSize: "0.9rem", color: "#8b949e" }}>{cat.description || "No description available."}</p>
            <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--command-color)" }}>
              {cat._count.articles} articles found
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
