"use client";

import * as React from "react";
import { useTransactionsQuery, useUpdateTransactionStatusMutation } from "@/hooks/use-transactions";
import { DataTable } from "@/components/common/data-table";
import type { Transaction } from "@/schemas/dashboard";
import { cn } from "@/lib/utils";

export function TransactionTable() {
  const { data: transactions = [], isLoading } = useTransactionsQuery();
  const updateStatusMutation = useUpdateTransactionStatusMutation();

  const handleToggleStatus = (tx: Transaction) => {
    const nextStatus: Transaction["status"] =
      tx.status === "successful" ? "failed" : tx.status === "failed" ? "pending" : "successful";
    updateStatusMutation.mutate({ id: tx.id, status: nextStatus });
  };

  const columns = [
    {
      header: "Transaction ID",
      accessorKey: (item: Transaction) => <code className="font-mono text-xs text-neutral-500">{item.id}</code>,
    },
    {
      header: "Order ID Reference",
      accessorKey: (item: Transaction) => <code className="font-mono text-xs text-neutral-500">{item.orderId}</code>,
    },
    {
      header: "Reference Number",
      accessorKey: (item: Transaction) => <code className="font-mono text-xs font-bold text-foreground">{item.referenceNumber}</code>,
    },
    {
      header: "Gross Amount",
      accessorKey: (item: Transaction) => <span className="font-mono text-xs font-bold text-foreground">₱{item.amount.toLocaleString()}</span>,
    },
    {
      header: "Payment Channel",
      accessorKey: (item: Transaction) => <span className="font-sans font-medium uppercase text-neutral-600 dark:text-neutral-400">{item.paymentMethod}</span>,
    },
    {
      header: "Submitted Time",
      accessorKey: (item: Transaction) => (
        <span className="font-mono text-xs text-neutral-500">
          {new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      header: "Audit Verification",
      accessorKey: (item: Transaction) => (
        <button
          onClick={() => handleToggleStatus(item)}
          className={cn(
            "rounded px-2 py-0.5 font-mono text-[9px] tracking-wider uppercase transition-all duration-300 hover:scale-105",
            item.status === "successful" &&
              "border border-green-200 bg-green-50 text-green-600 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400",
            item.status === "pending" &&
              "border border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-900/40 dark:bg-yellow-950/20 dark:text-yellow-400",
            item.status === "failed" && "border border-red-200 bg-red-50 text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
          )}
          title="Click to cycle status: pending -> successful -> failed"
        >
          {item.status}
        </button>
      ),
    },
  ];

  return (
    <DataTable<Transaction>
      data={transactions}
      columns={columns}
      isLoading={isLoading}
      searchKey="referenceNumber"
      searchPlaceholder="Search Reference Number..."
    />
  );
}
