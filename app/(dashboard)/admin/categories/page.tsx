import { CategoriesHeader } from "@/components/features/dashboard/categories/categories-header";
import { CategoriesTable } from "@/components/features/dashboard/categories/categories-table";
import { CategoriesAddOpenWrapper } from "@/components/features/dashboard/categories/categories-add-dialog";
import { CategoriesDetailDialog } from "@/components/features/dashboard/categories/categories-detail-dialog";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <CategoriesHeader />
      <CategoriesTable />
      <CategoriesAddOpenWrapper />
      <CategoriesDetailDialog />
    </div>
  );
}
