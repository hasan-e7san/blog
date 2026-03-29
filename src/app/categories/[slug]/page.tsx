import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { getActiveCategoryBySlug } from "@/lib/public-content";

interface CategoryDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getActiveCategoryBySlug(slug);

  if (!category) {
    return buildPageMetadata({
      title: "Category Not Found",
      description: "The requested category could not be found.",
      path: `/categories/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${category.name} Articles`,
    description:
      category.description ||
      `Read published articles filed under ${category.name} on Hasan Ehsan Cloud.`,
    path: `/categories/${category.slug}`,
    keywords: [category.name, "category archive", "published articles", "technology blog"],
    category: category.name,
  });
}

export default async function CategoryDetailPage({ params }: CategoryDetailProps) {
  const { slug } = await params;

  const category = await getActiveCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Articles`,
    description:
      category.description ||
      `Published articles in the ${category.name} category on Hasan Ehsan Cloud.`,
    url: absoluteUrl(`/categories/${category.slug}`),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: category.articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blogs/${article.slug}`),
        name: article.title,
      })),
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
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
