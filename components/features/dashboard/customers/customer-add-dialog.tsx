"use client";

import * as React from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { AddCustomerDialog as RawAddCustomerDialog } from "@/components/features/dashboard/customers/add-customer-dialog";

export function CustomerAddDialog() {
  const { isAddOpen, setIsAddOpen, addCustomer } = useDashboardStore();

  return (
    <RawAddCustomerDialog
      open={isAddOpen}
      onOpenChange={setIsAddOpen}
      onSuccess={(newCustomer) => {
        addCustomer(newCustomer);
      }}
    />
  );
}
