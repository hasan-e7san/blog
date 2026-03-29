import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin Seeder
  const adminEmail = "admin@hasan-ehsan.cloud";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
    data: {
        email: adminEmail,
        name: "Admin User",
        role: "ADMIN",
        password: hashedPassword,
        status: "ACTIVE",
      },
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }

  // Category Seeder
  const techCategories = [
    { name: "AI", slug: "ai" },
    { name: "Technology", slug: "technology" },
    { name: "Programming", slug: "programming" },
    { name: "Web Development", slug: "web-development" },
    { name: "Mobile Development", slug: "mobile-development" },
    { name: "Cybersecurity", slug: "cybersecurity" },
    { name: "Cloud Computing", slug: "cloud-computing" },
    { name: "Data Science", slug: "data-science" },
    { name: "Startups", slug: "startups" },
    { name: "Gadgets", slug: "gadgets" },
  ];

  const storyCategories = [
    { name: "Funny Stories", slug: "funny-stories" },
    { name: "Scary Stories", slug: "scary-stories" },
    { name: "Mystery Stories", slug: "mystery-stories" },
    { name: "Adventure Stories", slug: "adventure-stories" },
    { name: "Romantic Stories", slug: "romantic-stories" },
    { name: "Drama Stories", slug: "drama-stories" },
    { name: "Inspirational Stories", slug: "inspirational-stories" },
    { name: "Kids Stories", slug: "kids-stories" },
    { name: "Fantasy Stories", slug: "fantasy-stories" },
    { name: "Short Stories", slug: "short-stories" },
  ];

  const allCategories = [...techCategories, ...storyCategories];

  for (const cat of allCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        isActive: true,
        aiEnabled: true,
      },
    });
  }
  console.log("Categories seeded");

  // Setting Seeder
  const existingSetting = await prisma.setting.findFirst();
  if (!existingSetting) {
    await prisma.setting.create({
      data: {
        siteName: "AI Blog Platform",
        siteDescription: "The ultimate AI-generated blog platform",
        aiDailyGenerationEnabled: true,
        postsPerCategoryPerDay: 1,
      },
    });
    console.log("Settings seeded");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
