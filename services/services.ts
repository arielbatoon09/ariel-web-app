"use server";

import { getErrorMessage } from "@/lib/error-utils";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import {
  getServicesQuery,
  getServiceByIdQuery,
  insertServiceQuery,
  updateServiceQuery,
  deleteServicesQuery,
  getServiceBySlugQuery,
} from "@/data/services";
import type { Service } from "@/schemas/dashboard";
import { revalidateServicesPaths } from "@/lib/revalidate-cms";
import { redisGet, redisSet, redisDel } from "@/lib/redis";

async function checkAdminAccess() {
  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return { authorized: false, error: "Unauthorized: Please log in." };
  }

  const dbUser = await getUserByAuthId(currentUser.id);
  if (!dbUser) {
    return { authorized: false, error: "Unauthorized: Account not found." };
  }

  const role = await getUserRoleByUserId(dbUser.id);
  if (role !== "admin") {
    return { authorized: false, error: "Unauthorized: Admin privileges required." };
  }

  return { authorized: true };
}

async function invalidateServicesCache() {
  await Promise.all([
    redisDel("admin:services"),
    redisDel("admin:overview"),
  ]);
}

// 1. Get all services (Public/Admin)
export async function getServicesAction() {
  try {
    const cacheKey = "admin:services";
    const cachedServices = await redisGet<Service[]>(cacheKey);
    if (cachedServices) {
      return { success: true, services: cachedServices };
    }

    const servicesList = await getServicesQuery();
    await redisSet(cacheKey, servicesList, 3600); // 1 hour TTL
    return {
      success: true,
      services: servicesList,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to fetch services.") };
  }
}

// 2. Get single service by ID
export async function getServiceByIdAction(id: string) {
  try {
    const service = await getServiceByIdQuery(id);
    if (!service) {
      return { success: false, error: "Service not found." };
    }
    return {
      success: true,
      service,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to fetch service details.") };
  }
}

// 2b. Get single service by Slug
export async function getServiceBySlugAction(slug: string) {
  try {
    const service = await getServiceBySlugQuery(slug);
    if (!service) {
      return { success: false, error: "Service not found." };
    }
    return {
      success: true,
      service,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to fetch service details.") };
  }
}

// 3. Create service (Admin only)
export async function createServiceAction(data: Omit<Service, "id">) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const newService = await insertServiceQuery(data);
    revalidateServicesPaths(newService.slug);
    await invalidateServicesCache();
    return {
      success: true,
      service: newService,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to create service.") };
  }
}

// 4. Update service (Admin only)
export async function updateServiceAction(id: string, data: Partial<Service>) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const existing = await getServiceByIdQuery(id);
    const updated = await updateServiceQuery(id, data);
    if (!updated) {
      return { success: false, error: "Service not found or update failed." };
    }
    revalidateServicesPaths(updated.slug);
    if (existing?.slug && existing.slug !== updated.slug) {
      revalidateServicesPaths(existing.slug);
    }
    await invalidateServicesCache();
    return {
      success: true,
      service: updated,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to update service.") };
  }
}

// 5. Toggle service status (Admin only)
export async function toggleServiceStatusAction(id: string) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const service = await getServiceByIdQuery(id);
    if (!service) {
      return { success: false, error: "Service not found." };
    }

    const updated = await updateServiceQuery(id, { disabled: !service.disabled });
    revalidateServicesPaths(service.slug);
    await invalidateServicesCache();
    return {
      success: true,
      disabled: updated?.disabled,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to toggle service status.") };
  }
}

// 6. Delete services (Admin only)
export async function deleteServicesAction(ids: string[]) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const deleted = await deleteServicesQuery(ids);
    revalidateServicesPaths();
    for (const service of deleted) {
      revalidateServicesPaths(service.slug);
    }
    await invalidateServicesCache();
    return {
      success: true,
      services: deleted,
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to delete services.") };
  }
}
