"use client";

import * as React from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { ManagementDetailDialog } from "@/components/common/management-detail-dialog";
import { CustomerProfileView } from "@/components/features/dashboard/customers/customer-profile-view";
import { toast } from "sonner";
import { updateCustomerRoleAction, toggleCustomerBlockStatusAction } from "@/components/features/dashboard/customers/customers-action";

export function CustomerDetailDialog() {
  const { customers, selectedCustomerId, isDetailsOpen, setIsDetailsOpen, updateCustomerRole, toggleCustomerBlockStatus } = useDashboardStore();

  const currentCustomer = React.useMemo(() => {
    if (!selectedCustomerId) return null;
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const handleToggleBlock = async () => {
    if (!currentCustomer) return;
    const targetStatus = !currentCustomer.disabled;
    try {
      const res = await toggleCustomerBlockStatusAction(currentCustomer.id, targetStatus);
      if (res.success) {
        toggleCustomerBlockStatus(currentCustomer.id);
        toast.success(targetStatus ? "Customer blocked successfully." : "Customer unblocked successfully.");
      } else {
        toast.error(res.error || "Failed to update block status.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    }
  };

  const handleUpdateRole = async () => {
    if (!currentCustomer) return;
    const targetRole = currentCustomer.role === "admin" ? "client" : "admin";
    try {
      const res = await updateCustomerRoleAction(currentCustomer.id, targetRole);
      if (res.success) {
        updateCustomerRole(currentCustomer.id, currentCustomer.role === "admin" ? "customer" : "admin");
        toast.success("Customer role updated successfully.");
      } else {
        toast.error(res.error || "Failed to update role.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    }
  };

  return (
    <ManagementDetailDialog
      open={isDetailsOpen}
      onOpenChange={setIsDetailsOpen}
      title="Customer Profile & Audits"
      subtitle={currentCustomer ? `ID: ${currentCustomer.id}` : undefined}
    >
      {currentCustomer && <CustomerProfileView customer={currentCustomer} onUpdateRole={handleUpdateRole} onToggleBlock={handleToggleBlock} />}
    </ManagementDetailDialog>
  );
}
