"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getWorksAction, getWorkByIdAction, createWorkAction, updateWorkAction, toggleWorkStatusAction, deleteWorksAction } from "@/services/works";
import type { Project } from "@/schemas/dashboard";

export const WORKS_QUERY_KEY = ["works"];

export function useWorksQuery() {
  return useQuery({
    queryKey: WORKS_QUERY_KEY,
    queryFn: async () => {
      const res = await getWorksAction();
      if (!res.success || !res.works) {
        throw new Error(res.error || "Failed to load works.");
      }
      return res.works as Project[];
    },
  });
}

export function useWorkDetailQuery(id: string) {
  return useQuery({
    queryKey: [...WORKS_QUERY_KEY, id],
    queryFn: async () => {
      const res = await getWorkByIdAction(id);
      if (!res.success || !res.work) {
        throw new Error(res.error || "Failed to load work details.");
      }
      return res.work as Project;
    },
    enabled: !!id,
  });
}

export function useCreateWorkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (work: Omit<Project, "id">) => {
      const res = await createWorkAction(work);
      if (!res.success || !res.work) {
        throw new Error(res.error || "Failed to create project.");
      }
      return res.work;
    },
    onSuccess: () => {
      toast.success("Project created successfully.");
      queryClient.invalidateQueries({ queryKey: WORKS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create project.");
    },
  });
}

export function useUpdateWorkMutation(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; data: Partial<Project> }) => {
      const res = await updateWorkAction(payload.id, payload.data);
      if (!res.success || !res.work) {
        throw new Error(res.error || "Failed to update project.");
      }
      return res.work;
    },
    onSuccess: (updatedWork) => {
      toast.success("Project updated successfully.");
      queryClient.invalidateQueries({ queryKey: WORKS_QUERY_KEY });
      if (id) {
        queryClient.invalidateQueries({ queryKey: [...WORKS_QUERY_KEY, id] });
      }
      queryClient.invalidateQueries({ queryKey: [...WORKS_QUERY_KEY, updatedWork.id] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update project.");
    },
  });
}

export function useToggleWorkStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await toggleWorkStatusAction(id);
      if (!res.success) {
        throw new Error(res.error || "Failed to update status.");
      }
      return { id, status: res.status };
    },
    onSuccess: (data) => {
      toast.success(`Project status updated to ${data.status}.`);
      queryClient.invalidateQueries({ queryKey: WORKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...WORKS_QUERY_KEY, data.id] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update status.");
    },
  });
}

export function useDeleteWorksMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await deleteWorksAction(ids);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete projects.");
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Selected project(s) deleted successfully.");
      queryClient.invalidateQueries({ queryKey: WORKS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete projects.");
    },
  });
}
