"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Target, CheckCircle2, Cpu, ChevronDown, ChevronUp } from "lucide-react";
import type { Project, SeoMeta } from "@/schemas/dashboard";
import { MediaPickerDialog } from "@/components/common/media-picker-dialog";
import { useCustomersQuery } from "@/hooks/use-customers";
import { useCategoriesQuery } from "@/hooks/use-categories";

interface WorkVisualEditorProps {
  formData: Project;
  handleFieldChange: (field: keyof Project, value: any) => void;
  handleSeoFieldChange: (field: keyof SeoMeta, value: string) => void;
  handleCaseStudyFieldChange: (field: string, value: string | string[]) => void;
  handleFeatureChange: (index: number, key: "title" | "description", value: string) => void;
  handleResultChange: (index: number, value: string) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
  addResult: () => void;
  removeResult: (index: number) => void;
}

export function WorkVisualEditor({
  formData,
  handleFieldChange,
  handleSeoFieldChange,
  handleCaseStudyFieldChange,
  handleResultChange,
  addResult,
  removeResult,
}: WorkVisualEditorProps) {
  const [isBannerPickerOpen, setIsBannerPickerOpen] = useState(false);
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  const { data: customers = [] } = useCustomersQuery();
  const { data: categoriesData = [] } = useCategoriesQuery();

  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (formData.tags && document.activeElement?.id !== "tags-input") {
      setTagsInput((formData.tags || []).join(", "));
    }
  }, [formData.tags]);

  const activeWorksCategories = useMemo(() => {
    return categoriesData.length > 0
      ? categoriesData.filter((c) => (c.target === "works" || c.target === "both") && !c.disabled)
      : [
          { name: "Web Development", slug: "web" },
          { name: "Mobile Apps", slug: "mobile" },
          { name: "AI & Data", slug: "ai-data" },
          { name: "Open Source", slug: "open-source" },
        ];
  }, [categoriesData]);

  const toggleCategory = (slug: string) => {
    const current = (formData.categories || []) as string[];
    const next = current.includes(slug) ? current.filter((c) => c !== slug) : [...current, slug];
    handleFieldChange("categories", next);
  };

  return (
    <>
      <div className="space-y-16 border border-dashed border-neutral-300 bg-background p-6 font-mono text-xs dark:border-neutral-700">
        <div className="pointer-events-none w-full border border-dashed border-amber-300 bg-amber-500/10 py-2 text-center font-mono text-[10px] tracking-widest text-amber-600 uppercase select-none dark:text-amber-500">
          Visual Editor Mode Active — Click text components to edit directly.
        </div>

        {/* Section 1: Hero Block */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 lg:col-span-7">
            <input
              value={formData.tag}
              onChange={(e) => handleFieldChange("tag", e.target.value)}
              className="focus:ring-dashed focus:ring-neutral-450 w-full rounded border-none bg-transparent p-1 font-mono text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase outline-none focus:ring-1 dark:text-neutral-500"
              placeholder="TAG SUBTITLE"
            />
            <input
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className="focus:ring-dashed focus:ring-neutral-450 w-full rounded border-none bg-transparent p-1 font-sans text-3xl font-bold tracking-tight text-foreground outline-none focus:ring-1 md:text-5xl"
              placeholder="Project Title"
            />
            <textarea
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="focus:ring-dashed focus:ring-neutral-450 w-full resize-none rounded border-none bg-transparent p-1 font-sans text-sm leading-relaxed text-neutral-600 outline-none focus:ring-1 md:text-base dark:text-neutral-400"
              placeholder="Project Description Summary..."
              rows={5}
            />

            {/* Banner Image Showcase Editor */}
            <div className="space-y-1.5 pt-2">
              <span className="block font-mono text-[9px] text-neutral-400 uppercase">Project Banner Image:</span>
              {formData.imageSrc ? (
                <div className="group relative aspect-[16/6] w-full overflow-hidden border border-neutral-300 bg-neutral-100 transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-900">
                  <Image
                    src={formData.imageSrc}
                    alt="Project Banner Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    className="object-cover"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />

                  {/* Hover Controls */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-neutral-950/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      onClick={() => setIsBannerPickerOpen(true)}
                      className="h-7 rounded-none border border-dashed border-neutral-300 bg-background px-3 font-mono text-[9px] text-foreground uppercase hover:bg-neutral-100"
                    >
                      Change Image
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
                  type="button"
                  onClick={() => setIsBannerPickerOpen(true)}
                  className="hover:border-neutral-450 flex aspect-[16/6] w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-neutral-300 bg-neutral-50/50 font-mono text-xs text-neutral-400 uppercase transition-colors dark:border-neutral-700 dark:bg-neutral-900/10 dark:hover:bg-neutral-800"
                >
                  <Plus className="mb-1 size-5" />
                  <span>Select Project Banner Image</span>
                  <span className="text-[9px] text-neutral-400 normal-case">(Click to select from Media Library)</span>
                </button>
              )}
            </div>
          </div>

          {/* Spec Parameters Card */}
          <div className="w-full space-y-4 self-start border border-dashed border-neutral-300 bg-neutral-50/50 p-6 lg:col-span-5 dark:border-neutral-700 dark:bg-neutral-900/40">
            <h3 className="border-b border-dashed border-neutral-300 pb-2.5 font-mono text-xs tracking-wider text-foreground uppercase dark:border-neutral-700">
              Project Parameters
            </h3>
            <div className="space-y-3.5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-dashed border-neutral-200 py-1 dark:border-neutral-800">
                <span className="text-neutral-400">Role:</span>
                <input
                  value={formData.caseStudy.role}
                  onChange={(e) => handleCaseStudyFieldChange("role", e.target.value)}
                  className="focus:ring-dashed focus:ring-neutral-450 w-48 rounded border-none bg-transparent p-0.5 text-right font-bold text-foreground outline-none focus:ring-1"
                />
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-neutral-200 py-1 dark:border-neutral-800">
                <span className="text-neutral-400">Timeline:</span>
                <input
                  value={formData.caseStudy.timeline}
                  onChange={(e) => handleCaseStudyFieldChange("timeline", e.target.value)}
                  className="focus:ring-dashed focus:ring-neutral-450 w-48 rounded border-none bg-transparent p-0.5 text-right font-bold text-foreground outline-none focus:ring-1"
                />
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-neutral-200 py-1 dark:border-neutral-800">
                <span className="text-neutral-400">Client:</span>
                <div className="flex items-center gap-1.5">
                  {customers.length > 0 && (
                    <select
                      value={customers.some((c) => c.name === (formData.caseStudy.client || "")) ? formData.caseStudy.client : "manual"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "manual") {
                          handleCaseStudyFieldChange("client", "");
                        } else {
                          handleCaseStudyFieldChange("client", val);
                        }
                      }}
                      className="h-6 rounded border border-neutral-300 bg-background px-1 font-mono text-[10px] text-foreground focus:outline-none dark:border-neutral-700"
                    >
                      <option value="manual">— Manual —</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <input
                    value={formData.caseStudy.client || ""}
                    onChange={(e) => handleCaseStudyFieldChange("client", e.target.value)}
                    className="focus:ring-dashed focus:ring-neutral-450 w-32 rounded border-none bg-transparent p-0.5 text-right font-bold text-foreground outline-none focus:ring-1"
                    placeholder="None"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-neutral-200 py-1 dark:border-neutral-800">
                <span className="text-neutral-400">Stack (Tags):</span>
                <input
                  id="tags-input"
                  value={tagsInput}
                  onChange={(e) => {
                    setTagsInput(e.target.value);
                    const val = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    handleFieldChange("tags", val);
                  }}
                  className="focus:ring-dashed focus:ring-neutral-450 w-48 rounded border-none bg-transparent p-0.5 text-right font-bold text-foreground outline-none focus:ring-1"
                  placeholder="e.g. Next.js, Node.js"
                />
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-neutral-200 py-1 dark:border-neutral-800">
                <span className="text-neutral-400">Live Demo URL:</span>
                <input
                  value={formData.caseStudy.liveUrl || ""}
                  onChange={(e) => handleCaseStudyFieldChange("liveUrl", e.target.value)}
                  className="focus:ring-dashed focus:ring-neutral-450 w-48 rounded border-none bg-transparent p-0.5 text-right font-bold text-foreground outline-none focus:ring-1"
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-neutral-200 py-1 dark:border-neutral-800">
                <span className="text-neutral-400">GitHub URL:</span>
                <input
                  value={formData.caseStudy.githubUrl || ""}
                  onChange={(e) => handleCaseStudyFieldChange("githubUrl", e.target.value)}
                  className="focus:ring-dashed focus:ring-neutral-450 w-48 rounded border-none bg-transparent p-0.5 text-right font-bold text-foreground outline-none focus:ring-1"
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="flex flex-col gap-2 py-1">
                <span className="text-neutral-400">Categories:</span>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {activeWorksCategories.map((cat) => {
                    const selected = ((formData.categories || []) as string[]).includes(cat.slug);
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
            </div>
          </div>
        </div>

        {/* Section 1.5: Project Gallery Showcase Editor */}
        <div className="space-y-4 border-t border-dashed border-neutral-200 pt-12 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">Project Gallery Showcase</h3>
            <span className="font-mono text-[10px] text-neutral-400">{formData.gallery?.length || 0} images</span>
          </div>

          {/* Gallery Images Container */}
          {formData.gallery && formData.gallery.length > 0 ? (
            <div className="space-y-4">
              {/* Large Main View of the First Image */}
              <div className="group relative aspect-[16/6] w-full overflow-hidden border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
                <Image
                  src={formData.gallery[0]}
                  alt="Main Gallery Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                <div className="absolute bottom-4 left-4 border border-dashed border-neutral-300 bg-background/80 px-2 py-1 font-mono text-[9px] text-foreground uppercase backdrop-blur-sm dark:border-neutral-700">
                  Primary Image
                </div>
              </div>

              {/* Thumbnails Row with Add/Remove buttons */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {formData.gallery.map((src, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[16/10] overflow-hidden border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <Image
                      src={src}
                      alt={`Thumb ${idx}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 150px"
                      className="object-cover"
                    />
                    {/* Delete Overlay */}
                    <button
                      onClick={() => {
                        const updated = (formData.gallery || []).filter((_, i) => i !== idx);
                        handleFieldChange("gallery", updated);
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-red-600/80 font-mono text-[8px] font-bold tracking-wider text-white uppercase opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* Add Image Box */}
                <button
                  onClick={() => setIsGalleryPickerOpen(true)}
                  className="hover:border-neutral-450 flex aspect-[16/10] flex-col items-center justify-center border border-dashed border-neutral-300 bg-neutral-50/50 font-mono text-[9px] text-neutral-400 uppercase transition-colors dark:border-neutral-700 dark:bg-neutral-900/10 dark:hover:bg-neutral-500"
                >
                  <Plus className="mb-1 size-4" />
                  Add Image
                </button>
              </div>
            </div>
          ) : (
            /* If No Images Added Yet - Large Box */
            <button
              onClick={() => setIsGalleryPickerOpen(true)}
              className="hover:border-neutral-450 flex aspect-[16/6] w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-300 bg-neutral-50/50 font-mono text-xs text-neutral-400 uppercase transition-colors dark:border-neutral-700 dark:bg-neutral-900/10 dark:hover:bg-neutral-500"
            >
              <Plus className="size-6" />
              <span>Add Gallery Images</span>
              <span className="text-[9px] text-neutral-400 normal-case">(Currently empty, click to select from Media Library)</span>
            </button>
          )}
        </div>

        {/* Section 2: Challenge & Solution */}
        <div className="grid grid-cols-1 gap-12 border-t border-dashed border-neutral-200 pt-12 lg:grid-cols-12 dark:border-neutral-800">
          <div className="space-y-10 lg:col-span-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground">
                <Target className="size-4.5 text-neutral-400" />
                <h2 className="font-sans text-lg font-bold tracking-tight">The Challenge</h2>
              </div>
              <textarea
                value={formData.caseStudy.challenge}
                onChange={(e) => handleCaseStudyFieldChange("challenge", e.target.value)}
                className="focus:ring-dashed focus:ring-neutral-450 w-full resize-none rounded border-none bg-transparent p-1 font-sans text-sm leading-relaxed text-neutral-600 outline-none focus:ring-1 dark:text-neutral-400"
                rows={4}
              />
            </div>

            <div className="space-y-3 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="size-4.5 text-neutral-400" />
                <h2 className="font-sans text-lg font-bold tracking-tight">The Engineering Solution</h2>
              </div>
              <textarea
                value={formData.caseStudy.solution}
                onChange={(e) => handleCaseStudyFieldChange("solution", e.target.value)}
                className="focus:ring-dashed focus:ring-neutral-450 w-full resize-none rounded border-none bg-transparent p-1 font-sans text-sm leading-relaxed text-neutral-600 outline-none focus:ring-1 dark:text-neutral-400"
                rows={4}
              />
            </div>
          </div>
          <div className="hidden lg:col-span-4 lg:block" />
        </div>

        {/* Section 3: Technical Features */}
        <div className="space-y-6 border-t border-dashed border-neutral-200 pt-12 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <Cpu className="size-4.5 text-neutral-400" />
              <h2 className="font-sans text-lg font-bold tracking-tight">Key Architecture & Features</h2>
            </div>
            <Button variant="outline" size="sm" onClick={addResult} className="h-7 rounded-none border-dashed px-2.5 font-mono text-[9px] uppercase">
              <Plus className="mr-1 size-3" /> Add Outcome
            </Button>
          </div>

          <div className="space-y-4">
            {formData.caseStudy.results.map((result, idx) => (
              <div key={idx} className="group relative flex items-start gap-3 pr-8">
                <div className="mt-2.5 size-1.5 flex-shrink-0 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                <input
                  value={result}
                  onChange={(e) => handleResultChange(idx, e.target.value)}
                  className="focus:ring-dashed focus:ring-neutral-450 w-full rounded border-none bg-transparent p-0.5 text-xs text-neutral-600 outline-none focus:ring-1 md:text-sm dark:text-neutral-400"
                />
                <button
                  onClick={() => removeResult(idx)}
                  className="absolute top-1 right-0 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:col-span-4 lg:block" />
      </div>

      {/* Section 4: SEO Metadata Settings */}
      <div className="border-t border-solid border-neutral-300 pt-8 dark:border-neutral-800">
        <button type="button" onClick={() => setSeoOpen((v) => !v)} className="flex w-full cursor-pointer items-center justify-between text-left">
          <div>
            <h3 className="font-sans text-lg font-bold tracking-tight text-foreground">SEO Metadata Settings</h3>
            <p className="text-neutral-505 font-mono text-xs dark:text-neutral-400">
              Configure page-level titles and descriptions for search engine indexing.
            </p>
          </div>
          {seoOpen ? <ChevronUp className="size-5 text-neutral-400" /> : <ChevronDown className="size-5 text-neutral-400" />}
        </button>

        {seoOpen && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-neutral-455 block font-mono text-xs uppercase dark:text-neutral-500">Meta Title</label>
                <input
                  type="text"
                  value={formData.seo?.title || ""}
                  onChange={(e) => handleSeoFieldChange("title", e.target.value)}
                  placeholder="e.g. Project Name | Ariel Batoon Portfolio"
                  className="focus:ring-neutral-450 w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                />
                <span className="block font-mono text-[10px] text-neutral-400">
                  Characters: {(formData.seo?.title || "").length} (Recommended: 50-60)
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-neutral-455 block font-mono text-xs uppercase dark:text-neutral-500">Meta Keywords</label>
                <input
                  type="text"
                  value={formData.seo?.keywords || ""}
                  onChange={(e) => handleSeoFieldChange("keywords", e.target.value)}
                  placeholder="e.g. portfolio, react, nextjs, frontend"
                  className="focus:ring-neutral-450 w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                />
                <span className="block font-mono text-[10px] text-neutral-400">Comma-separated tags</span>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-neutral-455 block font-mono text-xs uppercase dark:text-neutral-500">Canonical URL Override</label>
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
                <label className="text-neutral-455 block font-mono text-xs uppercase dark:text-neutral-500">Meta Description</label>
                <textarea
                  value={formData.seo?.description || ""}
                  onChange={(e) => handleSeoFieldChange("description", e.target.value)}
                  placeholder="Brief summary of the project for search engine listings..."
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
                  <label className="text-neutral-455 block font-mono text-xs uppercase dark:text-neutral-500">OG Title</label>
                  <input
                    type="text"
                    value={formData.seo?.ogTitle || ""}
                    onChange={(e) => handleSeoFieldChange("ogTitle", e.target.value)}
                    placeholder="Custom sharing title..."
                    className="focus:ring-neutral-450 w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-neutral-455 block font-mono text-xs uppercase dark:text-neutral-500">OG Image URL</label>
                  <input
                    type="text"
                    value={formData.seo?.ogImage || ""}
                    onChange={(e) => handleSeoFieldChange("ogImage", e.target.value)}
                    placeholder="e.g. /projects/banner-og.png"
                    className="focus:ring-neutral-450 w-full rounded border border-neutral-300 bg-transparent p-2.5 font-sans text-xs text-foreground focus:ring-1 dark:border-neutral-700"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-neutral-455 block font-mono text-xs uppercase dark:text-neutral-500">OG Description</label>
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
        )}
      </div>

      <MediaPickerDialog
        open={isBannerPickerOpen}
        onOpenChange={setIsBannerPickerOpen}
        selectedUrl={formData.imageSrc}
        onSelect={(url) => {
          handleFieldChange("imageSrc", url);
          setIsBannerPickerOpen(false);
        }}
      />

      <MediaPickerDialog
        open={isGalleryPickerOpen}
        onOpenChange={setIsGalleryPickerOpen}
        onSelect={(url) => {
          const currentGallery = formData.gallery || [];
          handleFieldChange("gallery", [...currentGallery, url]);
          setIsGalleryPickerOpen(false);
        }}
      />
    </>
  );
}
