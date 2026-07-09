import { db } from "@/drizzle";
import { works } from "@/drizzle/schema";
import { eq, inArray, desc } from "drizzle-orm";

export async function getWorksQuery() {
  return await db.select().from(works).orderBy(desc(works.createdAt));
}

export async function getWorkByIdQuery(id: number) {
  const [work] = await db.select().from(works).where(eq(works.id, id)).limit(1);
  return work || null;
}

export async function getWorkBySlugQuery(slug: string) {
  const [work] = await db.select().from(works).where(eq(works.slug, slug)).limit(1);
  return work || null;
}

export async function insertWorkQuery(data: typeof works.$inferInsert) {
  const [inserted] = await db.insert(works).values(data).returning();
  return inserted;
}

export async function updateWorkQuery(id: number, data: Partial<typeof works.$inferInsert>) {
  const [updated] = await db
    .update(works)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(works.id, id))
    .returning();
  return updated || null;
}

export async function deleteWorksQuery(ids: number[]) {
  return await db.delete(works).where(inArray(works.id, ids)).returning();
}
