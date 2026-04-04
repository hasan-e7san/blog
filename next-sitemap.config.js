/** @type {import('next-sitemap').IConfig} */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  siteUrl: "https://blog.hasan-ehsan.cloud",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    "/dashboard",
    "/dashboard/*",
    "/api/*",
    "/login",
    "/register",
    "/profile",
    "/search",
    "/manifest.webmanifest",
    "/opengraph-image",
    "/twitter-image",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/login", "/register", "/profile", "/search", "/api/"],
      },
    ],
  },
  transform: async (config, path) => ({
    loc: path,
    changefreq: path === "/blogs" ? "daily" : "weekly",
    priority: path === "/blogs" ? 1.0 : 0.7,
    lastmod: new Date().toISOString(),
    alternateRefs: config.alternateRefs ?? [],
  }),
  additionalPaths: async () => {
    try {
      const [blogs, categories] = await Promise.all([
        prisma.article.findMany({
          where: { status: "PUBLISHED" },
          select: {
            slug: true,
            updatedAt: true,
            publishedAt: true,
          },
          orderBy: { publishedAt: "desc" },
        }),
        prisma.category.findMany({
          where: { isActive: true },
          select: {
            slug: true,
            updatedAt: true,
          },
          orderBy: { name: "asc" },
        }),
      ]);

      const staticPaths = [
        {
          loc: "/",
          changefreq: "daily",
          priority: 1.0,
          lastmod: new Date().toISOString(),
        },
        {
          loc: "/blogs",
          changefreq: "daily",
          priority: 1.0,
          lastmod: new Date().toISOString(),
        },
        {
          loc: "/categories",
          changefreq: "weekly",
          priority: 0.8,
          lastmod: new Date().toISOString(),
        },
        {
          loc: "/authors",
          changefreq: "monthly",
          priority: 0.6,
          lastmod: new Date().toISOString(),
        },
      ];

      const blogPaths = blogs.map((blog) => ({
        loc: `/blogs/${blog.slug}`,
        changefreq: "daily",
        priority: 0.8,
        lastmod: (blog.updatedAt ?? blog.publishedAt ?? new Date()).toISOString(),
      }));

      const categoryPaths = categories.map((category) => ({
        loc: `/categories/${category.slug}`,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: category.updatedAt.toISOString(),
      }));

      return [...staticPaths, ...blogPaths, ...categoryPaths];
    } finally {
      await prisma.$disconnect();
    }
  },
};
