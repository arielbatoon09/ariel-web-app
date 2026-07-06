"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { DataTable } from "@/components/features/dashboard/data-table";
import type { Project } from "@/lib/schemas/dashboard";

export default function AdminWorksPage() {
  const router = useRouter();
  const { works, addWork, deleteWork, toggleWorkStatus } = useDashboardStore();

  const columns = [
    {
      header: "Project Details",
      accessorKey: (item: Project) => (
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
      accessorKey: (item: Project) => <code className="font-mono text-xs text-neutral-500">{item.slug}</code>,
    },
    {
      header: "Categories",
      accessorKey: (item: Project) => (
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
      header: "Tech Stack",
      accessorKey: (item: Project) => (
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded border border-neutral-300 px-1.5 py-0.5 font-mono text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
            >
              {t}
            </span>
          ))}
          {item.tags.length > 3 && <span className="font-mono text-xs text-neutral-400">+{item.tags.length - 3}</span>}
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    const title = window.prompt("Enter Project Title:");
    if (!title) return;
    const desc = window.prompt("Enter Description:") || "";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newProject: Project = {
      id: `0${works.length + 1}`,
      slug,
      tag: "Custom SaaS / Web Platform",
      title,
      description: desc,
      imageSrc: "/projects/project-logistics.png",
      gallery: ["/projects/project-logistics.png"],
      tags: ["React", "Next.js", "TailwindCSS"],
      link: `/work/${slug}`,
      categories: ["web"],
      caseStudy: {
        role: "Full-Stack Engineer",
        timeline: "3 Months (2026)",
        challenge: "Manual administrative inefficiencies and manifest errors.",
        solution: "Centralized panel control dashboards and stripe triggers.",
        features: [{ title: "Ingestion APIs", description: "Realtime coordinates checkouts" }],
        results: ["Reduced overhead completely"],
      },
    };

    addWork(newProject);
  };

  const handleDelete = (item: Project) => {
    if (window.confirm(`Are you sure you want to delete project "${item.title}"?`)) {
      deleteWork(item.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">Works</h1>
        <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">MANAGE PROJECTS IN PORTFOLIO ARCHIVES</p>
      </div>

      <DataTable<Project>
        data={works}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search projects..."
        onAddClick={handleAdd}
        onViewClick={(item) => router.push(`/admin/works/${item.id}`)}
        onEditClick={(item) => router.push(`/admin/works/${item.id}?edit=true`)}
        onToggleStatusClick={(item) => toggleWorkStatus(item.id)}
        onDeleteClick={handleDelete}
        addButtonLabel="Add Project"
      />
    </div>
  );
}
