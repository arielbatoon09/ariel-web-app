"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomerOrdersAction } from "@/services/orders";
import type { Order } from "@/schemas/dashboard";

export const CUSTOMER_ORDERS_QUERY_KEY = ["customer-orders"];

export function useCustomerOrdersQuery() {
  return useQuery({
    queryKey: CUSTOMER_ORDERS_QUERY_KEY,
    queryFn: async () => {
      const res = await getCustomerOrdersAction();
      if (!res.success || !res.orders) {
        throw new Error(res.error || "Failed to load customer orders.");
      }
      return res.orders as Order[];
    },
  });
}
