import cron from "node-cron";
import { prisma } from "../src/lib/prisma";
import { generateArticle } from "../src/lib/ai";

/**
 * Main article generation logic
 */
async function generateDailyArticles() {
  console.log(`[${new Date().toISOString()}] TRIGGERED: Daily AI generation starting...`);

  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true, aiEnabled: true },
    });

    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!admin) {
      console.error("Admin user not found. Aborting.");
      return;
    }

    for (const category of categories) {
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
        console.log(`- Skipping ${category.name}: Already generated today.`);
        continue;
      }

      console.log(`- Generating article for: ${category.name}...`);
      
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
        console.log(`  ✓ Successfully generated: ${article.title}`);
      } catch (error: any) {
        await prisma.aIJobLog.update({
          where: { id: log.id },
          data: {
            status: "FAILED",
            errorMessage: error.message,
            completedAt: new Date(),
          },
        });
        console.error(`  ✗ Failed for ${category.name}: ${error.message}`);
      }
    }

    console.log(`[${new Date().toISOString()}] FINISHED: Generation cycle complete.`);
  } catch (error) {
    console.error("Critical error in generation process:", error);
  }
}

// 1. Schedule to run every 3 days at midnight (00:00)
cron.schedule("0 0 */3 * *", () => {
  generateDailyArticles();
});

// 2. Initial message and a way to run it once on startup if needed
console.log(`[${new Date().toISOString()}] AI Blog Worker is running...`);
console.log("Schedule: Every 3 days at midnight (0 0 */3 * *)");

// Optional: Uncomment the line below if you want it to run once immediately when the script starts
// generateDailyArticles();

// Handle termination gracefully
process.on("SIGTERM", async () => {
  console.log("Worker shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});
