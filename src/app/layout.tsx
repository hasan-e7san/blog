import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import LogoutButton from "@/components/shared/LogoutButton";
import { LayoutDashboard, User } from "lucide-react";
import { Providers } from "@/components/shared/Providers";
import {
  absoluteUrl,
  defaultRobots,
  getSiteUrl,
  siteConfig,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  keywords: [...siteConfig.keywords],
  authors: [
    {
      name: siteConfig.creator,
      url: absoluteUrl(),
    },
  ],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: siteConfig.category,
  robots: defaultRobots,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: ["/favicon.ico"],
    apple: ["/favicon.ico"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const sessionUser = session?.user as { role?: string } | undefined;
  const isAdmin = sessionUser?.role === "ADMIN";
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl(),
    description: siteConfig.description,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: siteConfig.creator,
      url: absoluteUrl(),
    },
  };
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.creator,
    url: "https://hasan-ehsan.cloud",
    email: "mailto:hasan.e7san@gmail.com",
    jobTitle: "Full Stack Developer",
    sameAs: siteConfig.sameAs,
  };

  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4305704904656915"
          crossOrigin="anonymous"></script>
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />

        <Providers>
          <nav className="nav">
            <div className="container site-nav-inner">
              <Link href="/" className="site-brand">
                <span style={{ color: 'var(--accent)' }}>AI.</span>BLOG
              </Link>

              <div className="site-nav-menu">
                <div className="site-nav-links">
                  <Link href="/blogs" className="nav-link">Articles</Link>
                  <Link href="/categories" className="nav-link">Categories</Link>
                  <Link href="/search" className="nav-link">Search</Link>
                </div>

                <div className="site-nav-actions">
                  {!session ? (
                    <>
                      <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                        Log In
                      </Link>
                      <Link href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        Register
                      </Link>
                    </>
                  ) : (
                    <div className="site-nav-session">
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
            </div>
          </nav>

          <main className="container">{children}</main>

          <footer style={{ marginTop: "8rem", borderTop: "1px solid var(--card-border)", padding: "4rem 0" }}>
            <div className="container">
              <div className="site-footer-grid">
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
