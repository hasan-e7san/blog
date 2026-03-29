import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { User, Shield, Calendar, Heart, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Profile",
  description: "Private profile page for account activity and personal details.",
  path: "/profile",
  noIndex: true,
});

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Profile</h1>
        <p className="text-muted">Manage your personal information and see your activity.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Profile Card */}
        <aside>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--card-border)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={48} className="text-muted" />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user.name || 'Anonymous User'}</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user.email}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)' }}>
                {user.role}
              </span>
            </div>
          </div>
        </aside>

        {/* Details & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={18} className="text-muted" /> Account Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span className="text-muted">Status</span>
                <span style={{ color: '#10b981' }}>{user.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span className="text-muted">Joined Date</span>
                <span>{user.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </section>

          <section className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={18} className="text-muted" /> Your Activity
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--card-border)' }}>
                <Heart size={24} style={{ color: '#ef4444', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{user._count.likes}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>Articles Liked</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--card-border)' }}>
                <MessageSquare size={24} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{user._count.comments}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>Comments Posted</div>
              </div>
            </div>
          </section>

          <div className="card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h3 style={{ fontSize: '1rem', color: '#ef4444', marginBottom: '1rem' }}>Danger Zone</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Deleting your account will remove all your data and contributions. This action is permanent.
            </p>
            <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', fontSize: '0.85rem' }}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
