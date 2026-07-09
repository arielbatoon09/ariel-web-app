import { db } from "@/drizzle";
import { articles } from "@/drizzle/schema";
import { eq, inArray, desc } from "drizzle-orm";

export async function getArticlesQuery() {
  return await db.select().from(articles).orderBy(desc(articles.createdAt));
}

export async function getArticleByIdQuery(id: number) {
  const [article] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return article || null;
}

export async function getArticleBySlugQuery(slug: string) {
  const [article] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return article || null;
}

export async function insertArticleQuery(data: typeof articles.$inferInsert) {
  const [inserted] = await db.insert(articles).values(data).returning();
  return inserted;
}

export async function updateArticleQuery(id: number, data: Partial<typeof articles.$inferInsert>) {
  const [updated] = await db
    .update(articles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id))
    .returning();
  return updated || null;
}

export async function deleteArticlesQuery(ids: number[]) {
  return await db.delete(articles).where(inArray(articles.id, ids)).returning();
}
