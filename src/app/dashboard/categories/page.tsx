import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Layers, 
  Plus, 
  Edit2, 
  Zap, 
  ZapOff,
  Eye
} from "lucide-react";
import { deleteCategory } from "@/lib/actions/category-actions";
import DeleteButton from "@/components/shared/DeleteButton";

export default async function DashboardCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } }
  });

  return (
    <div>
      <div className="section-row" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Categories</h1>
          <p className="text-muted">Organize your content and control AI generation per category.</p>
        </div>
        <Link href="/dashboard/categories/new" className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={18} /> Add Category
        </Link>
      </div>

      <div className="content-grid">
        {categories.map((category) => (
          <div key={category.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '0.75rem', borderRadius: '12px' }}>
                <Layers size={20} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {category.aiEnabled ? (
                  <span title="AI Enabled" style={{ color: '#10b981' }}><Zap size={18} /></span>
                ) : (
                  <span title="AI Disabled" className="text-muted"><ZapOff size={18} /></span>
                )}
                <Link href={`/dashboard/categories/${category.id}`} className="text-muted" title="Edit">
                  <Edit2 size={18} />
                </Link>
                <DeleteButton 
                  action={deleteCategory} 
                  id={category.id} 
                  confirmMessage={`Are you sure you want to delete "${category.name}"? This will fail if there are existing articles.`}
                />
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{category.name}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {category.description || "No description provided."}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge">{category._count.articles} Articles</span>
                <Link href={`/categories/${category.slug}`} className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Eye size={14} /> Public View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
