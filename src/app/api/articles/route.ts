import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  let where = { status: "PUBLISHED" };

  if (search) {
    (where as any).OR = [
      { title: { contains: search } },
      { content: { contains: search } },
      { excerpt: { contains: search } },
    ];
  }

  const articles = await prisma.article.findMany({
    where,
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json({ articles });
}
