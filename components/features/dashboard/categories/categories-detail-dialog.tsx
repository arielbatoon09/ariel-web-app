"use client";

import { useState, useMemo } from "react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { ManagementDetailDialog } from "@/components/common/management-detail-dialog";
import { useCategoriesQuery, useUpdateCategoryMutation, useToggleCategoryStatusMutation } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CategoriesDetailDialog() {
  const { selectedCategoryId, isCategoryDetailsOpen, setIsCategoryDetailsOpen } = useDashboardStore();

  const { data: categories = [] } = useCategoriesQuery();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const toggleStatusMutation = useToggleCategoryStatusMutation();

  const [confirmType, setConfirmType] = useState<"status" | "scope" | null>(null);
  const [pendingScope, setPendingScope] = useState<"works" | "articles" | "both" | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const currentCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  // Reset local state cleanly when currentCategory changes during render
  const [prevCategory, setPrevCategory] = useState(currentCategory);
  if (currentCategory !== prevCategory) {
    setPrevCategory(currentCategory);
    if (currentCategory) {
      setName(currentCategory.name);
      setSlug(currentCategory.slug);
    }
  }

  // Reset editing mode when details dialog closes during render
  const [prevIsOpen, setPrevIsOpen] = useState(isCategoryDetailsOpen);
  if (isCategoryDetailsOpen !== prevIsOpen) {
    setPrevIsOpen(isCategoryDetailsOpen);
    if (!isCategoryDetailsOpen) {
      setIsEditing(false);
    }
  }

  const handleToggleStatus = () => {
    if (!currentCategory) return;
    setConfirmType("status");
  };

  const handleScopeChange = (val: "works" | "articles" | "both") => {
    if (!currentCategory) return;
    setPendingScope(val);
    setConfirmType("scope");
  };

  const handleConfirm = () => {
    if (!currentCategory) return;
    if (confirmType === "status") {
      toggleStatusMutation.mutate(currentCategory.id);
    } else if (confirmType === "scope" && pendingScope) {
      updateCategoryMutation.mutate({
        ...currentCategory,
        target: pendingScope,
      });
    }
    setConfirmType(null);
  };

  const handleSaveDetails = () => {
    if (!currentCategory) return;
    updateCategoryMutation.mutate(
      {
        ...currentCategory,
        name: name.trim(),
        slug: slug.trim(),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const isSlugValid = /^[a-z0-9-]+$/.test(slug);
  const isNameValid = name.trim().length >= 2;
  const canSave = isNameValid && isSlugValid && (name !== currentCategory?.name || slug !== currentCategory?.slug);

  const confirmTitle = confirmType === "status" ? "Toggle Category Visibility" : "Update Scope Target";
  const confirmDescription =
    confirmType === "status"
      ? `Are you sure you want to ${currentCategory?.disabled ? "enable" : "disable"} the category "${currentCategory?.name}"?`
      : `Are you sure you want to change the target scope of "${currentCategory?.name}" to ${pendingScope}?`;

  return (
    <>
      <ManagementDetailDialog
        open={isCategoryDetailsOpen}
        onOpenChange={setIsCategoryDetailsOpen}
        title="Category Profile & Details"
        subtitle={currentCategory ? `ID: ${currentCategory.id}` : undefined}
        footerActions={
          isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  if (currentCategory) {
                    setName(currentCategory.name);
                    setSlug(currentCategory.slug);
                  }
                }}
                disabled={updateCategoryMutation.isPending}
                className="rounded-none border-dashed font-mono text-[10px] uppercase"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveDetails}
                disabled={updateCategoryMutation.isPending || !canSave}
                className="rounded-none border border-neutral-900 font-mono text-[10px] uppercase dark:border-neutral-100"
              >
                {updateCategoryMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="rounded-none border border-neutral-900 font-mono text-[10px] uppercase dark:border-neutral-100"
              >
                Edit details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCategoryDetailsOpen(false)}
                className="rounded-none border-dashed font-mono text-[10px] uppercase"
              >
                Close Panel
              </Button>
            </>
          )
        }
      >
        {currentCategory && (
          <div className="space-y-6 p-2 font-mono text-xs text-foreground">
            <div className="space-y-4 border-b border-dashed border-neutral-200 pb-4 dark:border-neutral-800">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <span className="text-neutral-450 uppercase">Name:</span>
                    <Input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        const autoSlug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "");
                        setSlug(autoSlug);
                      }}
                      className="col-span-2 h-8 rounded-none border-dashed border-neutral-300 bg-background/50 font-sans transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <span className="text-neutral-450 uppercase">Slug:</span>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="col-span-2 h-8 rounded-none border-dashed border-neutral-300 bg-background/50 font-mono transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-neutral-450 uppercase">Name:</span>
                    <span className="col-span-2 font-sans font-bold text-foreground">{currentCategory.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-neutral-450 uppercase">Slug:</span>
                    <span className="col-span-2 font-mono text-neutral-500">{currentCategory.slug}</span>
                  </div>
                </>
              )}
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Current Scope:</span>
                <span className="col-span-2 font-mono uppercase">{currentCategory.target}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-450 uppercase">Status:</span>
                <span className="col-span-2 font-sans">{currentCategory.disabled ? "Disabled" : "Active"}</span>
              </div>
            </div>

            <div className="space-y-4">
              <span className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Administrative Actions</span>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-neutral-450 text-[10px] uppercase">Modify Linked Scope</span>
                  <Select value={currentCategory.target} onValueChange={(val) => handleScopeChange(val as "works" | "articles" | "both")}>
                    <SelectTrigger className="border-neutral-350 !h-8 !w-full !rounded-none border bg-background font-mono text-[10px] hover:border-neutral-800 dark:border-neutral-700 dark:hover:border-neutral-300">
                      <SelectValue placeholder="Modify Scope">
                        {currentCategory.target === "works"
                          ? "Works Only"
                          : currentCategory.target === "articles"
                            ? "Articles Only"
                            : "Both (Works & Articles)"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      alignItemWithTrigger={false}
                      className="!rounded-none border border-neutral-300 bg-background font-mono text-[10px] dark:border-neutral-700"
                    >
                      <SelectItem value="both">Both (Works & Articles)</SelectItem>
                      <SelectItem value="works">Works Only</SelectItem>
                      <SelectItem value="articles">Articles Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-neutral-450 text-[10px] uppercase">Visibility State</span>
                  <Button
                    onClick={handleToggleStatus}
                    variant={currentCategory.disabled ? "default" : "destructive"}
                    size="sm"
                    className="h-7 cursor-pointer rounded-none font-mono text-[10px] uppercase"
                  >
                    {currentCategory.disabled ? "Enable Category" : "Disable Category"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </ManagementDetailDialog>

      <ConfirmDialog
        open={confirmType !== null}
        onOpenChange={(open) => !open && setConfirmType(null)}
        title={confirmTitle}
        description={confirmDescription}
        onConfirm={handleConfirm}
        variant={confirmType === "status" && !currentCategory?.disabled ? "destructive" : "default"}
        isLoading={updateCategoryMutation.isPending || toggleStatusMutation.isPending}
      />
    </>
  );
}
