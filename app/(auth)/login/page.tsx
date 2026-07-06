import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/drizzle";
import { users, userRoles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { LoginForm } from "@/components/features/auth/login-form";

export const metadata = {
  title: "Sign In | Ariel Batoon",
  description: "Sign in to your account to access the dashboard and manage settings.",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const dbUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.authId, user.id))
      .limit(1);

    if (dbUser.length > 0) {
      const roleRecord = await db
        .select({ role: userRoles.role })
        .from(userRoles)
        .where(eq(userRoles.userId, dbUser[0].id))
        .limit(1);

      const isAdmin = roleRecord.length > 0 && roleRecord[0].role === "admin";
      if (isAdmin) {
        redirect("/admin");
      } else {
        redirect("/customer");
      }
    } else {
      redirect("/customer");
    }
  }

  return <LoginForm />;
}
