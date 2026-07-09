"use client";
import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { ManagementDetailDialog } from "@/components/common/management-detail-dialog";
import { useArticlesQuery, useToggleArticleStatusMutation } from "@/hooks/use-articles";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

export function ArticleDetailDialog() {
  const router = useRouter();
  const { selectedArticleId, isArticleDetailsOpen, setIsArticleDetailsOpen } = useDashboardStore();

  const { data: articles = [] } = useArticlesQuery();
  const toggleStatusMutation = useToggleArticleStatusMutation();

  const [confirmStatus, setConfirmStatus] = React.useState(false);

  const currentArticle = React.useMemo(() => {
    if (!selectedArticleId) return null;
    return articles.find((a) => a.id === selectedArticleId) || null;
  }, [articles, selectedArticleId]);

  const displayArticle = React.useMemo(() => {
    if (!currentArticle) return null;
    if (currentArticle.draft) {
      return {
        ...currentArticle,
        ...currentArticle.draft,
      };
    }
    return currentArticle;
  }, [currentArticle]);

  const handleToggleStatus = () => {
    if (!currentArticle) return;
    setConfirmStatus(true);
  };

  const handleConfirm = () => {
    if (!currentArticle) return;
    toggleStatusMutation.mutate(currentArticle.id);
    setConfirmStatus(false);
  };

  const handleLaunchEditor = () => {
    if (!currentArticle) return;
    setIsArticleDetailsOpen(false);
    router.push(`/admin/articles/${currentArticle.id}?edit=true`);
  };

  const confirmTitle = "Update Article Status";
  const confirmDescription = `Are you sure you want to change the status of "${displayArticle?.title}" to ${
    currentArticle?.status === "published" ? "Draft" : "Published"
  }?`;

  return (
    <>
      <ManagementDetailDialog
        open={isArticleDetailsOpen}
        onOpenChange={setIsArticleDetailsOpen}
        title="Article Profile & Details"
        subtitle={currentArticle ? `ID: ${currentArticle.id}` : undefined}
        footerActions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLaunchEditor}
              className="rounded-none border border-neutral-900 font-mono text-[10px] uppercase dark:border-neutral-100"
            >
              Open Article Editor
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsArticleDetailsOpen(false)}
              className="rounded-none border-dashed font-mono text-[10px] uppercase"
            >
              Close Panel
            </Button>
          </>
        }
      >
        {displayArticle && (
          <div className="space-y-6 p-2 font-mono text-xs text-foreground">
            {/* Banner Preview */}
            {displayArticle.imageSrc ? (
              <div className="relative aspect-[16/6] w-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <Image
                  src={displayArticle.imageSrc}
                  alt={displayArticle.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[16/6] w-full flex-col items-center justify-center border border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40">
                <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">No Banner Image</span>
              </div>
            )}

            <div className="space-y-4 border-b border-dashed border-neutral-200 pb-4 dark:border-neutral-800">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Title:</span>
                <span className="col-span-2 font-sans font-bold text-foreground">{displayArticle.title}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Author:</span>
                <span className="col-span-2 text-neutral-500">{displayArticle.author || "Ariel Batoon"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Slug:</span>
                <span className="col-span-2 font-mono text-neutral-500">{displayArticle.slug}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Tag:</span>
                <span className="col-span-2 font-mono text-neutral-500">{displayArticle.tag}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Banner URL:</span>
                <span className="col-span-2 font-mono text-neutral-500 break-all">{displayArticle.imageSrc || "None"}</span>
              </div>
              {displayArticle.categories && displayArticle.categories.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-neutral-450 uppercase">Categories:</span>
                  <span className="col-span-2 font-mono uppercase text-neutral-500">
                    {displayArticle.categories.join(", ")}
                  </span>
                </div>
              )}
              {displayArticle.tags && displayArticle.tags.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-neutral-450 uppercase">Keywords:</span>
                  <span className="col-span-2 font-mono text-neutral-500">
                    {displayArticle.tags.join(", ")}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Status:</span>
                <span className="col-span-2 font-sans font-bold uppercase">
                  {currentArticle?.status}
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
                    variant={currentArticle?.status === "published" ? "destructive" : "default"}
                    size="sm"
                    className="h-7 cursor-pointer rounded-none font-mono text-[10px] uppercase"
                  >
                    {currentArticle?.status === "published" ? "Move to Draft" : "Publish Article"}
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
        variant={currentArticle?.status === "published" ? "destructive" : "default"}
        isLoading={toggleStatusMutation.isPending}
      />
    </>
  );
}
