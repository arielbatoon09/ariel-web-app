import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getWorkByIdQuery } from "@/data/works";
import { WorkEditorClient } from "@/components/features/dashboard/works/work-editor-client";
import type { Project } from "@/lib/schemas/dashboard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminWorkDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return (
      <div className="py-12 text-center font-mono text-xs">
        <p className="text-red-500">INVALID PROJECT ID</p>
        <Link href="/admin/works" className="mt-4 inline-flex items-center gap-1 text-neutral-400 hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to list
        </Link>
      </div>
    );
  }

  const rawProject = await getWorkByIdQuery(numericId);

  if (!rawProject) {
    return (
      <div className="py-12 text-center font-mono text-xs">
        <p className="text-red-500">PROJECT NOT FOUND</p>
        <Link href="/admin/works" className="mt-4 inline-flex items-center gap-1 text-neutral-400 hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Back to list
        </Link>
      </div>
    );
  }

  const project: Project = {
    ...rawProject,
    id: rawProject.id.toString(),
    categories: rawProject.categories as ("web" | "mobile" | "ai-data" | "open-source")[],
    seo: rawProject.seo || undefined,
  };

  return <WorkEditorClient projectId={id} initialData={project} />;
}
