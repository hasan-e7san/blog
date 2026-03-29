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
  const sessionUser = session?.user as { role?: string } | undefined;
  const isAdmin = sessionUser?.role === "ADMIN";

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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '4rem' }}>
                <div>
                  <Link href="/" style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: '1rem', display: 'block' }}>
                    Hasan Ehsan
                  </Link>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--foreground)' }}>
                    Full Stack Developer
                  </p>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    Full Stack Developer with over 6 years of experience building scalable web and mobile applications using Laravel, Node.js, NestJS, React, Next.js, and cloud infrastructure.
                  </p>
                </div>
                <div>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Explore</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }} className="text-muted">
                    <Link href="/blogs">Latest Articles</Link>
                    <Link href="/categories">Browse Categories</Link>
                    <Link href="/search">Search Articles</Link>
                  </div>
                </div>
                <div>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Contact</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }} className="text-muted">
                    <span>Dubai, United Arab Emirates</span>
                    <a href="mailto:hasan.e7san@gmail.com">hasan.e7san@gmail.com</a>
                    <a href="tel:+971528796711">+971 52 879 6711</a>
                  </div>
                </div>
                <div>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Profiles</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }} className="text-muted">
                    <a href="https://www.linkedin.com/in/hasan-ehsan-a15120112" target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                    <a href="https://hasan-ehsan.cloud/cv/Hasan_Ehsan_CV.pdf" target="_blank" rel="noreferrer">
                      Download Resume
                    </a>
                    <a href="https://hasan-ehsan.cloud" target="_blank" rel="noreferrer">
                      hasan-ehsan.cloud
                    </a>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--card-border)', textAlign: 'center' }} className="text-muted">
                <p style={{ fontSize: '0.8rem' }}>&copy; {new Date().getFullYear()} Hasan Ehsan. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
