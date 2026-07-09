import { SettingsView } from "@/components/features/dashboard/shared/settings-view";

export const metadata = {
  title: "Account Settings | Admin Panel",
  description: "Update your profile details, edit display name, and modify account security credentials.",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="border border-neutral-300 bg-neutral-50/50 p-6 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/40">
        <h1 className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">Account Settings</h1>
        <p className="mt-2 font-mono text-xs text-neutral-450 uppercase">
          CONTROL PANEL / PROFILE
        </p>
      </div>

      <SettingsView />
    </div>
  );
}
