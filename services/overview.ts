"use server";

import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import { redisGet, redisSet } from "@/lib/redis";
import { getWorksAction } from "./works";
import { getArticlesAction } from "./articles";
import { getOrdersAction } from "./orders";
import { getTransactionsAction } from "./transactions";
import { getCustomersAction } from "./customers";
import type { Project, Article, Order, Transaction, Customer } from "@/schemas/dashboard";

interface OverviewData {
  works: Project[];
  articles: Article[];
  orders: Order[];
  transactions: Transaction[];
  customers: Customer[];
}

export async function getAdminOverviewDataAction() {
  try {
    // 1. Verify Authentication & Admin Role
    const user = await getCurrentSessionUser();
    if (!user) return { success: false, error: "Unauthorized: Please log in." };

    const dbUser = await getUserByAuthId(user.id);
    if (!dbUser) return { success: false, error: "Unauthorized: Database user not found." };

    const role = await getUserRoleByUserId(dbUser.id);
    if (role !== "admin") return { success: false, error: "Unauthorized: Admin privileges required." };

    // 2. Check Redis Cache
    const cacheKey = "admin:overview";
    const cachedData = await redisGet<OverviewData>(cacheKey);
    if (cachedData) {
      return { success: true, overview: cachedData };
    }

    // 3. Fetch all dashboard dependencies in parallel
    const [worksRes, articlesRes, ordersRes, transactionsRes, customersRes] = await Promise.all([
      getWorksAction(),
      getArticlesAction(),
      getOrdersAction(),
      getTransactionsAction(),
      getCustomersAction(),
    ]);

    const overviewData = {
      works: worksRes.success ? worksRes.works || [] : [],
      articles: articlesRes.success ? articlesRes.articles || [] : [],
      orders: ordersRes.success ? ordersRes.orders || [] : [],
      transactions: transactionsRes.success ? transactionsRes.transactions || [] : [],
      customers: customersRes.success ? customersRes.customers || [] : [],
    };

    // 4. Save to Redis Cache (60 seconds TTL)
    await redisSet(cacheKey, overviewData, 60);

    return { success: true, overview: overviewData };
  } catch (err: unknown) {
    console.error("GET ADMIN OVERVIEW DATA ERROR:", err);
    return { success: false, error: "Failed to load dashboard overview data." };
  }
}
