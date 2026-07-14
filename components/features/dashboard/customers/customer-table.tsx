"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { DataTable } from "@/components/common/data-table";
import { cn } from "@/lib/utils";
import type { Customer } from "@/schemas/dashboard";
import { useCustomersQuery, useToggleCustomerBlockMutation, useDeleteCustomersMutation } from "@/hooks/use-customers";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

export function CustomerTable() {
  const { setSelectedCustomerId, setIsDetailsOpen } = useDashboardStore();

  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomersQuery();
  const toggleBlockMutation = useToggleCustomerBlockMutation();
  const deleteCustomersMutation = useDeleteCustomersMutation();

  const [itemsToDelete, setItemsToDelete] = useState<Customer[]>([]);
  const [customerToBlock, setCustomerToBlock] = useState<Customer | null>(null);
  const [confirmType, setConfirmType] = useState<"delete" | "block" | null>(null);

  const columns = useMemo(() => [
    {
      header: "Name",
      accessorKey: ((item: Customer) => {
        const initials = item.name
          ? item.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : "?";

        return (
          <div className="flex items-center gap-2.5">
            <div className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-300 bg-neutral-200 font-mono text-[10px] font-bold text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 select-none uppercase">
              {item.avatarUrl ? (
                <Image src={item.avatarUrl} alt={item.name} fill className="object-cover" />
              ) : (
                initials
              )}
            </div>
            <span className="font-sans font-bold text-foreground">{item.name}</span>
          </div>
        );
      }) as (item: Customer) => React.ReactNode,
    },
    {
      header: "Email",
      accessorKey: "email" as const,
      className: "font-mono text-neutral-500 dark:text-neutral-400",
    },
    {
      header: "Role",
      accessorKey: ((item: Customer) => <span className="font-sans text-xs">{item.role === "admin" ? "Admin" : "Customer"}</span>) as (
        item: Customer
      ) => React.ReactNode,
    },
    {
      header: "Status",
      accessorKey: ((item: Customer) => (
        <span className="inline-flex items-center gap-1.5 font-sans text-xs">
          <span className={cn("size-1.5 rounded-full", item.disabled ? "bg-red-500" : "bg-green-500")} />
          {item.disabled ? "Blocked" : "Active"}
        </span>
      )) as (item: Customer) => React.ReactNode,
    },
    {
      header: "Joined At",
      accessorKey: "joinedAt" as const,
      className: "font-mono text-neutral-400 dark:text-neutral-500",
    },
  ], []);

  const handleViewDetails = useCallback((customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setIsDetailsOpen(true);
  }, [setSelectedCustomerId, setIsDetailsOpen]);

  const handleToggleBlock = useCallback((customer: Customer) => {
    setCustomerToBlock(customer);
    setConfirmType("block");
  }, []);

  const handleDeleteBulk = useCallback((items: Customer[]) => {
    setItemsToDelete(items);
    setConfirmType("delete");
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmType === "delete") {
      const ids = itemsToDelete.map((item) => item.id);
      deleteCustomersMutation.mutate(ids);
    } else if (confirmType === "block" && customerToBlock) {
      const targetStatus = !customerToBlock.disabled;
      toggleBlockMutation.mutate({ customerId: customerToBlock.id, isBlocked: targetStatus });
    }
    setConfirmType(null);
  }, [confirmType, itemsToDelete, customerToBlock, deleteCustomersMutation, toggleBlockMutation]);

  const confirmTitle = confirmType === "delete" ? "Delete Customer(s)" : "Update Login Status";

  const confirmDescription =
    confirmType === "delete"
      ? "This action cannot be undone. This will permanently delete the selected customer(s) from the database and auth records."
      : customerToBlock?.disabled
        ? `This will unblock ${customerToBlock.name || "the customer"} and restore their login access.`
        : `This will block ${customerToBlock?.name || "the customer"} and immediately suspend their login access.`;

  const confirmVariant = confirmType === "delete" || (confirmType === "block" && !customerToBlock?.disabled) ? "destructive" : "default";

  return (
    <div className="relative">
      <DataTable
        data={customers}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search customer by name..."
        onViewClick={handleViewDetails}
        onToggleStatusClick={handleToggleBlock}
        isLoading={isLoadingCustomers}
        onDeleteBulk={handleDeleteBulk}
        onRowClick={handleViewDetails}
      />

      <ConfirmDialog
        open={confirmType !== null}
        onOpenChange={(open) => !open && setConfirmType(null)}
        title={confirmTitle}
        description={confirmDescription}
        onConfirm={handleConfirm}
        variant={confirmVariant}
        isLoading={deleteCustomersMutation.isPending || toggleBlockMutation.isPending}
      />
    </div>
  );
}
