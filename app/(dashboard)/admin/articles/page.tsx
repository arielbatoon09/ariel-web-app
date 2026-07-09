import { ArticleHeader } from "@/components/features/dashboard/articles/article-header";
import { ArticleTable } from "@/components/features/dashboard/articles/article-table";
import { ArticleAddDialog } from "@/components/features/dashboard/articles/article-add-dialog";
import { ArticleDetailDialog } from "@/components/features/dashboard/articles/article-detail-dialog";

export const metadata = {
  title: "Articles Management | Admin",
  description: "Manage blog posts, insights, and technical articles with draft staging and publishing controls.",
};

export default function AdminArticlesPage() {
  return (
    <div className="space-y-6">
      <ArticleHeader />
      <ArticleTable />
      <ArticleAddDialog />
      <ArticleDetailDialog />
    </div>
  );
}
