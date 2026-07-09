"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getOrderMessagesAction,
  sendOrderMessageAction,
  deliverOrderAction,
  approveOrderDeliveryAction,
  requestOrderRevisionAction,
  type ChatMessage,
} from "@/services/order-chat";

export const ORDER_CHAT_QUERY_KEY = ["order-chat"];

export function useOrderChatQuery(orderId: string) {
  return useQuery({
    queryKey: [...ORDER_CHAT_QUERY_KEY, orderId],
    queryFn: async () => {
      const res = await getOrderMessagesAction(orderId);
      if (!res.success || !res.messages) {
        throw new Error(res.error || "Failed to load chat messages.");
      }
      return res.messages as ChatMessage[];
    },
    enabled: !!orderId,
  });
}

export function useSendOrderMessageMutation(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { message: string; attachment?: { url: string; name: string } }) => {
      const res = await sendOrderMessageAction(orderId, data.message, data.attachment);
      if (!res.success || !res.message) {
        throw new Error(res.error || "Failed to send message.");
      }
      return res.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ORDER_CHAT_QUERY_KEY, orderId] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useDeliverOrderMutation(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { deliveryMessage: string; attachment?: { url: string; name: string } }) => {
      const res = await deliverOrderAction(orderId, data.deliveryMessage, data.attachment);
      if (!res.success) {
        throw new Error(res.error || "Failed to deliver order.");
      }
      return res.message;
    },
    onSuccess: () => {
      toast.success("Project successfully marked as delivered!");
      queryClient.invalidateQueries({ queryKey: [...ORDER_CHAT_QUERY_KEY, orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useApproveOrderDeliveryMutation(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await approveOrderDeliveryAction(orderId);
      if (!res.success) {
        throw new Error(res.error || "Failed to approve delivery.");
      }
      return true;
    },
    onSuccess: () => {
      toast.success("Delivery approved! Order marked as completed.");
      queryClient.invalidateQueries({ queryKey: [...ORDER_CHAT_QUERY_KEY, orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useRequestOrderRevisionMutation(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: string) => {
      const res = await requestOrderRevisionAction(orderId, feedback);
      if (!res.success) {
        throw new Error(res.error || "Failed to request revisions.");
      }
      return true;
    },
    onSuccess: () => {
      toast.success("Revision request submitted to the engineer.");
      queryClient.invalidateQueries({ queryKey: [...ORDER_CHAT_QUERY_KEY, orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
