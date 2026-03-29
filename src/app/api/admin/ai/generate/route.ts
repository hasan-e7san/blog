import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateArticle } from "@/lib/ai";

export async function GET(request: Request) {
  // Security: Check for a secret token in headers (Standard for Vercel Cron Jobs)
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true, aiEnabled: true },
  });

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    return NextResponse.json({ error: "Admin user not found" }, { status: 500 });
  }

  const results = [];

  for (const category of categories) {
    // Check if article already generated today for this category
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingArticle = await prisma.article.findFirst({
      where: {
        categoryId: category.id,
        createdAt: { gte: startOfDay },
        aiGenerated: true,
      },
    });

    if (existingArticle) {
      results.push({ category: category.name, status: "skipped", reason: "already-generated" });
      continue;
    }

    const log = await prisma.aIJobLog.create({
      data: {
        categoryId: category.id,
        status: "PENDING",
        startedAt: new Date(),
      },
    });

    try {
      const article = await generateArticle(category.id, admin.id);
      await prisma.aIJobLog.update({
        where: { id: log.id },
        data: {
          status: "SUCCESS",
          articleId: article.id,
          completedAt: new Date(),
        },
      });
      results.push({ category: category.name, status: "success", articleId: article.id });
    } catch (error: any) {
      await prisma.aIJobLog.update({
        where: { id: log.id },
        data: {
          status: "FAILED",
          errorMessage: error.message,
          completedAt: new Date(),
        },
      });
      results.push({ category: category.name, status: "failed", error: error.message });
    }
  }

  return NextResponse.json({ results });
}
