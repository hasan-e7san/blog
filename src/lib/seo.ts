import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://hasan-ehsan.cloud";

export const siteConfig = {
  name: "Hasan Ehsan Cloud",
  shortName: "Hasan Cloud",
  description:
    "AI-generated articles, software engineering insights, and practical technology writing by Hasan Ehsan.",
  creator: "Hasan Ehsan",
  category: "technology",
  locale: "en_US",
  sameAs: [
    "https://hasan-ehsan.cloud",
    "https://www.linkedin.com/in/hasan-ehsan-a15120112",
  ],
  keywords: [
    "Hasan Ehsan",
    "Hasan Ehsan Cloud",
    "AI blog",
    "technology blog",
    "software engineering",
    "web development",
    "Next.js",
    "full stack developer",
    "cloud infrastructure",
    "artificial intelligence",
  ],
} as const;

function getConfiguredSiteUrl() {
  return process.env.SITE_URL || process.env.NEXTAUTH_URL || FALLBACK_SITE_URL;
}

export function getSiteUrl() {
  try {
    return new URL(getConfiguredSiteUrl());
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

export function absoluteUrl(path = ""): string {
  if (!path) {
    return getSiteUrl().toString().replace(/\/$/, "");
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = `${getSiteUrl().toString().replace(/\/$/, "")}/`;
  return new URL(path.replace(/^\//, ""), base).toString();
}

function toIsoString(value?: string | Date | null) {
  if (!value) {
    return undefined;
  }

  return value instanceof Date ? value.toISOString() : value;
}

export const defaultRobots: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const noIndexRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
    "max-image-preview": "none",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

type BuildPageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
  absoluteTitle?: boolean;
  category?: string;
  publishedTime?: string | Date | null;
  modifiedTime?: string | Date | null;
  authors?: string[];
  section?: string;
  tags?: string[];
};

export function buildPageMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image,
  keywords = Array.from(siteConfig.keywords),
  type = "website",
  noIndex = false,
  absoluteTitle = false,
  category = siteConfig.category,
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: BuildPageMetadataOptions): Metadata {
  const resolvedImage = image ? absoluteUrl(image) : undefined;
  const resolvedAuthors = authors && authors.length > 0 ? authors : [siteConfig.creator];

  const metadata: Metadata = {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    category,
    alternates: {
      canonical: path,
    },
    robots: noIndex ? noIndexRobots : defaultRobots,
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(resolvedImage
        ? {
            images: [
              {
                url: resolvedImage,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
          }
        : {}),
      ...(type === "article"
        ? {
            publishedTime: toIsoString(publishedTime),
            modifiedTime: toIsoString(modifiedTime),
            authors: resolvedAuthors,
            section,
            tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(resolvedImage ? { images: [resolvedImage] } : {}),
    },
  };

  return metadata;
}
