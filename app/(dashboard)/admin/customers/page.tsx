"use client";

import * as React from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { DataTable } from "@/components/features/dashboard/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, ShieldAlert, User, Clock, Globe, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Customer } from "@/lib/schemas/dashboard";
import { AddCustomerDialog } from "@/components/features/dashboard/customers/add-customer-dialog";
import { toast } from "sonner";
import {
  getCustomersAction,
  updateCustomerRoleAction,
  toggleCustomerBlockStatusAction,
} from "@/components/features/dashboard/customers/customers-action";

export default function CustomersPage() {
  const { customers, updateCustomerRole, toggleCustomerBlockStatus, addCustomer, setCustomers } = useDashboardStore();
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
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
  const currentCustomer = React.useMemo(() => {
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">Customer Management</h1>
          <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">Manage user roles, block access, and audit log activities.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="rounded-none border border-neutral-900 font-mono text-xs tracking-widest uppercase py-2.5 dark:border-neutral-100 sm:w-auto w-full"
        >
          <Plus className="mr-1 size-3.5" />
          Add Customer
        </Button>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center font-mono text-xs text-neutral-500">
            Retrieving customer database records...
          </div>
        ) : (
          <DataTable
            data={customers}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search customer by name..."
            onViewClick={handleViewDetails}
            onToggleStatusClick={handleToggleBlock}
          />
        )}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="rounded-none border border-neutral-200 bg-background/95 p-6 font-mono text-xs backdrop-blur-md sm:max-w-[500px] dark:border-neutral-800">
          {currentCustomer && (
            <div className="space-y-6">
              <DialogHeader className="space-y-1">
                <DialogTitle className="font-sans text-base font-bold text-foreground">Customer Profile & Audits</DialogTitle>
                <DialogDescription className="text-[10px] text-neutral-400 uppercase">ID: {currentCustomer.id}</DialogDescription>
              </DialogHeader>

              {/* User Bio & Primary Settings */}
              <div className="space-y-4 border border-dashed border-neutral-300 bg-neutral-50/20 p-4 dark:border-neutral-700 dark:bg-neutral-900/10">
                <div className="space-y-1">
                  <div className="text-[10px] text-neutral-400 uppercase">Name & Email</div>
                  <div className="font-sans text-sm font-bold text-foreground">{currentCustomer.name}</div>
                  <div className="text-neutral-550 dark:text-neutral-400">{currentCustomer.email}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-dashed border-neutral-200 pt-2 dark:border-neutral-800">
                  {/* Change Role Button */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-neutral-400 uppercase">Change Account Role</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateRole(currentCustomer)}
                      className="h-8 w-full justify-between rounded-none border-dashed font-mono text-[10px] uppercase"
                    >
                      <span>{currentCustomer.role === "admin" ? "Demote to User" : "Promote to Admin"}</span>
                      {currentCustomer.role === "admin" ? <User className="size-3" /> : <Shield className="size-3" />}
                    </Button>
                  </div>

                  {/* Block / Unblock Button */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-neutral-400 uppercase">System Ban / Block</div>
                    <Button
                      variant={currentCustomer.disabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleBlock(currentCustomer)}
                      className={cn(
                        "h-8 w-full justify-between rounded-none border-dashed font-mono text-[10px] uppercase",
                        !currentCustomer.disabled && "text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/25"
                      )}
                    >
                      <span>{currentCustomer.disabled ? "Unblock Account" : "Block Account"}</span>
                      <ShieldAlert className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Activity Logs */}
              <div className="space-y-2">
                <h4 className="font-mono text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">User Audit Logs</h4>
                <div className="max-h-48 divide-y divide-dashed divide-neutral-200 overflow-y-auto border border-dashed border-neutral-300 dark:divide-neutral-800 dark:border-neutral-700">
                  {currentCustomer.activities && currentCustomer.activities.length > 0 ? (
                    currentCustomer.activities.map((act) => (
                      <div key={act.id} className="space-y-1 p-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10">
                        <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                          <span className="font-sans font-medium">{act.action}</span>
                          <span className="text-neutral-450 flex items-center gap-1 text-[9px] dark:text-neutral-500">
                            <Clock className="size-2.5" />
                            {act.timestamp}
                          </span>
                        </div>
                        <div className="text-neutral-450 flex items-center gap-1 text-[9px] dark:text-neutral-500">
                          <Globe className="size-2.5" />
                          IP Address: {act.ipAddress}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-neutral-400 dark:text-neutral-500">No activities logged for this user.</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDetailsOpen(false)}
                  className="rounded-none border-dashed font-mono text-[10px] uppercase"
                >
                  Close Panel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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