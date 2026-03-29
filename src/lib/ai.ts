import OpenAI from "openai";
import { prisma } from "./prisma";
import fs from "fs";
import path from "path";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Downloads an image from a URL and saves it locally
 */
async function downloadImage(url: string, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "ai");
  
  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(`/uploads/ai/${filename}`));
    writer.on('error', reject);
  });
}

export async function generateArticle(categoryId: string, authorId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) throw new Error("Category not found");

  // Fetch recent articles in this category to avoid duplication
  const recentArticles = await prisma.article.findMany({
    where: { categoryId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { title: true }
  });

  const recentTitles = recentArticles.map(a => a.title).join(", ");

  const prompt = `Generate a high-quality blog article about ${category.name}.
  
  CRITICAL: Do NOT repeat topics or titles that have already been covered.
  RECENT ARTICLES IN THIS CATEGORY: [${recentTitles}]
  
  The article should be engaging, informative, and SEO-friendly. Choose a unique angle or a trending topic within this category that is different from the recent articles listed above.
  
  Include:
  - Title (Must be unique and not in the list above)
  - Excerpt (summary)
  - Full Content (markdown)
  - SEO Title
  - SEO Description
  - A list of tags (comma-separated)
  - A descriptive image prompt for DALL-E to generate a cover image.

  Return the response in JSON format:
  {
    "title": "...",
    "excerpt": "...",
    "content": "...",
    "seoTitle": "...",
    "seoDescription": "...",
    "tags": ["tag1", "tag2"],
    "imagePrompt": "..."
  }`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
  });

  const articleData = JSON.parse(completion.choices[0].message.content || "{}");

  // Double check title uniqueness against DB just in case
  const existingArticle = await prisma.article.findFirst({
    where: { title: articleData.title }
  });

  if (existingArticle) {
    // If AI failed to provide unique title, we could either retry or slightly modify
    articleData.title = `${articleData.title} - Revisited`;
  }

  // Generate image
  let localImagePath = null;
  try {
    const imageResponse = await openai.images.generate({
      prompt: articleData.imagePrompt,
      n: 1,
      size: "1024x1024",
    });
    
    const tempUrl = imageResponse.data[0].url;
    if (tempUrl) {
      const filename = `img-${Date.now()}.png`;
      localImagePath = await downloadImage(tempUrl, filename);
    }
  } catch (error) {
    console.error("Image generation/download failed:", error);
  }

  const slug = articleData.title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  const article = await prisma.article.create({
    data: {
      title: articleData.title,
      slug: `${slug}-${Date.now()}`,
      excerpt: articleData.excerpt,
      content: articleData.content,
      seoTitle: articleData.seoTitle,
      seoDescription: articleData.seoDescription,
      coverImage: localImagePath,
      aiGenerated: true,
      generationPrompt: prompt,
      imagePrompt: articleData.imagePrompt,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categoryId: category.id,
      authorId: authorId,
    },
  });

  // Handle tags
  if (articleData.tags && Array.isArray(articleData.tags)) {
    for (const tagName of articleData.tags) {
      const tagSlug = tagName.toLowerCase().replace(/ /g, "-");
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug },
      });

      await prisma.articleTag.create({
        data: {
          articleId: article.id,
          tagId: tag.id,
        },
      });
    }
  }

  return article;
}
