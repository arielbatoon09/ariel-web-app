import type { BookingWeeklyHour } from "@/drizzle/schema";
import { DEFAULT_BOOKING_TIMEZONE } from "@/constants/booking";

export type BookingSettingsShape = {
  slotDurationMinutes: number;
  timezone: string;
  weeklyHours: BookingWeeklyHour[];
};

const WEEKDAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Parse "HH:mm" into minutes from midnight. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Build a Date in a specific IANA timezone from a calendar date + HH:mm.
 */
export function zonedDateTimeToUtc(dateKey: string, timeHm: string, timeZone: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hour, minute] = timeHm.split(":").map(Number);

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offsetMs = getTimeZoneOffsetMs(utcGuess, timeZone);
  return new Date(utcGuess.getTime() - offsetMs);
}

export function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = dtf.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUTC = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUTC - date.getTime();
}

/** Format a Date as YYYY-MM-DD in a timezone. */
export function formatDateKeyInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatTimeInZone(date: Date, timeZone: string, hour12 = true): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12,
  }).format(date);
}

export function getDayOfWeekInZone(dateKey: string, timeZone: string): number {
  const noonUtc = zonedDateTimeToUtc(dateKey, "12:00", timeZone);
  const weekdayLong = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(noonUtc);
  return WEEKDAY_MAP[weekdayLong] ?? 0;
}

export type GeneratedSlot = {
  startIso: string;
  endIso: string;
  label: string;
};

/**
 * Generate bookable slots for a single local calendar day.
 * Filters out past times when the day is "today" in the booking timezone.
 */
export function generateSlotsForDate(params: {
  dateKey: string;
  settings: BookingSettingsShape;
  bookedStarts: Date[];
  now?: Date;
  hour12?: boolean;
}): GeneratedSlot[] {
  const { dateKey, settings, bookedStarts, now = new Date(), hour12 = true } = params;
  const timeZone = settings.timezone || DEFAULT_BOOKING_TIMEZONE;
  const duration = settings.slotDurationMinutes;

  const dow = getDayOfWeekInZone(dateKey, timeZone);
  const hours = settings.weeklyHours.find((h) => h.dayOfWeek === dow);
  if (!hours || !hours.enabled) return [];

  const startMin = timeToMinutes(hours.startTime);
  const endMin = timeToMinutes(hours.endTime);
  if (endMin <= startMin + duration) return [];

  const todayKey = formatDateKeyInZone(now, timeZone);
  const isToday = dateKey === todayKey;
  const bookedSet = new Set(bookedStarts.map((b) => b.getTime()));
  const slots: GeneratedSlot[] = [];

  for (let cursor = startMin; cursor + duration <= endMin; cursor += duration) {
    const startHm = minutesToTime(cursor);
    const endHm = minutesToTime(cursor + duration);
    const startUtc = zonedDateTimeToUtc(dateKey, startHm, timeZone);
    const endUtc = zonedDateTimeToUtc(dateKey, endHm, timeZone);

    if (isToday && startUtc.getTime() <= now.getTime()) {
      continue;
    }

    if (bookedSet.has(startUtc.getTime())) {
      continue;
    }

    slots.push({
      startIso: startUtc.toISOString(),
      endIso: endUtc.toISOString(),
      label: formatTimeInZone(startUtc, timeZone, hour12),
    });
  }

  return slots;
}

/** Whether a date key is bookable (enabled weekday and not in the past in zone). */
export function isDateKeyBookable(dateKey: string, settings: BookingSettingsShape, now = new Date()): boolean {
  const timeZone = settings.timezone || DEFAULT_BOOKING_TIMEZONE;
  const todayKey = formatDateKeyInZone(now, timeZone);
  if (dateKey < todayKey) return false;

  const dow = getDayOfWeekInZone(dateKey, timeZone);
  const hours = settings.weeklyHours.find((h) => h.dayOfWeek === dow);
  if (!hours?.enabled) return false;

  if (dateKey === todayKey) {
    const slots = generateSlotsForDate({ dateKey, settings, bookedStarts: [], now });
    return slots.length > 0;
  }
  return true;
}
