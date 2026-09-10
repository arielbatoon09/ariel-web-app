"use client";

import { useState } from "react";
import { useBookingsQuery, useDeleteBookingsMutation } from "@/hooks/use-bookings";
import { DataTable } from "@/components/common/data-table";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { cn } from "@/lib/utils";
import type { DiscoveryBooking } from "@/schemas/dashboard";
import { BookingDetailDialog } from "./booking-detail-dialog";

function statusClass(status: DiscoveryBooking["status"]) {
  return cn(
    "inline-flex items-center rounded border px-2 py-0.5 font-mono text-[9px] tracking-wider uppercase",
    status === "pending" && "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/40 dark:bg-yellow-950/20 dark:text-yellow-400",
    status === "confirmed" && "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-400",
    status === "completed" && "border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400",
    status === "cancelled" && "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400",
    status === "no_show" && "border-neutral-300 bg-neutral-100 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
  );
}

export function BookingTable() {
  const { data: bookings = [], isLoading } = useBookingsQuery();
  const deleteMutation = useDeleteBookingsMutation();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<DiscoveryBooking[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const columns = [
    {
      header: "Guest",
      accessorKey: (item: DiscoveryBooking) => (
        <div className="flex flex-col gap-1">
          <span className="font-sans font-bold text-foreground">{item.guestName}</span>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">{item.guestEmail}</p>
        </div>
      ),
    },
    {
      header: "Scheduled",
      accessorKey: (item: DiscoveryBooking) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs text-foreground">
            {new Date(item.scheduledStart).toLocaleString("en-US", {
              timeZone: item.timezone,
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          <span className="font-mono text-[10px] text-neutral-400">{item.timezone.replace(/_/g, " ")}</span>
        </div>
      ),
    },
    {
      header: "Inquiry",
      accessorKey: (item: DiscoveryBooking) => <span className="line-clamp-2 max-w-[240px] text-xs text-neutral-500">{item.inquiry}</span>,
    },
    {
      header: "Status",
      accessorKey: (item: DiscoveryBooking) => <span className={statusClass(item.status)}>{item.status.replace("_", " ")}</span>,
    },
    {
      header: "Requested",
      accessorKey: (item: DiscoveryBooking) => (
        <span className="font-mono text-xs text-neutral-500">
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  const openDetail = (item: DiscoveryBooking) => {
    setSelectedId(item.id);
    setDetailOpen(true);
  };

  return (
    <>
      <DataTable<DiscoveryBooking>
        data={bookings}
        columns={columns}
        isLoading={isLoading}
        searchKey="guestName"
        searchPlaceholder="Search guests..."
        onRowClick={openDetail}
        onViewClick={openDetail}
        onDeleteClick={(item) => {
          setItemsToDelete([item]);
          setShowDeleteConfirm(true);
        }}
        onDeleteBulk={(items) => {
          setItemsToDelete(items);
          setShowDeleteConfirm(true);
        }}
      />

      <BookingDetailDialog
        id={selectedId || ""}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setSelectedId(null);
        }}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Confirm Booking Deletion"
        description={`Delete ${
          itemsToDelete.length === 1 ? `"${itemsToDelete[0].guestName}"` : `${itemsToDelete.length} bookings`
        }? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          deleteMutation.mutate(
            itemsToDelete.map((i) => i.id),
            {
              onSuccess: () => {
                setShowDeleteConfirm(false);
                setItemsToDelete([]);
              },
            }
          );
        }}
        variant="destructive"
      />
    </>
  );
}
