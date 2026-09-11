import { db } from "@/drizzle";
import { services } from "@/drizzle/schema";
import { eq, inArray } from "drizzle-orm";

export async function getServicesQuery() {
  const results = await db.select().from(services).orderBy(services.name);
  return results.map((s) => ({
    ...s,
    id: s.id.toString(),
  }));
}

export async function getServiceByIdQuery(id: string) {
  const numericId = parseInt(id, 10);
  const [result] = await db.select().from(services).where(eq(services.id, numericId)).limit(1);
  return result ? { ...result, id: result.id.toString() } : null;
}

export async function getServiceBySlugQuery(slug: string) {
  const [result] = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return result ? { ...result, id: result.id.toString() } : null;
}

export async function insertServiceQuery(data: {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountType?: "percent" | "fixed" | null;
  discountValue?: number;
  deliveryTime: string;
  features: string[];
  addOns: Array<{ id: string; name: string; price: number; description: string }>;
  imageSrc?: string | null;
  cardImageSrc?: string | null;
}) {
  const [inserted] = await db
    .insert(services)
    .values({
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      discountType: data.discountType ?? null,
      discountValue: data.discountValue ?? 0,
      deliveryTime: data.deliveryTime,
      features: data.features,
      addOns: data.addOns,
      imageSrc: data.imageSrc,
      cardImageSrc: data.cardImageSrc,
    })
    .returning();

  return {
    ...inserted,
    id: inserted.id.toString(),
  };
}

export async function updateServiceQuery(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    discountType?: "percent" | "fixed" | null;
    discountValue?: number;
    deliveryTime?: string;
    features?: string[];
    addOns?: Array<{ id: string; name: string; price: number; description: string }>;
    imageSrc?: string | null;
    cardImageSrc?: string | null;
    disabled?: boolean;
  }
) {
  const numericId = parseInt(id, 10);
  const [updated] = await db
    .update(services)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(services.id, numericId))
    .returning();

  return updated ? { ...updated, id: updated.id.toString() } : null;
}

export async function deleteServicesQuery(ids: string[]) {
  const numericIds = ids.map((id) => parseInt(id, 10));
  const deleted = await db.delete(services).where(inArray(services.id, numericIds)).returning();
  return deleted.map((s) => ({
    ...s,
    id: s.id.toString(),
  }));
}
