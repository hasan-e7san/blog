import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
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
    <div style={{ display: 'flex', minHeight: '80vh', gap: '2rem', padding: '2rem 0' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0 }}>
        <div className="card" style={{ padding: '1rem', position: 'sticky', top: '6rem' }}>
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
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
