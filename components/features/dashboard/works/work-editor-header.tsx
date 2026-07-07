"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, ExternalLink, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface WorkEditorHeaderProps {
  activeTab: "edit" | "preview";
  setActiveTab: (tab: "edit" | "preview") => void;
  isDirty: boolean;
  isSaving: boolean;
  handleBackClick: (e: React.MouseEvent) => void;
  handleSave: () => void;
  handlePublish: (status: "draft" | "published" | "unpublished") => void;
  status: "draft" | "published" | "unpublished";
  onStatusChange: (status: "draft" | "published" | "unpublished") => void;
  slug?: string;
  hasDraft?: boolean;
}

export function WorkEditorHeader({
  activeTab,
  setActiveTab,
  isDirty,
  isSaving,
  handleBackClick,
  handleSave,
  handlePublish,
  status,
  onStatusChange,
  slug,
  hasDraft,
}: WorkEditorHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-dashed border-neutral-300 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-700">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/works"
          onClick={handleBackClick}
          className="flex size-8 items-center justify-center border border-dashed border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900/60"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans text-xl font-bold tracking-tight text-foreground">Visual Project Editor</h1>
            {status === "published" ? (
              <span className="flex items-center gap-1 border border-green-500/20 bg-green-500/10 px-1.5 py-0.5 font-mono text-[8px] font-bold text-green-600 uppercase dark:text-green-500">
                <span className="size-1 bg-green-500 animate-pulse rounded-full" />
                Published
              </span>
            ) : (
              <span className="flex items-center gap-1 border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[8px] font-bold text-amber-600 uppercase dark:text-amber-500">
                <span className="size-1 bg-amber-500 rounded-full" />
                Draft
              </span>
            )}
            {hasDraft && (
              <span className="border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 font-mono text-[8px] font-bold text-purple-600 uppercase dark:text-purple-500 animate-pulse">
                Staged Changes
              </span>
            )}
            {isDirty && (
              <span className="border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 font-mono text-[8px] font-bold text-blue-600 uppercase dark:text-blue-500">
                Unsaved Changes
              </span>
            )}
            {status === "published" && slug && (
              <a
                href={`/work/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[9px] text-neutral-450 hover:text-foreground dark:text-neutral-500 underline ml-1"
              >
                View Live
                <ExternalLink className="size-2.5" />
              </a>
            )}
          </div>
          <p className="font-mono text-[9px] text-neutral-450 dark:text-neutral-500">
            Edit inline directly on the live template or preview changes instantly.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Segmented Control for Editor Mode */}
        <div className="inline-flex border border-neutral-300 dark:border-neutral-700 p-0.5 bg-neutral-50 dark:bg-neutral-900/60 rounded">
          <button
            onClick={() => setActiveTab("edit")}
            className={cn(
              "px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-all duration-150 rounded-sm cursor-pointer",
              activeTab === "edit"
                ? "bg-background text-foreground shadow-sm font-bold"
                : "text-neutral-400 hover:text-foreground"
            )}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={cn(
              "px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-all duration-150 rounded-sm cursor-pointer",
              activeTab === "preview"
                ? "bg-background text-foreground shadow-sm font-bold"
                : "text-neutral-400 hover:text-foreground"
            )}
          >
            Preview
          </button>
        </div>

        {/* Separator */}
        <div className="h-6 w-[1px] bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="h-8 rounded-none border border-dashed border-neutral-300 bg-background px-3 font-mono text-[10px] text-foreground uppercase hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-transparent dark:hover:bg-neutral-900"
        >
          {isSaving ? (
            <Loader2 className="mr-1.5 size-3 animate-spin" />
          ) : (
            <Save className="mr-1.5 size-3" />
          )}
          Save Draft
        </Button>

        {status === "published" ? (
          <div className="flex items-center gap-1.5">
            {hasDraft && (
              <Button
                size="sm"
                onClick={() => handlePublish("published")}
                disabled={isSaving}
                className="h-8 rounded-none bg-green-600 font-mono text-[10px] text-white uppercase hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              >
                Publish Changes
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-none border border-neutral-300 bg-background p-0 dark:border-neutral-700 dark:bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:ring-0 cursor-pointer"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="rounded-none border border-neutral-300 bg-background font-mono text-[10px] dark:border-neutral-700">
                <DropdownMenuItem
                  onClick={() => handlePublish("draft")}
                  className="justify-center text-red-500 font-mono hover:text-red-650 cursor-pointer focus:bg-red-500/10 focus:text-red-600 dark:focus:bg-red-950/20"
                >
                  Unpublish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={() => handlePublish("published")}
            disabled={isSaving}
            className="justify-center h-8 rounded-none bg-green-600 font-mono text-[10px] text-white uppercase hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
          >
            Publish
          </Button>
        )}
      </div>
    </div>
  );
}
