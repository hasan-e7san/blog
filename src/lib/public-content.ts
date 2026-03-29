import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getPublishedArticleBySlug = cache(async (slug: string) => {
  return prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
      likes: true,
      comments: {
        where: { status: "APPROVED" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
});

export const getActiveCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      articles: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { author: true },
      },
    },
  });
});

export const getPublishedArticleSitemapData = cache(async () => {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
      coverImage: true,
    },
    orderBy: { publishedAt: "desc" },
  });
});

export const getActiveCategorySitemapData = cache(async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: { name: "asc" },
  });
});
