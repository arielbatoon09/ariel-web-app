import { DashboardSidebar, type NavItem } from "@/components/features/dashboard/dashboard-sidebar";
import { AdminHeader } from "@/components/features/dashboard/admin-header";
import { LayoutDashboard, ShoppingBag, Settings, User } from "lucide-react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/drizzle";
import { users, userRoles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Client Portal | Ariel Batoon",
  description: "Customer access portal for managing orders, checking progress, and updating account settings.",
};

const CUSTOMER_NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/customer", icon: <LayoutDashboard className="size-4" /> },
  { label: "My Orders", href: "/customer/orders", icon: <ShoppingBag className="size-4" /> },
  { label: "Settings", href: "/customer/settings", icon: <Settings className="size-4" /> },
];

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch role from DB
  const dbUser = await db.select({ id: users.id }).from(users).where(eq(users.authId, user.id)).limit(1);

  if (dbUser.length === 0) {
    redirect("/login");
  }

  const roleRecord = await db.select({ role: userRoles.role }).from(userRoles).where(eq(userRoles.userId, dbUser[0].id)).limit(1);

  const isAdmin = roleRecord.length > 0 && roleRecord[0].role === "admin";

  if (isAdmin) {
    redirect("/admin");
  }
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background lg:flex-row">
      <DashboardSidebar role="customer" navItems={CUSTOMER_NAV_ITEMS} />
      <main className="h-full flex-1 overflow-x-hidden overflow-y-auto px-4 pt-0 pb-6 md:px-8 md:pt-0 md:pb-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <AdminHeader />
          {children}
        </div>
      </main>
    </div>
  );
}
