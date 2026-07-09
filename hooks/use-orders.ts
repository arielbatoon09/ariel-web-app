"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getOrdersAction, getOrderByIdAction, createOrderAction, updateOrderStatusAction, deleteOrdersAction } from "@/services/orders";
import type { Order } from "@/schemas/dashboard";

export const ORDERS_QUERY_KEY = ["orders"];

export function useOrdersQuery() {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: async () => {
      const res = await getOrdersAction();
      if (!res.success || !res.orders) {
        throw new Error(res.error || "Failed to load orders.");
      }
      return res.orders as Order[];
    },
  });
}

export function useOrderDetailQuery(id: string) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, id],
    queryFn: async () => {
      const res = await getOrderByIdAction(id);
      if (!res.success || !res.order) {
        throw new Error(res.error || "Failed to load order details.");
      }
      return res.order as Order;
    },
    enabled: !!id,
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      serviceId: string;
      serviceName: string;
      serviceBasePrice: number;
      customerName: string;
      customerEmail: string;
      addOnsSelected: string[];
      addOns: Array<{ name: string; price: number }>;
      totalAmount: number;
      referenceNumber?: string;
      customerPhone?: string;
      requirements?: string;
    }) => {
      const res = await createOrderAction(data);
      if (!res.success || !res.order) {
        throw new Error(res.error || "Failed to submit order.");
      }
      return res.order;
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to place order.");
    },
  });
}

export function useUpdateOrderStatusMutation(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; status: "pending" | "in-progress" | "completed" | "cancelled" }) => {
      const res = await updateOrderStatusAction(payload.id, payload.status);
      if (!res.success || !res.order) {
        throw new Error(res.error || "Failed to update order status.");
      }
      return res.order;
    },
    onSuccess: (updatedOrder) => {
      toast.success(`Order status updated to ${updatedOrder.status}.`);
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      if (id) {
        queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, id] });
      }
      queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, updatedOrder.id] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update order status.");
    },
  });
}

export function useDeleteOrdersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await deleteOrdersAction(ids);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete orders.");
      }
      return ids;
    },
    onSuccess: () => {
      toast.success("Selected orders deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete orders.");
    },
  });
}
