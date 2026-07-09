"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { useCreateWorkMutation } from "@/hooks/use-works";
import { useCategoriesQuery } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";

const workFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters.")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format. Use lowercase letters, numbers, and dashes."),
  categoriesRaw: z.string().min(2, ""),
});

export function WorkAddDialog() {
  const router = useRouter();
  const { isWorkAddOpen, setIsWorkAddOpen } = useDashboardStore();
  const createWorkMutation = useCreateWorkMutation();
  const { data: categoriesData = [] } = useCategoriesQuery();

  const activeWorkCategories = categoriesData.filter(
    (c) => (c.target === "works" || c.target === "both") && !c.disabled
  );

  const form = useForm({
    defaultValues: {
      title: "",
      slug: "",
      categoriesRaw: "",
    },
    validators: {
      onSubmit: workFormSchema,
    },
    onSubmit: async ({ value }) => {
      const categories = value.categoriesRaw
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean) as ("web" | "mobile" | "ai-data" | "open-source")[];

      const defaultCaseStudy = {
        role: "Lead Engineer",
        timeline: "3 Months (2026)",
        challenge: "Describe the core challenge faced by this client/project here.",
        solution: "Describe the technical architecture and solutions implemented here.",
        features: [{ title: "Core Ingestion API", description: "Realtime coordinates checking and data validation." }],
        results: ["Reduced overhead operational inefficiencies entirely."],
      };

      createWorkMutation.mutate(
        {
          title: value.title,
          slug: value.slug,
          tag: "Custom SaaS / Web Platform",
          description: "Describe the project overview and main focus areas...",
          imageSrc: "",
          gallery: [],
          tags: ["React"],
          link: `/work/${value.slug}`,
          categories,
          caseStudy: defaultCaseStudy,
          status: "draft",
        },
        {
          onSuccess: (newWork) => {
            form.reset();
            setIsWorkAddOpen(false);
            router.push(`/admin/works/${newWork.id}?edit=true`);
          },
        }
      );
    },
  });

  const isPending = createWorkMutation.isPending;

  return (
    <Dialog open={isWorkAddOpen} onOpenChange={setIsWorkAddOpen}>
      <DialogContent className="max-h-[90vh] [scrollbar-width:none] overflow-x-hidden overflow-y-auto rounded-none border border-neutral-300 bg-background/95 p-6 font-mono text-xs backdrop-blur-md [-ms-overflow-style:none] sm:max-w-[480px] dark:border-neutral-700 [&::-webkit-scrollbar]:hidden">
        {/* Decorative corner brackets */}
        <div className="pointer-events-none absolute -top-px -left-px z-50 size-2.5 border-t-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -top-px -right-px z-50 size-2.5 border-t-2 border-r-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -bottom-px -left-px z-50 size-2.5 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -right-px -bottom-px z-50 size-2.5 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500" />

        <DialogHeader className="space-y-1">
          <DialogTitle className="font-sans text-base font-bold text-foreground">Add Portfolio Project</DialogTitle>
          <DialogDescription className="text-neutral-450 text-[10px] uppercase dark:text-neutral-500">
            Create a minimal project draft, then edit full details on the next page
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4 pt-2"
        >
          <FieldGroup>
            {/* Title */}
            <form.Field name="title">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      Project Title
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        // Auto-populate slug
                        const autoSlug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "");
                        form.setFieldValue("slug", autoSlug);
                      }}
                      disabled={isPending}
                      placeholder="e.g. Fleet Logistics Platform"
                      className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Slug */}
            <form.Field name="slug">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      URL Slug
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      placeholder="e.g. fleet-logistics-platform"
                      className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Categories Selection */}
            <form.Field name="categoriesRaw">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                const selectedCategories = field.state.value
                  ? field.state.value
                      .split(",")
                      .map((c) => c.trim())
                      .filter(Boolean)
                  : [];

                const handleToggle = (slug: string) => {
                  let next;
                  if (selectedCategories.includes(slug)) {
                    next = selectedCategories.filter((c) => c !== slug);
                  } else {
                    next = [...selectedCategories, slug];
                  }
                  field.handleChange(next.join(", "));
                };

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel className="text-[10px] tracking-widest text-neutral-400 uppercase">Categories</FieldLabel>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {activeWorkCategories.length === 0 ? (
                        <div className="flex w-full flex-col gap-2">
                          <p className="text-[10px] text-neutral-450 uppercase">No active portfolio categories found in DB.</p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsWorkAddOpen(false);
                              router.push("/admin/categories");
                            }}
                            className="h-8 w-full rounded-none border border-dashed border-neutral-300 font-mono text-[10px] uppercase hover:bg-neutral-50 dark:border-neutral-700"
                          >
                            Add Category
                          </Button>
                        </div>
                      ) : (
                        activeWorkCategories.map((cat) => {
                          const isSelected = selectedCategories.includes(cat.slug);
                          return (
                            <button
                              key={cat.slug}
                              type="button"
                              disabled={isPending}
                              onClick={() => handleToggle(cat.slug)}
                              className={cn(
                                "border px-2.5 py-1 font-mono text-[10px] uppercase transition-all duration-150 select-none",
                                isSelected
                                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                                  : "border-dashed border-neutral-300 bg-background/50 text-neutral-500 hover:border-neutral-900 hover:text-foreground dark:border-neutral-700 dark:hover:border-neutral-100"
                              )}
                            >
                              {cat.name}
                            </button>
                          );
                        })
                      )}
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <div className="flex justify-end gap-2 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsWorkAddOpen(false)}
              disabled={isPending}
              className="h-8 rounded-none border-dashed font-mono text-[10px] uppercase"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="h-8 rounded-none border border-neutral-900 font-mono text-[10px] uppercase dark:border-neutral-100"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1 size-3 animate-spin" />
                  Creating...
                </>
              ) : (
                "Add Portfolio"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
