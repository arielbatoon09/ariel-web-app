"use client";

import { ManagementDetailDialog } from "@/components/common/management-detail-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useBookingDetailQuery, useUpdateBookingStatusMutation } from "@/hooks/use-bookings";
import type { BookingStatus } from "@/constants/booking";
import { useState } from "react";
import { cn } from "@/lib/utils";

const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "no_show", "cancelled"],
  cancelled: [],
  completed: [],
  no_show: [],
};

export function BookingDetailDialog({ id, open, onOpenChange }: { id: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: booking, isLoading } = useBookingDetailQuery(id);
  const updateStatus = useUpdateBookingStatusMutation();
  const [notes, setNotes] = useState("");

  if (!open) return null;

  const actions = booking ? TRANSITIONS[booking.status] || [] : [];

  const handleStatus = (status: BookingStatus) => {
    if (!booking) return;
    updateStatus.mutate(
      { id: booking.id, status, adminNotes: notes.trim() || booking.adminNotes },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  return (
    <ManagementDetailDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Booking Detail"
      subtitle="Review guest info and update workflow status"
      className="sm:max-w-[520px]"
      footerActions={
        <div className="flex flex-wrap justify-end gap-2">
          {actions.map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={status === "cancelled" || status === "no_show" ? "outline" : "default"}
              disabled={updateStatus.isPending}
              onClick={() => handleStatus(status)}
              className={cn("h-8 rounded-none font-mono text-[10px] uppercase", (status === "cancelled" || status === "no_show") && "border-dashed")}
            >
              Mark {status.replace("_", " ")}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 rounded-none border-dashed font-mono text-[10px] uppercase"
          >
            Close
          </Button>
        </div>
      }
    >
      {isLoading || !booking ? (
        <p className="font-mono text-[10px] text-neutral-400 uppercase">Loading…</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-neutral-450 uppercase">Guest:</span>
            <span className="col-span-2 font-sans font-bold text-foreground">{booking.guestName}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-neutral-450 uppercase">Email:</span>
            <span className="col-span-2 font-sans font-bold text-foreground">{booking.guestEmail}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-neutral-450 uppercase">Phone:</span>
            <span className="col-span-2 font-sans font-bold text-foreground">{booking.guestPhone || "—"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-neutral-450 uppercase">When:</span>
            <span className="col-span-2 font-sans font-bold text-foreground">
              {new Date(booking.scheduledStart).toLocaleString("en-US", {
                timeZone: booking.timezone,
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-neutral-450 uppercase">Status:</span>
            <span className="col-span-2 font-sans font-bold text-foreground uppercase">{booking.status.replace("_", " ")}</span>
          </div>
          <div className="space-y-1 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
            <span className="text-neutral-450 uppercase">Inquiry</span>
            <p className="font-sans text-sm whitespace-pre-wrap text-foreground">{booking.inquiry}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-neutral-450 uppercase">Admin notes</label>
            <Textarea
              value={notes || booking.adminNotes || ""}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20 rounded-none border-dashed"
              placeholder="Internal notes…"
            />
          </div>
        </div>
      )}
    </ManagementDetailDialog>
  );
}
