"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { PreviewFrame } from "@/components/features/dashboard/shared/preview-frame";
import { ArticleHero } from "@/components/features/public/articles/article-hero";
import { ArticleContent } from "@/components/features/public/articles/article-content";
import { PublicHeader } from "@/components/common/public-header";
import { PublicFooter } from "@/components/common/public-footer";
import type { Article } from "@/schemas/dashboard";

interface ArticlePreviewModeProps {
  formData: Article;
}

export function ArticlePreviewMode({ formData }: ArticlePreviewModeProps) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  return (
    <div className="space-y-4">
      {/* Device Switcher Bar */}
      <div className="flex items-center justify-between border border-dashed border-neutral-300 bg-neutral-50/50 px-4 py-2 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-900/20">
        <span className="text-neutral-450 text-[10px] uppercase dark:text-neutral-500">Device Viewport:</span>
        <div className="flex items-center gap-1">
          <Button
            variant={previewMode === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("desktop")}
            className="h-7 rounded-none px-3 font-mono text-[9px] uppercase"
          >
            <Monitor className="mr-1.5 size-3" />
            Desktop
          </Button>
          <Button
            variant={previewMode === "tablet" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("tablet")}
            className="h-7 rounded-none px-3 font-mono text-[9px] uppercase"
          >
            <Tablet className="mr-1.5 size-3" />
            Tablet
          </Button>
          <Button
            variant={previewMode === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("mobile")}
            className="h-7 rounded-none px-3 font-mono text-[9px] uppercase"
          >
            <Smartphone className="mr-1.5 size-3" />
            Mobile
          </Button>
        </div>
        <span className="text-neutral-450 font-mono text-[9px]">
          {previewMode === "desktop" && "Full Width"}
          {previewMode === "tablet" && "768px Width"}
          {previewMode === "mobile" && "375px Width"}
        </span>
      </div>

      {/* Viewport Frame */}
      <div className="flex justify-center border border-dashed border-neutral-300 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-900/60">
        <PreviewFrame
          className={`h-[70vh] max-w-full border border-neutral-300 bg-background shadow-2xl transition-all duration-300 dark:border-neutral-800 ${
            previewMode === "desktop" ? "w-full" : ""
          } ${previewMode === "tablet" ? "w-[768px]" : ""} ${previewMode === "mobile" ? "w-[375px]" : ""}`}
        >
          <div className="text-neutral-450 pointer-events-none sticky top-0 z-50 w-full border-b border-dashed border-neutral-300 bg-background/80 py-1.5 text-center font-mono text-[9px] tracking-widest uppercase backdrop-blur-sm select-none dark:border-neutral-700">
            Live Preview Mode Active
          </div>
          <div className="flex min-h-screen flex-col bg-background">
            <PublicHeader />
            <main className="flex-1">
              <ArticleHero article={formData as any} />
              <ArticleContent article={formData as any} />
            </main>
            <PublicFooter />
          </div>
        </PreviewFrame>
      </div>
    </div>
  );
}
