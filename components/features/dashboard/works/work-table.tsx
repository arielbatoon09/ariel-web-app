"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { useWorksQuery, useToggleWorkStatusMutation, useDeleteWorksMutation } from "@/hooks/use-works";
import { DataTable } from "@/components/common/data-table";
import type { Project } from "@/schemas/dashboard";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

export function WorkTable() {
  const router = useRouter();
  const { setSelectedWorkId, setIsWorkDetailsOpen } = useDashboardStore();

  const { data: works = [], isLoading } = useWorksQuery();
  const toggleStatusMutation = useToggleWorkStatusMutation();
  const deleteWorksMutation = useDeleteWorksMutation();

  const [itemsToDelete, setItemsToDelete] = React.useState<Project[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const columns = [
    {
      header: "Project Details",
      accessorKey: (item: Project) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-foreground">{item.title}</span>
            {item.status === "draft" && (
              <span className="rounded border border-amber-200 bg-amber-50/20 px-1.5 py-0.5 font-mono text-[8px] text-amber-500 uppercase dark:border-amber-900/30 animate-pulse">
                Draft
              </span>
            )}
            {item.status === "unpublished" && (
              <span className="rounded border border-red-200 bg-red-50/20 px-1.5 py-0.5 font-mono text-[8px] text-red-500 uppercase dark:border-red-900/30">
                Unpublished
              </span>
            )}
            {item.status === "published" && (
              <span className="rounded border border-green-200 bg-green-50/20 px-1.5 py-0.5 font-mono text-[8px] text-green-500 uppercase dark:border-green-900/30">
                Published
              </span>
            )}
            {item.draft && (
              <span className="rounded border border-purple-200 bg-purple-50/20 px-1.5 py-0.5 font-mono text-[8px] text-purple-500 uppercase dark:border-purple-900/30 animate-pulse">
                Staged Changes
              </span>
            )}
          </div>
          <p className="max-w-md text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">{item.description}</p>
        </div>
      ),
    },
    {
      header: "Slug Reference",
      accessorKey: (item: Project) => <code className="font-mono text-xs text-neutral-500">{item.slug}</code>,
    },
    {
      header: "Categories",
      accessorKey: (item: Project) => (
        <div className="flex flex-wrap gap-1">
          {item.categories.map((c) => (
            <span
              key={c}
              className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400"
            >
              {c}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Tech Stack",
      accessorKey: (item: Project) => (
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded border border-neutral-300 px-1.5 py-0.5 font-mono text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
            >
              {t}
            </span>
          ))}
          {item.tags.length > 3 && <span className="font-mono text-xs text-neutral-400">+{item.tags.length - 3}</span>}
        </div>
      ),
    },
  ];

  const handleToggleStatus = (item: Project) => {
    toggleStatusMutation.mutate(item.id);
  };

  const handleDelete = (item: Project) => {
    setItemsToDelete([item]);
    setShowDeleteConfirm(true);
  };

  const handleDeleteBulk = (items: Project[]) => {
    setItemsToDelete(items);
    setShowDeleteConfirm(true);
  };

  const handleConfirm = () => {
    deleteWorksMutation.mutate(
      itemsToDelete.map((item) => item.id),
      {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setItemsToDelete([]);
        },
      }
    );
  };

  const handleView = (item: Project) => {
    setSelectedWorkId(item.id);
    setIsWorkDetailsOpen(true);
  };

  const isBulkDelete = itemsToDelete.length > 1;
  const confirmTitle = isBulkDelete ? "Delete Selected Projects" : "Delete Project";
  const confirmDescription = isBulkDelete
    ? `Are you sure you want to permanently delete the ${itemsToDelete.length} selected projects? This action cannot be undone.`
    : `Are you sure you want to permanently delete project "${itemsToDelete[0]?.title}"? This action cannot be undone.`;
  const confirmText = isBulkDelete ? `Delete ${itemsToDelete.length} Projects` : "Delete Project";

  return (
    <>
      <DataTable<Project>
        data={works}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search projects..."
        onViewClick={handleView}
        onEditClick={(item) => router.push(`/admin/works/${item.id}?edit=true`)}
        onDeleteClick={handleDelete}
        onDeleteBulk={handleDeleteBulk}
        onRowClick={handleView}
        hideExport={true}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(open) => !open && setShowDeleteConfirm(false)}
        title={confirmTitle}
        description={confirmDescription}
        confirmText={confirmText}
        onConfirm={handleConfirm}
        variant="destructive"
        isLoading={deleteWorksMutation.isPending}
      />
    </>
  );
}
