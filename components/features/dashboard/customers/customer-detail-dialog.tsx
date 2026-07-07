"use client";

import * as React from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { ManagementDetailDialog } from "@/components/common/management-detail-dialog";
import { CustomerProfileView } from "@/components/features/dashboard/customers/customer-profile-view";
import { useCustomersQuery, useUpdateCustomerRoleMutation, useToggleCustomerBlockMutation } from "@/hooks/use-customers";

export function CustomerDetailDialog() {
  const { selectedCustomerId, isDetailsOpen, setIsDetailsOpen } = useDashboardStore();

  const { data: customers = [] } = useCustomersQuery();
  const updateRoleMutation = useUpdateCustomerRoleMutation();
  const toggleBlockMutation = useToggleCustomerBlockMutation();

  const currentCustomer = React.useMemo(() => {
    if (!selectedCustomerId) return null;
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const handleToggleBlock = async () => {
    if (!currentCustomer) return;
    const targetStatus = !currentCustomer.disabled;
    toggleBlockMutation.mutate({ customerId: currentCustomer.id, isBlocked: targetStatus });
  };

  const handleUpdateRole = async () => {
    if (!currentCustomer) return;
    const targetRole = currentCustomer.role === "admin" ? "client" : "admin";
    updateRoleMutation.mutate({ customerId: currentCustomer.id, role: targetRole });
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
