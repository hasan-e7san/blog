"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

export async function likeArticle(articleId: string) {
  const session = await getServerSession();
  if (!session?.user?.email) return { error: "You must be logged in to like." };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return { error: "User not found." };

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_articleId: {
        userId: user.id,
        articleId: articleId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
  } else {
    await prisma.like.create({
      data: {
        userId: user.id,
        articleId: articleId,
      },
    });
  }

  revalidatePath(`/blogs/${articleId}`); // Note: Path usually uses slug, but revalidate can work on many levels
  return { success: true };
}

export async function addComment(articleId: string, formData: FormData) {
  const session = await getServerSession();
  if (!session?.user?.email) return { error: "You must be logged in to comment." };

  const content = formData.get("content") as string;
  if (!content || content.length < 3) return { error: "Comment is too short." };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return { error: "User not found." };

  await prisma.comment.create({
    data: {
      content,
      articleId,
      userId: user.id,
      status: "APPROVED", // Auto-approve for now, can be changed to PENDING based on settings
    },
  });

  revalidatePath(`/blogs/${articleId}`);
  return { success: true };
}

export async function deleteComment(id: string) {
  await prisma.comment.delete({ where: { id } });
  revalidatePath("/dashboard/comments");
}

export async function approveComment(id: string) {
  await prisma.comment.update({
    where: { id },
    data: { status: "APPROVED" },
  });
  revalidatePath("/dashboard/comments");
}
