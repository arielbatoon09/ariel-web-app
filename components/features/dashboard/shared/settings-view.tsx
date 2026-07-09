"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { OrderDetailBrackets } from "@/components/features/dashboard/orders/order-detail-shared";
import { getCurrentUserProfileAction, updateUserProfileAction, updateUserPasswordAction } from "@/services/auth";

export function SettingsView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Password fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load user profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getCurrentUserProfileAction();
        if (res.success && res.user) {
          setFullName(res.user.fullName || "");
          setPhone(res.user.phone || "");
          setEmail(res.user.email || "");
        } else {
          toast.error(res.error || "Failed to load user profile details.");
        }
      } catch (err) {
        toast.error("An unexpected error occurred loading your profile.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full Name cannot be empty.");
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateUserProfileAction({ fullName, phone });
      if (res.success) {
        toast.success("Profile details updated successfully!");
        router.refresh(); // Propagate layout updates (like sidebar name)
      } else {
        toast.error(res.error || "Failed to update profile details.");
      }
    } catch (err) {
      toast.error("Failed to update profile details.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Password cannot be empty.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await updateUserPasswordAction(password);
      if (res.success) {
        toast.success("Password changed successfully!");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.error || "Failed to change password.");
      }
    } catch (err) {
      toast.error("Failed to change password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Profile Details Panel */}
      <div className="relative border border-neutral-300 bg-neutral-50/20 p-6 backdrop-blur-[2px] dark:border-neutral-700 dark:bg-neutral-950/10">
        <OrderDetailBrackets />
        <h3 className="border-b border-neutral-200 pb-3 font-sans text-sm font-bold tracking-widest text-foreground uppercase dark:border-neutral-800">
          Profile Settings
        </h3>
        
        <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4 font-mono text-xs">
          <FieldGroup>
            <Field>
              <FieldLabel className="text-[10px] tracking-widest text-neutral-400 uppercase">Email Address (Read-only)</FieldLabel>
              <Input
                type="email"
                value={email}
                disabled
                className="h-9 rounded-none border border-neutral-200 bg-neutral-100/50 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/30"
              />
            </Field>

            <Field>
              <FieldLabel className="text-[10px] tracking-widest text-neutral-400 uppercase">Full Name</FieldLabel>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSavingProfile}
                placeholder="e.g. John Doe"
                className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                required
              />
            </Field>

            <Field>
              <FieldLabel className="text-[10px] tracking-widest text-neutral-400 uppercase">Phone Number</FieldLabel>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSavingProfile}
                placeholder="e.g. +639123456789"
                className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
              />
            </Field>
          </FieldGroup>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSavingProfile}
              className="h-9 rounded-none bg-neutral-900 font-mono text-[10px] tracking-wider uppercase text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password Panel */}
      <div className="relative border border-neutral-300 bg-neutral-50/20 p-6 backdrop-blur-[2px] dark:border-neutral-700 dark:bg-neutral-950/10">
        <OrderDetailBrackets />
        <h3 className="border-b border-neutral-200 pb-3 font-sans text-sm font-bold tracking-widest text-foreground uppercase dark:border-neutral-800">
          Security & Password
        </h3>

        <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4 font-mono text-xs">
          <FieldGroup>
            <Field>
              <FieldLabel className="text-[10px] tracking-widest text-neutral-400 uppercase">New Password</FieldLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSavingPassword}
                placeholder="••••••••"
                className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                required
              />
            </Field>

            <Field>
              <FieldLabel className="text-[10px] tracking-widest text-neutral-400 uppercase">Confirm New Password</FieldLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSavingPassword}
                placeholder="••••••••"
                className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                required
              />
            </Field>
          </FieldGroup>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSavingPassword}
              className="h-9 rounded-none bg-neutral-900 font-mono text-[10px] tracking-wider uppercase text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {isSavingPassword ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Updating...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
