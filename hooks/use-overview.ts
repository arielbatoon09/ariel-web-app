import { useQuery } from "@tanstack/react-query";
import { getAdminOverviewDataAction } from "@/services/overview";

export const OVERVIEW_QUERY_KEY = ["admin", "overview"];

export function useAdminOverviewQuery() {
  return useQuery({
    queryKey: OVERVIEW_QUERY_KEY,
    queryFn: async () => {
      const res = await getAdminOverviewDataAction();
      if (!res.success || !res.overview) {
        throw new Error(res.error || "Failed to load dashboard overview.");
      }
      return res.overview;
    },
  });
}
