"use client";

import * as React from "react";
import { ManagementHeader } from "@/components/common/management-header";

export function TransactionHeader() {
  return (
    <ManagementHeader
      title="Transactions Audit"
      description="Audit incoming receipts, reference numbers, and verification statuses for manual BPI, GCash, Maya, and Wise transfers."
    />
  );
}
