"use client";

import { useState } from "react";
import { ManagementDetailDialog } from "@/components/common/management-detail-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useBookingSettingsQuery, useUpdateBookingSettingsMutation } from "@/hooks/use-bookings";
import { BOOKING_SLOT_DURATIONS, DAY_LABELS, DEFAULT_WEEKLY_HOURS } from "@/constants/booking";
import type { BookingWeeklyHour } from "@/drizzle/schema";
import type { BookingSettings } from "@/schemas/dashboard";
import { cn } from "@/lib/utils";

function sortWeeklyHours(weeklyHours: BookingWeeklyHour[]): BookingWeeklyHour[] {
  const sorted = [...weeklyHours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  return sorted.length === 7 ? sorted : DEFAULT_WEEKLY_HOURS;
}

function BookingSettingsDialogContent({
  settings,
  open,
  onOpenChange,
}: {
  settings: BookingSettings;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateMutation = useUpdateBookingSettingsMutation();
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(settings.slotDurationMinutes);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [weeklyHours, setWeeklyHours] = useState(() => sortWeeklyHours(settings.weeklyHours));

  const updateDay = (dayOfWeek: number, patch: Partial<BookingWeeklyHour>) => {
    setWeeklyHours((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d)));
  };

  const handleSave = () => {
    updateMutation.mutate({ slotDurationMinutes, timezone, weeklyHours }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <ManagementDetailDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Calendar Settings"
      subtitle="Allowed days, daily hours, and meeting gap"
      className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]"
      footerActions={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 rounded-none border-dashed font-mono text-[10px] uppercase"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={updateMutation.isPending}
            onClick={handleSave}
            className="h-8 rounded-none font-mono text-[10px] uppercase"
          >
            {updateMutation.isPending ? "Saving…" : "Save settings"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="font-mono text-[10px] text-neutral-400 uppercase">Meeting gap / slot length</p>
          <div className="flex flex-wrap gap-2">
            {BOOKING_SLOT_DURATIONS.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setSlotDurationMinutes(mins)}
                className={cn(
                  "h-8 border border-dashed px-3 font-mono text-[10px] uppercase transition-colors dark:border-neutral-700",
                  slotDurationMinutes === mins
                    ? "border-solid border-foreground bg-foreground text-background"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-900"
                )}
              >
                {mins === 60 ? "1 hour" : `${mins} min`}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500">Available times are generated from each day&apos;s hours using this gap.</p>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[10px] text-neutral-400 uppercase">Timezone</label>
          <Input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="h-9 rounded-none border-dashed"
            placeholder="Asia/Manila"
          />
        </div>

        <div className="space-y-3 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
          <p className="font-mono text-[10px] text-neutral-400 uppercase">Weekly hours</p>
          {weeklyHours.map((day) => (
            <div
              key={day.dayOfWeek}
              className="grid grid-cols-[1fr_auto] items-center gap-3 border border-dashed border-neutral-200 p-3 dark:border-neutral-800"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans text-sm font-bold">{DAY_LABELS[day.dayOfWeek]}</span>
                  <Switch checked={day.enabled} onCheckedChange={(checked) => updateDay(day.dayOfWeek, { enabled: checked })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-neutral-400 uppercase">Start</span>
                    <Input
                      type="time"
                      disabled={!day.enabled}
                      value={day.startTime}
                      onChange={(e) => updateDay(day.dayOfWeek, { startTime: e.target.value })}
                      className="h-9 rounded-none border-dashed"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-neutral-400 uppercase">End</span>
                    <Input
                      type="time"
                      disabled={!day.enabled}
                      value={day.endTime}
                      onChange={(e) => updateDay(day.dayOfWeek, { endTime: e.target.value })}
                      className="h-9 rounded-none border-dashed"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ManagementDetailDialog>
  );
}

export function BookingSettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: settings, isLoading } = useBookingSettingsQuery(true);

  if (!open) return null;

  if (isLoading || !settings) {
    return (
      <ManagementDetailDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Calendar Settings"
        subtitle="Allowed days, daily hours, and meeting gap"
        className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]"
      >
        <p className="font-mono text-[10px] text-neutral-400 uppercase">Loading…</p>
      </ManagementDetailDialog>
    );
  }

  return (
    <BookingSettingsDialogContent
      key={`${settings.timezone}-${settings.slotDurationMinutes}-${JSON.stringify(settings.weeklyHours)}`}
      settings={settings}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
