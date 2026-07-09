import { ServiceHeader } from "@/components/features/dashboard/services/service-header";
import { ServiceTable } from "@/components/features/dashboard/services/service-table";
import { ServiceDetailDialog } from "@/components/features/dashboard/services/service-detail-dialog";

export const metadata = {
  title: "Services Management | Admin",
  description: "Manage service packages, pricing, deliverables, and optional client add-ons.",
};

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <ServiceHeader />
      <ServiceTable />
      <ServiceDetailDialog />
    </div>
  );
}
