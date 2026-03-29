"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your email and password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '60vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem 0'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Admin Portal</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Sign in to manage your AI content platform.</p>
        </div>
        
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: '#f87171', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hasan-ehsan.cloud"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "#000",
                border: "1px solid var(--card-border)",
                borderRadius: '8px',
                color: "var(--foreground)",
                fontFamily: "inherit",
                fontSize: '1rem',
                outline: "none",
              }}
              required
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "#000",
                border: "1px solid var(--card-border)",
                borderRadius: '8px',
                color: "var(--foreground)",
                fontFamily: "inherit",
                fontSize: '1rem',
                outline: "none",
              }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ 
              marginTop: '1rem', 
              width: '100%',
              gap: '0.75rem'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In to Dashboard"}
          </button>
        </form>

        <div style={{ marginTop: "2.5rem", padding: '1.5rem', borderTop: "1px solid var(--card-border)", fontSize: "0.85rem", textAlign: 'center' }}>
          <p className="text-muted">
            Internal use only. Default: <code style={{ color: 'var(--accent)', background: 'rgba(59, 130, 246, 0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
