"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { useCreateArticleMutation } from "@/hooks/use-articles";
import { useCategoriesQuery } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";

const articleFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters.")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format. Use lowercase letters, numbers, and dashes."),
  author: z.string().min(1, "Author is required."),
  categoriesRaw: z.string(),
});

export function ArticleAddDialog() {
  const router = useRouter();
  const { isArticleAddOpen, setIsArticleAddOpen } = useDashboardStore();
  const createArticleMutation = useCreateArticleMutation();
  const { data: categoriesData = [] } = useCategoriesQuery();

  const activeArticleCategories =
    categoriesData.length > 0
      ? categoriesData.filter((c) => (c.target === "articles" || c.target === "both") && !c.disabled)
      : [
          { name: "Engineering", slug: "engineering" },
          { name: "Design", slug: "design" },
          { name: "AI & Data", slug: "ai" },
          { name: "Business & Strategy", slug: "business" },
        ];

  const form = useForm({
    defaultValues: {
      title: "",
      slug: "",
      author: "Ariel Batoon",
      categoriesRaw: "",
    },
    validators: {
      onSubmit: articleFormSchema,
    },
    onSubmit: async ({ value }) => {
      const categories = value.categoriesRaw
        ? value.categoriesRaw
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      createArticleMutation.mutate(
        {
          title: value.title,
          slug: value.slug,
          tag: "Engineering",
          description: "Describe this article overview and key insights...",
          imageSrc: "",
          tags: [],
          link: `/article/${value.slug}`,
          categories,
          date: formattedDate,
          readTime: "5 min read",
          author: value.author,
          sections: [{ title: "Introduction", body: "Start writing your article content here." }],
          status: "draft",
        } as any,
        {
          onSuccess: (newArticle) => {
            form.reset();
            setIsArticleAddOpen(false);
            router.push(`/admin/articles/${newArticle.id}?edit=true`);
          },
        }
      );
    },
  });

  const isPending = createArticleMutation.isPending;

  return (
    <Dialog open={isArticleAddOpen} onOpenChange={setIsArticleAddOpen}>
      <DialogContent className="max-h-[90vh] [scrollbar-width:none] overflow-x-hidden overflow-y-auto rounded-none border border-neutral-300 bg-background/95 p-6 font-mono text-xs backdrop-blur-md [-ms-overflow-style:none] sm:max-w-[480px] dark:border-neutral-700 [&::-webkit-scrollbar]:hidden">
        {/* Decorative corner brackets */}
        <div className="pointer-events-none absolute -top-px -left-px z-50 size-2.5 border-t-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -top-px -right-px z-50 size-2.5 border-t-2 border-r-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -bottom-px -left-px z-50 size-2.5 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500" />
        <div className="pointer-events-none absolute -right-px -bottom-px z-50 size-2.5 border-r-2 border-b-2 border-neutral-400 dark:border-neutral-500" />

        <DialogHeader className="space-y-1">
          <DialogTitle className="font-sans text-base font-bold text-foreground">Add New Article</DialogTitle>
          <DialogDescription className="text-neutral-450 text-[10px] uppercase dark:text-neutral-500">
            Create a minimal article draft, then complete the full content on the next page
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
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      Article Title
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        // Auto-populate slug from title
                        const autoSlug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "");
                        form.setFieldValue("slug", autoSlug);
                      }}
                      disabled={isPending}
                      placeholder="e.g. Mastering API Design Patterns"
                      className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            />

            {/* Slug */}
            <form.Field
              name="slug"
              children={(field) => {
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
                      placeholder="e.g. mastering-api-design-patterns"
                      className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            />

            {/* Author */}
            <form.Field
              name="author"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      Author
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      placeholder="e.g. Ariel Batoon"
                      className="h-9 rounded-none border-dashed border-neutral-300 bg-background/50 transition-all duration-200 focus-visible:border-solid focus-visible:border-neutral-900 focus-visible:ring-0 dark:border-neutral-700 dark:focus-visible:border-neutral-100"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} />}
                  </Field>
                );
              }}
            />

            {/* Categories Selection */}
            <form.Field
              name="categoriesRaw"
              children={(field) => {
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
                  <Field>
                    <FieldLabel className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      Categories <span className="text-neutral-400 normal-case">(optional)</span>
                    </FieldLabel>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {activeArticleCategories.map((cat) => {
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
                      })}
                    </div>
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <div className="flex justify-end gap-2 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsArticleAddOpen(false)}
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
                "Create Article"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
