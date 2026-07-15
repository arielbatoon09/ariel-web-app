import { redirect } from "next/navigation";
import { LoginForm } from "@/components/features/auth/login-form";
import { getCurrentSessionUser } from "@/data/auth";
import { getUserByAuthId } from "@/data/users";
import { getUserRoleByUserId } from "@/data/roles";

export const metadata = {
  title: "Sign In | Ariel Batoon",
  description: "Sign in to your account to access the dashboard and manage settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const user = await getCurrentSessionUser();

  if (user) {
    const dbUser = await getUserByAuthId(user.id);

    if (dbUser) {
      const role = await getUserRoleByUserId(dbUser.id);
      const isAdmin = role === "admin";
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
