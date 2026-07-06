"use client";

import * as React from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { DataTable } from "@/components/features/dashboard/data-table";
import type { Order } from "@/lib/schemas/dashboard";
import { cn } from "@/lib/utils";

export default function AdminOrdersPage() {
  const { orders, services, updateOrderStatus, deleteOrder } = useDashboardStore();

  const getServiceName = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.name || "Unknown Service";
  };

  const handleCycleStatus = (order: Order) => {
    const statuses: Order["status"][] = ["pending", "in-progress", "completed", "cancelled"];
    const currentIndex = statuses.indexOf(order.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];
    updateOrderStatus(order.id, nextStatus);
  };

  const columns = [
    {
      header: "Order ID",
      accessorKey: (item: Order) => <code className="font-mono text-xs text-neutral-500">{item.id}</code>,
    },
    {
      header: "Client Name",
      accessorKey: (item: Order) => (
        <div className="flex flex-col gap-1.5">
          <span className="font-sans font-bold text-foreground">{item.customerName}</span>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">{item.customerEmail}</p>
        </div>
      ),
    },
    {
      header: "Service",
      accessorKey: (item: Order) => <span className="font-sans font-medium">{getServiceName(item.serviceId)}</span>,
    },
    {
      header: "Created Date",
      accessorKey: "createdAt" as keyof Order,
    },
    {
      header: "Total Cost",
      accessorKey: (item: Order) => <span className="font-mono text-xs font-bold text-foreground">₱{item.totalAmount.toLocaleString()}</span>,
    },
    {
      header: "Workflow Status",
      accessorKey: (item: Order) => (
        <button
          onClick={() => handleCycleStatus(item)}
          className={cn(
            "rounded px-2 py-0.5 font-mono text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105",
            item.status === "completed" &&
              "border border-green-200 bg-green-50 text-green-600 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400",
            item.status === "in-progress" &&
              "border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-400",
            item.status === "pending" &&
              "border border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-900/40 dark:bg-yellow-950/20 dark:text-yellow-400",
            item.status === "cancelled" && "border border-red-200 bg-red-50 text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
          )}
          title="Click to cycle status"
        >
          {item.status}
        </button>
      ),
    },
  ];

  const handleDelete = (item: Order) => {
    if (window.confirm(`Are you sure you want to delete order ${item.id}?`)) {
      deleteOrder(item.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">Orders</h1>
        <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">MONITOR CLIENT BOOKINGS AND CYCLE WORKFLOW STATUSES</p>
      </div>

      <DataTable<Order>
        data={orders}
        columns={columns}
        searchKey="customerName"
        searchPlaceholder="Search client orders..."
        onDeleteClick={handleDelete}
      />
    </div>
  );
}
