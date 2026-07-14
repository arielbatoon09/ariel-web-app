"use server";

import { getErrorMessage } from "@/lib/error-utils";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import { getCategoriesQuery, insertCategoryQuery, updateCategoryQuery, deleteCategoriesQuery } from "@/data/categories";
import { redisGet, redisSet, redisDel } from "@/lib/redis";

async function verifyAdminAccess() {
  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    throw new Error("Unauthorized: Please log in.");
  }
  const dbUser = await getUserByAuthId(currentUser.id);
  if (!dbUser) {
    throw new Error("Unauthorized: User account not found in database.");
  }
  const currentRole = await getUserRoleByUserId(dbUser.id);
  if (currentRole !== "admin") {
    throw new Error("Unauthorized: You do not have permission to perform this action.");
  }
}

async function invalidateCategoriesCache() {
  await Promise.all([
    redisDel("admin:categories"),
    redisDel("admin:overview"),
  ]);
}

export async function getCategoriesAction() {
  try {
    const cacheKey = "admin:categories";
    const cachedCategories = await redisGet<unknown[]>(cacheKey);
    if (cachedCategories) {
      return { success: true, categories: cachedCategories as unknown as Awaited<ReturnType<typeof getCategoriesQuery>> };
    }

    const categories = await getCategoriesQuery();
    await redisSet(cacheKey, categories, 3600); // 1 hour TTL
    return { success: true, categories };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to load categories.") };
  }
}

export async function createCategoryAction(input: { name: string; slug: string; target: "works" | "articles" | "both" }) {
  try {
    await verifyAdminAccess();
    const newCategory = await insertCategoryQuery(input);
    await invalidateCategoriesCache();
    return { success: true, category: newCategory };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to create category.") };
  }
}

export async function updateCategoryAction(
  id: string,
  input: { name?: string; slug?: string; target?: "works" | "articles" | "both"; disabled?: boolean }
) {
  try {
    await verifyAdminAccess();
    const updated = await updateCategoryQuery(id, input);
    if (!updated) {
      return { success: false, error: "Category not found." };
    }
    await invalidateCategoriesCache();
    return { success: true, category: updated };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to update category.") };
  }
}

export async function toggleCategoryStatusAction(id: string) {
  try {
    await verifyAdminAccess();
    const categoriesList = await getCategoriesQuery();
    const category = categoriesList.find((c) => c.id === id);
    if (!category) {
      return { success: false, error: "Category not found." };
    }
    const updated = await updateCategoryQuery(id, { disabled: !category.disabled });
    await invalidateCategoriesCache();
    return { success: true, category: updated };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to toggle category status.") };
  }
}

export async function deleteCategoriesAction(ids: string[]) {
  try {
    await verifyAdminAccess();
    const deleted = await deleteCategoriesQuery(ids);
    await invalidateCategoriesCache();
    return { success: true, deleted };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Failed to delete categories.") };
  }
}
