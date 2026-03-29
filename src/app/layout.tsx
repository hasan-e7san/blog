import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import LogoutButton from "@/components/shared/LogoutButton";
import { LayoutDashboard, User } from "lucide-react";
import { Providers } from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: "AI Blog Platform | Insights by AI",
  description: "Explore the frontier of AI, Technology, and Creativity.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <html lang="en">
      <body>
        <Providers>
          <nav className="nav">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Link href="/" style={{ fontSize: "1.25rem", fontWeight: "700", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }}>AI.</span>BLOG
              </Link>
              
              <div style={{ display: "flex", gap: "2rem", alignItems: 'center' }}>
                <Link href="/blogs" className="nav-link">Articles</Link>
                <Link href="/categories" className="nav-link">Categories</Link>
                <Link href="/search" className="nav-link">Search</Link>
                
                {!session ? (
                  <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Admin Access</Link>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {isAdmin ? (
                      <>
                        <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem', gap: '0.5rem' }}>
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <LogoutButton />
                      </>
                    ) : (
                      <>
                        <Link href="/profile" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <User size={18} /> Profile
                        </Link>
                        <LogoutButton />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </nav>

          <main className="container">{children}</main>

          <footer style={{ marginTop: "8rem", borderTop: "1px solid var(--card-border)", padding: "4rem 0" }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>
                <div>
                  <Link href="/" style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: '1.5rem', display: 'block' }}>
                    <span style={{ color: 'var(--accent)' }}>AI.</span>BLOG
                  </Link>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    Automated insights delivered daily across technology and storytelling. Powered by GPT-4 and DALL-E.
                  </p>
                </div>
                <div>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Platform</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }} className="text-muted">
                    <Link href="/blogs">Latest Articles</Link>
                    <Link href="/categories">Browse Categories</Link>
                    <Link href="/authors">Meet our Authors</Link>
                  </div>
                </div>
                <div>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Connect</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }} className="text-muted">
                    <Link href="/contact">Contact Support</Link>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                    <Link href="/terms">Terms of Service</Link>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--card-border)', textAlign: 'center' }} className="text-muted">
                <p style={{ fontSize: '0.8rem' }}>&copy; {new Date().getFullYear()} hasan-ehsan.cloud. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
