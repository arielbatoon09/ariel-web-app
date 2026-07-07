import { WorkHeader } from "@/components/features/dashboard/works/work-header";
import { WorkTable } from "@/components/features/dashboard/works/work-table";
import { WorkDetailDialog } from "@/components/features/dashboard/works/work-detail-dialog";
import { WorkAddDialog } from "@/components/features/dashboard/works/work-add-dialog";

export const metadata = {
  title: "Works Management | Admin",
  description: "Manage portfolio works, projects, and case studies.",
};

export default function AdminWorksPage() {
  return (
    <div className="space-y-6">
      <WorkHeader />
      <WorkTable />
      <WorkDetailDialog />
      <WorkAddDialog />
    </div>
  );
}
