import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Calendar, User, Tag as TagIcon, Clock } from "lucide-react";
import EngagementSection from "@/components/public/EngagementSection";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { absoluteUrl, buildPageMetadata, siteConfig } from "@/lib/seo";
import { getPublishedArticleBySlug } from "@/lib/public-content";
import { prisma } from "@/lib/prisma";

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return buildPageMetadata({
      title: "Article Not Found",
      description: "The requested article could not be found.",
      path: `/blogs/${slug}`,
      noIndex: true,
    });
  }

  const tagNames = article.tags.map((item) => item.tag.name);

  return buildPageMetadata({
    title: article.seoTitle || article.title,
    description:
      article.seoDescription ||
      article.excerpt ||
      siteConfig.description,
    path: `/blogs/${article.slug}`,
    image: article.coverImage,
    type: "article",
    keywords: Array.from(new Set([...siteConfig.keywords, article.category.name, ...tagNames])),
    category: article.category.name,
    publishedTime: article.publishedAt || article.createdAt,
    modifiedTime: article.updatedAt,
    authors: [article.author.name || siteConfig.creator],
    section: article.category.name,
    tags: tagNames,
  });
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const session = await getServerSession();

  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description:
      article.seoDescription ||
      article.excerpt ||
      siteConfig.description,
    image: article.coverImage ? [absoluteUrl(article.coverImage)] : undefined,
    datePublished: (article.publishedAt || article.createdAt).toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: article.author.name || siteConfig.creator,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.creator,
      url: absoluteUrl(),
    },
    mainEntityOfPage: absoluteUrl(`/blogs/${article.slug}`),
    articleSection: article.category.name,
    keywords: article.tags.map((item) => item.tag.name).join(", "),
  };

  let isLiked = false;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      isLiked = article.likes.some(like => like.userId === user.id);
    }
  }

  return (
    <article style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: '8rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <header style={{ marginBottom: "4rem", textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            {article.category.name}
          </span>
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "2rem", lineHeight: '1.2' }}>{article.title}</h1>
        
        <div style={{ display: "flex", justifyContent: 'center', flexWrap: 'wrap', gap: "2rem", color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} /> {article.publishedAt?.toLocaleDateString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} /> {article.author.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} /> 5 min read
          </div>
        </div>
      </header>

      {article.coverImage && (
        <div style={{ marginBottom: "4rem", borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
          <img src={article.coverImage} alt={article.title} style={{ width: "100%", height: "auto", display: 'block' }} />
        </div>
      )}

      <div className="prose" style={{ 
        fontSize: "1.125rem", 
        lineHeight: "1.8", 
        color: "#d1d5db",
      }}>
        <ReactMarkdown
          components={{
            h2: (props) => <h2 style={{ fontSize: '1.8rem', marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--foreground)' }} {...props} />,
            h3: (props) => <h3 style={{ fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1.25rem', color: 'var(--foreground)' }} {...props} />,
            p: (props) => <p style={{ marginBottom: '1.5rem' }} {...props} />,
            ul: (props) => <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }} {...props} />,
            li: (props) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      <div style={{ marginTop: "6rem", paddingTop: "3rem", borderTop: "1px solid var(--card-border)" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
          <TagIcon size={18} /> <span style={{ fontSize: '1rem', fontWeight: '500' }}>Tagged in</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {article.tags.map((at) => (
            <span key={at.tagId} className="badge" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              #{at.tag.name}
            </span>
          ))}
        </div>
      </div>

      <EngagementSection 
        articleId={article.id}
        initialLikes={article.likes.length}
        initialComments={article.comments}
        isLiked={isLiked}
      />
    </article>
  );
}
