import { OrderHeader } from "@/components/features/dashboard/orders/order-header";
import { OrderTable } from "@/components/features/dashboard/orders/order-table";
import { OrderDetailDialog } from "@/components/features/dashboard/orders/order-detail-dialog";

export const metadata = {
  title: "Orders Management | Admin",
  description: "Track orders, verify manual GCash/Maya receipts, and process development workflows.",
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <OrderHeader />
      <OrderTable />
      <OrderDetailDialog />
    </div>
  );
}
