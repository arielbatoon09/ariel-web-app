"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/schemas/dashboard";

import { useWorkEditor } from "@/hooks/use-work-editor";
import { WorkEditorHeader } from "./work-editor-header";
import { WorkVisualEditor } from "./work-visual-editor";
import { WorkPreviewMode } from "./work-preview-mode";

interface WorkEditorClientProps {
  projectId: string;
  initialData: Project;
}

export function WorkEditorClient({ projectId, initialData }: WorkEditorClientProps) {
  const searchParams = useSearchParams();

  const {
    formData,
    isDirty,
    isSaving,
    handleBackClick,
    handleFieldChange,
    handleSeoFieldChange,
    handleCaseStudyFieldChange,
    handleFeatureChange,
    handleResultChange,
    addFeature,
    removeFeature,
    addResult,
    removeResult,
    handleSave,
    handlePublish,
  } = useWorkEditor(projectId, initialData);

  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">(
    searchParams.get("edit") === "true" ? "edit" : "preview"
  );

  if (!formData) {
    return (
      <div className="py-12 text-center font-mono text-xs">
        <p className="text-red-500">PROJECT NOT FOUND</p>
        <Link href="/admin/works" className="mt-4 inline-flex items-center gap-1 text-neutral-400 hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6">
      <WorkEditorHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDirty={isDirty}
        isSaving={isSaving}
        handleBackClick={handleBackClick}
        handleSave={handleSave}
        handlePublish={handlePublish}
        status={formData.status}
        onStatusChange={(val) => handleFieldChange("status", val)}
        slug={formData.slug}
        hasDraft={!!formData.draft}
      />

      {activeTab === "edit" ? (
        <WorkVisualEditor
          formData={formData}
          handleFieldChange={handleFieldChange}
          handleSeoFieldChange={handleSeoFieldChange}
          handleCaseStudyFieldChange={handleCaseStudyFieldChange}
          handleFeatureChange={handleFeatureChange}
          handleResultChange={handleResultChange}
          addFeature={addFeature}
          removeFeature={removeFeature}
          addResult={addResult}
          removeResult={removeResult}
        />
      ) : (
        <WorkPreviewMode formData={formData} />
      )}
    </div>
  );
}
