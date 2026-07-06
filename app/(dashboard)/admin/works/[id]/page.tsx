"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { Button } from "@/components/ui/button";
import { CaseStudyHero } from "@/components/features/works/case-study-hero";
import { CaseStudyDetails } from "@/components/features/works/case-study-details";
import { CaseStudyOutcomes } from "@/components/features/works/case-study-outcomes";
import { ArrowLeft, Save, Eye, Edit2, Plus, Trash2, Target, CheckCircle2, Cpu, FileText, Monitor, Tablet, Smartphone } from "lucide-react";
import type { Project, SeoMeta } from "@/lib/schemas/dashboard";
import { PreviewFrame } from "@/components/features/dashboard/preview-frame";

export default function AdminWorkDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { works, updateWork } = useDashboardStore();

  const projectId = params.id as string;
  const project = works.find((p) => p.id === projectId);

  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">(searchParams.get("edit") === "true" ? "edit" : "preview");
  const [previewMode, setPreviewMode] = React.useState<"desktop" | "tablet" | "mobile">("desktop");

  // Form State
  const [formData, setFormData] = React.useState<Project | null>(null);

  const isDirty = React.useMemo(() => {
    if (!project || !formData) return false;
    return JSON.stringify(project) !== JSON.stringify(formData);
  }, [project, formData]);

  React.useEffect(() => {
    if (project) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(JSON.parse(JSON.stringify(project)) as Project); // Deep clone for local edits
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

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

  if (!project || !formData) {
    return (
      <div className="py-12 text-center font-mono text-xs">
        <p className="text-red-500">PROJECT NOT FOUND</p>
        <Link href="/admin/works" className="mt-4 inline-flex items-center gap-1 text-neutral-400 hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to list
        </Link>
      </div>
    );
  }

  const handleFieldChange = (field: keyof Project, value: Project[keyof Project]) => {
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

  const handleCaseStudyFieldChange = (field: string, value: string | string[]) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        caseStudy: {
          ...prev.caseStudy,
          [field]: value,
        },
      };
    });
  };

  const handleFeatureChange = (index: number, key: "title" | "description", value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedFeatures = [...prev.caseStudy.features];
      updatedFeatures[index] = { ...updatedFeatures[index], [key]: value };
      return {
        ...prev,
        caseStudy: {
          ...prev.caseStudy,
          features: updatedFeatures,
        },
      };
    });
  };

  const handleResultChange = (index: number, value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedResults = [...prev.caseStudy.results];
      updatedResults[index] = value;
      return {
        ...prev,
        caseStudy: {
          ...prev.caseStudy,
          results: updatedResults,
        },
      };
    });
  };

  const addFeature = () => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        caseStudy: {
          ...prev.caseStudy,
          features: [...prev.caseStudy.features, { title: "New Feature Title", description: "Feature description." }],
        },
      };
    });
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        caseStudy: {
          ...prev.caseStudy,
          features: prev.caseStudy.features.filter((_, idx) => idx !== index),
        },
      };
    });
  };

  const addResult = () => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        caseStudy: {
          ...prev.caseStudy,
          results: [...prev.caseStudy.results, "New outcome or metric achieved."],
        },
      };
    });
  };

  const removeResult = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        caseStudy: {
          ...prev.caseStudy,
          results: prev.caseStudy.results.filter((_, idx) => idx !== index),
        },
      };
    });
  };

  const handleSave = () => {
    updateWork(formData);
    router.push("/admin/works");
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Header Panel */}
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
        <div className="space-y-16 border border-dashed border-neutral-300 bg-background p-6 dark:border-neutral-700">
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
                  <div className="group relative aspect-[16/6] w-full overflow-hidden border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
                    <Image
                      src={formData.imageSrc}
                      alt="Project Banner Preview"
                      fill
                      className="object-cover grayscale transition-all duration-705 ease-out hover:grayscale-0"
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
                      const path = window.prompt("Enter Project Banner Image source path:");
                      if (path) {
                        handleFieldChange("imageSrc", path);
                      }
                    }}
                    className="hover:border-neutral-450 flex aspect-[16/6] w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-neutral-300 bg-neutral-50/50 font-mono text-xs text-neutral-400 uppercase transition-colors dark:border-neutral-700 dark:bg-neutral-900/10 dark:hover:bg-neutral-500"
                  >
                    <Plus className="size-5" />
                    <span>Add Project Banner Image</span>
                    <span className="text-[9px] text-neutral-400 normal-case">(Currently empty, click to set path)</span>
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
                <div className="flex items-center justify-between py-1">
                  <span className="text-neutral-400">Client:</span>
                  <input
                    value={formData.caseStudy.client || ""}
                    onChange={(e) => handleCaseStudyFieldChange("client", e.target.value)}
                    className="focus:ring-dashed focus:ring-neutral-450 w-48 rounded border-none bg-transparent p-0.5 text-right font-bold text-foreground outline-none focus:ring-1"
                    placeholder="None"
                  />
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
                {/* Large Main View of the First Image / Carousel */}
                <div className="group relative aspect-[16/6] w-full overflow-hidden border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
                  <Image
                    src={formData.gallery[0]}
                    alt="Main Gallery Preview"
                    fill
                    className="object-cover grayscale transition-all duration-705 ease-out hover:grayscale-0"
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
                      <Image src={src} alt={`Thumb ${idx}`} fill className="object-cover" />
                      {/* Delete Overlay */}
                      <button
                        onClick={() => {
                          const updated = (formData.gallery || []).filter((_, i) => i !== idx);
                          handleFieldChange("gallery", updated);
                        }}
                        className="bg-red-650/80 absolute inset-0 flex items-center justify-center font-mono text-[8px] font-bold tracking-wider text-white uppercase opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {/* Add Image Box */}
                  <button
                    onClick={() => {
                      const path = window.prompt("Enter new Gallery Image source path:");
                      if (path) {
                        const currentGallery = formData.gallery || [];
                        handleFieldChange("gallery", [...currentGallery, path]);
                      }
                    }}
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
                onClick={() => {
                  const path = window.prompt("Enter first Gallery Image source path:");
                  if (path) {
                    handleFieldChange("gallery", [path]);
                  }
                }}
                className="hover:border-neutral-450 flex aspect-[16/6] w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-300 bg-neutral-50/50 font-mono text-xs text-neutral-400 uppercase transition-colors dark:border-neutral-700 dark:bg-neutral-900/10 dark:hover:bg-neutral-500"
              >
                <Plus className="size-6" />
                <span>Add Gallery Images</span>
                <span className="text-[9px] text-neutral-400 normal-case">(Currently empty, click to initialize)</span>
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
                <h2 className="font-sans text-lg font-bold tracking-tight">Key Technical Features</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="h-7 rounded-none border-dashed px-2.5 font-mono text-[9px] uppercase"
              >
                <Plus className="mr-1 size-3" /> Add Feature card
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {formData.caseStudy.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative space-y-2 border border-dashed border-neutral-300 bg-neutral-50/30 p-5 dark:border-neutral-700 dark:bg-neutral-900/10"
                >
                  <button
                    onClick={() => removeFeature(idx)}
                    className="absolute top-2 right-2 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">0{idx + 1}.</span>
                    <input
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                      className="focus:ring-dashed focus:ring-neutral-450 w-full rounded border-none bg-transparent p-0.5 text-sm font-bold text-foreground outline-none focus:ring-1"
                    />
                  </div>
                  <textarea
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(idx, "description", e.target.value)}
                    className="focus:ring-dashed focus:ring-neutral-450 w-full resize-none rounded border-none bg-transparent p-0.5 text-xs leading-relaxed text-neutral-500 outline-none focus:ring-1 dark:text-neutral-400"
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Outcomes */}
          <div className="grid grid-cols-1 gap-12 border-t border-dashed border-neutral-200 pt-12 lg:grid-cols-12 dark:border-neutral-800">
            <div className="space-y-6 lg:col-span-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground">
                  <FileText className="size-4.5 text-neutral-400" />
                  <h3 className="font-mono text-sm tracking-wider uppercase">Measurable Impact</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addResult}
                  className="h-7 rounded-none border-dashed px-2.5 font-mono text-[9px] uppercase"
                >
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
                  placeholder="e.g. Project Name | Ariel Batoon Portfolio"
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
                  placeholder="e.g. portfolio, react, nextjs, frontend"
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
                    placeholder="e.g. /projects/banner-og.png"
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
              <div className="space-y-16 p-4">
                <CaseStudyHero project={formData} />
                <CaseStudyDetails caseStudy={formData.caseStudy} />
                <CaseStudyOutcomes caseStudy={formData.caseStudy} />
              </div>
            </PreviewFrame>
          </div>
        </div>
      )}
    </div>
  );
}
