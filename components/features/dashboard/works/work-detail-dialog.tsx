"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { ManagementDetailDialog } from "@/components/common/management-detail-dialog";
import { useWorksQuery, useToggleWorkStatusMutation } from "@/hooks/use-works";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

export function WorkDetailDialog() {
  const router = useRouter();
  const { selectedWorkId, isWorkDetailsOpen, setIsWorkDetailsOpen } = useDashboardStore();

  const { data: works = [] } = useWorksQuery();
  const toggleStatusMutation = useToggleWorkStatusMutation();

  const [confirmStatus, setConfirmStatus] = React.useState(false);

  const currentWork = React.useMemo(() => {
    if (!selectedWorkId) return null;
    return works.find((w) => w.id === selectedWorkId) || null;
  }, [works, selectedWorkId]);

  const handleToggleStatus = () => {
    if (!currentWork) return;
    setConfirmStatus(true);
  };

  const handleConfirm = () => {
    if (!currentWork) return;
    toggleStatusMutation.mutate(currentWork.id);
    setConfirmStatus(false);
  };

  const handleLaunchEditor = () => {
    if (!currentWork) return;
    setIsWorkDetailsOpen(false);
    router.push(`/admin/works/${currentWork.id}?edit=true`);
  };

  const confirmTitle = "Update Project Status";
  const confirmDescription = `Are you sure you want to change the status of "${currentWork?.title}" to ${
    currentWork?.status === "published" ? "Draft" : "Published"
  }?`;

  return (
    <>
      <ManagementDetailDialog
        open={isWorkDetailsOpen}
        onOpenChange={setIsWorkDetailsOpen}
        title="Project Profile & Details"
        subtitle={currentWork ? `ID: ${currentWork.id}` : undefined}
        footerActions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLaunchEditor}
              className="rounded-none border border-neutral-900 font-mono text-[10px] uppercase dark:border-neutral-100"
            >
              Open Case Study Editor
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWorkDetailsOpen(false)}
              className="rounded-none border-dashed font-mono text-[10px] uppercase"
            >
              Close Panel
            </Button>
          </>
        }
      >
        {currentWork && (
          <div className="space-y-6 p-2 font-mono text-xs text-foreground">
            {/* Banner Preview */}
            {currentWork.imageSrc && (
              <div className="relative aspect-[16/6] w-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <Image
                  src={currentWork.imageSrc}
                  alt={currentWork.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-4 border-b border-dashed border-neutral-200 pb-4 dark:border-neutral-800">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Title:</span>
                <span className="col-span-2 font-sans font-bold text-foreground">{currentWork.title}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Subtitle:</span>
                <span className="col-span-2 text-neutral-500">{currentWork.tag}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Slug:</span>
                <span className="col-span-2 font-mono text-neutral-500">{currentWork.slug}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Target Link:</span>
                <span className="col-span-2 font-mono text-neutral-500">{currentWork.link}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Categories:</span>
                <span className="col-span-2 font-mono uppercase text-neutral-500">
                  {currentWork.categories.join(", ")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Tech Stack:</span>
                <span className="col-span-2 font-mono text-neutral-500">
                  {currentWork.tags.join(", ")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Status:</span>
                <span className="col-span-2 font-sans font-bold uppercase">
                  {currentWork.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <span className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Administrative Actions</span>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-450 text-[10px] uppercase">Publishing State</span>
                  <Button
                    onClick={handleToggleStatus}
                    variant={currentWork.status === "published" ? "destructive" : "default"}
                    size="sm"
                    className="h-7 cursor-pointer rounded-none font-mono text-[10px] uppercase"
                  >
                    {currentWork.status === "published" ? "Move to Draft" : "Publish Project"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </ManagementDetailDialog>

      <ConfirmDialog
        open={confirmStatus}
        onOpenChange={setConfirmStatus}
        title={confirmTitle}
        description={confirmDescription}
        onConfirm={handleConfirm}
        variant={currentWork?.status === "published" ? "destructive" : "default"}
        isLoading={toggleStatusMutation.isPending}
      />
    </>
  );
}
