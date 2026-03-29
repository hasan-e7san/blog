import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Users, 
  MessageSquare, 
  Settings, 
  Zap,
  Image as ImageIcon,
  Heart,
  LogOut
} from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Dashboard",
  description: "Private dashboard for managing articles, categories, and platform settings.",
  path: "/dashboard",
  noIndex: true,
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const menuItems = [
    { label: "Overview", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
    { label: "Articles", icon: <FileText size={18} />, href: "/dashboard/articles" },
    { label: "Categories", icon: <Layers size={18} />, href: "/dashboard/categories" },
    { label: "Users", icon: <Users size={18} />, href: "/dashboard/users" },
    { label: "Comments", icon: <MessageSquare size={18} />, href: "/dashboard/comments" },
    { label: "Likes", icon: <Heart size={18} />, href: "/dashboard/likes" },
    { label: "Media", icon: <ImageIcon size={18} />, href: "/dashboard/media" },
    { label: "AI Control", icon: <Zap size={18} />, href: "/dashboard/ai" },
    { label: "Settings", icon: <Settings size={18} />, href: "/dashboard/settings" },
  ];

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="card dashboard-panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="nav-link"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <div style={{ borderTop: '1px solid var(--card-border)', marginTop: '1rem', paddingTop: '1rem' }}>
              <Link 
                href="/api/auth/signout"
                className="nav-link"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#ef4444'
                }}
              >
                <LogOut size={18} /> Sign Out
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
}
