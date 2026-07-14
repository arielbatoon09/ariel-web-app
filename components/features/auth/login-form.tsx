"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";

import { ReCaptchaV2, ReCaptchaV2Ref } from "@/components/common/recaptcha-v2";
import { verifyReCaptchaAction } from "@/services/recaptcha";
import { useAuthStore } from "@/hooks/use-auth-store";
import { getUserRoleAction, checkLoginRateLimitAction } from "@/services/auth";
const loginSchema = z.object({
  email: z.string().min(1, "Email address is required.").email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading } = useAuthStore();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCaptchaV2Ref>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // 1. Check Rate Limit
        const rateLimit = await checkLoginRateLimitAction(value.email);
        if (!rateLimit.success) {
          toast.error(rateLimit.error || "Too many attempts. Please try again later.");
          return;
        }

        // 2. Verify reCAPTCHA
        if (!recaptchaToken) {
          toast.error("Please complete the reCAPTCHA challenge.");
          return;
        }

        const verification = await verifyReCaptchaAction(recaptchaToken);
        if (!verification.success) {
          toast.error(verification.error || "Security validation failed. Please try again.");
          recaptchaRef.current?.reset();
          return;
        }

        const res = await signIn(value.email, value.password);
        if (res.success) {
          toast.success("Successfully logged in!");
          try {
            const roleRes = await getUserRoleAction();
            if (roleRes.success && roleRes.role === "admin") {
              router.push("/admin");
            } else {
              router.push("/customer");
            }
          } catch {
            // Default fallback
            router.push("/customer");
          }
        } else {
          toast.error(res.error || "Failed to log in.");
          recaptchaRef.current?.reset();
        }
      } catch {
        toast.error("An error occurred during submission.");
        recaptchaRef.current?.reset();
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">Welcome back</h2>
        <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Sign in to your account</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup>
          <form.Field name="email">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    Email Address
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isLoading}
                    aria-invalid={isInvalid}
                    placeholder="name@example.com"
                    className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="password">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name} className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      Password
                    </FieldLabel>
                    {/* <Link
                      href="#"
                      className="font-mono text-[10px] text-muted-foreground hover:text-foreground hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info("Password reset link is not configured.");
                      }}
                    >
                      Forgot?
                    </Link> */}
                  </div>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                      aria-invalid={isInvalid}
                      className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 pr-10 transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <ReCaptchaV2 ref={recaptchaRef} onChange={setRecaptchaToken} />

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => {
            const activeLoading = isLoading || isSubmitting;
            return (
              <Button
                type="submit"
                disabled={activeLoading}
                className="h-9 w-full justify-center rounded-none border border-neutral-900 font-mono text-[10px] tracking-widest uppercase dark:border-neutral-100"
              >
                {activeLoading ? (
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
            );
          }}
        </form.Subscribe>
      </form>

      <p className="px-4 text-center font-mono text-[9px] leading-relaxed tracking-wider text-muted-foreground uppercase">
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
