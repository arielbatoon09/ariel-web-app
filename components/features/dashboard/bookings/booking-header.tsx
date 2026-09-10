"use client";

import { ManagementHeader } from "@/components/common/management-header";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function BookingHeader({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <ManagementHeader
        title="Bookings Management"
        description="Review Discovery Call requests, confirm slots, and configure calendar availability."
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onOpenSettings}
        className="h-8 shrink-0 rounded-none border-dashed font-mono text-[10px] uppercase"
      >
        <Settings className="size-3.5" />
        Calendar settings
      </Button>
    </div>
  );
}
