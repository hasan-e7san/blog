import { prisma } from "@/lib/prisma";
import { updateArticle } from "@/lib/actions/article-actions";
import { notFound } from "next/navigation";
import { ArrowLeft, Save, ImageIcon } from "lucide-react";
import Link from "next/link";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  
  const article = await prisma.article.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!article) notFound();

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/dashboard/articles" className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Articles
        </Link>
        <h1 style={{ fontSize: '1.75rem' }}>Edit Article</h1>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>ID: {article.id}</p>
      </div>

      <form action={updateArticle.bind(null, article.id)} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="text-muted" style={{ fontSize: '0.85rem' }}>Article Title</label>
              <input
                name="title"
                defaultValue={article.title}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "#000",
                  border: "1px solid var(--card-border)",
                  borderRadius: '8px',
                  color: "white",
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="text-muted" style={{ fontSize: '0.85rem' }}>Excerpt</label>
              <textarea
                name="excerpt"
                defaultValue={article.excerpt || ""}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "#000",
                  border: "1px solid var(--card-border)",
                  borderRadius: '8px',
                  color: "white",
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="text-muted" style={{ fontSize: '0.85rem' }}>Content (Markdown)</label>
              <textarea
                name="content"
                defaultValue={article.content}
                required
                rows={15}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: "#000",
                  border: "1px solid var(--card-border)",
                  borderRadius: '8px',
                  color: "white",
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: '1.6'
                }}
              />
            </div>
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={16} /> Publishing
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="text-muted" style={{ fontSize: '0.8rem' }}>Status</label>
              <select 
                name="status"
                defaultValue={article.status}
                style={{ background: '#000', border: '1px solid var(--card-border)', padding: '0.6rem', borderRadius: '8px', color: 'white' }}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="text-muted" style={{ fontSize: '0.8rem' }}>Category</label>
              <select 
                name="categoryId"
                defaultValue={article.categoryId}
                required
                style={{ background: '#000', border: '1px solid var(--card-border)', padding: '0.6rem', borderRadius: '8px', color: 'white' }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Update Article
            </button>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={16} /> Cover Image
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="text-muted" style={{ fontSize: '0.8rem' }}>Image URL</label>
              <input 
                name="coverImage"
                defaultValue={article.coverImage || ""}
                style={{ background: '#000', border: '1px solid var(--card-border)', padding: '0.6rem', borderRadius: '8px', color: 'white' }}
              />
              {article.coverImage && (
                <div style={{ marginTop: '1rem', borderRadius: '8px', overflow: 'hidden', height: '120px' }}>
                   <img src={article.coverImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
