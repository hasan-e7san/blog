import { prisma } from "@/lib/prisma";
import { createArticle } from "@/lib/actions/article-actions";
import { ArrowLeft, Save, FileText, LayoutGrid, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default async function NewArticlePage() {
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
        <h1 style={{ fontSize: '1.75rem' }}>Create New Article</h1>
      </div>

      <form action={createArticle} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="text-muted" style={{ fontSize: '0.85rem' }}>Article Title</label>
              <input
                name="title"
                required
                placeholder="Enter a compelling title..."
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
              <label className="text-muted" style={{ fontSize: '0.85rem' }}>Excerpt (Brief Summary)</label>
              <textarea
                name="excerpt"
                rows={3}
                placeholder="Write a short summary for search results..."
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
              <label className="text-muted" style={{ fontSize: '0.85rem' }}>Content (Markdown Supported)</label>
              <textarea
                name="content"
                required
                rows={15}
                placeholder="Write your article content here..."
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
                required
                style={{ background: '#000', border: '1px solid var(--card-border)', padding: '0.6rem', borderRadius: '8px', color: 'white' }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Save Article
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
                placeholder="https://..."
                style={{ background: '#000', border: '1px solid var(--card-border)', padding: '0.6rem', borderRadius: '8px', color: 'white' }}
              />
              <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>Provide a direct link to the cover image.</p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
