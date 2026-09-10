import { db } from "@/drizzle";
import { bookingSettings, discoveryBookings, type BookingWeeklyHour } from "@/drizzle/schema";
import { and, desc, eq, gte, inArray, lte, ne } from "drizzle-orm";
import { DEFAULT_BOOKING_TIMEZONE, DEFAULT_WEEKLY_HOURS } from "@/constants/booking";
import type { BookingStatus } from "@/constants/booking";

function mapBooking(row: typeof discoveryBookings.$inferSelect) {
  return {
    id: row.id,
    userId: row.userId?.toString() ?? null,
    guestName: row.guestName,
    guestEmail: row.guestEmail,
    guestPhone: row.guestPhone,
    inquiry: row.inquiry,
    scheduledStart: row.scheduledStart.toISOString(),
    scheduledEnd: row.scheduledEnd.toISOString(),
    timezone: row.timezone,
    status: row.status as BookingStatus,
    adminNotes: row.adminNotes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function mapSettings(row: typeof bookingSettings.$inferSelect) {
  return {
    id: row.id,
    slotDurationMinutes: row.slotDurationMinutes,
    timezone: row.timezone,
    weeklyHours: row.weeklyHours as BookingWeeklyHour[],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function ensureBookingSettingsQuery() {
  const [existing] = await db.select().from(bookingSettings).where(eq(bookingSettings.id, 1)).limit(1);
  if (existing) return mapSettings(existing);

  const [inserted] = await db
    .insert(bookingSettings)
    .values({
      id: 1,
      slotDurationMinutes: 30,
      timezone: DEFAULT_BOOKING_TIMEZONE,
      weeklyHours: DEFAULT_WEEKLY_HOURS,
    })
    .onConflictDoNothing()
    .returning();

  if (inserted) return mapSettings(inserted);

  const [again] = await db.select().from(bookingSettings).where(eq(bookingSettings.id, 1)).limit(1);
  return again ? mapSettings(again) : null;
}

export async function getBookingSettingsQuery() {
  return ensureBookingSettingsQuery();
}

export async function updateBookingSettingsQuery(data: { slotDurationMinutes: number; timezone: string; weeklyHours: BookingWeeklyHour[] }) {
  await ensureBookingSettingsQuery();
  const [updated] = await db
    .update(bookingSettings)
    .set({
      slotDurationMinutes: data.slotDurationMinutes,
      timezone: data.timezone,
      weeklyHours: data.weeklyHours,
      updatedAt: new Date(),
    })
    .where(eq(bookingSettings.id, 1))
    .returning();

  return updated ? mapSettings(updated) : null;
}

export async function getBookingsQuery() {
  const results = await db.select().from(discoveryBookings).orderBy(desc(discoveryBookings.scheduledStart));
  return results.map(mapBooking);
}

export async function getBookingByIdQuery(id: string) {
  const [row] = await db.select().from(discoveryBookings).where(eq(discoveryBookings.id, id)).limit(1);
  return row ? mapBooking(row) : null;
}

/** Active bookings that occupy a start time (pending + confirmed). */
export async function getActiveBookedStartsInRangeQuery(rangeStart: Date, rangeEnd: Date) {
  const rows = await db
    .select({ scheduledStart: discoveryBookings.scheduledStart })
    .from(discoveryBookings)
    .where(
      and(
        inArray(discoveryBookings.status, ["pending", "confirmed"]),
        gte(discoveryBookings.scheduledStart, rangeStart),
        lte(discoveryBookings.scheduledStart, rangeEnd)
      )
    );
  return rows.map((r) => r.scheduledStart);
}

export async function findConflictingBookingQuery(scheduledStart: Date, excludeId?: string) {
  const conditions = [eq(discoveryBookings.scheduledStart, scheduledStart), inArray(discoveryBookings.status, ["pending", "confirmed"])];
  if (excludeId) {
    conditions.push(ne(discoveryBookings.id, excludeId));
  }
  const [row] = await db
    .select()
    .from(discoveryBookings)
    .where(and(...conditions))
    .limit(1);
  return row ? mapBooking(row) : null;
}

export async function insertBookingQuery(data: {
  userId?: number | null;
  guestName: string;
  guestEmail: string;
  guestPhone?: string | null;
  inquiry: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  timezone: string;
}) {
  const [inserted] = await db
    .insert(discoveryBookings)
    .values({
      userId: data.userId ?? null,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone ?? null,
      inquiry: data.inquiry,
      scheduledStart: data.scheduledStart,
      scheduledEnd: data.scheduledEnd,
      timezone: data.timezone,
      status: "pending",
    })
    .returning();

  return mapBooking(inserted);
}

export async function updateBookingStatusQuery(id: string, status: BookingStatus, adminNotes?: string | null) {
  const [updated] = await db
    .update(discoveryBookings)
    .set({
      status,
      ...(adminNotes !== undefined ? { adminNotes } : {}),
      updatedAt: new Date(),
    })
    .where(eq(discoveryBookings.id, id))
    .returning();

  return updated ? mapBooking(updated) : null;
}

export async function deleteBookingsQuery(ids: string[]) {
  if (ids.length === 0) return;
  await db.delete(discoveryBookings).where(inArray(discoveryBookings.id, ids));
}
