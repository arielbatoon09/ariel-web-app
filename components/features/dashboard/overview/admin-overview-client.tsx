"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useAdminOverviewQuery } from "@/hooks/use-overview";
import type { Order, Transaction } from "@/schemas/dashboard";

import { AdminOverviewHeader } from "./admin-overview-header";
import { AdminOverviewMetrics } from "./admin-overview-metrics";
import { AdminOverviewDetails } from "./admin-overview-details";

export function AdminOverviewClient() {
  const { data: overview, isLoading } = useAdminOverviewQuery();

  const orders = useMemo(() => overview?.orders || [], [overview?.orders]);
  const transactions = useMemo(() => overview?.transactions || [], [overview?.transactions]);
  const works = useMemo(() => overview?.works || [], [overview?.works]);
  const articles = useMemo(() => overview?.articles || [], [overview?.articles]);
  const customers = useMemo(() => overview?.customers || [], [overview?.customers]);

  // Calculations
  const totalSales = useMemo(() => {
    return transactions.filter((tx: Transaction) => tx.status === "successful").reduce((sum: number, tx: Transaction) => sum + tx.amount, 0);
  }, [transactions]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter((o: Order) => o.status === "pending" || o.status === "in-progress" || o.status === "revision_requested").length;
  }, [orders]);

  const recentCustomers = useMemo(() => {
    return [...customers].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()).slice(0, 3);
  }, [customers]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminOverviewHeader />
      <AdminOverviewMetrics totalSales={totalSales} activeOrdersCount={activeOrdersCount} worksCount={works.length} articlesCount={articles.length} />
      <AdminOverviewDetails orders={orders} transactions={transactions} recentCustomers={recentCustomers} />
    </div>
  );
}
