"use client";

import * as React from "react";
import { ManagementHeader } from "@/components/common/management-header";
import { useDashboardStore } from "@/hooks/use-dashboard-store";

export function WorkHeader() {
  const setIsWorkAddOpen = useDashboardStore((s) => s.setIsWorkAddOpen);

  return (
    <ManagementHeader
      title="Works Management"
      description="Manage portfolio projects, case studies, galleries, and publishing state."
      actionButton={{
        label: "Add Project",
        onClick: () => setIsWorkAddOpen(true),
      }}
    />
  );
}
