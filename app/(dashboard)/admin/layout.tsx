import { DashboardSidebar, type NavItem } from "@/components/features/dashboard/dashboard-sidebar";
import { AdminHeader } from "@/components/features/dashboard/admin-header";
import { LayoutDashboard, Briefcase, FileText, Layers, ShoppingBag, CreditCard, User, Package, ImageIcon } from "lucide-react";

import { redirect } from "next/navigation";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";

export const metadata = {
  title: "Admin Dashboard | Ariel Batoon",
  description: "Administrative control portal for managing projects, blog articles, services, and transactions.",
};

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="size-4" /> },
  { label: "Customers", href: "/admin/customers", icon: <User className="size-4" /> },
  { label: "Works", href: "/admin/works", icon: <Briefcase className="size-4" /> },
  { label: "Articles", href: "/admin/articles", icon: <FileText className="size-4" /> },
  { label: "Media", href: "/admin/media", icon: <ImageIcon className="size-4" /> },
  { label: "Categories", href: "/admin/categories", icon: <Layers className="size-4" /> },
  { label: "Services", href: "/admin/services", icon: <Package className="size-4" /> },
  { label: "Orders", href: "/admin/orders", icon: <ShoppingBag className="size-4" /> },
  { label: "Transactions", href: "/admin/transactions", icon: <CreditCard className="size-4" /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentSessionUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user from DB using authId
  const dbUser = await getUserByAuthId(user.id);

  if (!dbUser) {
    redirect("/login");
  }

  const role = await getUserRoleByUserId(dbUser.id);
  const isAdmin = role === "admin";

  if (!isAdmin) {
    redirect("/customer");
  }
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
