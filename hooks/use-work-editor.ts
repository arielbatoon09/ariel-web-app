"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useWorkDetailQuery, useUpdateWorkMutation } from "@/hooks/use-works";
import type { Project, SeoMeta } from "@/lib/schemas/dashboard";

export function useWorkEditor(projectId: string, initialData?: Project) {
  const router = useRouter();
  const { data: project, isLoading: isFetching } = useWorkDetailQuery(projectId);
  const updateWorkMutation = useUpdateWorkMutation(projectId);

  // Form State
  const [formData, setFormData] = React.useState<Project | null>(initialData || null);

  const isDirty = React.useMemo(() => {
    const activeProject = project || initialData;
    if (!activeProject || !formData) return false;
    return JSON.stringify(activeProject) !== JSON.stringify(formData);
  }, [project, initialData, formData]);

  React.useEffect(() => {
    const activeProject = project || initialData;
    if (activeProject) {
      setFormData(JSON.parse(JSON.stringify(activeProject)) as Project); // Deep clone for local edits
    }
  }, [project, initialData]);

  // Dirty check navigation alert
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
        },
      },
      {
        onSuccess: () => {
          router.push("/admin/works");
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
    setFormData,
  };
}
