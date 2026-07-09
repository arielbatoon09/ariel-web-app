"use client";

import { ManagementHeader } from "@/components/common/management-header";
import { useDashboardStore } from "@/hooks/use-dashboard-store";

export function CustomerHeader() {
  const setIsAddOpen = useDashboardStore((s) => s.setIsAddOpen);

  return (
    <ManagementHeader
      title="Customer Management"
      description="Manage user roles, block access, and audit log activities."
      actionButton={{
        label: "Add Customer",
        onClick: () => setIsAddOpen(true),
      }}
    />
  );
}
