"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const siteName = formData.get("siteName") as string;
  const siteDescription = formData.get("siteDescription") as string;
  const aiDailyGenerationEnabled = formData.get("aiDailyGenerationEnabled") === "on";
  const autoPublishAI = formData.get("autoPublishAI") === "on";
  const commentsEnabled = formData.get("commentsEnabled") === "on";
  const postsPerCategoryPerDay = parseInt(formData.get("postsPerCategoryPerDay") as string) || 1;

  const currentSettings = await prisma.setting.findFirst();

  if (currentSettings) {
    await prisma.setting.update({
      where: { id: currentSettings.id },
      data: {
        siteName,
        siteDescription,
        aiDailyGenerationEnabled,
        autoPublishAI,
        commentsEnabled,
        postsPerCategoryPerDay,
      },
    });
  } else {
    await prisma.setting.create({
      data: {
        siteName,
        siteDescription,
        aiDailyGenerationEnabled,
        autoPublishAI,
        commentsEnabled,
        postsPerCategoryPerDay,
      },
    });
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/");
}
