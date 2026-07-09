"use server";

import { getErrorMessage } from "@/lib/error-utils";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";

export async function getUserRoleAction() {
  try {
    const user = await getCurrentSessionUser();

    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const dbUser = await getUserByAuthId(user.id);

    if (!dbUser) {
      return { success: false, error: "User profile not found in database" };
    }

    const role = await getUserRoleByUserId(dbUser.id);

    if (!role) {
      return { success: true, role: "client" as const };
    }

    return { success: true, role };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to get user role") };
  }
}
