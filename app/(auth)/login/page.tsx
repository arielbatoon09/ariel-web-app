"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Successfully logged in!");
      router.push("/admin");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">
          Welcome back
        </h2>
        <p className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="rounded-none border-dashed border-neutral-300 dark:border-neutral-700 bg-background/50 focus-visible:border-neutral-900 dark:focus-visible:border-neutral-100"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Password
            </label>
            <Link
              href="#"
              className="font-mono text-[10px] text-muted-foreground hover:text-foreground hover:underline"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Password reset link is not configured.");
              }}
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="rounded-none border-dashed border-neutral-300 dark:border-neutral-700 bg-background/50 pr-10 focus-visible:border-neutral-900 dark:focus-visible:border-neutral-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full justify-center rounded-none font-mono text-xs tracking-widest uppercase py-3 border border-neutral-900 dark:border-neutral-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-3.5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-1 size-3.5" />
            </>
          )}
        </Button>
      </form>

      <p className="px-4 text-center font-mono text-[9px] leading-relaxed text-muted-foreground uppercase tracking-wider">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
