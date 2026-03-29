import { prisma } from "@/lib/prisma";
import { 
  Save, 
  Globe, 
  Cpu, 
  MessageSquare 
} from "lucide-react";
import { updateSettings } from "@/lib/actions/setting-actions";

export default async function DashboardSettingsPage() {
  const settings = await prisma.setting.findFirst() || {
    siteName: "AI Blog Platform",
    siteDescription: "The ultimate AI-generated blog platform",
    aiDailyGenerationEnabled: true,
    postsPerCategoryPerDay: 1,
    commentsEnabled: true,
    autoPublishAI: true
  };

  return (
    <div className="form-shell-sm">
      <form action={updateSettings}>
        <div className="section-row" style={{ marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Platform Settings</h1>
            <p className="text-muted">Configure your site metadata, AI behavior, and system rules.</p>
          </div>
          <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Save size={18} /> Save All Changes
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Site Identity */}
          <section className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Globe size={20} style={{ color: 'var(--accent)' }} /> Site Identity
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Site Name</label>
                <input 
                  name="siteName"
                  defaultValue={settings.siteName}
                  style={{ background: '#000', border: '1px solid var(--card-border)', padding: '0.75rem', borderRadius: '8px', color: 'white' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Site Description</label>
                <textarea 
                  name="siteDescription"
                  defaultValue={settings.siteDescription || ""}
                  rows={3}
                  style={{ background: '#000', border: '1px solid var(--card-border)', padding: '0.75rem', borderRadius: '8px', color: 'white' }} 
                />
              </div>
            </div>
          </section>

          {/* AI Configuration */}
          <section className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Cpu size={20} style={{ color: '#a855f7' }} /> AI Generation Rules
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="toggle-row">
                <div>
                  <div style={{ fontWeight: '500' }}>AI Generation Cycle</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Automatically generate new articles every 3 days.</div>
                </div>

                <input name="aiDailyGenerationEnabled" type="checkbox" defaultChecked={settings.aiDailyGenerationEnabled} style={{ width: '20px', height: '20px' }} />
              </div>
              <div className="toggle-row">
                <div>
                  <div style={{ fontWeight: '500' }}>Auto-Publish AI Articles</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>New articles go live immediately without review.</div>
                </div>
                <input name="autoPublishAI" type="checkbox" defaultChecked={settings.autoPublishAI} style={{ width: '20px', height: '20px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Articles Per Category (Daily)</label>
                <input 
                  name="postsPerCategoryPerDay"
                  type="number"
                  defaultValue={settings.postsPerCategoryPerDay}
                  style={{ background: '#000', border: '1px solid var(--card-border)', padding: '0.75rem', borderRadius: '8px', color: 'white', width: '100px' }} 
                />
              </div>
            </div>
          </section>

          {/* Community Settings */}
          <section className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MessageSquare size={20} style={{ color: '#ec4899' }} /> Community & Moderation
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="toggle-row">
                <div>
                  <div style={{ fontWeight: '500' }}>Enable Comments</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Allow readers to post comments on your articles.</div>
                </div>
                <input name="commentsEnabled" type="checkbox" defaultChecked={settings.commentsEnabled} style={{ width: '20px', height: '20px' }} />
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
