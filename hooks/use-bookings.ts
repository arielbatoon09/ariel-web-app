"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-utils";
import {
  createBookingAction,
  deleteBookingsAction,
  getAvailableSlotsAction,
  getBookableDatesAction,
  getBookingByIdAction,
  getBookingSettingsAction,
  getBookingsAction,
  getPublicBookingSettingsAction,
  updateBookingSettingsAction,
  updateBookingStatusAction,
} from "@/services/bookings";
import type { DiscoveryBooking, BookingSettings } from "@/schemas/dashboard";
import type { BookingStatus } from "@/constants/booking";
import type { BookingWeeklyHour } from "@/drizzle/schema";

export const BOOKINGS_QUERY_KEY = ["bookings"];
export const BOOKING_SETTINGS_QUERY_KEY = ["booking-settings"];

export function useBookingsQuery() {
  return useQuery({
    queryKey: BOOKINGS_QUERY_KEY,
    queryFn: async () => {
      const res = await getBookingsAction();
      if (!res.success || !res.bookings) {
        throw new Error(res.error || "Failed to load bookings.");
      }
      return res.bookings as DiscoveryBooking[];
    },
  });
}

export function useBookingDetailQuery(id: string) {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, id],
    queryFn: async () => {
      const res = await getBookingByIdAction(id);
      if (!res.success || !res.booking) {
        throw new Error(res.error || "Failed to load booking.");
      }
      return res.booking as DiscoveryBooking;
    },
    enabled: !!id,
  });
}

export function useBookingSettingsQuery(admin = true) {
  return useQuery({
    queryKey: [...BOOKING_SETTINGS_QUERY_KEY, admin ? "admin" : "public"],
    queryFn: async () => {
      const res = admin ? await getBookingSettingsAction() : await getPublicBookingSettingsAction();
      if (!res.success || !res.settings) {
        throw new Error(res.error || "Failed to load booking settings.");
      }
      return res.settings as BookingSettings;
    },
  });
}

export function useBookableDatesQuery(monthKey: string) {
  return useQuery({
    queryKey: ["bookable-dates", monthKey],
    queryFn: async () => {
      const res = await getBookableDatesAction(monthKey);
      if (!res.success || !res.dates) {
        throw new Error(res.error || "Failed to load dates.");
      }
      return {
        dates: res.dates as string[],
        settings: res.settings,
      };
    },
    enabled: !!monthKey,
  });
}

export function useAvailableSlotsQuery(dateKey: string | null) {
  return useQuery({
    queryKey: ["available-slots", dateKey],
    queryFn: async () => {
      if (!dateKey) return { slots: [], settings: null };
      const res = await getAvailableSlotsAction(dateKey);
      if (!res.success) {
        throw new Error(res.error || "Failed to load slots.");
      }
      return {
        slots: res.slots || [],
        settings: res.settings || null,
      };
    },
    enabled: !!dateKey,
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      guestName: string;
      guestEmail: string;
      guestPhone?: string;
      inquiry: string;
      scheduledStartIso: string;
      recaptchaToken: string;
    }) => {
      const res = await createBookingAction(data);
      if (!res.success || !res.booking) {
        throw new Error(res.error || "Failed to create booking.");
      }
      return res.booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      queryClient.invalidateQueries({ queryKey: ["bookable-dates"] });
      toast.success("Request sent — pending confirmation.");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to book slot."));
    },
  });
}

export function useUpdateBookingSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { slotDurationMinutes: number; timezone: string; weeklyHours: BookingWeeklyHour[] }) => {
      const res = await updateBookingSettingsAction(data);
      if (!res.success || !res.settings) {
        throw new Error(res.error || "Failed to save settings.");
      }
      return res.settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_SETTINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["bookable-dates"] });
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      toast.success("Calendar settings saved.");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to save settings."));
    },
  });
}

export function useUpdateBookingStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; status: BookingStatus; adminNotes?: string | null }) => {
      const res = await updateBookingStatusAction(data.id, data.status, data.adminNotes);
      if (!res.success || !res.booking) {
        throw new Error(res.error || "Failed to update status.");
      }
      return res.booking;
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      toast.success(`Booking marked ${booking.status.replace("_", " ")}.`);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to update status."));
    },
  });
}

export function useDeleteBookingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await deleteBookingsAction(ids);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete bookings.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
      toast.success("Booking(s) deleted.");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to delete bookings."));
    },
  });
}
