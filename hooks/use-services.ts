"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getServicesAction,
  getServiceByIdAction,
  createServiceAction,
  updateServiceAction,
  toggleServiceStatusAction,
  deleteServicesAction,
  getServiceBySlugAction,
} from "@/services/services";
import type { Service } from "@/schemas/dashboard";

export const SERVICES_QUERY_KEY = ["services"];

export function useServicesQuery(initialData?: Service[]) {
  return useQuery({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: async () => {
      const res = await getServicesAction();
      if (!res.success || !res.services) {
        throw new Error(res.error || "Failed to load services.");
      }
      return res.services as Service[];
    },
    initialData,
  });
}

export function useServiceDetailQuery(id: string) {
  return useQuery({
    queryKey: [...SERVICES_QUERY_KEY, id],
    queryFn: async () => {
      const res = await getServiceByIdAction(id);
      if (!res.success || !res.service) {
        throw new Error(res.error || "Failed to load service details.");
      }
      return res.service as Service;
    },
    enabled: !!id,
  });
}

export function useServiceDetailBySlugQuery(slug: string) {
  return useQuery({
    queryKey: [...SERVICES_QUERY_KEY, "slug", slug],
    queryFn: async () => {
      const res = await getServiceBySlugAction(slug);
      if (!res.success || !res.service) {
        throw new Error(res.error || "Failed to load service details.");
      }
      return res.service as Service;
    },
    enabled: !!slug,
  });
}

export function useCreateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Omit<Service, "id">) => {
      const res = await createServiceAction(service);
      if (!res.success || !res.service) {
        throw new Error(res.error || "Failed to create service.");
      }
      return res.service;
    },
    onSuccess: () => {
      toast.success("Service package created successfully.");
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create service.");
    },
  });
}

export function useUpdateServiceMutation(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; data: Partial<Service> }) => {
      const res = await updateServiceAction(payload.id, payload.data);
      if (!res.success || !res.service) {
        throw new Error(res.error || "Failed to update service.");
      }
      return res.service;
    },
    onSuccess: (updatedService) => {
      toast.success("Service package updated successfully.");
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
      if (id) {
        queryClient.invalidateQueries({ queryKey: [...SERVICES_QUERY_KEY, id] });
      }
      queryClient.invalidateQueries({ queryKey: [...SERVICES_QUERY_KEY, updatedService.id] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update service.");
    },
  });
}

export function useToggleServiceStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await toggleServiceStatusAction(id);
      if (!res.success) {
        throw new Error(res.error || "Failed to update service status.");
      }
      return { id, disabled: res.disabled };
    },
    onSuccess: (data) => {
      toast.success(data.disabled ? "Service package disabled." : "Service package enabled.");
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...SERVICES_QUERY_KEY, data.id] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to toggle service status.");
    },
  });
}

export function useDeleteServicesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await deleteServicesAction(ids);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete services.");
      }
      return ids;
    },
    onSuccess: () => {
      toast.success("Selected services deleted successfully.");
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete services.");
    },
  });
}
