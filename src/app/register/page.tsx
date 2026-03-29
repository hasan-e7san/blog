"use client";

import { useState } from "react";
import { registerUser } from "@/lib/actions/auth-actions";
import { User, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    
    try {
      const res = await registerUser(formData);
      if (res?.error) {
        setError(res.error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Create Account</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Join the AI Blog community today.</p>
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

        <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={14} /> Full Name
            </label>
            <input
              name="name"
              placeholder="John Doe"
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
              <Mail size={14} /> Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
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
              name="password"
              type="password"
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
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Create Account"}
          </button>
        </form>

        <div style={{ marginTop: "2.5rem", padding: '1.5rem', borderTop: "1px solid var(--card-border)", fontSize: "0.85rem", textAlign: 'center' }}>
          <p className="text-muted">
            Already have an account? <Link href="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
