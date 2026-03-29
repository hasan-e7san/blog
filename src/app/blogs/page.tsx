import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BlogsPage() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
  });

  return (
    <div>
      <div style={{ marginBottom: "4rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>All Articles</h1>
        <p className="text-muted">A collection of AI-generated insights across various disciplines.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2.5rem" }}>
        {articles.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
            <p className="text-muted">No articles published yet.</p>
          </div>
        ) : (
          articles.map((article) => (
            <Link key={article.id} href={`/blogs/${article.slug}`} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0' }}>
              {article.coverImage && (
                <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                  <img src={article.coverImage} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <span className="badge">{article.category.name}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>{article.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {article.excerpt}
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }} className="text-muted">
                  <span>By {article.author.name}</span>
                  <span>{article.publishedAt?.toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
