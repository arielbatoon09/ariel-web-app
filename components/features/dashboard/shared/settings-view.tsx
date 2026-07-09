"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, User, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { OrderDetailBrackets } from "@/components/features/dashboard/orders/order-detail-shared";
import {
  getCurrentUserProfileAction,
  updateUserProfileAction,
  updateUserPasswordAction,
  getAvatarPresignedUrlAction,
  updateUserAvatarAction,
} from "@/services/auth";

export function SettingsView() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Profile fields (current)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Profile fields (original values for change tracking)
  const [initialFullName, setInitialFullName] = useState("");
  const [initialPhone, setInitialPhone] = useState("");

  // staged avatar file
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

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
          setInitialFullName(res.user.fullName || "");
          setPhone(res.user.phone || "");
          setInitialPhone(res.user.phone || "");
          setEmail(res.user.email || "");
          setAvatarUrl(res.user.avatarUrl || null);
        } else {
          toast.error(res.error || "Failed to load user profile details.");
        }
      } catch {
        toast.error("An unexpected error occurred loading your profile.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Cleanup local preview URLs on unmount
  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }

    const preview = URL.createObjectURL(file);
    setAvatarPreviewUrl(preview);
    setAvatarFile(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full Name cannot be empty.");
      return;
    }

    setIsSavingProfile(true);
    try {
      // 1. Upload new avatar to R2 only when "Save Profile" is clicked
      if (avatarFile) {
        setIsUploadingAvatar(true);
        const res = await getAvatarPresignedUrlAction(avatarFile.name, avatarFile.type);
        if (!res.success || !res.presignedUrl || !res.url) {
          throw new Error(res.error || "Failed to generate upload URL.");
        }

        const uploadRes = await fetch(res.presignedUrl, {
          method: "PUT",
          body: avatarFile,
          headers: {
            "Content-Type": avatarFile.type,
          },
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image file to storage.");
        }

        const updateRes = await updateUserAvatarAction(res.url);
        if (!updateRes.success) {
          throw new Error(updateRes.error || "Failed to update profile avatar metadata.");
        }

        setAvatarUrl(res.url);
        setAvatarFile(null);
        if (avatarPreviewUrl) {
          URL.revokeObjectURL(avatarPreviewUrl);
          setAvatarPreviewUrl(null);
        }
        setIsUploadingAvatar(false);
      }

      // 2. Save name and phone changes
      const res = await updateUserProfileAction({ fullName, phone });
      if (res.success) {
        setInitialFullName(fullName);
        setInitialPhone(phone);
        toast.success("Profile details updated successfully!");
        router.refresh(); // Propagate to sidebar layout
      } else {
        toast.error(res.error || "Failed to update profile details.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setIsSavingProfile(false);
      setIsUploadingAvatar(false);
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
    } catch {
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

  const displayAvatarUrl = avatarPreviewUrl || avatarUrl;
  const isProfileChanged =
    fullName !== initialFullName ||
    phone !== initialPhone ||
    avatarFile !== null;

  const isPasswordValid =
    password.length >= 6 &&
    password === confirmPassword;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Profile Details Panel */}
      <div className="relative border border-neutral-300 bg-neutral-50/20 p-6 backdrop-blur-[2px] dark:border-neutral-700 dark:bg-neutral-950/10">
        <OrderDetailBrackets />
        <h3 className="border-b border-neutral-200 pb-3 font-sans text-sm font-bold tracking-widest text-foreground uppercase dark:border-neutral-800">
          Profile Settings
        </h3>
        
        <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4 font-mono text-xs">
          {/* Avatar Upload Block */}
          <div className="flex flex-col items-center gap-4 border-b border-dashed border-neutral-200 pb-5 dark:border-neutral-800">
            <div className="group relative flex size-20 items-center justify-center overflow-hidden border border-neutral-300 bg-neutral-100 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
              {displayAvatarUrl ? (
                <Image
                  src={displayAvatarUrl}
                  alt="Profile Avatar"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                />
              ) : (
                <User className="size-8 transition-opacity duration-300 group-hover:opacity-75" />
              )}
              
              <button
                type="button"
                disabled={isSavingProfile || isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 hover:cursor-pointer group-hover:opacity-100 disabled:hover:cursor-not-allowed"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="size-5 animate-spin text-white" />
                ) : (
                  <Camera className="size-5 text-white" />
                )}
              </button>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                disabled={isSavingProfile || isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="h-7 rounded-none border-dashed font-mono text-[9px] uppercase transition-all duration-300 hover:bg-neutral-150"
              >
                {isUploadingAvatar ? "Uploading..." : "Upload New Avatar"}
              </Button>
              <p className="mt-1 font-mono text-[8px] text-neutral-400">PNG, JPG or GIF up to 5MB</p>
            </div>
          </div>

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
            <button
              type="submit"
              disabled={!isProfileChanged || isSavingProfile || isUploadingAvatar}
              className="h-9 px-6 rounded-none bg-neutral-900 font-mono text-[10px] tracking-wider uppercase text-white transition-colors duration-300 hover:bg-neutral-800 hover:cursor-pointer dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-neutral-900 dark:disabled:hover:bg-neutral-100"
            >
              {isSavingProfile || isUploadingAvatar ? (
                <>
                  <Loader2 className="mr-1.5 inline size-3.5 animate-spin" /> Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
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
            <button
              type="submit"
              disabled={!isPasswordValid || isSavingPassword}
              className="h-9 px-6 rounded-none bg-neutral-900 font-mono text-[10px] tracking-wider uppercase text-white transition-colors duration-300 hover:bg-neutral-800 hover:cursor-pointer dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-neutral-900 dark:disabled:hover:bg-neutral-100"
            >
              {isSavingPassword ? (
                <>
                  <Loader2 className="mr-1.5 inline size-3.5 animate-spin" /> Updating...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
