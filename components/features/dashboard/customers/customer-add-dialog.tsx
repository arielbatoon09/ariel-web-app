"use client";

import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { AddCustomerDialog as RawAddCustomerDialog } from "@/components/features/dashboard/customers/add-customer-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { CUSTOMERS_QUERY_KEY } from "@/hooks/use-customers";

export function CustomerAddDialog() {
  const { isAddOpen, setIsAddOpen } = useDashboardStore();
  const queryClient = useQueryClient();

  return (
    <RawAddCustomerDialog
      open={isAddOpen}
      onOpenChange={setIsAddOpen}
      onSuccess={() => {
        queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      }}
    />
  );
}
