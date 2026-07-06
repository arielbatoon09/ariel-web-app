"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Button } from "@/components/ui/button";
import { ArticleHero } from "@/components/features/articles/article-hero";
import { ArticleContent } from "@/components/features/articles/article-content";
import { ArrowLeft, Save, Eye, Edit2, Plus, Trash2, Clock, Calendar, User, Monitor, Tablet, Smartphone } from "lucide-react";
import type { Article, SeoMeta } from "@/lib/schemas/dashboard";
import { PreviewFrame } from "@/components/features/dashboard/preview-frame";

export default function AdminArticleDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { articles, updateArticle } = useDashboardStore();

  const articleId = params.id as string;
  const article = articles.find((a) => a.id === articleId);

  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">(searchParams.get("edit") === "true" ? "edit" : "preview");
  const [previewMode, setPreviewMode] = React.useState<"desktop" | "tablet" | "mobile">("desktop");

  // Form State
  const [formData, setFormData] = React.useState<Article | null>(null);

  const isDirty = React.useMemo(() => {
    if (!article || !formData) return false;
    return JSON.stringify(article) !== JSON.stringify(formData);
  }, [article, formData]);

  React.useEffect(() => {
    if (article) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(JSON.parse(JSON.stringify(article)) as Article); // Deep clone for local edits
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]);

  React.useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleBackClick = (e: React.MouseEvent) => {
    if (isDirty) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmLeave) {
        e.preventDefault();
      }
    }
  };

  if (!article || !formData) {
    return (
      <div className="py-12 text-center font-mono text-xs">
        <p className="text-red-500">ARTICLE NOT FOUND</p>
        <Link href="/admin/articles" className="mt-4 inline-flex items-center gap-1 text-neutral-400 hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to list
        </Link>
      </div>
    );
  }

  const handleFieldChange = (field: keyof Article, value: Article[keyof Article]) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSeoFieldChange = (field: keyof SeoMeta, value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        seo: {
          ...(prev.seo || {}),
          [field]: value,
        },
      };
    });
  };

  const handleSectionChange = (index: number, key: "title" | "body", value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedSections = [...prev.sections];
      updatedSections[index] = { ...updatedSections[index], [key]: value };
      return {
        ...prev,
        sections: updatedSections,
      };
    });
  };

  const addSection = () => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        sections: [...prev.sections, { title: "New Section Title", body: "Section content goes here." }],
      };
    });
  };

  const removeSection = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        sections: prev.sections.filter((_, idx) => idx !== index),
      };
    });
  };

  const handleSave = () => {
    updateArticle(formData);
    router.push("/admin/articles");
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 border-b border-dashed border-neutral-300 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            onClick={handleBackClick}
            className="flex size-8 items-center justify-center border border-dashed border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900/60"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="font-sans text-xl font-bold tracking-tight text-foreground">Visual Article Editor</h1>
            <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500">
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
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
            className="h-8 rounded-none bg-green-600 font-mono text-[10px] text-white uppercase hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-700"
          >
            <Save className="mr-1.5 size-3" />
            Save changes
          </Button>
        </div>
      </div>

      {activeTab === "edit" ? (
        /* Visual Inline Editor Mode (Inheriting Exact Public Layout CSS) */
        <div className="space-y-12 border border-dashed border-neutral-300 bg-background p-6 dark:border-neutral-700">
          <div className="pointer-events-none w-full border border-dashed border-amber-300 bg-amber-500/10 py-2 text-center font-mono text-[10px] tracking-widest text-amber-600 uppercase select-none dark:text-amber-500">
            Visual Editor Mode Active — Click text components to edit directly.
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            {/* Metadata Fields Row */}
            <div className="flex flex-wrap items-center gap-4 border-b border-dashed border-neutral-200 pb-4 dark:border-neutral-800">
              <div className="text-neutral-450 flex items-center gap-1.5 font-mono text-[10px] dark:text-neutral-500">
                <span className="uppercase">Tag:</span>
                <input
                  value={formData.tag}
                  onChange={(e) => handleFieldChange("tag", e.target.value)}
                  className="focus:ring-dashed focus:ring-neutral-450 w-28 rounded border-none bg-transparent p-0.5 font-bold text-foreground uppercase outline-none focus:ring-1"
                />
              </div>
              <div className="dark:text-neutral-750 text-neutral-300">|</div>
              <div className="text-neutral-450 flex items-center gap-1.5 font-mono text-[10px] dark:text-neutral-500">
                <Calendar className="size-3" />
                <input
                  value={formData.date}
                  onChange={(e) => handleFieldChange("date", e.target.value)}
                  className="focus:ring-dashed focus:ring-neutral-450 w-24 rounded border-none bg-transparent p-0.5 text-foreground outline-none focus:ring-1"
                />
              </div>
              <div className="dark:text-neutral-750 text-neutral-300">|</div>
              <div className="text-neutral-450 flex items-center gap-1.5 font-mono text-[10px] dark:text-neutral-500">
                <Clock className="size-3" />
                <input
                  value={formData.readTime}
                  onChange={(e) => handleFieldChange("readTime", e.target.value)}
                  className="focus:ring-dashed focus:ring-neutral-450 w-20 rounded border-none bg-transparent p-0.5 text-foreground outline-none focus:ring-1"
                />
              </div>
              <div className="dark:text-neutral-750 text-neutral-300">|</div>
              <div className="text-neutral-450 flex items-center gap-1.5 font-mono text-[10px] dark:text-neutral-500">
                <User className="size-3" />
                <input
                  value={formData.author}
                  onChange={(e) => handleFieldChange("author", e.target.value)}
                  className="focus:ring-dashed focus:ring-neutral-450 w-28 rounded border-none bg-transparent p-0.5 text-foreground outline-none focus:ring-1"
                />
              </div>
            </div>

            {/* Title Header */}
            <div className="space-y-4">
              <input
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="focus:ring-dashed focus:ring-neutral-450 w-full rounded border-none bg-transparent p-1 font-sans text-3xl font-bold tracking-tight text-foreground outline-none focus:ring-1 md:text-5xl"
                placeholder="Enter Article Title"
              />
              <textarea
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                className="focus:ring-dashed focus:ring-neutral-450 w-full resize-none rounded border-none bg-transparent p-1 font-sans text-base leading-relaxed text-neutral-600 outline-none focus:ring-1 dark:text-neutral-400"
                placeholder="Enter Article Summary Description..."
                rows={3}
              />
              {/* Banner Image Showcase Editor */}
              <div className="space-y-1.5 pt-4">
                <span className="block font-mono text-[9px] text-neutral-400 uppercase">Article Banner Image:</span>
                {formData.imageSrc ? (
                  <div className="group relative aspect-[16/5] w-full overflow-hidden border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
                    <Image
                      src={formData.imageSrc}
                      alt="Article Banner Preview"
                      fill
                      className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />

                    {/* Hover Controls */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-neutral-950/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        onClick={() => {
                          const newSrc = window.prompt("Change Banner Image Source Path:", formData.imageSrc);
                          if (newSrc) {
                            handleFieldChange("imageSrc", newSrc);
                          }
                        }}
                        className="h-7 rounded-none border border-dashed border-neutral-300 bg-background px-3 font-mono text-[9px] text-foreground uppercase hover:bg-neutral-100"
                      >
                        Change Path
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleFieldChange("imageSrc", "")}
                        className="h-7 rounded-none px-3 font-mono text-[9px] uppercase"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Banner Empty State Box */
                  <button
                    onClick={() => {
                      const path = window.prompt("Enter Article Banner Image source path:");
                      if (path) {
                        handleFieldChange("imageSrc", path);
                      }
                    }}
                    className="hover:border-neutral-450 flex aspect-[16/5] w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-neutral-300 bg-neutral-50/50 font-mono text-xs text-neutral-400 uppercase transition-colors dark:border-neutral-700 dark:bg-neutral-900/10 dark:hover:bg-neutral-500"
                  >
                    <Plus className="size-5" />
                    <span>Add Article Banner Image</span>
                    <span className="text-[9px] text-neutral-400 normal-case">(Currently empty, click to set path)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sections Content List */}
            <div className="space-y-8 border-t border-dashed border-neutral-200 pt-8 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold tracking-wider text-neutral-400 uppercase">Article Body Sections</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSection}
                  className="h-7 rounded-none border-dashed px-2.5 font-mono text-[9px] uppercase"
                >
                  <Plus className="mr-1 size-3" /> Add Section block
                </Button>
              </div>

              <div className="space-y-10">
                {formData.sections.map((section, idx) => (
                  <div key={idx} className="group relative space-y-4 border-l-2 border-dashed border-neutral-200 pl-4 dark:border-neutral-800">
                    <button
                      onClick={() => removeSection(idx)}
                      className="absolute top-1 right-0 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                    <div className="space-y-1">
                      <input
                        value={section.title}
                        onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
                        className="focus:ring-dashed focus:ring-neutral-450 w-full rounded border-none bg-transparent p-0.5 font-sans text-lg font-bold tracking-tight text-foreground outline-none focus:ring-1 md:text-xl"
                        placeholder="Section Title"
                      />
                    </div>
                    <textarea
                      value={section.body}
                      onChange={(e) => handleSectionChange(idx, "body", e.target.value)}
                      className="focus:ring-dashed focus:ring-neutral-450 w-full resize-none rounded border-none bg-transparent p-0.5 font-sans text-sm leading-relaxed text-neutral-600 outline-none focus:ring-1 md:text-base"
                      placeholder="Type section paragraphs here..."
                      rows={8}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: SEO Metadata Settings */}
            <div className="space-y-6 border-t border-solid border-neutral-300 pt-8 dark:border-neutral-800">
              <div>
                <h3 className="font-sans text-lg font-bold tracking-tight text-foreground">SEO Metadata Settings</h3>
                <p className="text-neutral-505 font-mono text-xs dark:text-neutral-400">
                  Configure page-level titles and descriptions for search engine indexing.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-neutral-450 block font-mono text-xs uppercase dark:text-neutral-500">Meta Title</label>
                  <input
                    type="text"
                    value={formData.seo?.title || ""}
                    onChange={(e) => handleSeoFieldChange("title", e.target.value)}
                    placeholder="e.g. Article Title | Ariel Batoon Blog"
                    className="focus:ring-neutral-450 w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                  />
                  <span className="block font-mono text-[10px] text-neutral-400">
                    Characters: {(formData.seo?.title || "").length} (Recommended: 50-60)
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-neutral-450 block font-mono text-xs uppercase dark:text-neutral-500">Meta Keywords</label>
                  <input
                    type="text"
                    value={formData.seo?.keywords || ""}
                    onChange={(e) => handleSeoFieldChange("keywords", e.target.value)}
                    placeholder="e.g. blog, tech, tutorial, dynamic"
                    className="focus:ring-neutral-450 w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                  />
                  <span className="block font-mono text-[10px] text-neutral-400">Comma-separated tags</span>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-neutral-450 block font-mono text-xs uppercase dark:text-neutral-500">Canonical URL Override</label>
                  <input
                    type="text"
                    value={formData.seo?.canonicalUrl || ""}
                    onChange={(e) => handleSeoFieldChange("canonicalUrl", e.target.value)}
                    placeholder="e.g. https://medium.com/@username/original-post"
                    className="focus:ring-neutral-450 w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                  />
                  <span className="block font-mono text-[10px] text-neutral-400">Leave empty to automatically point to this page&apos;s URL</span>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-neutral-450 block font-mono text-xs uppercase dark:text-neutral-500">Meta Description</label>
                  <textarea
                    value={formData.seo?.description || ""}
                    onChange={(e) => handleSeoFieldChange("description", e.target.value)}
                    placeholder="Brief summary of the article for search engine listings..."
                    className="focus:ring-neutral-450 w-full resize-none rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                    rows={3}
                  />
                  <span className="block font-mono text-[10px] text-neutral-400">
                    Characters: {(formData.seo?.description || "").length} (Recommended: 150-160)
                  </span>
                </div>
              </div>

              {/* Social Share Settings (Open Graph) */}
              <div className="space-y-4 border-t border-solid border-neutral-300 pt-6 dark:border-neutral-800">
                <div>
                  <h4 className="font-sans text-sm font-bold tracking-tight text-foreground">Social Sharing (Open Graph Overrides)</h4>
                  <p className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                    Override metadata titles, descriptions, and images when shared on social channels (Facebook, Twitter/X, LinkedIn).
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-neutral-450 block font-mono text-xs uppercase dark:text-neutral-500">OG Title</label>
                    <input
                      type="text"
                      value={formData.seo?.ogTitle || ""}
                      onChange={(e) => handleSeoFieldChange("ogTitle", e.target.value)}
                      placeholder="Custom sharing title..."
                      className="focus:ring-neutral-450 w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-neutral-450 block font-mono text-xs uppercase dark:text-neutral-500">OG Image URL</label>
                    <input
                      type="text"
                      value={formData.seo?.ogImage || ""}
                      onChange={(e) => handleSeoFieldChange("ogImage", e.target.value)}
                      placeholder="e.g. /articles/banner-og.png"
                      className="focus:ring-neutral-450 w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-neutral-450 block font-mono text-xs uppercase dark:text-neutral-500">OG Description</label>
                    <textarea
                      value={formData.seo?.ogDescription || ""}
                      onChange={(e) => handleSeoFieldChange("ogDescription", e.target.value)}
                      placeholder="Custom sharing snippet..."
                      className="focus:ring-neutral-450 w-full resize-none rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Real-Time Live Preview Mode (Matches Public View layout) */
        <div className="space-y-4">
          {/* Device Switcher Bar */}
          <div className="flex items-center justify-between border border-dashed border-neutral-300 bg-neutral-50/50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900/20">
            <span className="text-neutral-455 font-mono text-[10px] uppercase dark:text-neutral-500">Device Viewport:</span>
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
            <span className="font-mono text-[9px] text-neutral-400">
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
              <div className="text-neutral-405 pointer-events-none sticky top-0 z-10 w-full border-b border-dashed border-neutral-300 bg-neutral-900/10 py-1 text-center font-mono text-[9px] tracking-widest uppercase select-none dark:border-neutral-700">
                Live Preview Mode Active
              </div>
              <div className="space-y-12 p-4">
                <ArticleHero article={formData} />
                <ArticleContent article={formData} />
              </div>
            </PreviewFrame>
          </div>
        </div>
      )}
    </div>
  );
}
