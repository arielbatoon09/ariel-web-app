import { CustomerHeader } from "@/components/features/dashboard/customers/customer-header";
import { CustomerTable } from "@/components/features/dashboard/customers/customer-table";
import { CustomerDetailDialog } from "@/components/features/dashboard/customers/customer-detail-dialog";
import { CustomerAddDialog } from "@/components/features/dashboard/customers/customer-add-dialog";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <CustomerHeader />
      <CustomerTable />
      <CustomerDetailDialog />
      <CustomerAddDialog />
    </div>
  );
}
