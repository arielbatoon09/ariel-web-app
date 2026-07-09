"use client";

import { useMemo, useState, useEffect } from "react";
import { useArticleDetailQuery, useUpdateArticleMutation } from "@/hooks/use-articles";
import { useCategoriesQuery } from "@/hooks/use-categories";
import { toast } from "sonner";
import type { Article, SeoMeta } from "@/schemas/dashboard";

export function useArticleEditor(articleId: string, initialData?: Article) {
  const { data: article } = useArticleDetailQuery(articleId);
  const updateArticleMutation = useUpdateArticleMutation(articleId);
  const { data: categoriesData = [] } = useCategoriesQuery();

  // Merge staged draft changes on top of original data
  const mergedActiveArticle = useMemo(() => {
    const activeArticle = article || initialData;
    if (!activeArticle) return null;

    // Safely check for draft properties using type casting to Partial<Article>
    const draftContent = activeArticle.draft as Partial<Article> | undefined;
    if (draftContent) {
      return {
        ...activeArticle,
        ...draftContent,
        categories: draftContent.categories || activeArticle.categories,
        seo: draftContent.seo || activeArticle.seo || undefined,
      } as Article;
    }
    return activeArticle;
  }, [article, initialData]);

  // Form state
  const [formData, setFormData] = useState<Article | null>(() => mergedActiveArticle || null);

  const isDirty = useMemo(() => {
    if (!mergedActiveArticle || !formData) return false;
    const cleanActive = { ...mergedActiveArticle, draft: undefined, isDraftSave: undefined };
    const cleanForm = { ...formData, draft: undefined, isDraftSave: undefined };
    return JSON.stringify(cleanActive) !== JSON.stringify(cleanForm);
  }, [mergedActiveArticle, formData]);

  const isSaving = updateArticleMutation.isPending;

  useEffect(() => {
    if (mergedActiveArticle) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(JSON.parse(JSON.stringify(mergedActiveArticle)) as Article);
    }
  }, [mergedActiveArticle]);

  // Dirty check navigation guard
  useEffect(() => {
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
      return { ...prev, sections: updatedSections };
    });
  };

  const addSection = () => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        sections: [...prev.sections, { title: "New Section", body: "Start writing here..." }],
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

  const handleCategoriesChange = (categories: string[]) => {
    setFormData((prev) => {
      if (!prev) return null;
      const firstCatSlug = categories[0];
      let firstCatName = firstCatSlug ? firstCatSlug.toUpperCase() : prev.tag;
      if (firstCatSlug) {
        const matchingCat = categoriesData.find((c) => c.slug === firstCatSlug);
        firstCatName = matchingCat ? matchingCat.name.toUpperCase() : firstCatSlug.toUpperCase();
      }
      return {
        ...prev,
        categories,
        tag: firstCatName,
      };
    });
  };

  // Get the exact type payload structure expected by your update mutation
  type UpdateMutationPayload = Parameters<typeof updateArticleMutation.mutateAsync>[0];

  const handleSave = async () => {
    if (!formData) return;

    const payload: UpdateMutationPayload = {
      id: articleId,
      data: { ...formData, isDraftSave: true },
    };

    await updateArticleMutation.mutateAsync(
      payload,
      {
        onSuccess: () => toast.success("Draft saved. Changes are staged and not yet live."),
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Failed to save draft.";
          toast.error(message);
        },
      }
    );
  };

  const handlePublish = async (status: "published" | "draft" | "unpublished") => {
    if (!formData) return;

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const payload: UpdateMutationPayload = {
      id: articleId,
      data: {
        ...formData,
        status,
        date: status === "published" ? formattedDate : formData.date,
        isDraftSave: false,
      },
    };

    await updateArticleMutation.mutateAsync(
      payload,
      {
        onSuccess: () => {
          if (status === "published") toast.success("Article published successfully.");
          else if (status === "unpublished") toast.success("Article unpublished.");
          else toast.success("Article reverted to draft.");
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Failed to publish article.";
          toast.error(message);
        },
      }
    );
  };

  return {
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
  };
}