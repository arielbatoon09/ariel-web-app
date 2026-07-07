import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getUserByAuthId(authId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.authId, authId))
    .limit(1);
  return user || null;
}

export async function getUserById(id: number) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user || null;
}

export async function insertUser(values: { authId: string; fullName: string; phone?: string | null }) {
  const [inserted] = await db
    .insert(users)
    .values({
      authId: values.authId,
      fullName: values.fullName,
      phone: values.phone || null,
    })
    .returning();
  return inserted;
}

export async function deleteUserById(id: number) {
  await db.delete(users).where(eq(users.id, id));
}
