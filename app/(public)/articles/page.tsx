import { ArticlesArchive } from "@/components/features/articles/articles-archive";

export const metadata = {
  title: "Articles & Insights | Ariel Batoon",
  description: "Detailed articles and insights on Next.js optimization, modular React Native architectures, and integrating autonomous AI agents into modern SaaS platforms.",
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-background">
      <ArticlesArchive />
    </div>
  );
}
