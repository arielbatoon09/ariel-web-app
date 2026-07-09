"use client";

import { useState, useMemo } from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { ManagementDetailDialog } from "@/components/common/management-detail-dialog";
import { CustomerProfileView } from "@/components/features/dashboard/customers/customer-profile-view";
import { useCustomersQuery, useUpdateCustomerRoleMutation, useToggleCustomerBlockMutation } from "@/hooks/use-customers";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

export function CustomerDetailDialog() {
  const { selectedCustomerId, isDetailsOpen, setIsDetailsOpen } = useDashboardStore();

  const { data: customers = [] } = useCustomersQuery();
  const updateRoleMutation = useUpdateCustomerRoleMutation();
  const toggleBlockMutation = useToggleCustomerBlockMutation();

  const [confirmType, setConfirmType] = useState<"role" | "block" | null>(null);

  const currentCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const handleToggleBlock = () => {
    if (!currentCustomer) return;
    setConfirmType("block");
  };

  const handleUpdateRole = () => {
    if (!currentCustomer) return;
    setConfirmType("role");
  };

  const handleConfirm = () => {
    if (!currentCustomer) return;
    if (confirmType === "role") {
      const targetRole = currentCustomer.role === "admin" ? "client" : "admin";
      updateRoleMutation.mutate({ customerId: currentCustomer.id, role: targetRole });
    } else if (confirmType === "block") {
      const targetStatus = !currentCustomer.disabled;
      toggleBlockMutation.mutate({ customerId: currentCustomer.id, isBlocked: targetStatus });
    }
    setConfirmType(null);
  };

  const confirmTitle = confirmType === "role" ? "Change User Role" : "Update Login Access";

  const confirmDescription =
    confirmType === "role"
      ? `Are you sure you want to change the role of ${currentCustomer?.name} to ${currentCustomer?.role === "admin" ? "Customer" : "Admin"}?`
      : currentCustomer?.disabled
        ? `Are you sure you want to unblock ${currentCustomer?.name} and restore their login access?`
        : `Are you sure you want to block ${currentCustomer?.name} and suspend their login access?`;

  const confirmVariant = confirmType === "block" && !currentCustomer?.disabled ? "destructive" : "default";

  return (
    <>
      <ManagementDetailDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title="Customer Profile & Audits"
        subtitle={currentCustomer ? `ID: ${currentCustomer.id}` : undefined}
      >
        {currentCustomer && <CustomerProfileView customer={currentCustomer} onUpdateRole={handleUpdateRole} onToggleBlock={handleToggleBlock} />}
      </ManagementDetailDialog>

      <ConfirmDialog
        open={confirmType !== null}
        onOpenChange={(open) => !open && setConfirmType(null)}
        title={confirmTitle}
        description={confirmDescription}
        onConfirm={handleConfirm}
        variant={confirmVariant}
        isLoading={updateRoleMutation.isPending || toggleBlockMutation.isPending}
      />
    </>
  );
}
