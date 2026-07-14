"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { useWorksQuery, useDeleteWorksMutation, useToggleWorkFeaturedMutation } from "@/hooks/use-works";
import { DataTable } from "@/components/common/data-table";
import type { Project } from "@/schemas/dashboard";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Star } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

function FeaturedToggleCell({ item }: { item: Project }) {
  const toggleFeaturedMutation = useToggleWorkFeaturedMutation();
  const [localFeatured, setLocalFeatured] = useState(item.isFeatured);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalFeatured(item.isFeatured);
  }, [item.isFeatured]);

  const handleToggle = (pressed: boolean) => {
    setLocalFeatured(pressed);

    toggleFeaturedMutation.mutate(
      { id: item.id, isFeatured: pressed },
      {
        onError: () => {
          setLocalFeatured(item.isFeatured);
        },
      }
    );
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
      <Toggle
        pressed={localFeatured}
        onPressedChange={handleToggle}
        disabled={toggleFeaturedMutation.isPending}
        className={cn(
          "cursor-pointer rounded-none p-0 !bg-transparent hover:bg-transparent data-[state=on]:bg-transparent focus-visible:ring-0 transition-all",
          localFeatured
            ? "text-yellow-500 dark:text-yellow-400 [&_svg]:fill-yellow-500 dark:[&_svg]:fill-yellow-400 [&_svg]:text-yellow-500 dark:[&_svg]:text-yellow-400"
            : "text-neutral-300 hover:text-neutral-450 dark:text-neutral-600 dark:hover:text-neutral-500"
        )}
        title={localFeatured ? "Remove from Top 3 featured works" : "Add to Top 3 featured works"}
      >
        <Star className="size-4" />
      </Toggle>
    </div>
  );
}

export function WorkTable() {
  const router = useRouter();
  const { setSelectedWorkId, setIsWorkDetailsOpen } = useDashboardStore();

  const { data: works = [], isLoading } = useWorksQuery();
  const deleteWorksMutation = useDeleteWorksMutation();

  const [itemsToDelete, setItemsToDelete] = useState<Project[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const columns = useMemo(() => [
    {
      header: "",
      accessorKey: (item: Project) => <FeaturedToggleCell item={item} />,
      className: "w-8 !px-0 text-center",
    },
    {
      header: "Project Details",
      accessorKey: (item: Project) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/60">
            {item.imageSrc ? (
              <Image src={item.imageSrc} alt={item.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-[8px] text-neutral-400 dark:text-neutral-600 uppercase select-none">
                No Banner
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-foreground">{item.title}</span>
              {item.status === "draft" && (
                <span className="animate-pulse rounded border border-amber-200 bg-amber-50/20 px-1.5 py-0.5 font-mono text-[8px] text-amber-500 uppercase dark:border-amber-900/30">
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
                <span className="animate-pulse rounded border border-purple-200 bg-purple-50/20 px-1.5 py-0.5 font-mono text-[8px] text-purple-500 uppercase dark:border-purple-900/30">
                  Staged Changes
                </span>
              )}
            </div>
            <p className="max-w-md text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">{item.description}</p>
          </div>
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
  ], []);

  const handleDelete = useCallback((item: Project) => {
    setItemsToDelete([item]);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteBulk = useCallback((items: Project[]) => {
    setItemsToDelete(items);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirm = useCallback(() => {
    deleteWorksMutation.mutate(
      itemsToDelete.map((item) => item.id),
      {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setItemsToDelete([]);
        },
      }
    );
  }, [deleteWorksMutation, itemsToDelete]);

  const handleView = useCallback((item: Project) => {
    setSelectedWorkId(item.id);
    setIsWorkDetailsOpen(true);
  }, [setSelectedWorkId, setIsWorkDetailsOpen]);

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
