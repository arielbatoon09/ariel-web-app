import { BookingsAdminClient } from "@/components/features/dashboard/bookings/bookings-admin-client";

export const metadata = {
  title: "Bookings Management | Admin",
  description: "Manage Discovery Call requests, confirm slots, and configure calendar availability.",
};

export default function AdminBookingsPage() {
  return <BookingsAdminClient />;
}
