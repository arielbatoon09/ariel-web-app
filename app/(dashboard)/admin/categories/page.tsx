"use client";

import * as React from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { DataTable } from "@/components/features/dashboard/data-table";
import type { Category } from "@/lib/schemas/dashboard";

export default function AdminCategoriesPage() {
  const { categories, addCategory, deleteCategory, toggleCategoryStatus } = useDashboardStore();

  const columns = [
    {
      header: "Category Name",
      accessorKey: (item: Category) => (
        <div>
          <span className="font-sans font-bold text-foreground">{item.name}</span>
          {item.disabled && (
            <span className="ml-2 rounded border border-red-200 bg-red-50/20 px-1 py-0.5 font-mono text-[8px] text-red-500 uppercase dark:border-red-900/30">
              Disabled
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Slug",
      accessorKey: (item: Category) => <code className="font-mono text-xs text-neutral-500">{item.slug}</code>,
    },
    {
      header: "Linked Scope",
      accessorKey: (item: Category) => (
        <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">
          {item.target}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    const name = window.prompt("Enter Category Name:");
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const targetInput = window.prompt("Enter Target Scope ('works', 'articles', or 'both'):", "both");
    const target = (targetInput === "works" || targetInput === "articles" || targetInput === "both") ? targetInput : "both";

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      target,
    };

    addCategory(newCategory);
  };

  const handleDelete = (item: Category) => {
    if (window.confirm(`Are you sure you want to delete the category "${item.name}"?`)) {
      deleteCategory(item.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">Categories</h1>
        <p className="font-mono text-xs text-neutral-400 dark:text-neutral-500">MANAGE CATEGORIES LINKED TO PROJECTS AND BLOG ARTICLES</p>
      </div>

      <DataTable<Category>
        data={categories}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search categories..."
        onAddClick={handleAdd}
        onViewClick={(item) => alert(`VIEWING CATEGORY: ${item.name}\nSlug: ${item.slug}\nScope: ${item.target}`)}
        onEditClick={(item) => {
          const newName = window.prompt("Edit Category Name:", item.name);
          if (newName) {
            useDashboardStore.getState().updateCategory({ ...item, name: newName });
          }
        }}
        onToggleStatusClick={(item) => toggleCategoryStatus(item.id)}
        onDeleteClick={handleDelete}
        addButtonLabel="Add Category"
      />
    </div>
  );
}
