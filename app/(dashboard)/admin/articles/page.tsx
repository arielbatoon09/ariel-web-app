"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { DataTable } from "@/components/features/dashboard/data-table";
import type { Article } from "@/lib/schemas/dashboard";

export default function AdminArticlesPage() {
  const router = useRouter();
  const { articles, addArticle, deleteArticle, toggleArticleStatus } = useDashboardStore();

  const columns = [
    {
      header: "Article Details",
      accessorKey: (item: Article) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-foreground">{item.title}</span>
            {item.disabled && (
              <span className="rounded border border-red-200 bg-red-50/20 px-1 py-0.5 font-mono text-[8px] text-red-500 uppercase dark:border-red-900/30">
                Disabled
              </span>
            )}
          </div>
          <p className="max-w-md text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">{item.description}</p>
        </div>
      ),
    },
    {
      header: "Slug Reference",
      accessorKey: (item: Article) => <code className="font-mono text-xs text-neutral-500">{item.slug}</code>,
    },
    {
      header: "Categories",
      accessorKey: (item: Article) => (
        <div className="flex flex-wrap gap-1">
          {item.categories.map((c) => (
            <span
              key={c}
              className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400"
            >
              {c}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Read Time",
      accessorKey: "readTime" as keyof Article,
    },
    {
      header: "Publish Date",
      accessorKey: "date" as keyof Article,
    },
  ];

  const handleAdd = () => {
    const title = window.prompt("Enter Article Title:");
    if (!title) return;
    const desc = window.prompt("Enter Description:") || "";
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newArticle: Article = {
      id: `0${articles.length + 1}`,
      slug,
      tag: "Software Engineering",
      title,
      description: desc,
      imageSrc: "/projects/project-logistics.png",
      tags: ["React", "Next.js"],
      link: `/article/${slug}`,
      categories: ["engineering"],
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: "5 min read",
      author: "Ariel Batoon",
      sections: [{ title: "Introduction", body: "Initial introduction contents." }],
    };

    addArticle(newArticle);
  };

  const handleDelete = (item: Article) => {
    if (window.confirm(`Are you sure you want to delete article "${item.title}"?`)) {
      deleteArticle(item.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">Articles</h1>
        <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">MANAGE ARTICLES PUBLISHED TO BLOG ARCHIVES</p>
      </div>

      <DataTable<Article>
        data={articles}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search articles..."
        onAddClick={handleAdd}
        onViewClick={(item) => router.push(`/admin/articles/${item.id}`)}
        onEditClick={(item) => router.push(`/admin/articles/${item.id}?edit=true`)}
        onToggleStatusClick={(item) => toggleArticleStatus(item.id)}
        onDeleteClick={handleDelete}
        addButtonLabel="Add Article"
      />
    </div>
  );
}
