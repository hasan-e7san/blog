import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Edit2, 
  Eye,
  CheckCircle2,
  Clock,
  FileEdit
} from "lucide-react";
import { deleteArticle } from "@/lib/actions/article-actions";
import DeleteButton from "@/components/shared/DeleteButton";

export default async function DashboardArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, author: true },
  });

  return (
    <div>
      <div className="section-row" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Articles</h1>
          <p className="text-muted">Manage all your blog publications.</p>
        </div>
        <Link href="/dashboard/articles/new" className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={18} /> Create Article
        </Link>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div className="table-scroll">
        <table className="admin-table">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left', color: 'var(--muted-foreground)' }}>
              <th style={{ padding: '1.25rem' }}>Article</th>
              <th style={{ padding: '1.25rem' }}>Category</th>
              <th style={{ padding: '1.25rem' }}>Status</th>
              <th style={{ padding: '1.25rem' }}>Date</th>
              <th style={{ padding: '1.25rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '4rem', textAlign: 'center' }} className="text-muted">
                  No articles found. Use AI to generate some or create manually.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {article.coverImage ? (
                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: 'var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={20} className="text-muted" />
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {article.title}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>By {article.author.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <span className="badge">{article.category.name}</span>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    {article.status === "PUBLISHED" ? (
                      <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                        <CheckCircle2 size={14} /> Published
                      </span>
                    ) : (
                      <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                        <FileEdit size={14} /> Draft
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem', color: 'var(--muted-foreground)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={14} /> {article.createdAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div className="action-group">
                      <Link href={`/blogs/${article.slug}`} className="action-link" title="View article">
                        <Eye size={16} />
                        <span>View</span>
                      </Link>
                      <Link href={`/dashboard/articles/${article.id}`} className="action-link" title="Edit article">
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </Link>
                      <DeleteButton 
                        action={deleteArticle} 
                        id={article.id} 
                        label="Delete"
                        title="Delete article"
                        confirmMessage="Are you sure you want to delete this article? This action cannot be undone."
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
