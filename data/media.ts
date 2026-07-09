import { db } from "@/drizzle";
import { mediaAssets } from "@/drizzle/schema";
import { eq, inArray, desc, like } from "drizzle-orm";

export type MediaAsset = typeof mediaAssets.$inferSelect;
export type NewMediaAsset = typeof mediaAssets.$inferInsert;

/** Get all media assets, optionally filtered by folder prefix */
export async function getAllMediaQuery(folder?: string): Promise<MediaAsset[]> {
  if (folder) {
    return db
      .select()
      .from(mediaAssets)
      .where(like(mediaAssets.folder, `${folder}%`))
      .orderBy(desc(mediaAssets.createdAt));
  }
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
}

/** Insert a new media asset record */
export async function insertMediaQuery(data: NewMediaAsset): Promise<MediaAsset> {
  const [inserted] = await db.insert(mediaAssets).values(data).returning();
  return inserted;
}

/** Bulk delete media records by IDs */
export async function deleteMediaByIdsQuery(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  await db.delete(mediaAssets).where(inArray(mediaAssets.id, ids));
}

/** Get single media asset by ID */
export async function getMediaByIdQuery(id: number): Promise<MediaAsset | undefined> {
  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id));
  return asset;
}

/** Update alt text for a media asset */
export async function updateMediaAltQuery(id: number, altText: string): Promise<MediaAsset | undefined> {
  const [updated] = await db.update(mediaAssets).set({ altText, updatedAt: new Date() }).where(eq(mediaAssets.id, id)).returning();
  return updated;
}
