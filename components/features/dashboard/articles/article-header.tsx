"use client";

import { ManagementHeader } from "@/components/common/management-header";
import { useDashboardStore } from "@/hooks/use-dashboard-store";

export function ArticleHeader() {
  const setIsArticleAddOpen = useDashboardStore((s) => s.setIsArticleAddOpen);

  return (
    <ManagementHeader
      title="Articles Management"
      description="Manage blog posts, insights, and technical writing with draft staging and publishing controls."
      actionButton={{
        label: "Add Article",
        onClick: () => setIsArticleAddOpen(true),
      }}
    />
  );
}
