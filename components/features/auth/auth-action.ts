"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/drizzle";
import { users, userRoles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getUserRoleAction() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { success: false, error: "Not logged in" };
    }

    const dbUser = await db.select({ id: users.id }).from(users).where(eq(users.authId, user.id)).limit(1);

    if (dbUser.length === 0) {
      return { success: false, error: "User profile not found in database" };
    }

    const roleRecord = await db.select({ role: userRoles.role }).from(userRoles).where(eq(userRoles.userId, dbUser[0].id)).limit(1);

    if (roleRecord.length === 0) {
      return { success: true, role: "client" as const };
    }

    return { success: true, role: roleRecord[0].role };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to get user role" };
  }
}
