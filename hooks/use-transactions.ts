"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-utils";
import { getTransactionsAction, createTransactionAction, updateTransactionStatusAction } from "@/services/transactions";
import type { Transaction } from "@/schemas/dashboard";

export const TRANSACTIONS_QUERY_KEY = ["transactions"];

export function useTransactionsQuery() {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await getTransactionsAction();
      if (!res.success || !res.transactions) {
        throw new Error(res.error || "Failed to load transactions.");
      }
      return res.transactions as Transaction[];
    },
  });
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { orderId: string; amount: number; paymentMethod: string; referenceNumber: string; screenshotUrl: string }) => {
      const res = await createTransactionAction(data);
      if (!res.success || !res.transaction) {
        throw new Error(res.error || "Failed to submit transaction receipt.");
      }
      return res.transaction;
    },
    onSuccess: () => {
      toast.success("Transaction proof submitted successfully!");
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to submit transaction proof."));
    },
  });
}

export function useUpdateTransactionStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; status: "successful" | "failed" | "pending" }) => {
      const res = await updateTransactionStatusAction(payload.id, payload.status);
      if (!res.success || !res.transaction) {
        throw new Error(res.error || "Failed to update transaction status.");
      }
      return res.transaction;
    },
    onSuccess: (updatedTx) => {
      toast.success(`Transaction status updated to ${updatedTx.status}.`);
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", updatedTx.orderId] });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to update transaction status."));
    },
  });
}
