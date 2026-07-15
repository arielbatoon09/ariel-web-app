import { DashboardSidebar, type NavItem } from "@/components/features/dashboard/shared/dashboard-sidebar";
import { AdminHeader } from "@/components/features/dashboard/shared/admin-header";
import { LayoutDashboard, ShoppingBag, Settings } from "lucide-react";

import { redirect } from "next/navigation";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";

export const metadata = {
  title: "Client Portal | Ariel Batoon",
  description: "Customer access portal for managing orders, checking progress, and updating account settings.",
  robots: {
    index: false,
    follow: false,
  },
};

const CUSTOMER_NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/customer", icon: <LayoutDashboard className="size-4" /> },
  { label: "My Orders", href: "/customer/orders", icon: <ShoppingBag className="size-4" /> },
  { label: "Settings", href: "/customer/settings", icon: <Settings className="size-4" /> },
];

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
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

  if (isAdmin) {
    redirect("/admin");
  }
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background lg:flex-row">
      <DashboardSidebar
        role="customer"
        navItems={CUSTOMER_NAV_ITEMS}
        userProfile={{
          name: dbUser.fullName || user.email || "Client",
          email: user.email || "",
          avatarUrl: user.user_metadata?.avatar_url || null,
        }}
      />
      <main className="h-full flex-1 overflow-x-hidden overflow-y-auto px-4 pt-0 pb-6 md:px-8 md:pt-0 md:pb-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <AdminHeader />
          {children}
        </div>
      </main>
    </div>
  );
}
