import { db } from "@/drizzle";
import { categories } from "@/drizzle/schema";
import { eq, inArray } from "drizzle-orm";

export async function getCategoriesQuery() {
  const results = await db.select().from(categories).orderBy(categories.name);
  return results.map((c) => ({
    ...c,
    id: c.id.toString(),
  }));
}

export async function insertCategoryQuery(data: { name: string; slug: string; target: string }) {
  const [newCategory] = await db
    .insert(categories)
    .values({
      name: data.name,
      slug: data.slug,
      target: data.target,
    })
    .returning();

  return {
    ...newCategory,
    id: newCategory.id.toString(),
  };
}

export async function updateCategoryQuery(id: string, data: { name?: string; slug?: string; target?: string; disabled?: boolean }) {
  const numericId = parseInt(id, 10);
  const [updatedCategory] = await db
    .update(categories)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, numericId))
    .returning();

  return updatedCategory
    ? {
        ...updatedCategory,
        id: updatedCategory.id.toString(),
      }
    : null;
}

export async function deleteCategoriesQuery(ids: string[]) {
  const numericIds = ids.map((id) => parseInt(id, 10));
  const deleted = await db.delete(categories).where(inArray(categories.id, numericIds)).returning();

  return deleted.map((c) => ({
    ...c,
    id: c.id.toString(),
  }));
}
