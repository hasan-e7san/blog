import { prisma } from "@/lib/prisma";
import { MessageSquare, FileText, User as UserIcon, Clock, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { approveComment, deleteComment } from "@/lib/actions/engagement-actions";

export default async function DashboardCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, article: true },
  });

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Comments</h1>
        <p className="text-muted">Manage all visitor interactions across your blog posts.</p>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left', color: 'var(--muted-foreground)' }}>
              <th style={{ padding: '1.25rem' }}>User & Comment</th>
              <th style={{ padding: '1.25rem' }}>Article</th>
              <th style={{ padding: '1.25rem' }}>Status</th>
              <th style={{ padding: '1.25rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '4rem', textAlign: 'center' }} className="text-muted">
                   No comments found.
                </td>
              </tr>
            ) : (
              comments.map((comment) => (
                <tr key={comment.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                        <UserIcon size={14} /> {comment.user.name || 'Anonymous'}
                      </div>
                      <div className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                        "{comment.content}"
                      </div>
                      <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                        <Clock size={12} /> {comment.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={14} className="text-muted" />
                      <span className="text-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                        {comment.article.title}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                     {comment.status === 'APPROVED' ? (
                       <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                         <CheckCircle2 size={14} /> Approved
                       </span>
                     ) : (
                       <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                         <Clock size={14} /> Pending
                       </span>
                     )}
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                       {comment.status === 'PENDING' && (
                         <form action={approveComment.bind(null, comment.id)}>
                            <button type="submit" className="text-muted" title="Approve" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                            </button>
                         </form>
                       )}
                       <form action={deleteComment.bind(null, comment.id)}>
                          <button type="submit" className="text-muted" title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            <Trash2 size={18} />
                          </button>
                       </form>
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
