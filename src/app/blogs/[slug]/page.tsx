import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Calendar, User, Tag as TagIcon, Clock } from "lucide-react";
import EngagementSection from "@/components/public/EngagementSection";
import { getServerSession } from "next-auth";

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const session = await getServerSession();

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { 
      category: true, 
      author: true, 
      tags: { include: { tag: true } },
      likes: true,
      comments: { 
        where: { status: 'APPROVED' },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    },
  });

  if (!article) {
    notFound();
  }

  let isLiked = false;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      isLiked = article.likes.some(like => like.userId === user.id);
    }
  }

  return (
    <article style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: '8rem' }}>
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
            h2: ({node, ...props}) => <h2 style={{ fontSize: '1.8rem', marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--foreground)' }} {...props} />,
            h3: ({node, ...props}) => <h3 style={{ fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1.25rem', color: 'var(--foreground)' }} {...props} />,
            p: ({node, ...props}) => <p style={{ marginBottom: '1.5rem' }} {...props} />,
            ul: ({node, ...props}) => <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
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
