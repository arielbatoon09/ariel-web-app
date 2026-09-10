import type { BookingWeeklyHour } from "@/drizzle/schema";

export const BOOKING_SLOT_DURATIONS = [15, 30, 60] as const;
export type BookingSlotDuration = (typeof BOOKING_SLOT_DURATIONS)[number];

export const BOOKING_INQUIRY_MIN_LENGTH = 10;
export const BOOKING_INQUIRY_MAX_LENGTH = 500;

export const BOOKING_STATUSES = ["pending", "confirmed", "cancelled", "completed", "no_show"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const DEFAULT_BOOKING_TIMEZONE = "Asia/Manila";

export const DEFAULT_WEEKLY_HOURS: BookingWeeklyHour[] = [
  { dayOfWeek: 0, enabled: false, startTime: "09:00", endTime: "17:30" }, // Sunday
  { dayOfWeek: 1, enabled: true, startTime: "09:00", endTime: "17:30" },
  { dayOfWeek: 2, enabled: true, startTime: "09:00", endTime: "17:30" },
  { dayOfWeek: 3, enabled: true, startTime: "09:00", endTime: "17:30" },
  { dayOfWeek: 4, enabled: true, startTime: "09:00", endTime: "17:30" },
  { dayOfWeek: 5, enabled: true, startTime: "09:00", endTime: "17:30" },
  { dayOfWeek: 6, enabled: true, startTime: "09:00", endTime: "17:30" }, // Saturday
];

export const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
