import { prisma } from "@/lib/prisma";
import { Users, Mail, Shield, Clock } from "lucide-react";

export default async function DashboardUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Users</h1>
        <p className="text-muted">Manage system administrators and authors.</p>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left', color: 'var(--muted-foreground)' }}>
              <th style={{ padding: '1.25rem' }}>User</th>
              <th style={{ padding: '1.25rem' }}>Email</th>
              <th style={{ padding: '1.25rem' }}>Role</th>
              <th style={{ padding: '1.25rem' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={16} className="text-muted" />
                    </div>
                    <span style={{ fontWeight: '500' }}>{user.name || 'Unnamed User'}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="text-muted">
                    <Mail size={14} /> {user.email}
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <span className="badge" style={{ 
                    background: user.role === 'ADMIN' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                    color: user.role === 'ADMIN' ? 'var(--accent)' : '#a855f7',
                    border: user.role === 'ADMIN' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(168, 85, 247, 0.2)'
                  }}>
                    <Shield size={12} style={{ marginRight: '0.4rem' }} /> {user.role}
                  </span>
                </td>
                <td style={{ padding: '1.25rem' }} className="text-muted">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} /> {user.createdAt.toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
