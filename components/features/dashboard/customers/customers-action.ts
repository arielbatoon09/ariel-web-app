"use server";

import { cookies } from "next/headers";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { db } from "@/drizzle";
import { users, userRoles } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import type { Customer } from "@/lib/schemas/dashboard";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase Admin Auth Client
const getSupabaseAdmin = () => {
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing on the server.");
  }
  return createSupabaseAdminClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

interface CreateCustomerInput {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  role: "admin" | "client";
}

export async function createCustomerAction(input: CreateCustomerInput) {
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    // 1. Get the current user's session
    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !currentUser) {
      return { success: false, error: "Unauthorized: Please log in." };
    }

    // 2. Verify that the current user is an Admin
    const dbUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.authId, currentUser.id))
      .limit(1);

    if (dbUser.length === 0) {
      return { success: false, error: "Unauthorized: User account not found in database." };
    }

    const currentUserId = dbUser[0].id;
    const adminCheck = await db
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, currentUserId), eq(userRoles.role, "admin")))
      .limit(1);

    if (adminCheck.length === 0) {
      return { success: false, error: "Unauthorized: You do not have permission to perform this action." };
    }

    // 3. Create the user in Supabase auth via Admin API
    const adminClient = getSupabaseAdmin();
    const { data: authData, error: createAuthError } = await adminClient.auth.admin.createUser({
      email: input.email,
      password: input.password || Math.random().toString(36).slice(-12),
      email_confirm: true,
    });

    if (createAuthError || !authData.user) {
      return { success: false, error: createAuthError?.message || "Failed to create user in Auth provider." };
    }

    const newAuthId = authData.user.id;

    // 4. Insert into the database users table using Drizzle
    const [insertedUser] = await db
      .insert(users)
      .values({
        authId: newAuthId,
        fullName: input.fullName,
        phone: input.phone || null,
      })
      .returning();

    // 5. Insert into the userRoles table
    await db.insert(userRoles).values({
      userId: insertedUser.id,
      role: input.role,
    });

    return { success: true, user: insertedUser };
  } catch (err: any) {
    return { success: false, error: err?.message || "An unexpected server error occurred." };
  }
}

export async function getCustomersAction() {
  try {
    const adminClient = getSupabaseAdmin();
    const { data: { users: authUsers }, error: authError } = await adminClient.auth.admin.listUsers();
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
    const existing = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, numericId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(userRoles)
        .set({ role })
        .where(eq(userRoles.userId, numericId));
    } else {
      await db
        .insert(userRoles)
        .values({ userId: numericId, role });
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update role." };
  }
}

export async function toggleCustomerBlockStatusAction(customerId: string, isBlocked: boolean) {
  try {
    const numericId = parseInt(customerId, 10);
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, numericId))
      .limit(1);

    if (!dbUser || !dbUser.authId) {
      return { success: false, error: "User not found." };
    }

    const adminClient = getSupabaseAdmin();
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
