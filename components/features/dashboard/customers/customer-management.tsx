"use client";

import { useState, useEffect, useMemo } from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { DataTable } from "@/components/features/dashboard/data-table";
import { ManagementHeader } from "@/components/common/management-header";
import { ManagementDetailDialog } from "@/components/common/management-detail-dialog";
import { Shield, ShieldAlert, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Customer } from "@/schemas/dashboard";
import { AddCustomerDialog } from "@/components/features/dashboard/customers/add-customer-dialog";
import { CustomerProfileView } from "@/components/features/dashboard/customers/customer-profile-view";
import { toast } from "sonner";
import { getCustomersAction, updateCustomerRoleAction, toggleCustomerBlockStatusAction } from "@/services/customers";

export function CustomerManagement() {
  const { customers, updateCustomerRole, toggleCustomerBlockStatus, addCustomer, setCustomers } = useDashboardStore();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        setIsLoading(true);
        const res = await getCustomersAction();
        if (res.success && res.customers) {
          setCustomers(res.customers);
        } else {
          toast.error(res.error || "Failed to load customers.");
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to load customers.");
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomers();
  }, [setCustomers]);

  // Sync selectedCustomer state with store changes when they happen
  const currentCustomer = useMemo(() => {
    if (!selectedCustomer) return null;
    return customers.find((c) => c.id === selectedCustomer.id) || null;
  }, [customers, selectedCustomer]);

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
    setSelectedCustomer(customer);
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

  const handleUpdateRole = async (customer: Customer) => {
    const targetRole = customer.role === "admin" ? "client" : "admin";
    try {
      const res = await updateCustomerRoleAction(customer.id, targetRole);
      if (res.success) {
        updateCustomerRole(customer.id, customer.role === "admin" ? "customer" : "admin");
        toast.success("Customer role updated successfully.");
      } else {
        toast.error(res.error || "Failed to update role.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="space-y-6">
      <ManagementHeader
        title="Customer Management"
        description="Manage user roles, block access, and audit log activities."
        actionButton={{
          label: "Add Customer",
          onClick: () => setIsAddOpen(true),
        }}
      />

      <div className="relative">
        <DataTable
          data={customers}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Search customer by name..."
          onViewClick={handleViewDetails}
          onToggleStatusClick={handleToggleBlock}
          isLoading={isLoading}
        />
      </div>

      <ManagementDetailDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title="Customer Profile & Audits"
        subtitle={currentCustomer ? `ID: ${currentCustomer.id}` : undefined}
      >
        {currentCustomer && <CustomerProfileView customer={currentCustomer} onUpdateRole={handleUpdateRole} onToggleBlock={handleToggleBlock} />}
      </ManagementDetailDialog>

      <AddCustomerDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={(newCustomer) => {
          addCustomer(newCustomer);
        }}
      />
    </div>
  );
}
