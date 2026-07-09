"use client";

import * as React from "react";
import { ManagementHeader } from "@/components/common/management-header";

export function OrderHeader() {
  return (
    <ManagementHeader
      title="Orders Management"
      description="Track client bookings, cycle development delivery stages, and audit purchase details."
    />
  );
}
