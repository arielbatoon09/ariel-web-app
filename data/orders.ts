import { db } from "@/drizzle";
import { orders } from "@/drizzle/schema";
import { eq, inArray, desc } from "drizzle-orm";

export async function getOrdersQuery() {
  const results = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return results.map((o) => ({
    ...o,
    id: o.id.toString(),
    userId: o.userId?.toString() || null,
    serviceId: o.serviceId.toString(),
    status: o.status as "pending" | "in-progress" | "completed" | "cancelled",
    createdAt: o.createdAt.toISOString(),
  }));
}

export async function getOrderByIdQuery(id: string) {
  const numericId = parseInt(id, 10);
  const [result] = await db.select().from(orders).where(eq(orders.id, numericId)).limit(1);
  return result
    ? {
        ...result,
        id: result.id.toString(),
        userId: result.userId?.toString() || null,
        serviceId: result.serviceId.toString(),
        status: result.status as "pending" | "in-progress" | "completed" | "cancelled",
        createdAt: result.createdAt.toISOString(),
      }
    : null;
}

export async function insertOrderQuery(data: {
  userId?: string | null;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  addOnsSelected: string[];
  totalAmount: number;
  referenceNumber?: string;
  customerPhone?: string;
  requirements?: string;
}) {
  const [inserted] = await db
    .insert(orders)
    .values({
      userId: data.userId ? parseInt(data.userId, 10) : null,
      serviceId: parseInt(data.serviceId, 10),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      status: data.status,
      addOnsSelected: data.addOnsSelected,
      totalAmount: data.totalAmount,
      referenceNumber: data.referenceNumber,
      customerPhone: data.customerPhone,
      requirements: data.requirements,
    })
    .returning();

  return {
    ...inserted,
    id: inserted.id.toString(),
    userId: inserted.userId?.toString() || null,
    serviceId: inserted.serviceId.toString(),
    status: inserted.status as "pending" | "in-progress" | "completed" | "cancelled",
    createdAt: inserted.createdAt.toISOString(),
  };
}

export async function updateOrderStatusQuery(id: string, status: "pending" | "in-progress" | "completed" | "cancelled") {
  const numericId = parseInt(id, 10);
  const [updated] = await db
    .update(orders)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, numericId))
    .returning();

  return updated
    ? {
        ...updated,
        id: updated.id.toString(),
        userId: updated.userId?.toString() || null,
        serviceId: updated.serviceId.toString(),
        status: updated.status as "pending" | "in-progress" | "completed" | "cancelled",
        createdAt: updated.createdAt.toISOString(),
      }
    : null;
}

export async function deleteOrdersQuery(ids: string[]) {
  const numericIds = ids.map((id) => parseInt(id, 10));
  const deleted = await db.delete(orders).where(inArray(orders.id, numericIds)).returning();
  return deleted.map((o) => ({
    ...o,
    id: o.id.toString(),
    userId: o.userId?.toString() || null,
    serviceId: o.serviceId.toString(),
    status: o.status as "pending" | "in-progress" | "completed" | "cancelled",
    createdAt: o.createdAt.toISOString(),
  }));
}
