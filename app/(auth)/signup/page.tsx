"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page as sign up is disabled/manual only
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="font-mono text-xs text-muted-foreground">Redirecting...</p>
    </div>
  );
}
