"use client";

import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { AddCategoryDialog as RawAddCategoryDialog } from "@/components/features/dashboard/categories/add-category-dialog";
import { useCreateCategoryMutation } from "@/hooks/use-categories";

export function CategoriesAddOpenWrapper() {
  const { isCategoryAddOpen, setIsCategoryAddOpen } = useDashboardStore();
  const createCategoryMutation = useCreateCategoryMutation();

  return (
    <RawAddCategoryDialog
      open={isCategoryAddOpen}
      onOpenChange={setIsCategoryAddOpen}
      onSuccess={(newCategory) => {
        createCategoryMutation.mutate(newCategory);
      }}
    />
  );
}
