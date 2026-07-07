"use server";

import { db } from "@/drizzle";
import { users, userRoles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import type { Customer } from "@/schemas/dashboard";
import { getCurrentSessionUser, getSupabaseAdminClient } from "@/data/auth";
import { getUserByAuthId, getUserById, insertUser, deleteUserById } from "@/data/users";
import { getUserRoleByUserId, upsertUserRole } from "@/data/roles";

interface CreateCustomerInput {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  role: "admin" | "client";
}

export async function createCustomerAction(input: CreateCustomerInput) {
  try {
    // 1. Get the current user's session
    const currentUser = await getCurrentSessionUser();

    if (!currentUser) {
      return { success: false, error: "Unauthorized: Please log in." };
    }

    // 2. Verify that the current user is an Admin
    const dbUser = await getUserByAuthId(currentUser.id);

    if (!dbUser) {
      return { success: false, error: "Unauthorized: User account not found in database." };
    }

    const currentRole = await getUserRoleByUserId(dbUser.id);

    if (currentRole !== "admin") {
      return { success: false, error: "Unauthorized: You do not have permission to perform this action." };
    }

    // 3. Create the user in Supabase auth via Admin API
    const adminClient = getSupabaseAdminClient();
    const { data: authData, error: createAuthError } = await adminClient.auth.admin.createUser({
      email: input.email,
      password: input.password || Math.random().toString(36).slice(-12),
      email_confirm: true,
    });

    if (createAuthError || !authData.user) {
      return { success: false, error: createAuthError?.message || "Failed to create user in Auth provider." };
    }

    const newAuthId = authData.user.id;

    // 4. Insert into the database users table using helper
    const insertedUser = await insertUser({
      authId: newAuthId,
      fullName: input.fullName,
      phone: input.phone || null,
    });

    // 5. Insert into the userRoles table using helper
    await upsertUserRole(insertedUser.id, input.role);

    return { success: true, user: insertedUser };
  } catch (err: any) {
    return { success: false, error: err?.message || "An unexpected server error occurred." };
  }
}

export async function getCustomersAction() {
  try {
    const adminClient = getSupabaseAdminClient();
    const {
      data: { users: authUsers },
      error: authError,
    } = await adminClient.auth.admin.listUsers();
    if (authError) {
      return { success: false, error: authError.message };
    }

    const dbUsers = await db
      .select({
        id: users.id,
        authId: users.authId,
        fullName: users.fullName,
        phone: users.phone,
        createdAt: users.createdAt,
        role: userRoles.role,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId));

    const customers: Customer[] = dbUsers.map((dbUser) => {
      const authUser = authUsers.find((au) => au.id === dbUser.authId);
      const isBlocked = !!(authUser?.banned_until && new Date(authUser.banned_until) > new Date());

      return {
        id: dbUser.id.toString(),
        name: dbUser.fullName || "Unknown",
        email: authUser?.email || "No Email",
        role: (dbUser.role === "admin" ? "admin" : "customer") as "admin" | "customer",
        disabled: isBlocked,
        joinedAt: dbUser.createdAt.toISOString().split("T")[0],
        activities: [],
      };
    });

    return { success: true, customers };
  } catch (err: any) {
    return { success: false, error: err?.message || "An unexpected server error occurred." };
  }
}

export async function updateCustomerRoleAction(customerId: string, role: "admin" | "client") {
  try {
    const numericId = parseInt(customerId, 10);
    await upsertUserRole(numericId, role);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update role." };
  }
}

export async function toggleCustomerBlockStatusAction(customerId: string, isBlocked: boolean) {
  try {
    const numericId = parseInt(customerId, 10);
    const dbUser = await getUserById(numericId);

    if (!dbUser || !dbUser.authId) {
      return { success: false, error: "User not found." };
    }

    const adminClient = getSupabaseAdminClient();
    if (isBlocked) {
      const { error } = await adminClient.auth.admin.updateUserById(dbUser.authId, {
        ban_duration: "876000h",
      });
      if (error) throw error;
    } else {
      const { error } = await adminClient.auth.admin.updateUserById(dbUser.authId, {
        ban_duration: "none",
      });
      if (error) throw error;
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update block status." };
  }
}

export async function deleteCustomersAction(customerIds: string[]) {
  try {
    const adminClient = getSupabaseAdminClient();

    for (const customerId of customerIds) {
      const numericId = parseInt(customerId, 10);

      // Get auth ID to delete from Supabase Auth
      const dbUser = await getUserById(numericId);

      if (dbUser && dbUser.authId) {
        // Delete from Supabase Auth
        await adminClient.auth.admin.deleteUser(dbUser.authId);
      }

      // Delete from local DB using helper
      await deleteUserById(numericId);
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete customers." };
  }
}
