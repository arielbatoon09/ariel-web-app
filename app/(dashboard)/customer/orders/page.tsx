import { getCustomerOrdersAction } from "@/services/orders";
import { getServicesQuery } from "@/data/services";
import { CustomerOrdersClient } from "@/components/features/dashboard/orders/customer-orders-client";

export const metadata = {
  title: "My Active Orders | Client Board",
  description: "Track development milestones, deliverables, and active agreements.",
};

export default async function CustomerOrdersPage() {
  const ordersRes = await getCustomerOrdersAction();
  const initialOrders = ordersRes.success && ordersRes.orders ? ordersRes.orders : [];
  const initialServices = await getServicesQuery();

  return <CustomerOrdersClient initialOrders={initialOrders} initialServices={initialServices} />;
}
