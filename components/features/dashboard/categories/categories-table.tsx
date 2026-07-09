"use client";

import { useState } from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { DataTable } from "@/components/common/data-table";
import { cn } from "@/lib/utils";
import type { Category } from "@/schemas/dashboard";
import { useCategoriesQuery, useToggleCategoryStatusMutation, useDeleteCategoriesMutation } from "@/hooks/use-categories";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

export function CategoriesTable() {
  const { setSelectedCategoryId, setIsCategoryDetailsOpen } = useDashboardStore();

  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery();
  const toggleStatusMutation = useToggleCategoryStatusMutation();
  const deleteCategoriesMutation = useDeleteCategoriesMutation();

  const [itemsToDelete, setItemsToDelete] = useState<Category[]>([]);
  const [categoryToToggle, setCategoryToToggle] = useState<Category | null>(null);
  const [confirmType, setConfirmType] = useState<"delete" | "status" | null>(null);

  const columns = [
    {
      header: "Category Name",
      accessorKey: "name" as const,
      className: "font-medium font-sans",
    },
    {
      header: "Slug",
      accessorKey: "slug" as const,
      className: "font-mono text-neutral-550 dark:text-neutral-400",
    },
    {
      header: "Linked Scope",
      accessorKey: ((item: Category) => (
        <span className="text-neutral-450 font-mono text-[10px] tracking-wider uppercase dark:text-neutral-500">{item.target}</span>
      )) as (item: Category) => React.ReactNode,
    },
    {
      header: "Status",
      accessorKey: ((item: Category) => (
        <span className="inline-flex items-center gap-1.5 font-sans text-xs">
          <span className={cn("size-1.5 rounded-full", item.disabled ? "bg-red-500" : "bg-green-500")} />
          {item.disabled ? "Disabled" : "Active"}
        </span>
      )) as (item: Category) => React.ReactNode,
    },
  ];

  const handleViewDetails = (category: Category) => {
    setSelectedCategoryId(category.id);
    setIsCategoryDetailsOpen(true);
  };

  const handleToggleStatus = (category: Category) => {
    setCategoryToToggle(category);
    setConfirmType("status");
  };

  const handleDeleteBulk = (items: Category[]) => {
    setItemsToDelete(items);
    setConfirmType("delete");
  };

  const handleConfirm = () => {
    if (confirmType === "delete") {
      const ids = itemsToDelete.map((item) => item.id);
      deleteCategoriesMutation.mutate(ids);
    } else if (confirmType === "status" && categoryToToggle) {
      toggleStatusMutation.mutate(categoryToToggle.id);
    }
    setConfirmType(null);
  };

  const confirmTitle = confirmType === "delete" ? "Delete Category" : categoryToToggle?.disabled ? "Enable Category" : "Disable Category";

  const confirmDescription =
    confirmType === "delete"
      ? "This action cannot be undone. This will permanently delete the selected category/categories."
      : categoryToToggle?.disabled
        ? `Are you sure you want to enable the category "${categoryToToggle?.name}"? This will make it visible across public works and article categories.`
        : `Are you sure you want to disable the category "${categoryToToggle?.name}"? Disabling this category will hide it and all its associated items from public view.`;

  const confirmText = confirmType === "delete" ? "Delete" : categoryToToggle?.disabled ? "Enable" : "Disable";

  const confirmVariant = confirmType === "delete" ? "destructive" : "default";

  return (
    <div className="relative">
      <DataTable
        data={categories}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search categories..."
        onViewClick={handleViewDetails}
        onToggleStatusClick={handleToggleStatus}
        isLoading={isLoadingCategories}
        onDeleteBulk={handleDeleteBulk}
        onRowClick={handleViewDetails}
      />

      <ConfirmDialog
        open={confirmType !== null}
        onOpenChange={(open) => !open && setConfirmType(null)}
        title={confirmTitle}
        description={confirmDescription}
        confirmText={confirmText}
        cancelText="Cancel"
        onConfirm={handleConfirm}
        variant={confirmVariant}
        isLoading={deleteCategoriesMutation.isPending || toggleStatusMutation.isPending}
      />
    </div>
  );
}
