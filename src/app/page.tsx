import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import { buildPageMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

export default async function Home() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    take: 8,
    include: { _count: { select: { articles: true } } }
  });

  const latestArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 6,
    include: { category: true, author: true },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '6rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div className="badge" style={{ marginBottom: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <Sparkles size={14} style={{ marginRight: '0.5rem' }} />
          Powered by GPT-4 & DALL-E
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', maxWidth: '900px', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Explore the Frontier of <span className="gradient-text">Automated Intelligence</span>
        </h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '3rem' }}>
          Daily insights on technology, development, and storytelling, generated and curated by advanced AI models.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/blogs" className="btn btn-primary" style={{ gap: '0.5rem' }}>
            Browse Articles <ArrowRight size={18} />
          </Link>
          <Link href="/about" className="btn btn-outline">
            How it works
          </Link>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid-main">
        {/* Latest Articles */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TrendingUp size={24} className="text-muted" /> Latest Publications
            </h2>
            <Link href="/blogs" className="text-muted" style={{ fontSize: '0.9rem' }}>View all</Link>
          </div>
          
          {latestArticles.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <p className="text-muted">The AI models are busy crafting new stories. Check back soon.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {latestArticles.map((article) => (
                <Link key={article.id} href={`/blogs/${article.slug}`} className="card" style={{ display: 'grid', gridTemplateColumns: article.coverImage ? '1fr 2fr' : '1fr', gap: '2rem', padding: '1rem' }}>
                  {article.coverImage && (
                    <div style={{ borderRadius: '8px', overflow: 'hidden', height: '200px' }}>
                      <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                      <span className="badge">{article.category.name}</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>{article.publishedAt?.toLocaleDateString()}</span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{article.title}</h3>
                    <p className="text-muted" style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--muted-foreground)' }}>POPULAR CATEGORIES</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
                  {cat.name} <span style={{ marginLeft: '0.5rem', opacity: 0.5 }}>{cat._count.articles}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #111111 0%, #0a0a0a 100%)', border: '1px solid var(--accent)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Daily Newsletter</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Get the most interesting AI-generated insights delivered to your inbox every morning.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="email" 
                placeholder="email@example.com" 
                style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: '8px', padding: '0.75rem', color: 'white' }} 
              />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--muted-foreground)' }}>SYSTEM STATUS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span className="text-muted">GPT-4 Engine</span>
                <span style={{ color: '#10b981' }}>Healthy</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span className="text-muted">Image Generation</span>
                <span style={{ color: '#10b981' }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span className="text-muted">Cycle Frequency</span>
                <span className="text-muted">Every 3 Days</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
