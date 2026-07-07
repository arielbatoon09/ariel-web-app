"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye, Edit2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorkEditorHeaderProps {
  activeTab: "edit" | "preview";
  setActiveTab: (tab: "edit" | "preview") => void;
  isDirty: boolean;
  isSaving: boolean;
  handleBackClick: (e: React.MouseEvent) => void;
  handleSave: () => void;
  status: "draft" | "published" | "unpublished";
  onStatusChange: (status: "draft" | "published" | "unpublished") => void;
}

export function WorkEditorHeader({
  activeTab,
  setActiveTab,
  isDirty,
  isSaving,
  handleBackClick,
  handleSave,
  status,
  onStatusChange,
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
          <h1 className="font-sans text-xl font-bold tracking-tight text-foreground">Visual Project Editor</h1>
          <p className="font-mono text-[9px] text-neutral-450 dark:text-neutral-500">
            Edit inline directly on the live template or preview changes instantly.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={activeTab === "edit" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("edit")}
          className="h-8 rounded-none border-dashed font-mono text-[10px] uppercase"
        >
          <Edit2 className="mr-1.5 size-3" />
          Visual Editor
        </Button>
        <Button
          variant={activeTab === "preview" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("preview")}
          className="h-8 rounded-none border-dashed font-mono text-[10px] uppercase"
        >
          <Eye className="mr-1.5 size-3" />
          Live Preview
        </Button>

        {/* Status Dropdown selector */}
        <Select value={status} onValueChange={(val) => onStatusChange(val as "draft" | "published" | "unpublished")}>
          <SelectTrigger className="!h-8 w-28 rounded-none border border-neutral-300 bg-transparent font-mono text-[10px] uppercase hover:border-neutral-400 dark:border-neutral-700 dark:bg-transparent dark:hover:border-neutral-600">
            <span className="flex items-center gap-1.5">
              <span className={`size-1.5 rounded-full ${
                status === "published" ? "bg-green-500 animate-pulse" :
                status === "draft" ? "bg-amber-500" : "bg-red-500"
              }`} />
              <SelectValue placeholder="Status" />
            </span>
          </SelectTrigger>
          <SelectContent className="rounded-none border border-neutral-300 bg-background font-mono text-[10px] dark:border-neutral-700">
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="unpublished">Unpublished</SelectItem>
          </SelectContent>
        </Select>

        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="h-8 rounded-none bg-green-600 font-mono text-[10px] text-white uppercase hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-700"
        >
          {isSaving ? (
            <Loader2 className="mr-1.5 size-3 animate-spin" />
          ) : (
            <Save className="mr-1.5 size-3" />
          )}
          Save changes
        </Button>
      </div>
    </div>
  );
}
