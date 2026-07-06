"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { DataTable } from "@/components/common/data-table";
import { Shield, ShieldAlert, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Customer } from "@/lib/schemas/dashboard";
import { toast } from "sonner";
import { getCustomersAction, toggleCustomerBlockStatusAction, deleteCustomersAction } from "@/components/features/dashboard/customers/customers-action";

export function CustomerTable() {
  const {
    customers,
    setCustomers,
    setSelectedCustomerId,
    setIsDetailsOpen,
    toggleCustomerBlockStatus,
    isLoadingCustomers,
    setIsLoadingCustomers,
    addCustomer,
    deleteCustomer,
  } = useDashboardStore();

  useEffect(() => {
    async function loadCustomers() {
      try {
        setIsLoadingCustomers(true);
        const res = await getCustomersAction();
        if (res.success && res.customers) {
          setCustomers(res.customers);
        } else {
          toast.error(res.error || "Failed to load customers.");
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to load customers.");
      } finally {
        setIsLoadingCustomers(false);
      }
    }
    loadCustomers();
  }, [setCustomers, setIsLoadingCustomers]);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as const,
      className: "font-medium",
    },
    {
      header: "Email",
      accessorKey: "email" as const,
      className: "font-mono text-neutral-500 dark:text-neutral-400",
    },
    {
      header: "Role",
      accessorKey: ((item: Customer) => (
        <span
          className={cn(
            "inline-flex items-center gap-1 font-mono text-xs tracking-wide uppercase",
            item.role === "admin" ? "font-bold text-amber-500" : "text-neutral-400 dark:text-neutral-500"
          )}
        >
          {item.role === "admin" ? <Shield className="size-3" /> : <User className="size-3" />}
          {item.role}
        </span>
      )) as (item: Customer) => React.ReactNode,
    },
    {
      header: "Status",
      accessorKey: ((item: Customer) => (
        <span
          className={cn(
            "inline-flex items-center gap-1 font-mono text-xs tracking-wide uppercase",
            item.disabled ? "font-bold text-red-500" : "text-green-550"
          )}
        >
          {item.disabled ? <ShieldAlert className="size-3" /> : <Clock className="size-3" />}
          {item.disabled ? "BLOCKED" : "ACTIVE"}
        </span>
      )) as (item: Customer) => React.ReactNode,
    },
    {
      header: "Joined At",
      accessorKey: "joinedAt" as const,
      className: "font-mono text-neutral-400 dark:text-neutral-500",
    },
  ];

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setIsDetailsOpen(true);
  };

  const handleToggleBlock = async (customer: Customer) => {
    const targetStatus = !customer.disabled;
    try {
      const res = await toggleCustomerBlockStatusAction(customer.id, targetStatus);
      if (res.success) {
        toggleCustomerBlockStatus(customer.id);
        toast.success(targetStatus ? "Customer blocked successfully." : "Customer unblocked successfully.");
      } else {
        toast.error(res.error || "Failed to update block status.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    }
  };

  const handleDeleteBulk = async (items: Customer[]) => {
    if (!window.confirm(`Are you sure you want to delete ${items.length} selected customer(s)?`)) {
      return;
    }
    const ids = items.map((item) => item.id);
    try {
      const res = await deleteCustomersAction(ids);
      if (res.success) {
        ids.forEach((id) => deleteCustomer(id));
        toast.success("Selected customer(s) deleted successfully.");
      } else {
        toast.error(res.error || "Failed to delete selected customer(s).");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    }
  };

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
      />
    </div>
  );
}
