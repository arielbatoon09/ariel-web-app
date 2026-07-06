"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDashboardStore } from "@/lib/store/dashboard-store";
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

  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">(
    searchParams.get("edit") === "true" ? "edit" : "preview"
  );
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
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-dashed border-neutral-300 pb-4 dark:border-neutral-700">
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
            <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500">Edit inline directly on the live template or preview changes instantly.</p>
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
            className="h-8 rounded-none font-mono text-[10px] uppercase bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="mr-1.5 size-3" />
            Save changes
          </Button>
        </div>
      </div>

      {activeTab === "edit" ? (
        /* Visual Inline Editor Mode (Inheriting Exact Public Layout CSS) */
        <div className="border border-dashed border-neutral-300 dark:border-neutral-700 bg-background p-6 space-y-16">
          <div className="pointer-events-none w-full bg-amber-500/10 border border-dashed border-amber-300 text-[10px] font-mono tracking-widest text-center py-2 uppercase text-amber-600 dark:text-amber-500 select-none">
            Visual Editor Mode Active — Click text components to edit directly.
          </div>

          {/* Section 1: Hero Block */}
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-4 lg:col-span-7">
              <input
                value={formData.tag}
                onChange={(e) => handleFieldChange("tag", e.target.value)}
                className="w-full bg-transparent border-none outline-none font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase dark:text-neutral-500 focus:ring-1 focus:ring-dashed focus:ring-neutral-450 p-1 rounded font-bold"
                placeholder="TAG SUBTITLE"
              />
              <input
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="w-full bg-transparent border-none outline-none font-sans text-3xl md:text-5xl font-bold tracking-tight text-foreground focus:ring-1 focus:ring-dashed focus:ring-neutral-450 p-1 rounded"
                placeholder="Project Title"
              />
              <textarea
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                className="w-full bg-transparent border-none outline-none font-sans text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-400 focus:ring-1 focus:ring-dashed focus:ring-neutral-450 p-1 rounded resize-none"
                placeholder="Project Description Summary..."
                rows={5}
              />
              {/* Banner Image Showcase Editor */}
              <div className="pt-2 space-y-1.5">
                <span className="text-neutral-400 font-mono text-[9px] uppercase block">Project Banner Image:</span>
                {formData.imageSrc ? (
                  <div className="relative aspect-[16/6] w-full border border-dashed border-neutral-300 bg-neutral-100 overflow-hidden dark:border-neutral-700 dark:bg-neutral-900 group">
                    <Image
                      src={formData.imageSrc}
                      alt="Project Banner Preview"
                      fill
                      className="object-cover grayscale transition-all duration-705 ease-out hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
                    
                    {/* Hover Controls */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        onClick={() => {
                          const newSrc = window.prompt("Change Banner Image Source Path:", formData.imageSrc);
                          if (newSrc) {
                            handleFieldChange("imageSrc", newSrc);
                          }
                        }}
                        className="rounded-none border-dashed font-mono text-[9px] uppercase px-3 h-7 bg-background text-foreground hover:bg-neutral-100 border border-neutral-300"
                      >
                        Change Path
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleFieldChange("imageSrc", "")}
                        className="rounded-none font-mono text-[9px] uppercase px-3 h-7"
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
                    className="w-full aspect-[16/6] border-2 border-dashed border-neutral-300 hover:border-neutral-450 dark:border-neutral-700 dark:hover:bg-neutral-500 bg-neutral-50/50 dark:bg-neutral-900/10 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs uppercase transition-colors gap-1"
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
                <div className="flex items-center justify-between py-1 border-b border-dashed border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-400">Role:</span>
                  <input
                    value={formData.caseStudy.role}
                    onChange={(e) => handleCaseStudyFieldChange("role", e.target.value)}
                    className="bg-transparent border-none outline-none text-right font-bold text-foreground focus:ring-1 focus:ring-dashed focus:ring-neutral-450 p-0.5 rounded w-48"
                  />
                </div>
                <div className="flex items-center justify-between py-1 border-b border-dashed border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-400">Timeline:</span>
                  <input
                    value={formData.caseStudy.timeline}
                    onChange={(e) => handleCaseStudyFieldChange("timeline", e.target.value)}
                    className="bg-transparent border-none outline-none text-right font-bold text-foreground focus:ring-1 focus:ring-dashed focus:ring-neutral-450 p-0.5 rounded w-48"
                  />
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-neutral-400">Client:</span>
                  <input
                    value={formData.caseStudy.client || ""}
                    onChange={(e) => handleCaseStudyFieldChange("client", e.target.value)}
                    className="bg-transparent border-none outline-none text-right font-bold text-foreground focus:ring-1 focus:ring-dashed focus:ring-neutral-450 p-0.5 rounded w-48"
                    placeholder="None"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 1.5: Project Gallery Showcase Editor */}
          <div className="space-y-4 border-t border-dashed border-neutral-200 pt-12 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
                Project Gallery Showcase
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">
                {formData.gallery?.length || 0} images
              </span>
            </div>

            {/* Gallery Images Container */}
            {formData.gallery && formData.gallery.length > 0 ? (
              <div className="space-y-4">
                {/* Large Main View of the First Image / Carousel */}
                <div className="relative aspect-[16/6] w-full border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 overflow-hidden group">
                  <Image
                    src={formData.gallery[0]}
                    alt="Main Gallery Preview"
                    fill
                    className="object-cover grayscale transition-all duration-705 ease-out hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-2 py-1 text-[9px] font-mono text-foreground uppercase border border-dashed border-neutral-300 dark:border-neutral-700">
                    Primary Image
                  </div>
                </div>

                {/* Thumbnails Row with Add/Remove buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {formData.gallery.map((src, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-[16/10] border border-neutral-300 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                    >
                      <Image src={src} alt={`Thumb ${idx}`} fill className="object-cover" />
                      {/* Delete Overlay */}
                      <button
                        onClick={() => {
                          const updated = (formData.gallery || []).filter((_, i) => i !== idx);
                          handleFieldChange("gallery", updated);
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-red-650/80 text-white opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[8px] uppercase tracking-wider font-bold"
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
                    className="aspect-[16/10] border border-dashed border-neutral-300 hover:border-neutral-450 dark:border-neutral-700 dark:hover:bg-neutral-500 bg-neutral-50/50 dark:bg-neutral-900/10 flex flex-col items-center justify-center text-neutral-400 font-mono text-[9px] uppercase transition-colors"
                  >
                    <Plus className="size-4 mb-1" />
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
                className="w-full aspect-[16/6] border-2 border-dashed border-neutral-300 hover:border-neutral-450 dark:border-neutral-700 dark:hover:bg-neutral-500 bg-neutral-50/50 dark:bg-neutral-900/10 flex flex-col items-center justify-center text-neutral-400 font-mono text-xs uppercase transition-colors gap-2"
              >
                <Plus className="size-6" />
                <span>Add Gallery Images</span>
                <span className="text-[9px] text-neutral-400 normal-case">(Currently empty, click to initialize)</span>
              </button>
            )}
          </div>

          {/* Section 2: Challenge & Solution */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 border-t border-dashed border-neutral-200 pt-12 dark:border-neutral-800">
            <div className="space-y-10 lg:col-span-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <Target className="size-4.5 text-neutral-400" />
                  <h2 className="font-sans text-lg font-bold tracking-tight">The Challenge</h2>
                </div>
                <textarea
                  value={formData.caseStudy.challenge}
                  onChange={(e) => handleCaseStudyFieldChange("challenge", e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 focus:ring-1 focus:ring-dashed focus:ring-neutral-450 p-1 rounded resize-none"
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
                  className="w-full bg-transparent border-none outline-none font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 focus:ring-1 focus:ring-dashed focus:ring-neutral-450 p-1 rounded resize-none"
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
                className="h-7 rounded-none border-dashed font-mono text-[9px] uppercase px-2.5"
              >
                <Plus className="size-3 mr-1" /> Add Feature card
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {formData.caseStudy.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="relative border border-dashed border-neutral-300 bg-neutral-50/30 p-5 dark:border-neutral-700 dark:bg-neutral-900/10 space-y-2 group"
                >
                  <button
                    onClick={() => removeFeature(idx)}
                    className="absolute top-2 right-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">0{idx + 1}.</span>
                    <input
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                      className="bg-transparent border-none outline-none font-bold text-sm text-foreground focus:ring-1 focus:ring-dashed focus:ring-neutral-450 p-0.5 rounded w-full"
                    />
                  </div>
                  <textarea
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(idx, "description", e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 focus:ring-1 focus:ring-dashed focus:ring-neutral-450 p-0.5 rounded resize-none"
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Outcomes */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 border-t border-dashed border-neutral-200 pt-12 dark:border-neutral-800">
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
                  className="h-7 rounded-none border-dashed font-mono text-[9px] uppercase px-2.5"
                >
                  <Plus className="size-3 mr-1" /> Add Outcome
                </Button>
              </div>

              <div className="space-y-4">
                {formData.caseStudy.results.map((result, idx) => (
                  <div key={idx} className="flex items-start gap-3 group relative pr-8">
                    <div className="mt-2.5 size-1.5 flex-shrink-0 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                    <input
                      value={result}
                      onChange={(e) => handleResultChange(idx, e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-xs md:text-sm text-neutral-600 dark:text-neutral-400 focus:ring-1 focus:ring-dashed focus:ring-neutral-450 p-0.5 rounded"
                    />
                    <button
                      onClick={() => removeResult(idx)}
                      className="absolute right-0 top-1 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
          <div className="border-t border-solid border-neutral-300 pt-8 dark:border-neutral-800 space-y-6">
            <div>
              <h3 className="font-sans text-lg font-bold tracking-tight text-foreground">SEO Metadata Settings</h3>
              <p className="font-mono text-xs text-neutral-505 dark:text-neutral-400">Configure page-level titles and descriptions for search engine indexing.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block font-mono text-xs text-neutral-450 uppercase dark:text-neutral-500">Meta Title</label>
                <input
                  type="text"
                  value={formData.seo?.title || ""}
                  onChange={(e) => handleSeoFieldChange("title", e.target.value)}
                  placeholder="e.g. Project Name | Ariel Batoon Portfolio"
                  className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 focus:ring-1 focus:ring-neutral-450 p-2.5 rounded text-xs font-sans text-foreground"
                />
                <span className="block text-[10px] text-neutral-400 font-mono">
                  Characters: {(formData.seo?.title || "").length} (Recommended: 50-60)
                </span>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-xs text-neutral-450 uppercase dark:text-neutral-500">Meta Keywords</label>
                <input
                  type="text"
                  value={formData.seo?.keywords || ""}
                  onChange={(e) => handleSeoFieldChange("keywords", e.target.value)}
                  placeholder="e.g. portfolio, react, nextjs, frontend"
                  className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 focus:ring-1 focus:ring-neutral-450 p-2.5 rounded text-xs font-sans text-foreground"
                />
                <span className="block text-[10px] text-neutral-400 font-mono">Comma-separated tags</span>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block font-mono text-xs text-neutral-450 uppercase dark:text-neutral-500">Canonical URL Override</label>
                <input
                  type="text"
                  value={formData.seo?.canonicalUrl || ""}
                  onChange={(e) => handleSeoFieldChange("canonicalUrl", e.target.value)}
                  placeholder="e.g. https://medium.com/@username/original-post"
                  className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 focus:ring-1 focus:ring-neutral-450 p-2.5 rounded text-xs font-sans text-foreground"
                />
                <span className="block text-[10px] text-neutral-400 font-mono">Leave empty to automatically point to this page&apos;s URL</span>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block font-mono text-xs text-neutral-450 uppercase dark:text-neutral-500">Meta Description</label>
                <textarea
                  value={formData.seo?.description || ""}
                  onChange={(e) => handleSeoFieldChange("description", e.target.value)}
                  placeholder="Brief summary of the project for search engine listings..."
                  className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 focus:ring-1 focus:ring-neutral-450 p-2.5 rounded text-xs font-sans text-foreground resize-none"
                  rows={3}
                />
                <span className="block text-[10px] text-neutral-400 font-mono">
                  Characters: {(formData.seo?.description || "").length} (Recommended: 150-160)
                </span>
              </div>
            </div>

            {/* Social Share Settings (Open Graph) */}
            <div className="border-t border-solid border-neutral-300 pt-6 dark:border-neutral-800 space-y-4">
              <div>
                <h4 className="font-sans text-sm font-bold tracking-tight text-foreground">Social Sharing (Open Graph Overrides)</h4>
                <p className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">Override metadata titles, descriptions, and images when shared on social channels (Facebook, Twitter/X, LinkedIn).</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block font-mono text-xs text-neutral-450 uppercase dark:text-neutral-500">OG Title</label>
                  <input
                    type="text"
                    value={formData.seo?.ogTitle || ""}
                    onChange={(e) => handleSeoFieldChange("ogTitle", e.target.value)}
                    placeholder="Custom sharing title..."
                    className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 focus:ring-1 focus:ring-neutral-450 p-2.5 rounded text-xs font-sans text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-xs text-neutral-450 uppercase dark:text-neutral-500">OG Image URL</label>
                  <input
                    type="text"
                    value={formData.seo?.ogImage || ""}
                    onChange={(e) => handleSeoFieldChange("ogImage", e.target.value)}
                    placeholder="e.g. /projects/banner-og.png"
                    className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 focus:ring-1 focus:ring-neutral-450 p-2.5 rounded text-xs font-sans text-foreground"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block font-mono text-xs text-neutral-450 uppercase dark:text-neutral-500">OG Description</label>
                  <textarea
                    value={formData.seo?.ogDescription || ""}
                    onChange={(e) => handleSeoFieldChange("ogDescription", e.target.value)}
                    placeholder="Custom sharing snippet..."
                    className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 focus:ring-1 focus:ring-neutral-450 p-2.5 rounded text-xs font-sans text-foreground resize-none"
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
          <div className="flex items-center justify-between border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/20 px-4 py-2">
            <span className="font-mono text-[10px] text-neutral-455 uppercase dark:text-neutral-500">Device Viewport:</span>
            <div className="flex items-center gap-1">
              <Button
                variant={previewMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("desktop")}
                className="h-7 rounded-none font-mono text-[9px] uppercase px-3"
              >
                <Monitor className="mr-1.5 size-3" />
                Desktop
              </Button>
              <Button
                variant={previewMode === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("tablet")}
                className="h-7 rounded-none font-mono text-[9px] uppercase px-3"
              >
                <Tablet className="mr-1.5 size-3" />
                Tablet
              </Button>
              <Button
                variant={previewMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("mobile")}
                className="h-7 rounded-none font-mono text-[9px] uppercase px-3"
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
          <div className="flex justify-center bg-neutral-100 dark:bg-neutral-900/60 p-4 border border-dashed border-neutral-300 dark:border-neutral-700">
            <PreviewFrame
              className={`bg-background border border-neutral-300 dark:border-neutral-800 shadow-2xl h-[70vh] max-w-full transition-all duration-300 ${
                previewMode === "desktop" ? "w-full" : ""
              } ${
                previewMode === "tablet" ? "w-[768px]" : ""
              } ${
                previewMode === "mobile" ? "w-[375px]" : ""
              }`}
            >
              <div className="pointer-events-none sticky top-0 z-10 w-full text-[9px] font-mono tracking-widest text-center py-1 uppercase text-neutral-405 bg-neutral-900/10 border-b border-dashed border-neutral-300 dark:border-neutral-700 select-none">
                Live Preview Mode Active
              </div>
              <div className="p-4 space-y-16">
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
