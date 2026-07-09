"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useOrdersQuery } from "@/hooks/use-orders";
import { useTransactionsQuery } from "@/hooks/use-transactions";
import { useWorksQuery } from "@/hooks/use-works";
import { useArticlesQuery } from "@/hooks/use-articles";
import { useCustomersQuery } from "@/hooks/use-customers";

import { AdminOverviewHeader } from "./admin-overview-header";
import { AdminOverviewMetrics } from "./admin-overview-metrics";
import { AdminOverviewDetails } from "./admin-overview-details";

export function AdminOverviewClient() {
  const { data: orders = [], isLoading: isLoadingOrders } = useOrdersQuery();
  const { data: transactions = [], isLoading: isLoadingTx } = useTransactionsQuery();
  const { data: works = [], isLoading: isLoadingWorks } = useWorksQuery();
  const { data: articles = [], isLoading: isLoadingArticles } = useArticlesQuery();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomersQuery();

  // Calculations
  const totalSales = useMemo(() => {
    return transactions
      .filter((tx) => tx.status === "successful")
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === "pending" || o.status === "in-progress" || o.status === "revision_requested").length;
  }, [orders]);

  const recentCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
      .slice(0, 3);
  }, [customers]);

  const isLoading = isLoadingOrders || isLoadingTx || isLoadingWorks || isLoadingArticles || isLoadingCustomers;

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
      <AdminOverviewMetrics
        totalSales={totalSales}
        activeOrdersCount={activeOrdersCount}
        worksCount={works.length}
        articlesCount={articles.length}
      />
      <AdminOverviewDetails
        orders={orders}
        transactions={transactions}
        recentCustomers={recentCustomers}
      />
    </div>
  );
}
