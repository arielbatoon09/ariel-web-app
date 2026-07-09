"use server";

import { getErrorMessage } from "@/lib/error-utils";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId, updateUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import { cookies } from "next/headers";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function getCurrentUserProfileAction() {
  try {
    const user = await getCurrentSessionUser();

    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const dbUser = await getUserByAuthId(user.id);

    if (!dbUser) {
      return { success: false, error: "User profile not found in database" };
    }

    return {
      success: true,
      user: {
        id: dbUser.id,
        authId: dbUser.authId,
        fullName: dbUser.fullName,
        phone: dbUser.phone,
        email: user.email,
      },
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to get user profile") };
  }
}

export async function updateUserProfileAction(data: { fullName: string; phone?: string | null }) {
  try {
    const user = await getCurrentSessionUser();
    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const updated = await updateUserByAuthId(user.id, {
      fullName: data.fullName,
      phone: data.phone,
    });

    if (!updated) {
      return { success: false, error: "Profile not found or update failed" };
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      user: {
        id: updated.id,
        fullName: updated.fullName,
        phone: updated.phone,
      },
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to update profile") };
  }
}

export async function updateUserPasswordAction(password: string) {
  try {
    const user = await getCurrentSessionUser();
    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to update password") };
  }
}
