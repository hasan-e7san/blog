import { prisma } from "@/lib/prisma";
import { Heart, FileText, User as UserIcon, Clock } from "lucide-react";

export default async function DashboardLikesPage() {
  const likes = await prisma.like.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, article: true },
  });

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Article Likes</h1>
        <p className="text-muted">Track which articles are resonating most with your audience.</p>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left', color: 'var(--muted-foreground)' }}>
              <th style={{ padding: '1.25rem' }}>User</th>
              <th style={{ padding: '1.25rem' }}>Article</th>
              <th style={{ padding: '1.25rem' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {likes.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '4rem', textAlign: 'center' }} className="text-muted">
                   No likes recorded yet.
                </td>
              </tr>
            ) : (
              likes.map((like) => (
                <tr key={like.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                      <UserIcon size={14} className="text-muted" /> {like.user.name || 'Anonymous'}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={14} className="text-muted" />
                      <span className="text-muted">{like.article.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }} className="text-muted">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={14} /> {like.createdAt.toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
