"use client";

import * as React from "react";
import { ManagementHeader } from "@/components/common/management-header";
import { useDashboardStore } from "@/hooks/use-dashboard-store";

export function CategoriesHeader() {
  const setIsCategoryAddOpen = useDashboardStore((s) => s.setIsCategoryAddOpen);

  return (
    <ManagementHeader
      title="Category Management"
      description="Manage work and blog categories, slugs, scopes, and visibility."
      actionButton={{
        label: "Add Category",
        onClick: () => setIsCategoryAddOpen(true),
      }}
    />
  );
}
