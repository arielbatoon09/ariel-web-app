"use server";

import { getErrorMessage } from "@/lib/error-utils";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";
import {
  deleteBookingsQuery,
  findConflictingBookingQuery,
  getActiveBookedStartsInRangeQuery,
  getBookingByIdQuery,
  getBookingSettingsQuery,
  getBookingsQuery,
  insertBookingQuery,
  updateBookingSettingsQuery,
  updateBookingStatusQuery,
} from "@/data/bookings";
import { verifyReCaptchaAction } from "./recaptcha";
import { checkRateLimit } from "@/lib/rate-limit";
import { resend } from "@/lib/email";
import {
  bookingAdminNotificationHtml,
  bookingAdminNotificationText,
  bookingGuestReceivedHtml,
  bookingGuestReceivedText,
  bookingStatusUpdateHtml,
  bookingStatusUpdateText,
} from "@/lib/emails/booking";
import { formatDateKeyInZone, formatTimeInZone, generateSlotsForDate, isDateKeyBookable, zonedDateTimeToUtc } from "@/lib/booking-slots";
import { BOOKING_SLOT_DURATIONS, BOOKING_STATUSES, type BookingStatus } from "@/constants/booking";
import type { BookingWeeklyHour } from "@/drizzle/schema";
import { CreateBookingSchema, UpdateBookingSettingsSchema, UpdateBookingStatusSchema } from "@/schemas/dashboard";

async function checkAdminAccess() {
  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return { authorized: false as const, error: "Unauthorized: Please log in." };
  }

  const dbUser = await getUserByAuthId(currentUser.id);
  if (!dbUser) {
    return { authorized: false as const, error: "Unauthorized: Account not found." };
  }

  const role = await getUserRoleByUserId(dbUser.id);
  if (role !== "admin") {
    return { authorized: false as const, error: "Unauthorized: Admin privileges required." };
  }

  return { authorized: true as const, dbUser };
}

function allowedTransitions(from: BookingStatus): BookingStatus[] {
  if (from === "pending") return ["confirmed", "cancelled"];
  if (from === "confirmed") return ["completed", "no_show", "cancelled"];
  return [];
}

function formatSlotDisplay(startIso: string, endIso: string, timeZone: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(start);
  const startLabel = formatTimeInZone(start, timeZone, true);
  const endLabel = formatTimeInZone(end, timeZone, true);
  return { dateLabel, timeLabel: `${startLabel} – ${endLabel}`, timeZone };
}

export async function getPublicBookingSettingsAction() {
  try {
    const settings = await getBookingSettingsQuery();
    if (!settings) {
      return { success: false, error: "Booking settings unavailable." };
    }
    return {
      success: true,
      settings: {
        slotDurationMinutes: settings.slotDurationMinutes,
        timezone: settings.timezone,
        weeklyHours: settings.weeklyHours,
      },
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to load booking settings.") };
  }
}

export async function getAvailableSlotsAction(dateKey: string) {
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return { success: false, error: "Invalid date." };
    }

    const settings = await getBookingSettingsQuery();
    if (!settings) {
      return { success: false, error: "Booking settings unavailable." };
    }

    const now = new Date();
    if (!isDateKeyBookable(dateKey, settings, now)) {
      return { success: true, slots: [], settings: { slotDurationMinutes: settings.slotDurationMinutes, timezone: settings.timezone } };
    }

    const dayStart = zonedDateTimeToUtc(dateKey, "00:00", settings.timezone);
    const dayEnd = zonedDateTimeToUtc(dateKey, "23:59", settings.timezone);
    const bookedStarts = await getActiveBookedStartsInRangeQuery(dayStart, dayEnd);

    const slots = generateSlotsForDate({
      dateKey,
      settings,
      bookedStarts,
      now,
    });

    return {
      success: true,
      slots,
      settings: {
        slotDurationMinutes: settings.slotDurationMinutes,
        timezone: settings.timezone,
      },
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to load available slots.") };
  }
}

