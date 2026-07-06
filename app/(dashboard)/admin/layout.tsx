import { DashboardSidebar, type NavItem } from "@/components/features/dashboard/dashboard-sidebar";
import { AdminHeader } from "@/components/features/dashboard/admin-header";
import { LayoutDashboard, Briefcase, FileText, Layers, ShoppingBag, CreditCard, User, Package } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Ariel Batoon",
  description: "Administrative control portal for managing projects, blog articles, services, and transactions.",
};

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="size-4" /> },
  { label: "Customers", href: "/admin/customers", icon: <User className="size-4" /> },
  { label: "Works", href: "/admin/works", icon: <Briefcase className="size-4" /> },
  { label: "Articles", href: "/admin/articles", icon: <FileText className="size-4" /> },
  { label: "Categories", href: "/admin/categories", icon: <Layers className="size-4" /> },
  { label: "Services", href: "/admin/services", icon: <Package className="size-4" /> },
  { label: "Orders", href: "/admin/orders", icon: <ShoppingBag className="size-4" /> },
  { label: "Transactions", href: "/admin/transactions", icon: <CreditCard className="size-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background lg:flex-row">
      <DashboardSidebar role="admin" navItems={ADMIN_NAV_ITEMS} />
      <main className="h-full flex-1 overflow-x-hidden overflow-y-auto px-4 pt-0 pb-6 md:px-8 md:pt-0 md:pb-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <AdminHeader />
          {children}
        </div>
      </main>
    </div>
  );
}
