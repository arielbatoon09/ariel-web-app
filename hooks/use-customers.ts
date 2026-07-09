import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-utils";
import {
  getCustomersAction,
  createCustomerAction,
  updateCustomerRoleAction,
  toggleCustomerBlockStatusAction,
  deleteCustomersAction,
} from "@/services/customers";

export const CUSTOMERS_QUERY_KEY = ["customers"];

export function useCustomersQuery() {
  return useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: async () => {
      const res = await getCustomersAction();
      if (!res.success || !res.customers) {
        throw new Error(res.error || "Failed to load customers.");
      }
      return res.customers;
    },
  });
}

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerAction,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Customer created successfully.");
        queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      } else {
        toast.error(res.error || "Failed to create customer.");
      }
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "An error occurred while creating customer."));
    },
  });
}

export function useUpdateCustomerRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, role }: { customerId: string; role: "admin" | "client" }) => {
      const res = await updateCustomerRoleAction(customerId, role);
      if (!res.success) {
        throw new Error(res.error || "Failed to update role.");
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Customer role updated successfully.");
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "An error occurred while updating role."));
    },
  });
}

export function useToggleCustomerBlockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, isBlocked }: { customerId: string; isBlocked: boolean }) => {
      const res = await toggleCustomerBlockStatusAction(customerId, isBlocked);
      if (!res.success) {
        throw new Error(res.error || "Failed to update block status.");
      }
      return res;
    },
    onSuccess: (_, variables) => {
      toast.success(variables.isBlocked ? "Customer blocked." : "Customer unblocked.");
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "An error occurred while updating block status."));
    },
  });
}

export function useDeleteCustomersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerIds: string[]) => {
      const res = await deleteCustomersAction(customerIds);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete customers.");
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Selected customer(s) deleted successfully.");
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "An error occurred while deleting customers."));
    },
  });
}
