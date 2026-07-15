import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order, Transaction, Customer } from "@/schemas/dashboard";

interface AdminOverviewDetailsProps {
  orders: Order[];
  transactions: Transaction[];
  recentCustomers: Customer[];
}

export function AdminOverviewDetails({ orders, transactions, recentCustomers }: AdminOverviewDetailsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Recent Orders Panel */}
      <div className="relative border border-neutral-300 bg-neutral-50/20 p-5 lg:col-span-5 dark:border-neutral-700 dark:bg-neutral-900/10">
        <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 -translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="group inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 transition-colors hover:cursor-pointer hover:text-foreground"
          >
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
                <Link href={`/admin/orders/${order.id}`} className="font-sans text-xs font-bold text-foreground hover:underline">
                  {order.customerName}
                </Link>
                <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500">{order.customerEmail}</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-medium">₱{order.totalAmount.toLocaleString()}</span>
                <span
                  className={cn(
                    "ml-2.5 inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase",
                    order.status === "completed" &&
                      "border-green-200 bg-green-50 text-green-600 dark:border-green-900/30 dark:bg-green-950/15 dark:text-green-400",
                    order.status === "delivered" && "border-green-500/30 bg-green-500/5 text-green-600 dark:border-green-500/20 dark:text-green-400",
                    order.status === "in-progress" &&
                      "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/30 dark:bg-blue-950/15 dark:text-blue-400",
                    order.status === "revision_requested" &&
                      "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/30 dark:bg-rose-950/15 dark:text-rose-400",
                    order.status === "pending" &&
                      "border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-900/30 dark:bg-yellow-950/15 dark:text-yellow-400",
                    order.status === "cancelled" &&
                      "border-red-200 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-950/15 dark:text-red-400"
                  )}
                >
                  {order.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-neutral-450 py-6 text-center font-mono">No orders registered yet.</p>}
        </div>
      </div>

      {/* Recent Payments Panel */}
      <div className="relative border border-neutral-300 bg-neutral-50/20 p-5 lg:col-span-3 dark:border-neutral-700 dark:bg-neutral-900/10">
        <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 -translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">Recent Payments</h3>
          <Link
            href="/admin/transactions"
            className="group inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 transition-colors hover:cursor-pointer hover:text-foreground"
          >
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
                <p className="font-mono text-[10px] font-bold text-foreground">{tx.referenceNumber || tx.id}</p>
                <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500">{tx.date.split("T")[0]}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-foreground">₱{tx.amount.toLocaleString()}</p>
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase",
                    tx.status === "successful" ? "text-green-500" : tx.status === "failed" ? "text-red-500" : "text-yellow-500"
                  )}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
          {transactions.length === 0 && <p className="text-neutral-455 py-6 text-center font-mono">No payment records found.</p>}
        </div>
      </div>

      {/* Recent Customers Panel */}
      <div className="relative border border-neutral-300 bg-neutral-50/20 p-5 lg:col-span-4 dark:border-neutral-700 dark:bg-neutral-900/10">
        <div className="pointer-events-none absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 -translate-x-1/2 translate-y-1/2 text-[10px] text-neutral-300 select-none dark:text-neutral-700">
          +
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">Recent Customers</h3>
          <Link
            href="/admin/customers"
            className="group inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 transition-colors hover:cursor-pointer hover:text-foreground"
          >
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
                <p className="text-neutral-450 font-mono text-[9px] dark:text-neutral-500">{cust.email}</p>
              </div>
              <div className="text-right">
                <p className="text-neutral-450 font-mono text-[9px] uppercase dark:text-neutral-500">{cust.joinedAt}</p>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.25 font-mono text-[8px] font-bold uppercase",
                    cust.role === "admin"
                      ? "border border-amber-200 bg-amber-50/50 text-amber-600 dark:border-amber-900/30 dark:bg-amber-950/15"
                      : "border border-neutral-200 bg-neutral-50/50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/40"
                  )}
                >
                  {cust.role}
                </span>
              </div>
            </div>
          ))}
          {recentCustomers.length === 0 && <p className="text-neutral-455 py-6 text-center font-mono">No customers registered.</p>}
        </div>
      </div>
    </div>
  );
}
