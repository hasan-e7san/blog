import { prisma } from "@/lib/prisma";
import { Image as ImageIcon, ExternalLink, Calendar, Link2 } from "lucide-react";

export default async function DashboardMediaPage() {
  const articles = await prisma.article.findMany({
    where: { NOT: { coverImage: null } },
    select: { id: true, title: true, coverImage: true, createdAt: true, aiGenerated: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Media Assets</h1>
        <p className="text-muted">Manage and review all images and media used across your articles.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {articles.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
             <p className="text-muted">No media assets found. Generate some content with images!</p>
          </div>
        ) : (
          articles.map((item) => (
            <div key={item.id} className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
                <img src={item.coverImage!} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {item.aiGenerated && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(59, 130, 246, 0.9)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    AI GENERATED
                  </div>
                )}
              </div>
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }} className="text-muted">
                    <Calendar size={12} /> {item.createdAt.toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <a href={item.coverImage!} target="_blank" rel="noopener noreferrer" className="text-muted" title="Open Image">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
