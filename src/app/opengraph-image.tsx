import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt = `${siteConfig.name} social preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "radial-gradient(circle at top left, #1d4ed8 0%, #0f172a 45%, #020617 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 30,
            opacity: 0.95,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "12px 22px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            AI Blog • Engineering Notes
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            maxWidth: "920px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1.05,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "rgba(248,250,252,0.82)",
              lineHeight: 1.35,
            }}
          >
            AI-generated articles, software engineering insights, and practical
            technology writing by Hasan Ehsan.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "rgba(248,250,252,0.78)",
          }}
        >
          <div style={{ display: "flex" }}>hasan-ehsan.cloud</div>
          <div style={{ display: "flex" }}>Next.js • Prisma • OpenAI</div>
        </div>
      </div>
    ),
    size
  );
}
