"use client";

import { useState } from "react";
import { Heart, MessageSquare, Send, User } from "lucide-react";
import { likeArticle, addComment } from "@/lib/actions/engagement-actions";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface EngagementSectionProps {
  articleId: string;
  initialLikes: number;
  initialComments: any[];
  isLiked: boolean;
}

export default function EngagementSection({ 
  articleId, 
  initialLikes, 
  initialComments,
  isLiked: initialIsLiked 
}: EngagementSectionProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
    if (!session) return alert("Please sign in to like articles.");
    
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    
    const res = await likeArticle(articleId);
    if (res.error) {
      // Rollback on error
      setIsLiked(isLiked);
      setLikesCount(likesCount);
      alert(res.error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return alert("Please sign in to comment.");
    if (!commentText.trim()) return;

    const formData = new FormData();
    formData.append("content", commentText);

    setCommentText("");
    
    // Optimistically update (Simplified)
    // In a real app, wait for server response
    const res = await addComment(articleId, formData);
    if (res.error) {
      alert(res.error);
    } else {
        window.location.reload(); // Simple way to refresh comments for now
    }
  };

  return (
    <div style={{ marginTop: '4rem' }}>
      <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', padding: '1.5rem 0', marginBottom: '3rem' }}>
        <button 
          onClick={handleLike}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'none', 
            border: 'none', 
            color: isLiked ? '#ef4444' : 'var(--muted-foreground)', 
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          <Heart size={20} fill={isLiked ? "#ef4444" : "none"} /> {likesCount} Likes
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontSize: '1rem', fontWeight: '500' }}>
          <MessageSquare size={20} /> {comments.length} Comments
        </div>
      </div>

      <section style={{ marginBottom: '4rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Discussion</h3>
        
        {session ? (
          <form onSubmit={handleComment} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--card-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <User size={20} className="text-muted" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#000',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  color: 'white',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none',
                  minHeight: '100px'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ alignSelf: 'flex-end', gap: '0.5rem' }}
              >
                Post Comment <Send size={16} />
              </button>
            </div>
          </form>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', marginBottom: '3rem' }}>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>Join the conversation. Sign in to post a comment.</p>
            <Link href="/login" className="btn btn-outline">Sign In</Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--card-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <User size={20} className="text-muted" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{comment.user.name || 'Anonymous'}</span>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ color: 'var(--foreground)', lineHeight: '1.5', fontSize: '1rem' }}>{comment.content}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="text-muted">No comments yet. Be the first to share your thoughts!</p>}
        </div>
      </section>
    </div>
  );
}
