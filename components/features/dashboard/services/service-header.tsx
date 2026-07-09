"use client";

import { ManagementHeader } from "@/components/common/management-header";
import { useRouter } from "next/navigation";

export function ServiceHeader() {
  const router = useRouter();

  return (
    <ManagementHeader
      title="Services Management"
      description="Create and manage your professional service packages, base pricing, timelines, delivery features, and optional add-ons."
      actionButton={{
        label: "Add Package",
        onClick: () => router.push("/admin/services/new"),
      }}
    />
  );
}
