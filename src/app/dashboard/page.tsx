import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  FileText, 
  Layers, 
  Users, 
  MessageSquare, 
  Activity, 
  Zap, 
  Settings, 
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const stats = {
    articles: await prisma.article.count(),
    categories: await prisma.category.count(),
    users: await prisma.user.count(),
    comments: await prisma.comment.count(),
  };

  const recentLogs = await prisma.aIJobLog.findMany({
    take: 8,
    orderBy: { startedAt: "desc" },
    include: { category: true },
  });

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
        <p className="text-muted">Welcome back, {session.user?.name || 'Admin'}. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '12px' }}>
            <FileText size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Total Articles</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{stats.articles}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '1rem', borderRadius: '12px' }}>
            <Layers size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Categories</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{stats.categories}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', padding: '1rem', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Users</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{stats.users}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '1rem', borderRadius: '12px' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Comments</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{stats.comments}</div>
          </div>
        </div>
      </div>

      <div className="grid-main">
        {/* Activity Logs */}
        <section>
          <div className="section-row" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Activity size={20} className="text-muted" /> AI Generation Logs
            </h2>
            <Link href="/dashboard/ai" className="text-muted" style={{ fontSize: '0.85rem' }}>View all</Link>
          </div>
          
          <div className="card" style={{ padding: "0" }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--card-border)", textAlign: "left", color: 'var(--muted-foreground)' }}>
                    <th style={{ padding: "1.25rem" }}>Timestamp</th>
                    <th style={{ padding: "1.25rem" }}>Category</th>
                    <th style={{ padding: "1.25rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: '3rem', textAlign: 'center' }} className="text-muted">
                        No activity logs found.
                      </td>
                    </tr>
                  ) : (
                    recentLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                        <td style={{ padding: "1.25rem", color: 'var(--muted-foreground)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={14} /> {log.startedAt.toLocaleTimeString()}
                          </div>
                        </td>
                        <td style={{ padding: "1.25rem", fontWeight: '500' }}>{log.category?.name || "System"}</td>
                        <td style={{ padding: "1.25rem" }}>
                          {log.status === "SUCCESS" ? (
                            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                              <CheckCircle2 size={14} /> Success
                            </span>
                          ) : log.status === "FAILED" ? (
                            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                              <XCircle size={14} /> Failed
                            </span>
                          ) : (
                            <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                              <Zap size={14} className="animate-pulse" /> Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--muted-foreground)' }}>QUICK ACTIONS</h3>
          <div className="dashboard-actions">
            <Link href="/dashboard/ai" className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Zap size={18} style={{ color: 'var(--accent)' }} />
                <span>Run AI Generator</span>
              </div>
              <ArrowRight size={16} className="text-muted" />
            </Link>
            <Link href="/dashboard/articles" className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FileText size={18} style={{ color: '#ec4899' }} />
                <span>Manage Articles</span>
              </div>
              <ArrowRight size={16} className="text-muted" />
            </Link>
            <Link href="/dashboard/settings" className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Settings size={18} style={{ color: '#a855f7' }} />
                <span>Site Settings</span>
              </div>
              <ArrowRight size={16} className="text-muted" />
            </Link>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Need Help?</h4>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Check out our documentation on how the AI generation workflow works.
            </p>
            <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>Read Documentation</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
