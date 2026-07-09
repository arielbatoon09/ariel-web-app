"use client";

import * as React from "react";
import { useServicesQuery, useToggleServiceStatusMutation, useDeleteServicesMutation } from "@/hooks/use-services";
import { DataTable } from "@/components/common/data-table";
import type { Service } from "@/schemas/dashboard";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { useRouter } from "next/navigation";

export function ServiceTable() {
  const { setSelectedServiceId, setIsServiceDetailsOpen } = useDashboardStore();
  const router = useRouter();

  const { data: services = [], isLoading } = useServicesQuery();
  const toggleStatusMutation = useToggleServiceStatusMutation();
  const deleteServicesMutation = useDeleteServicesMutation();

  const [itemsToDelete, setItemsToDelete] = React.useState<Service[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const [showToggleConfirm, setShowToggleConfirm] = React.useState(false);
  const [itemToToggle, setItemToToggle] = React.useState<Service | null>(null);

  const columns = [
    {
      header: "Service Package",
      accessorKey: (item: Service) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-foreground">{item.name}</span>
            {item.disabled && (
              <span className="rounded border border-red-200 bg-red-50/20 px-1.5 py-0.5 font-mono text-[8px] text-red-500 uppercase dark:border-red-900/30">
                Disabled
              </span>
            )}
            {!item.disabled && (
              <span className="rounded border border-green-200 bg-green-50/20 px-1.5 py-0.5 font-mono text-[8px] text-green-500 uppercase dark:border-green-900/30">
                Active
              </span>
            )}
          </div>
          <p className="max-w-md text-xs leading-relaxed text-neutral-400 dark:text-neutral-500 line-clamp-2">{item.description}</p>
        </div>
      ),
    },
    {
      header: "Base Price",
      accessorKey: (item: Service) => <span className="font-mono text-xs font-mono text-foreground">₱{item.price.toLocaleString()}</span>,
    },
    {
      header: "Timeline",
      accessorKey: "deliveryTime" as keyof Service,
    },
    {
      header: "Features & Add-ons",
      accessorKey: (item: Service) => (
        <div className="flex flex-col gap-1">
          <span className="text-neutral-400 font-mono text-[10px]">{item.features.length} Features included</span>
          <div className="flex flex-wrap gap-1">
            {item.addOns.slice(0, 1).map((add) => (
              <span
                key={add.id}
                className="rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 font-mono text-[9px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400"
                title={add.description}
              >
                {add.name} (+₱{add.price.toLocaleString()})
              </span>
            ))}
            {item.addOns.length > 1 && (
              <span className="rounded border border-dashed border-neutral-300 bg-transparent px-1.5 py-0.5 font-mono text-[9px] text-neutral-500 dark:border-neutral-700">
                + {item.addOns.length - 1} more
              </span>
            )}
          </div>
        </div>
      ),
    },
  ];

  const handleToggleStatus = (item: Service) => {
    setItemToToggle(item);
    setShowToggleConfirm(true);
  };

  const handleConfirmToggle = () => {
    if (itemToToggle) {
      toggleStatusMutation.mutate(itemToToggle.id, {
        onSuccess: () => {
          setShowToggleConfirm(false);
          setItemToToggle(null);
        },
      });
    }
  };

  const handleDelete = (item: Service) => {
    setItemsToDelete([item]);
    setShowDeleteConfirm(true);
  };

  const handleDeleteBulk = (items: Service[]) => {
    setItemsToDelete(items);
    setShowDeleteConfirm(true);
  };

  const handleConfirm = () => {
    deleteServicesMutation.mutate(
      itemsToDelete.map((i) => i.id),
      {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setItemsToDelete([]);
        },
      }
    );
  };

  const handleView = (item: Service) => {
    setSelectedServiceId(item.id);
    setIsServiceDetailsOpen(true);
  };

  return (
    <>
      <DataTable<Service>
        data={services}
        columns={columns}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search packages..."
        onViewClick={handleView}
        onToggleStatusClick={handleToggleStatus}
        onDeleteClick={handleDelete}
        onDeleteBulk={handleDeleteBulk}
        onRowClick={handleView}
        hideExport={true}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Confirm Deletion"
        description={`Are you sure you want to permanently delete ${
          itemsToDelete.length === 1 ? `"${itemsToDelete[0].name}"` : `${itemsToDelete.length} packages`
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        variant="destructive"
      />

      <ConfirmDialog
        open={showToggleConfirm}
        onOpenChange={setShowToggleConfirm}
        title={itemToToggle?.disabled ? "Enable Service Package" : "Disable Service Package"}
        description={`Are you sure you want to ${
          itemToToggle?.disabled ? "enable" : "disable"
        } the service package "${itemToToggle?.name}"? ${
          itemToToggle?.disabled
            ? "This will make it visible to clients on the public pricing page."
            : "This will temporarily hide it from the public pricing page."
        }`}
        confirmText={itemToToggle?.disabled ? "Enable" : "Disable"}
        cancelText="Cancel"
        onConfirm={handleConfirmToggle}
      />
    </>
  );
}
