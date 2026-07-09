"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Article } from "@/schemas/dashboard";

import { useArticleEditor } from "@/hooks/use-article-editor";
import { ArticleEditorHeader } from "./article-editor-header";
import { ArticleVisualEditor } from "./article-visual-editor";
import { ArticlePreviewMode } from "./article-preview-mode";

interface ArticleEditorClientProps {
  articleId: string;
  initialData: Article;
}

export function ArticleEditorClient({ articleId, initialData }: ArticleEditorClientProps) {
  const searchParams = useSearchParams();

  const {
    formData,
    isDirty,
    isSaving,
    handleBackClick,
    handleFieldChange,
    handleSeoFieldChange,
    handleSectionChange,
    addSection,
    removeSection,
    handleCategoriesChange,
    handleSave,
    handlePublish,
  } = useArticleEditor(articleId, initialData);

  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">(
    searchParams.get("edit") === "true" ? "edit" : "preview"
  );

  if (!formData) {
    return (
      <div className="py-12 text-center font-mono text-xs">
        <p className="text-red-500">ARTICLE NOT FOUND</p>
        <Link href="/admin/articles" className="mt-4 inline-flex items-center gap-1 text-neutral-400 hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6">
      <ArticleEditorHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDirty={isDirty}
        isSaving={isSaving}
        handleBackClick={handleBackClick}
        handleSave={handleSave}
        handlePublish={handlePublish}
        status={formData.status}
        slug={formData.slug}
        hasDraft={!!formData.draft}
      />

      {activeTab === "edit" ? (
        <ArticleVisualEditor
          formData={formData}
          handleFieldChange={handleFieldChange}
          handleSeoFieldChange={handleSeoFieldChange}
          handleSectionChange={handleSectionChange}
          addSection={addSection}
          removeSection={removeSection}
          handleCategoriesChange={handleCategoriesChange}
        />
      ) : (
        <ArticlePreviewMode formData={formData} />
      )}
    </div>
  );
}
