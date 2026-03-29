"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const aiEnabled = formData.get("aiEnabled") === "on";
  const isActive = formData.get("isActive") === "on";

  const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  await prisma.category.create({
    data: {
      name,
      slug: `${slug}-${Date.now()}`,
      description,
      aiEnabled,
      isActive,
    },
  });

  revalidatePath("/dashboard/categories");
  redirect("/dashboard/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const aiEnabled = formData.get("aiEnabled") === "on";
  const isActive = formData.get("isActive") === "on";

  await prisma.category.update({
    where: { id },
    data: {
      name,
      description,
      aiEnabled,
      isActive,
    },
  });

  revalidatePath("/dashboard/categories");
  redirect("/dashboard/categories");
}

export async function deleteCategory(id: string) {
  // Check if category has articles
  const articlesCount = await prisma.article.count({
    where: { categoryId: id },
  });

  if (articlesCount > 0) {
    throw new Error("Cannot delete category with existing articles.");
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/dashboard/categories");
}
