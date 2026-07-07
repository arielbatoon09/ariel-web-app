"use client";

import * as React from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { DataTable } from "@/components/features/dashboard/data-table";
import type { Transaction } from "@/schemas/dashboard";
import { cn } from "@/lib/utils";

export default function AdminTransactionsPage() {
  const { transactions, updateTransactionStatus } = useDashboardStore();

  const handleToggleStatus = (tx: Transaction) => {
    const nextStatus: Transaction["status"] = tx.status === "successful" ? "failed" : tx.status === "failed" ? "pending" : "successful";
    updateTransactionStatus(tx.id, nextStatus);
  };

  const columns = [
    {
      header: "Transaction ID",
      accessorKey: (item: Transaction) => <code className="font-mono text-xs text-neutral-500">{item.id}</code>,
    },
    {
      header: "Associated Order",
      accessorKey: (item: Transaction) => <code className="font-mono text-xs text-neutral-500">{item.orderId}</code>,
    },
    {
      header: "Gross Amount",
      accessorKey: (item: Transaction) => <span className="font-mono text-xs font-bold text-foreground">₱{item.amount.toLocaleString()}</span>,
    },
    {
      header: "Payment Method",
      accessorKey: "paymentMethod" as keyof Transaction,
    },
    {
      header: "Logged Time",
      accessorKey: "date" as keyof Transaction,
    },
    {
      header: "Payment Status",
      accessorKey: (item: Transaction) => (
        <button
          onClick={() => handleToggleStatus(item)}
          className={cn(
            "rounded px-2 py-0.5 font-mono text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105",
            item.status === "successful" &&
              "border border-green-200 bg-green-50 text-green-600 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400",
            item.status === "pending" &&
              "border border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-900/40 dark:bg-yellow-950/20 dark:text-yellow-400",
            item.status === "failed" && "border border-red-200 bg-red-50 text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
          )}
          title="Click to toggle status"
        >
          {item.status}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">Transactions</h1>
        <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">AUDIT LOGS OF BILLING INVOICES AND TRANSACTION RECEIPTS</p>
      </div>

      <DataTable<Transaction> data={transactions} columns={columns} searchKey="id" searchPlaceholder="Search Transaction ID..." />
    </div>
  );
}
