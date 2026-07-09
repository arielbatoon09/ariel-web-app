"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useCustomerOrdersQuery } from "@/hooks/use-customer-orders";
import { useServicesQuery } from "@/hooks/use-services";
import { getCurrentUserProfileAction } from "@/services/auth";
import { Loader2 } from "lucide-react";

import { CustomerOverviewHeader } from "./customer-overview-header";
import { CustomerOverviewMetrics } from "./customer-overview-metrics";
import { CustomerOverviewTable } from "./customer-overview-table";

export function CustomerOverviewClient() {
  const { user } = useAuthStore();
  const { data: orders = [], isLoading: isLoadingOrders } = useCustomerOrdersQuery();
  const { data: services = [] } = useServicesQuery();

  const [profileName, setProfileName] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch client profile name on load
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getCurrentUserProfileAction();
        if (res.success && res.user) {
          setProfileName(res.user.fullName || null);
        }
      } catch (err) {
        console.error("Failed to load profile name:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  const activeProjectsCount = useMemo(() => {
    return orders.filter((o) => o.status === "in-progress" || o.status === "revision_requested").length;
  }, [orders]);

  const isLoading = isLoadingOrders || isLoadingProfile;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <CustomerOverviewHeader displayName={profileName || user?.email || "Valued Client"} />
      <CustomerOverviewMetrics
        activeProjectsCount={activeProjectsCount}
        totalOrdersCount={orders.length}
      />
      <CustomerOverviewTable
        orders={orders}
        services={services}
      />
    </div>
  );
}
