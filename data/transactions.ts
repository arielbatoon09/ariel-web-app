import { db } from "@/drizzle";
import { transactions } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export async function getTransactionsQuery() {
  const results = await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  return results.map((t) => ({
    ...t,
    id: t.id.toString(),
    orderId: t.orderId.toString(),
    status: t.status as "successful" | "failed" | "pending",
    date: t.createdAt.toISOString(),
  }));
}

export async function insertTransactionQuery(data: {
  orderId: string;
  amount: number;
  status: "successful" | "failed" | "pending";
  paymentMethod: string;
  referenceNumber: string;
  screenshotUrl: string;
}) {
  const [inserted] = await db
    .insert(transactions)
    .values({
      orderId: data.orderId,
      amount: data.amount,
      status: data.status,
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      screenshotUrl: data.screenshotUrl,
    })
    .returning();

  return {
    ...inserted,
    id: inserted.id.toString(),
    orderId: inserted.orderId.toString(),
    status: inserted.status as "successful" | "failed" | "pending",
    date: inserted.createdAt.toISOString(),
  };
}

export async function updateTransactionStatusQuery(id: string, status: "successful" | "failed" | "pending") {
  const numericId = parseInt(id, 10);
  const [updated] = await db
    .update(transactions)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(transactions.id, numericId))
    .returning();

  return updated
    ? {
        ...updated,
        id: updated.id.toString(),
        orderId: updated.orderId.toString(),
        status: updated.status as "successful" | "failed" | "pending",
        date: updated.createdAt.toISOString(),
      }
    : null;
}
