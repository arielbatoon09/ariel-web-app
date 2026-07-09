"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrdersQuery, useUpdateOrderStatusMutation, useDeleteOrdersMutation } from "@/hooks/use-orders";
import { useServicesQuery } from "@/hooks/use-services";
import { DataTable } from "@/components/common/data-table";
import type { Order } from "@/schemas/dashboard";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { cn } from "@/lib/utils";

export function OrderTable() {
  const router = useRouter();
  const { setSelectedOrderId, setIsOrderDetailsOpen } = useDashboardStore();

  const { data: orders = [], isLoading } = useOrdersQuery();
  const { data: services = [] } = useServicesQuery();

  const updateStatusMutation = useUpdateOrderStatusMutation();
  const deleteOrdersMutation = useDeleteOrdersMutation();

  const [itemsToDelete, setItemsToDelete] = useState<Order[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getServiceName = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.name || "Unknown Package";
  };


  const columns = [
    {
      header: "Order ID",
      accessorKey: (item: Order) => <code className="font-mono text-xs text-neutral-500">{item.id}</code>,
    },
    {
      header: "Reference #",
      accessorKey: (item: Order) => (
        <span className="font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">{item.referenceNumber || "-"}</span>
      ),
    },
    {
      header: "Client Name",
      accessorKey: (item: Order) => (
        <div className="flex flex-col gap-1">
          <span className="font-sans font-bold text-foreground">{item.customerName}</span>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">{item.customerEmail}</p>
        </div>
      ),
    },
    {
      header: "Package",
      accessorKey: (item: Order) => <span className="font-sans font-medium">{getServiceName(item.serviceId)}</span>,
    },
    {
      header: "Created Date",
      accessorKey: (item: Order) => (
        <span className="font-mono text-xs text-neutral-500">
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Total Price",
      accessorKey: (item: Order) => <span className="font-mono text-xs text-foreground">₱{item.totalAmount.toLocaleString()}</span>,
    },
    {
      header: "Workflow Status",
      accessorKey: (item: Order) => (
        <span
          className={cn(
            "inline-flex items-center rounded px-2 py-0.5 font-mono text-[9px] tracking-wider uppercase border",
            item.status === "completed" &&
              "border-green-200 bg-green-50 text-green-600 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400",
            item.status === "delivered" &&
              "border-green-500/30 bg-green-500/5 text-green-600 dark:border-green-500/20 dark:text-green-400",
            item.status === "in-progress" &&
              "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-400",
            item.status === "pending" &&
              "border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-900/40 dark:bg-yellow-950/20 dark:text-yellow-400",
            item.status === "revision_requested" &&
              "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400",
            item.status === "cancelled" &&
              "border-red-200 bg-red-50 text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
          )}
        >
          {item.status.replace("_", " ")}
        </span>
      ),
    },
  ];

  const handleDelete = (item: Order) => {
    setItemsToDelete([item]);
    setShowDeleteConfirm(true);
  };

  const handleDeleteBulk = (items: Order[]) => {
    setItemsToDelete(items);
    setShowDeleteConfirm(true);
  };

  const handleConfirm = () => {
    deleteOrdersMutation.mutate(
      itemsToDelete.map((i) => i.id),
      {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setItemsToDelete([]);
        },
      }
    );
  };

  return (
    <>
      <DataTable<Order>
        data={orders}
        columns={columns}
        isLoading={isLoading}
        searchKey="customerName"
        searchPlaceholder="Search client orders..."
        onRowClick={(item) => {
          router.push(`/admin/order/${item.id}`);
        }}
        onViewClick={(item) => {
          router.push(`/admin/order/${item.id}`);
        }}
        onDeleteClick={handleDelete}
        onDeleteBulk={handleDeleteBulk}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Confirm Order Deletion"
        description={`Are you sure you want to permanently delete order ${
          itemsToDelete.length === 1 ? `"${itemsToDelete[0].id}"` : `${itemsToDelete.length} orders`
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        variant="destructive"
      />
    </>
  );
}
