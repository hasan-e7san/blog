"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export async function createArticle(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const categoryId = formData.get("categoryId") as string;
  const status = formData.get("status") as string;
  const coverImage = formData.get("coverImage") as string;

  const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) throw new Error("User not found");

  await prisma.article.create({
    data: {
      title,
      slug: `${slug}-${Date.now()}`,
      content,
      excerpt,
      categoryId,
      status,
      coverImage,
      authorId: user.id,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/dashboard/articles");
  revalidatePath("/blogs");
  revalidatePath("/");
  redirect("/dashboard/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const categoryId = formData.get("categoryId") as string;
  const status = formData.get("status") as string;
  const coverImage = formData.get("coverImage") as string;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) throw new Error("Article not found");

  await prisma.article.update({
    where: { id },
    data: {
      title,
      content,
      excerpt,
      categoryId,
      status,
      coverImage,
      publishedAt: status === "PUBLISHED" && !article.publishedAt ? new Date() : article.publishedAt,
    },
  });

  revalidatePath("/dashboard/articles");
  revalidatePath(`/blogs/${article.slug}`);
  revalidatePath("/blogs");
  revalidatePath("/");
  redirect("/dashboard/articles");
}

export async function deleteArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!article) throw new Error("Article not found");

  await prisma.$transaction(async (tx) => {
    await tx.aIJobLog.deleteMany({
      where: { articleId: id },
    });

    await tx.articleTag.deleteMany({
      where: { articleId: id },
    });

    await tx.like.deleteMany({
      where: { articleId: id },
    });

    await tx.comment.deleteMany({
      where: { articleId: id },
    });

    await tx.media.deleteMany({
      where: { articleId: id },
    });

    await tx.article.delete({
      where: { id },
    });
  });

  revalidatePath("/dashboard/articles");
  revalidatePath(`/blogs/${article.slug}`);
  revalidatePath("/blogs");
  revalidatePath("/");
}
