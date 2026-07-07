"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  toggleCategoryStatusAction,
  deleteCategoriesAction,
} from "@/services/categories";
import type { Category } from "@/lib/schemas/dashboard";

export const CATEGORIES_QUERY_KEY = ["categories"];

export function useCategoriesQuery() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const res = await getCategoriesAction();
      if (!res.success || !res.categories) {
        throw new Error(res.error || "Failed to load categories.");
      }
      return res.categories as Category[];
    },
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Omit<Category, "id">) => {
      const res = await createCategoryAction(category);
      if (!res.success || !res.category) {
        throw new Error(res.error || "Failed to create category.");
      }
      return res.category;
    },
    onSuccess: () => {
      toast.success("Category created successfully.");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create category.");
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Category) => {
      const res = await updateCategoryAction(category.id, {
        name: category.name,
        slug: category.slug,
        target: category.target as "works" | "articles" | "both",
        disabled: category.disabled,
      });
      if (!res.success || !res.category) {
        throw new Error(res.error || "Failed to update category.");
      }
      return res.category;
    },
    onSuccess: () => {
      toast.success("Category updated successfully.");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update category.");
    },
  });
}

export function useToggleCategoryStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await toggleCategoryStatusAction(id);
      if (!res.success || !res.category) {
        throw new Error(res.error || "Failed to toggle status.");
      }
      return res.category;
    },
    onSuccess: () => {
      toast.success("Category status updated successfully.");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to toggle status.");
    },
  });
}

export function useDeleteCategoriesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await deleteCategoriesAction(ids);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete categories.");
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Selected category/categories deleted successfully.");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete categories.");
    },
  });
}
