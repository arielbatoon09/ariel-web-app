"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Key } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { createCustomerAction } from "@/services/customers";
import type { Customer } from "@/lib/schemas/dashboard";

const customerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  phone: z.string(),
  role: z.enum(["admin", "client"]),
});

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (customer: Customer) => void;
}

export function AddCustomerDialog({ open, onOpenChange, onSuccess }: AddCustomerDialogProps) {
  const [isPending, setIsPending] = useState(false);

  const generateStrongPassword = (setVal: (val: string) => void) => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,./<>";
    const all = uppercase + lowercase + numbers + symbols;

    let pwd = "";
    pwd += uppercase[Math.floor(Math.random() * uppercase.length)];
    pwd += lowercase[Math.floor(Math.random() * lowercase.length)];
    pwd += numbers[Math.floor(Math.random() * numbers.length)];
    pwd += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 4; i < 16; i++) {
      pwd += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle characters
    pwd = pwd
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
    setVal(pwd);
    toast.success("Generated a strong password!");
  };

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: "client" as "admin" | "client",
    },
    validators: {
      onSubmit: customerSchema,
    },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      const res = await createCustomerAction(value);
      setIsPending(false);

      if (res.success) {
        toast.success("Customer account successfully created!");
        const newCustomerId = res.user?.id ? res.user.id.toString() : Math.random().toString();

        onSuccess?.({
          id: newCustomerId,
          name: value.fullName,
          email: value.email,
          role: value.role === "client" ? "customer" : "admin",
          disabled: false,
          joinedAt: new Date().toISOString().split("T")[0],
          activities: [
            {
              id: `act-${Math.random().toString(36).slice(-8)}`,
              action: "Created Account",
              ipAddress: "127.0.0.1",
              timestamp: new Date().toLocaleString(),
            },
          ],
        });

        form.reset();
        onOpenChange(false);
      } else {
        toast.error(res.error || "Failed to create customer.");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border border-neutral-200 bg-background/95 p-6 font-mono text-xs backdrop-blur-md sm:max-w-[480px] dark:border-neutral-800">
        <DialogHeader className="space-y-1">
          <DialogTitle className="font-sans text-base font-bold text-foreground">Create Customer Account</DialogTitle>
          <DialogDescription className="text-[10px] text-neutral-400 uppercase">Register new authentication user securely</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4 pt-2"
        >
          <FieldGroup>
            {/* Full Name */}
            <form.Field
              name="fullName"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      Full Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      placeholder="Jane Doe"
                      className="rounded-none border-dashed border-neutral-300 bg-background/50 focus-visible:border-neutral-900 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            />

            {/* Email Address */}
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      Email Address
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      placeholder="jane.doe@example.com"
                      className="rounded-none border-dashed border-neutral-300 bg-background/50 focus-visible:border-neutral-900 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            />

            {/* Password with Generator */}
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                        Password
                      </FieldLabel>
                      <button
                        type="button"
                        onClick={() => generateStrongPassword(field.handleChange)}
                        disabled={isPending}
                        className="flex items-center gap-1 font-mono text-[9px] text-muted-foreground hover:text-foreground hover:underline"
                      >
                        <Key className="size-3" />
                        Generate Strong Password
                      </button>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      placeholder="••••••••••••"
                      className="rounded-none border-dashed border-neutral-300 bg-background/50 focus-visible:border-neutral-900 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            />

            {/* Phone Number (Optional) */}
            <form.Field
              name="phone"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      Phone Number (Optional)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      placeholder="+63 900 000 0000"
                      className="rounded-none border-dashed border-neutral-300 bg-background/50 focus-visible:border-neutral-900 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            />

            {/* Role Selection */}
            <form.Field
              name="role"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      Role
                    </FieldLabel>
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value as "admin" | "client")}
                      disabled={isPending}
                      className="w-full rounded-none border border-dashed border-neutral-300 bg-background/50 px-3 py-2 font-mono text-xs text-foreground outline-hidden focus-visible:border-neutral-900 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    >
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                    </select>
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <div className="flex justify-end gap-2 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-none border-dashed font-mono text-[10px] uppercase"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="rounded-none border border-neutral-900 font-mono text-[10px] uppercase dark:border-neutral-100"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1 size-3 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
