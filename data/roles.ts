import { db } from "@/drizzle";
import { userRoles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getUserRoleByUserId(userId: number) {
  const [roleRecord] = await db
    .select({ role: userRoles.role })
    .from(userRoles)
    .where(eq(userRoles.userId, userId))
    .limit(1);
  return roleRecord ? roleRecord.role : null;
}

export async function upsertUserRole(userId: number, role: "admin" | "client") {
  const existing = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userRoles)
      .set({ role })
      .where(eq(userRoles.userId, userId));
  } else {
    await db.insert(userRoles).values({
      userId,
      role,
    });
  }
}
