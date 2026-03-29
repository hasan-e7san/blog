"use client";

import { createCategory } from "@/lib/actions/category-actions";
import { ArrowLeft, Save, LayoutGrid, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewCategoryPage() {
  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/dashboard/categories" className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Categories
        </Link>
        <h1 style={{ fontSize: '1.75rem' }}>Create New Category</h1>
      </div>

      <form action={createCategory} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LayoutGrid size={14} /> Category Name
          </label>
          <input
            name="name"
            placeholder="e.g. Artificial Intelligence"
            required
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
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--muted-foreground)' }}>
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Describe what this category is about..."
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
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '500', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={14} style={{ color: 'var(--accent)' }} /> AI Enabled
              </div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Allow AI to generate articles for this category.</div>
            </div>
            <input name="aiEnabled" type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>Active Status</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Show this category on the public website.</div>
            </div>
            <input name="isActive" type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ gap: '0.75rem', justifyContent: 'center' }}>
          <Save size={18} /> Create Category
        </button>
      </form>
    </div>
  );
}
