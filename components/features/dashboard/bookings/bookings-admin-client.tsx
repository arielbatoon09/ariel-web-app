"use client";

import { useState } from "react";
import { BookingHeader } from "@/components/features/dashboard/bookings/booking-header";
import { BookingTable } from "@/components/features/dashboard/bookings/booking-table";
import { BookingSettingsDialog } from "@/components/features/dashboard/bookings/booking-settings-dialog";

export function BookingsAdminClient() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <BookingHeader onOpenSettings={() => setSettingsOpen(true)} />
      <BookingTable />
      <BookingSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
