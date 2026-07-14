"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useArticlesQuery, useDeleteArticlesMutation } from "@/hooks/use-articles";
import { DataTable } from "@/components/common/data-table";
import type { Article } from "@/schemas/dashboard";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useDashboardStore } from "@/hooks/use-dashboard-store";

export function ArticleTable() {
  const router = useRouter();
  const { setSelectedArticleId, setIsArticleDetailsOpen } = useDashboardStore();

  const { data: articles = [], isLoading } = useArticlesQuery();
  const deleteArticlesMutation = useDeleteArticlesMutation();

  const [itemsToDelete, setItemsToDelete] = useState<Article[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const columns = [
    {
      header: "Article Details",
      accessorKey: (item: Article) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/60">
            {item.imageSrc ? (
              <Image src={item.imageSrc} alt={item.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-[8px] text-neutral-400 dark:text-neutral-600 uppercase select-none">
                No Banner
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-foreground">{item.title}</span>
              {item.status === "draft" && (
                <span className="animate-pulse rounded border border-amber-200 bg-amber-50/20 px-1.5 py-0.5 font-mono text-[8px] text-amber-500 uppercase dark:border-amber-900/30">
                  Draft
                </span>
              )}
              {item.status === "unpublished" && (
                <span className="rounded border border-red-200 bg-red-50/20 px-1.5 py-0.5 font-mono text-[8px] text-red-500 uppercase dark:border-red-900/30">
                  Unpublished
                </span>
              )}
              {item.status === "published" && (
                <span className="rounded border border-green-200 bg-green-50/20 px-1.5 py-0.5 font-mono text-[8px] text-green-500 uppercase dark:border-green-900/30">
                  Published
                </span>
              )}
              {item.draft && (
                <span className="animate-pulse rounded border border-purple-200 bg-purple-50/20 px-1.5 py-0.5 font-mono text-[8px] text-purple-500 uppercase dark:border-purple-900/30">
                  Staged Changes
                </span>
              )}
            </div>
            <p className="max-w-md text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">{item.description}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Slug Reference",
      accessorKey: (item: Article) => <code className="font-mono text-xs text-neutral-500">{item.slug}</code>,
    },
    {
      header: "Author / Date",
      accessorKey: (item: Article) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs text-neutral-500">{item.author}</span>
          <span className="font-mono text-[10px] text-neutral-400">{item.date}</span>
        </div>
      ),
    },
    {
      header: "Tags",
      accessorKey: (item: Article) => (
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded border border-neutral-300 px-1.5 py-0.5 font-mono text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
            >
              {t}
            </span>
          ))}
          {item.tags.length > 3 && <span className="font-mono text-xs text-neutral-400">+{item.tags.length - 3}</span>}
        </div>
      ),
    },
  ];

  const handleDelete = (item: Article) => {
    setItemsToDelete([item]);
    setShowDeleteConfirm(true);
  };

  const handleDeleteBulk = (items: Article[]) => {
    setItemsToDelete(items);
    setShowDeleteConfirm(true);
  };

  const handleConfirm = () => {
    deleteArticlesMutation.mutate(
      itemsToDelete.map((item) => item.id),
      {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setItemsToDelete([]);
        },
      }
    );
  };

  const handleView = (item: Article) => {
    setSelectedArticleId(item.id);
    setIsArticleDetailsOpen(true);
  };

  const isBulkDelete = itemsToDelete.length > 1;
  const confirmTitle = isBulkDelete ? "Delete Selected Articles" : "Delete Article";
  const confirmDescription = isBulkDelete
    ? `Are you sure you want to permanently delete the ${itemsToDelete.length} selected articles? This action cannot be undone.`
    : `Are you sure you want to permanently delete article "${itemsToDelete[0]?.title}"? This action cannot be undone.`;
  const confirmText = isBulkDelete ? `Delete ${itemsToDelete.length} Articles` : "Delete Article";

  return (
    <>
      <DataTable<Article>
        data={articles}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search articles..."
        onViewClick={handleView}
        onEditClick={(item) => router.push(`/admin/articles/${item.id}?edit=true`)}
        onDeleteClick={handleDelete}
        onDeleteBulk={handleDeleteBulk}
        onRowClick={handleView}
        hideExport={true}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(open) => !open && setShowDeleteConfirm(false)}
        title={confirmTitle}
        description={confirmDescription}
        confirmText={confirmText}
        onConfirm={handleConfirm}
        variant="destructive"
        isLoading={deleteArticlesMutation.isPending}
      />
    </>
  );
}
