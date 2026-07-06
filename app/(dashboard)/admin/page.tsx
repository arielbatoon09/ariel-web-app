"use client";

import Link from "next/link";
import * as React from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { DollarSign, ShoppingBag, Briefcase, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { works, articles, orders, transactions, customers } = useDashboardStore();

  // Calculations
  const totalSales = transactions
    .filter((tx) => tx.status === "successful")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const activeOrdersCount = orders.filter(
    (o) => o.status === "pending" || o.status === "in-progress"
  ).length;

  const recentCustomers = React.useMemo(() => {
    return [...customers]
      .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
      .slice(0, 3);
  }, [customers]);

  const stats = [
    {
      label: "Total Sales",
      value: `₱${totalSales.toLocaleString()}`,
      icon: <DollarSign className="size-4 text-neutral-400" />,
      description: "Sum of successful transactions",
    },
    {
      label: "Active Orders",
      value: activeOrdersCount,
      icon: <ShoppingBag className="size-4 text-neutral-400" />,
      description: "Orders pending or in progress",
    },
    {
      label: "Works Published",
      value: works.length,
      icon: <Briefcase className="size-4 text-neutral-400" />,
      description: "Case studies in portfolio",
    },
    {
      label: "Articles Published",
      value: articles.length,
      icon: <FileText className="size-4 text-neutral-400" />,
      description: "Blog posts written",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="space-y-2.5">
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">Dashboard Overview</h1>
        <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">SYSTEM STATUS: OPERATIONAL</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="relative border border-neutral-300 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900/60"
          >
            {/* Corners intersection plus markers */}
            <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">+</div>
            <div className="pointer-events-none absolute left-0 bottom-0 z-20 -translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">+</div>

            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase dark:text-neutral-500">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="mt-2.5">
              <span className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">{stat.value}</span>
              <p className="mt-1 text-[10px] text-neutral-505 dark:text-neutral-400">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Split layout for Orders, Payments and Customers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Orders Panel */}
        <div className="relative border border-neutral-300 bg-neutral-50/20 p-5 lg:col-span-5 dark:border-neutral-700 dark:bg-neutral-900/10">
          <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">+</div>
          <div className="pointer-events-none absolute left-0 bottom-0 z-20 -translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">+</div>

          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-foreground">Recent Orders</h3>
            <Link href="/admin/orders" className="group inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 transition-colors hover:text-foreground">
              Manage Orders
              <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b border-neutral-200 pb-3 last:border-b-0 last:pb-0 dark:border-neutral-800"
              >
                <div>
                  <p className="font-sans text-xs font-bold text-foreground">{order.customerName}</p>
                  <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500">{order.customerEmail}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-medium">₱{order.totalAmount.toLocaleString()}</span>
                  <span className={cn(
                    "ml-2.5 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase",
                    order.status === "completed" && "bg-green-50/55 text-green-600 border border-green-200 dark:bg-green-950/15 dark:text-green-400 dark:border-green-900/30",
                    order.status === "in-progress" && "bg-blue-50/55 text-blue-600 border border-blue-200 dark:bg-blue-950/15 dark:text-blue-400 dark:border-blue-900/30",
                    order.status === "pending" && "bg-yellow-50/55 text-yellow-600 border border-yellow-200 dark:bg-yellow-950/15 dark:text-yellow-400 dark:border-yellow-900/30",
                    order.status === "cancelled" && "bg-red-50/55 text-red-600 border border-red-200 dark:bg-red-950/15 dark:text-red-400 dark:border-red-900/30"
                  )}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments Panel */}
        <div className="relative border border-neutral-300 bg-neutral-50/20 p-5 lg:col-span-3 dark:border-neutral-700 dark:bg-neutral-900/10">
          <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">+</div>
          <div className="pointer-events-none absolute left-0 bottom-0 z-20 -translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">+</div>

          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-foreground">Recent Payments</h3>
            <Link href="/admin/transactions" className="group inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 transition-colors hover:text-foreground">
              Audit Logs
              <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {transactions.slice(0, 3).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b border-neutral-200 pb-3 last:border-b-0 last:pb-0 dark:border-neutral-800"
              >
                <div>
                  <p className="font-mono text-[10px] text-foreground">{tx.id}</p>
                  <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs font-bold text-foreground">₱{tx.amount.toLocaleString()}</p>
                  <span className={cn(
                    "text-[9px] font-mono",
                    tx.status === "successful" ? "text-green-500" : tx.status === "failed" ? "text-red-500" : "text-yellow-500"
                  )}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Customers Panel */}
        <div className="relative border border-neutral-300 bg-neutral-50/20 p-5 lg:col-span-4 dark:border-neutral-700 dark:bg-neutral-900/10">
          <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">+</div>
          <div className="pointer-events-none absolute left-0 bottom-0 z-20 -translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">+</div>

          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-foreground">Recent Customers</h3>
            <Link href="/admin/customers" className="group inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 transition-colors hover:text-foreground">
              Manage Users
              <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {recentCustomers.map((cust) => (
              <div
                key={cust.id}
                className="flex items-center justify-between border-b border-neutral-200 pb-3 last:border-b-0 last:pb-0 dark:border-neutral-800"
              >
                <div>
                  <p className="font-sans text-xs font-bold text-foreground">{cust.name}</p>
                  <p className="font-mono text-[9px] text-neutral-450 dark:text-neutral-500">{cust.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] text-neutral-450 dark:text-neutral-500 uppercase">{cust.joinedAt}</p>
                  <span className={cn(
                    "rounded px-1.5 py-0.25 font-mono text-[8px] uppercase font-bold",
                    cust.role === "admin" ? "bg-amber-50/50 text-amber-600 border border-amber-200 dark:bg-amber-950/15 dark:border-amber-900/30" : "bg-neutral-50/50 text-neutral-500 border border-neutral-200 dark:bg-neutral-900/40 dark:border-neutral-800"
                  )}>
                    {cust.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
