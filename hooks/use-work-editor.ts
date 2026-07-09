"use client";

import { useState, useMemo, useEffect } from "react";
import { useWorkDetailQuery, useUpdateWorkMutation } from "@/hooks/use-works";
import type { Project, SeoMeta } from "@/schemas/dashboard";
import { toast } from "sonner";

export function useWorkEditor(projectId: string, initialData?: Project) {
  const { data: project, isLoading: isFetching } = useWorkDetailQuery(projectId);
  const updateWorkMutation = useUpdateWorkMutation(projectId);

  // Merge staged draft changes on top of original data
  const mergedActiveProject = useMemo(() => {
    const activeProject = project || initialData;
    if (!activeProject) return null;
    if (activeProject.draft) {
      return {
        ...activeProject,
        ...(activeProject.draft || {}),
        categories: activeProject.draft.categories || activeProject.categories,
        seo: activeProject.draft.seo || activeProject.seo || undefined,
        caseStudy: activeProject.draft.caseStudy || activeProject.caseStudy,
      } as Project;
    }
    return activeProject;
  }, [project, initialData]);

  // Form State
  const [formData, setFormData] = useState<Project | null>(mergedActiveProject || null);

  const isDirty = useMemo(() => {
    if (!mergedActiveProject || !formData) return false;
    const cleanActive = { ...mergedActiveProject, draft: undefined, isDraftSave: undefined };
    const cleanForm = { ...formData, draft: undefined, isDraftSave: undefined };
    return JSON.stringify(cleanActive) !== JSON.stringify(cleanForm);
  }, [mergedActiveProject, formData]);

  useEffect(() => {
    if (mergedActiveProject) {
      setFormData(JSON.parse(JSON.stringify(mergedActiveProject)) as Project); // Deep clone for local edits
    }
  }, [mergedActiveProject]);

  // Dirty check navigation alert
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
    if (!formData) return;
    updateWorkMutation.mutate(
      {
        id: projectId,
        data: {
          title: formData.title,
          tag: formData.tag,
          description: formData.description,
          imageSrc: formData.imageSrc,
          gallery: formData.gallery,
          tags: formData.tags,
          link: formData.link,
          categories: formData.categories,
          caseStudy: formData.caseStudy,
          seo: formData.seo,
          status: formData.status,
          isDraftSave: true,
        },
      },
      {
        onSuccess: () => {
          toast.success("Draft saved. Changes are staged and not yet live.");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to save draft.");
        },
      }
    );
  };

  const handlePublish = (targetStatus: "published" | "draft" | "unpublished") => {
    if (!formData) return;
    setFormData((prev) => (prev ? { ...prev, status: targetStatus } : null));

    updateWorkMutation.mutate(
      {
        id: projectId,
        data: {
          title: formData.title,
          tag: formData.tag,
          description: formData.description,
          imageSrc: formData.imageSrc,
          gallery: formData.gallery,
          tags: formData.tags,
          link: formData.link,
          categories: formData.categories,
          caseStudy: formData.caseStudy,
          seo: formData.seo,
          status: targetStatus,
          isDraftSave: false,
        },
      },
      {
        onSuccess: () => {
          if (targetStatus === "published") {
            toast.success("Project published successfully.");
          } else if (targetStatus === "unpublished") {
            toast.success("Project unpublished.");
          } else {
            toast.success("Project reverted to draft.");
          }
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to publish project.");
        },
      }
    );
  };

  return {
    project,
    formData,
    isDirty,
    isFetching,
    isSaving: updateWorkMutation.isPending,
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
    setFormData,
  };
}
