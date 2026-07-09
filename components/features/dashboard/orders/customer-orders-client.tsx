"use client";

import { useCustomerOrdersQuery } from "@/hooks/use-customer-orders";
import { useServicesQuery } from "@/hooks/use-services";
import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, AlertCircle, FileText, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { Order, Service } from "@/schemas/dashboard";

interface CustomerOrdersClientProps {
  initialOrders: Order[];
  initialServices: Service[];
}

export function CustomerOrdersClient({ initialOrders, initialServices }: CustomerOrdersClientProps) {
  // Use React Query for dynamic updates, with server-fetched data as initialData
  const { data: orders = initialOrders } = useCustomerOrdersQuery();
  const { data: services = initialServices } = useServicesQuery();

  const getServiceName = (serviceId: string) => {
    const s = services.find((srv) => srv.id === serviceId);
    return s ? s.name : "Custom Development Service";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-500 uppercase">
            <Clock className="size-3" /> Pending Verification
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-blue-500 uppercase">
            <Loader2 className="size-3 animate-spin" /> In Progress
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-green-600 font-bold uppercase animate-pulse dark:text-green-400">
            <AlertCircle className="size-3" /> Delivered (Action Required)
          </span>
        );
      case "revision_requested":
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-rose-500 uppercase">
            <Clock className="size-3" /> Revision Requested
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-green-550 uppercase">
            <CheckCircle2 className="size-3" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header Panel */}
      <div className="border border-neutral-300 bg-neutral-50/50 p-6 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/40">
        <h1 className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">My Active Orders</h1>
        <p className="mt-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
          Track production progress, view submitted deliverables, and collaborate with your engineer in real-time.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-800">
          <FileText className="size-6 text-neutral-400" />
          <span className="font-mono text-xs text-neutral-400">No active invoices or orders found for your account email.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => {
            const hasActionRequired = order.status === "delivered";

            return (
              <div
                key={order.id}
                className={cn(
                  "group relative border p-6 transition-all duration-300",
                  hasActionRequired
                    ? "border-green-400 bg-green-50/5 dark:border-green-500/50 dark:bg-green-950/5"
                    : "border-neutral-300 hover:border-neutral-800 dark:border-neutral-700 dark:hover:border-neutral-400"
                )}
              >
                {/* Decorative border brackets for active items */}
                {hasActionRequired && (
                  <>
                    <div className="pointer-events-none absolute -top-px -left-px size-2 border-t-2 border-l-2 border-green-500" />
                    <div className="pointer-events-none absolute -top-px -right-px size-2 border-t-2 border-r-2 border-green-500" />
                    <div className="pointer-events-none absolute -bottom-px -left-px size-2 border-b-2 border-l-2 border-green-500" />
                    <div className="pointer-events-none absolute -right-px -bottom-px size-2 border-r-2 border-b-2 border-green-500" />
                  </>
                )}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold text-neutral-400">
                        REF #{order.referenceNumber || order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <h3 className="font-sans text-base font-bold text-foreground">
                      {getServiceName(order.serviceId)}
                    </h3>
                    <div className="flex items-center gap-4 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      <span>Total: ₱{order.totalAmount.toLocaleString()}</span>
                      <span>•</span>
                      <span>Order Date: {order.createdAt.split("T")[0]}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                    <Link
                      href={`/customer/order/${order.id}`}
                      className={cn(
                        "inline-flex h-9 items-center justify-center gap-1.5 px-4 font-mono text-[10px] uppercase tracking-wider transition-all duration-200",
                        hasActionRequired
                          ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                          : "border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900"
                      )}
                    >
                      <MessageSquareQuote className="size-3.5" />
                      View Board & Chat
                      <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
