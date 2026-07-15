import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order, Service } from "@/schemas/dashboard";

interface CustomerOverviewTableProps {
  orders: Order[];
  services: Service[];
}

export function CustomerOverviewTable({ orders, services }: CustomerOverviewTableProps) {
  const getServiceName = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.name || "Software Package";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-sans text-sm font-bold text-foreground">Recent Activities & Orders</h2>
          <p className="font-mono text-[10px] text-neutral-500">Tracking of current project status deliverables</p>
        </div>
        {orders.length > 0 && (
          <Link
            href="/customer/orders"
            className="group inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 transition-colors hover:cursor-pointer hover:text-foreground"
          >
            All Orders
            <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      <div className="border border-neutral-300 bg-neutral-50/50 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/40">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-100 font-mono text-[10px] uppercase dark:border-neutral-700 dark:bg-neutral-900/80">
                <th className="p-4 font-normal text-neutral-500">Order ID</th>
                <th className="p-4 font-normal text-neutral-500">Service Title</th>
                <th className="p-4 font-normal text-neutral-500">Date Ordered</th>
                <th className="p-4 font-normal text-neutral-500">Status</th>
                <th className="p-4 text-right font-normal text-neutral-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-900/20">
                  <td className="dark:text-neutral-150 p-4 font-mono font-bold text-neutral-900">
                    <Link href={`/customer/order/${order.id}`} className="hover:underline">
                      {order.id.slice(0, 8)}...
                    </Link>
                  </td>
                  <td className="p-4 font-medium text-neutral-800 dark:text-neutral-200">{getServiceName(order.serviceId)}</td>
                  <td className="p-4 text-neutral-500">{order.createdAt.split("T")[0]}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[9px] uppercase",
                        order.status === "completed" && "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
                        order.status === "delivered" && "border-green-450/30 bg-green-450/10 text-green-600 dark:text-green-400",
                        order.status === "in-progress" && "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
                        order.status === "revision_requested" && "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
                        order.status === "pending" && "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
                        order.status === "cancelled" && "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                      )}
                    >
                      <span
                        className={cn(
                          "size-1 rounded-full",
                          (order.status === "completed" || order.status === "delivered") && "bg-green-500",
                          order.status === "in-progress" && "bg-blue-500",
                          order.status === "revision_requested" && "bg-rose-500",
                          order.status === "pending" && "bg-yellow-500",
                          order.status === "cancelled" && "bg-red-500"
                        )}
                      />
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="dark:text-neutral-150 p-4 text-right font-mono font-medium text-neutral-900">
                    ₱{order.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-neutral-450 py-8 text-center font-mono">
                    No order records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