export async function getBookableDatesAction(monthKey: string) {
  try {
    // monthKey = YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(monthKey)) {
      return { success: false, error: "Invalid month." };
    }

    const settings = await getBookingSettingsQuery();
    if (!settings) {
      return { success: false, error: "Booking settings unavailable." };
    }

    const [year, month] = monthKey.split("-").map(Number);
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const now = new Date();
    const bookable: string[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${monthKey}-${String(day).padStart(2, "0")}`;
      if (isDateKeyBookable(dateKey, settings, now)) {
        bookable.push(dateKey);
      }
    }

    return {
      success: true,
      dates: bookable,
      settings: {
        slotDurationMinutes: settings.slotDurationMinutes,
        timezone: settings.timezone,
        weeklyHours: settings.weeklyHours,
      },
    };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to load bookable dates.") };
  }
}

export async function createBookingAction(input: {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  inquiry: string;
  scheduledStartIso: string;
  recaptchaToken: string;
}) {
  try {
    const parsed = CreateBookingSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid booking details." };
    }

    const rateLimit = await checkRateLimit("rate_limit:booking", 3, 60, parsed.data.guestEmail);
    if (!rateLimit.success) {
      return {
        success: false,
        error: `Too many booking attempts. Please wait ${rateLimit.reset} seconds before trying again.`,
      };
    }

    const recaptchaRes = await verifyReCaptchaAction(parsed.data.recaptchaToken);
    if (!recaptchaRes.success) {
      return { success: false, error: recaptchaRes.error || "Security validation failed. Please try again." };
    }

    const settings = await getBookingSettingsQuery();
    if (!settings) {
      return { success: false, error: "Booking settings unavailable." };
    }

    const start = new Date(parsed.data.scheduledStartIso);
    if (Number.isNaN(start.getTime())) {
      return { success: false, error: "Invalid time slot." };
    }

    const now = new Date();
    if (start.getTime() <= now.getTime()) {
      return { success: false, error: "That time has already passed. Please choose a later slot." };
    }

    const dateKey = formatDateKeyInZone(start, settings.timezone);
    const dayStart = zonedDateTimeToUtc(dateKey, "00:00", settings.timezone);
    const dayEnd = zonedDateTimeToUtc(dateKey, "23:59", settings.timezone);
    const bookedStarts = await getActiveBookedStartsInRangeQuery(dayStart, dayEnd);
    const slots = generateSlotsForDate({ dateKey, settings, bookedStarts, now });
    const matched = slots.find((s) => s.startIso === start.toISOString());

    if (!matched) {
      return { success: false, error: "That slot is no longer available. Please pick another time." };
    }

    const conflict = await findConflictingBookingQuery(start);
    if (conflict) {
      return { success: false, error: "That slot was just booked. Please pick another time." };
    }

    let userId: number | null = null;
    const sessionUser = await getCurrentSessionUser();
    if (sessionUser) {
      const dbUser = await getUserByAuthId(sessionUser.id);
      if (dbUser) userId = dbUser.id;
    }

    const booking = await insertBookingQuery({
      userId,
      guestName: parsed.data.guestName.trim(),
      guestEmail: parsed.data.guestEmail.trim().toLowerCase(),
      guestPhone: parsed.data.guestPhone?.trim() || null,
      inquiry: parsed.data.inquiry.trim(),
      scheduledStart: new Date(matched.startIso),
      scheduledEnd: new Date(matched.endIso),
      timezone: settings.timezone,
    });

    const display = formatSlotDisplay(booking.scheduledStart, booking.scheduledEnd, booking.timezone);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const toAdmin = process.env.RESEND_TO_EMAIL || "info.arielbatoon@gmail.com";

    try {
      await resend.emails.send({
        from: fromEmail,
        to: booking.guestEmail,
        subject: "Discovery Call request received – Ariel Batoon",
        html: bookingGuestReceivedHtml({
          guestName: booking.guestName,
          dateLabel: display.dateLabel,
          timeLabel: display.timeLabel,
          timeZone: display.timeZone,
          inquiry: booking.inquiry,
        }),
        text: bookingGuestReceivedText({
          guestName: booking.guestName,
          dateLabel: display.dateLabel,
          timeLabel: display.timeLabel,
          timeZone: display.timeZone,
          inquiry: booking.inquiry,
        }),
      });

      await resend.emails.send({
        from: fromEmail,
        to: toAdmin,
        subject: `New Discovery Call request from ${booking.guestName}`,
        html: bookingAdminNotificationHtml({
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          guestPhone: booking.guestPhone,
          dateLabel: display.dateLabel,
          timeLabel: display.timeLabel,
          timeZone: display.timeZone,
          inquiry: booking.inquiry,
        }),
        text: bookingAdminNotificationText({
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          guestPhone: booking.guestPhone,
          dateLabel: display.dateLabel,
          timeLabel: display.timeLabel,
          timeZone: display.timeZone,
          inquiry: booking.inquiry,
        }),
        replyTo: booking.guestEmail,
      });
    } catch (emailErr) {
      console.error("[Booking] Failed to send email:", emailErr);
    }

    return { success: true, booking };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to create booking.") };
  }
}

export async function getBookingsAction() {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const bookings = await getBookingsQuery();
    return { success: true, bookings };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to fetch bookings.") };
  }
}

export async function getBookingByIdAction(id: string) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const booking = await getBookingByIdQuery(id);
    if (!booking) return { success: false, error: "Booking not found." };
    return { success: true, booking };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to fetch booking.") };
  }
}

export async function getBookingSettingsAction() {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const settings = await getBookingSettingsQuery();
    if (!settings) return { success: false, error: "Settings not found." };
    return { success: true, settings };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to load settings.") };
  }
}

export async function updateBookingSettingsAction(data: { slotDurationMinutes: number; timezone: string; weeklyHours: BookingWeeklyHour[] }) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const parsed = UpdateBookingSettingsSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid settings." };
    }

    if (!BOOKING_SLOT_DURATIONS.includes(parsed.data.slotDurationMinutes as (typeof BOOKING_SLOT_DURATIONS)[number])) {
      return { success: false, error: "Slot duration must be 15, 30, or 60 minutes." };
    }

    const settings = await updateBookingSettingsQuery(parsed.data);
    return { success: true, settings };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to update settings.") };
  }
}

export async function updateBookingStatusAction(id: string, status: BookingStatus, adminNotes?: string | null) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    const parsed = UpdateBookingStatusSchema.safeParse({ id, status, adminNotes });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid status update." };
    }

    const existing = await getBookingByIdQuery(id);
    if (!existing) return { success: false, error: "Booking not found." };

    const next = parsed.data.status;
    if (!BOOKING_STATUSES.includes(next)) {
      return { success: false, error: "Invalid status." };
    }

    const allowed = allowedTransitions(existing.status);
    if (!allowed.includes(next)) {
      return {
        success: false,
        error: `Cannot change status from ${existing.status} to ${next}.`,
      };
    }

    if (next === "confirmed" || next === "pending") {
      const conflict = await findConflictingBookingQuery(new Date(existing.scheduledStart), id);
      if (conflict) {
        return { success: false, error: "Another active booking already occupies this slot." };
      }
    }

    const booking = await updateBookingStatusQuery(id, next, parsed.data.adminNotes);
    if (!booking) return { success: false, error: "Failed to update booking." };

    const display = formatSlotDisplay(booking.scheduledStart, booking.scheduledEnd, booking.timezone);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    try {
      await resend.emails.send({
        from: fromEmail,
        to: booking.guestEmail,
        subject: `Discovery Call ${next.replace("_", " ")} – Ariel Batoon`,
        html: bookingStatusUpdateHtml({
          guestName: booking.guestName,
          status: next,
          dateLabel: display.dateLabel,
          timeLabel: display.timeLabel,
          timeZone: display.timeZone,
        }),
        text: bookingStatusUpdateText({
          guestName: booking.guestName,
          status: next,
          dateLabel: display.dateLabel,
          timeLabel: display.timeLabel,
          timeZone: display.timeZone,
        }),
      });
    } catch (emailErr) {
      console.error("[Booking] Failed to send status email:", emailErr);
    }

    return { success: true, booking };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to update booking status.") };
  }
}

export async function deleteBookingsAction(ids: string[]) {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  try {
    await deleteBookingsQuery(ids);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to delete bookings.") };
  }
}
