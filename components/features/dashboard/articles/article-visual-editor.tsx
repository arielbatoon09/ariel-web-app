"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Trash2, Calendar, Clock, User, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichTextarea } from "@/components/ui/textarea";
import type { Article, SeoMeta } from "@/schemas/dashboard";
import { useCategoriesQuery } from "@/hooks/use-categories";
import { MediaPickerDialog } from "@/components/common/media-picker-dialog";

interface ArticleVisualEditorProps {
  formData: Article;
  handleFieldChange: (field: keyof Article, value: Article[keyof Article]) => void;
  handleSeoFieldChange: (field: keyof SeoMeta, value: string) => void;
  handleSectionChange: (index: number, key: "title" | "body", value: string) => void;
  addSection: () => void;
  removeSection: (index: number) => void;
  handleCategoriesChange: (categories: string[]) => void;
}

export function ArticleVisualEditor({
  formData,
  handleFieldChange,
  handleSeoFieldChange,
  handleSectionChange,
  addSection,
  removeSection,
  handleCategoriesChange,
}: ArticleVisualEditorProps) {
  const [seoOpen, setSeoOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const { data: categoriesData = [] } = useCategoriesQuery();

  const activeArticleCategories = useMemo(() => {
    return categoriesData.length > 0
      ? categoriesData.filter((c) => (c.target === "articles" || c.target === "both") && !c.disabled)
      : [
          { name: "Engineering", slug: "engineering" },
          { name: "Design", slug: "design" },
          { name: "AI & Data", slug: "ai" },
          { name: "Business & Strategy", slug: "business" },
        ];
  }, [categoriesData]);

  const toggleCategory = (slug: string) => {
    const current = formData.categories || [];
    const next = current.includes(slug) ? current.filter((c) => c !== slug) : [...current, slug];
    handleCategoriesChange(next);

    // Auto-update tag to the first selected category name (uppercase)
    const matchingCat = activeArticleCategories.find((c) => c.slug === next[0]);
    const catName = matchingCat ? matchingCat.name : next[0] || "";
    handleFieldChange("tag", catName.toUpperCase() || "ENGINEERING");
  };

  return (
    <div className="border border-dashed border-neutral-300 bg-background dark:border-neutral-700">
      {/* Editor Mode Banner */}
      <div className="pointer-events-none w-full border-b border-dashed border-amber-300 bg-amber-500/10 py-1.5 text-center font-mono text-[10px] tracking-widest text-amber-600 uppercase select-none dark:text-amber-500">
        Visual Editor Mode — Click any text field to edit directly.
      </div>

      <div className="flex min-h-[70vh] divide-x divide-dashed divide-neutral-300 dark:divide-neutral-700">
        {/* ─────────────────────────────────────────────────────────────── */}
        {/* LEFT COLUMN: Writing Surface */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <div className="min-w-0 flex-1 space-y-8 p-6 md:p-8">
          {/* Banner Image */}
          <div className="space-y-2">
            <span className="block font-mono text-[9px] tracking-wider text-neutral-400 uppercase">Cover Image</span>
            {formData.imageSrc ? (
              <div className="group relative aspect-[16/5] w-full overflow-hidden border border-dashed border-neutral-300 bg-neutral-100 transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-900">
                <Image
                  src={formData.imageSrc}
                  alt="Article Cover Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-neutral-950/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="sm"
                    onClick={() => setMediaPickerOpen(true)}
                    className="h-7 rounded-none border border-dashed border-neutral-300 bg-background px-3 font-mono text-[9px] text-foreground uppercase hover:bg-neutral-100"
                  >
                    Select Cover
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
              <button
                onClick={() => setMediaPickerOpen(true)}
                className="flex aspect-[16/5] w-full flex-col items-center justify-center gap-1.5 border-2 border-dashed border-neutral-300 bg-neutral-50/50 font-mono text-xs text-neutral-400 uppercase transition-colors hover:border-neutral-500 hover:text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/10"
              >
                <Plus className="size-5" />
                <span>Add Cover Image</span>
                <span className="text-[9px] text-neutral-400 normal-case">Click to browse media library</span>
              </button>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <textarea
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              rows={2}
              className="focus:ring-dashed w-full resize-none rounded border-none bg-transparent p-1 font-sans text-3xl leading-tight font-bold tracking-tight text-foreground outline-none placeholder:text-neutral-300 focus:ring-1 focus:ring-neutral-400 md:text-4xl dark:placeholder:text-neutral-700"
              placeholder="Article Title..."
            />
            <textarea
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              rows={3}
              className="focus:ring-dashed w-full resize-none rounded border-none bg-transparent p-1 font-sans text-base leading-relaxed text-neutral-600 outline-none placeholder:text-neutral-300 focus:ring-1 focus:ring-neutral-400 dark:text-neutral-400 dark:placeholder:text-neutral-700"
              placeholder="Write a compelling summary of this article..."
            />
          </div>

          {/* ─── Section Blocks ─── */}
          <div className="space-y-6 border-t border-dashed border-neutral-200 pt-6 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold tracking-wider text-neutral-400 uppercase">Article Body Sections</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addSection}
                className="h-7 rounded-none border-dashed px-2.5 font-mono text-[9px] uppercase"
              >
                <Plus className="mr-1 size-3" />
                Add Section
              </Button>
            </div>

            <div className="space-y-8">
              {formData.sections.map((section, idx) => (
                <div key={idx} className="group relative space-y-3 border-l-2 border-dashed border-neutral-200 pl-5 dark:border-neutral-800">
                  {/* Remove button */}
                  <button
                    onClick={() => removeSection(idx)}
                    className="absolute top-0 -left-0 -translate-x-full pr-2 text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                    title="Remove section"
                  >
                    <Trash2 className="size-3.5" />
                  </button>

                  {/* Drag handle (cosmetic) */}
                  <div className="absolute top-6 -left-0 -translate-x-full pr-2 text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="size-3.5" />
                  </div>

                  <span className="font-mono text-[9px] text-neutral-400 uppercase">Section {idx + 1}</span>

                  <input
                    value={section.title}
                    onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
                    className="focus:ring-dashed focus:ring-neutral-450 w-full rounded border-none bg-transparent p-0.5 font-sans text-xl font-bold tracking-tight text-foreground outline-none placeholder:text-neutral-300 focus:ring-1 md:text-2xl dark:placeholder:text-neutral-700"
                    placeholder="Section heading..."
                  />
                  <RichTextarea
                    value={section.body}
                    onChange={(val) => handleSectionChange(idx, "body", val)}
                    placeholder="Write the section content here..."
                    className="w-full rounded border-dashed border-neutral-300 bg-background/50 p-1 dark:border-neutral-700"
                  />
                </div>
              ))}

              {formData.sections.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
                  <p className="font-mono text-xs text-neutral-400">No sections yet. Click &quot;Add Section&quot; to start writing.</p>
                </div>
              )}
            </div>
          </div>

          {/* ─── SEO Panel (Collapsible) ─── */}
          <div className="border-t border-solid border-neutral-200 pt-6 dark:border-neutral-800">
            <button onClick={() => setSeoOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
              <div>
                <h3 className="font-sans text-base font-bold tracking-tight text-foreground">SEO Settings</h3>
                <p className="font-mono text-[10px] text-neutral-500">Configure search engine visibility and social sharing metadata.</p>
              </div>
              {seoOpen ? <ChevronUp className="size-4 text-neutral-400" /> : <ChevronDown className="size-4 text-neutral-400" />}
            </button>

            {seoOpen && (
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Meta Title */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">Meta Title</label>
                  <input
                    type="text"
                    value={formData.seo?.title || ""}
                    onChange={(e) => handleSeoFieldChange("title", e.target.value)}
                    placeholder="e.g. Article Title | Ariel Batoon"
                    className="border-neutral-350 w-full rounded border bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 focus:ring-neutral-400 dark:border-neutral-700"
                  />
                  <span className="font-mono text-[9px] text-neutral-400">{(formData.seo?.title || "").length} chars (rec: 50-60)</span>
                </div>

                {/* Meta Keywords */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">Meta Keywords</label>
                  <input
                    type="text"
                    value={formData.seo?.keywords || ""}
                    onChange={(e) => handleSeoFieldChange("keywords", e.target.value)}
                    placeholder="e.g. react, next.js, api design"
                    className="w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 focus:ring-neutral-400 dark:border-neutral-700"
                  />
                  <span className="font-mono text-[9px] text-neutral-400">Comma-separated</span>
                </div>

                {/* Canonical URL */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">Meta Canonical URL</label>
                  <input
                    type="text"
                    value={formData.seo?.canonicalUrl || ""}
                    onChange={(e) => handleSeoFieldChange("canonicalUrl", e.target.value)}
                    placeholder="e.g. https://medium.com/@username/original-post"
                    className="w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 focus:ring-neutral-400 dark:border-neutral-700"
                  />
                  <span className="font-mono text-[9px] text-neutral-400">Leave empty to default to this page&apos;s URL</span>
                </div>

                {/* Meta Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">Meta Description</label>
                  <textarea
                    value={formData.seo?.description || ""}
                    onChange={(e) => handleSeoFieldChange("description", e.target.value)}
                    placeholder="Brief article summary for search listings..."
                    rows={3}
                    className="focus:ring-neutral-450 w-full resize-none rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                  />
                  <span className="font-mono text-[9px] text-neutral-400">{(formData.seo?.description || "").length} chars (rec: 150-160)</span>
                </div>

                {/* Open Graph */}
                <div className="space-y-1.5 border-t border-dashed border-neutral-200 pt-2 md:col-span-2 dark:border-neutral-800">
                  <h4 className="font-sans text-sm font-bold text-foreground">Open Graph / Social Sharing</h4>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">OG Title</label>
                  <input
                    type="text"
                    value={formData.seo?.ogTitle || ""}
                    onChange={(e) => handleSeoFieldChange("ogTitle", e.target.value)}
                    placeholder="Custom sharing title..."
                    className="focus:ring-neutral-450 w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">OG Image URL</label>
                  <input
                    type="text"
                    value={formData.seo?.ogImage || ""}
                    onChange={(e) => handleSeoFieldChange("ogImage", e.target.value)}
                    placeholder="e.g. /articles/og-banner.png"
                    className="focus:ring-neutral-450 w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">OG Description</label>
                  <textarea
                    value={formData.seo?.ogDescription || ""}
                    onChange={(e) => handleSeoFieldChange("ogDescription", e.target.value)}
                    placeholder="Custom sharing snippet..."
                    rows={2}
                    className="focus:ring-neutral-450 w-full resize-none rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* RIGHT COLUMN: Metadata Sidebar */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <aside className="w-72 shrink-0 p-5">
          <div className="sticky top-6 space-y-6">
            {/* Status indicator */}
            <div className="space-y-1">
              <span className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase">Status</span>
              <div className="flex items-center gap-1.5">
                {formData.status === "published" ? (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-green-600 dark:text-green-500">
                    <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
                    Published
                  </span>
                ) : formData.status === "unpublished" ? (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-red-600 dark:text-red-500">
                    <span className="size-1.5 rounded-full bg-red-500" />
                    Unpublished
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-600 dark:text-amber-500">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Draft
                  </span>
                )}
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[9px] tracking-widest text-neutral-400 uppercase">URL Slug</label>
              <input
                value={formData.slug}
                onChange={(e) => handleFieldChange("slug", e.target.value)}
                className="w-full rounded border border-dashed border-neutral-300 bg-transparent px-2.5 py-1.5 font-mono text-xs text-neutral-600 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:text-neutral-400"
                placeholder="url-slug-here"
              />
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <label className="block flex items-center gap-1 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
                <User className="size-3" /> Author
              </label>
              <input
                value={formData.author}
                onChange={(e) => handleFieldChange("author", e.target.value)}
                className="w-full rounded border border-dashed border-neutral-300 bg-transparent px-2.5 py-1.5 font-mono text-xs text-foreground focus:border-neutral-500 focus:outline-none dark:border-neutral-700"
                placeholder="e.g. Ariel Batoon"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="block flex items-center gap-1 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
                <Calendar className="size-3" /> Date
              </label>
              <div className="w-full rounded border border-dashed border-neutral-300 bg-neutral-100 px-2.5 py-1.5 font-mono text-xs text-neutral-500 select-none dark:border-neutral-700 dark:bg-neutral-900">
                {formData.date || "Set automatically"}
              </div>
            </div>

            {/* Read Time */}
            <div className="space-y-1.5">
              <label className="block flex items-center gap-1 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
                <Clock className="size-3" /> Read Time
              </label>
              <input
                value={formData.readTime}
                onChange={(e) => handleFieldChange("readTime", e.target.value)}
                className="w-full rounded border border-dashed border-neutral-300 bg-transparent px-2.5 py-1.5 font-mono text-xs text-foreground focus:border-neutral-500 focus:outline-none dark:border-neutral-700"
                placeholder="e.g. 5 min read"
              />
            </div>

            {/* Categories */}
            <div className="space-y-2 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
              <span className="block font-mono text-[9px] tracking-widest text-neutral-400 uppercase">Categories</span>
              <div className="flex flex-wrap gap-1.5">
                {activeArticleCategories.map((cat) => {
                  const selected = (formData.categories || []).includes(cat.slug);
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => toggleCategory(cat.slug)}
                      className={`border px-2 py-0.5 font-mono text-[9px] uppercase transition-all duration-150 ${
                        selected
                          ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                          : "border-dashed border-neutral-300 bg-transparent text-neutral-400 hover:border-neutral-600 dark:border-neutral-700"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section count */}
            <div className="border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase">Sections</span>
                <span className="font-mono text-[10px] font-bold text-foreground">{formData.sections.length}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={(url) => handleFieldChange("imageSrc", url)}
        selectedUrl={formData.imageSrc}
      />
    </div>
  );
}
