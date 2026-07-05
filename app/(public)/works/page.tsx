import { WorksArchive } from "@/components/features/works/works-archive";

export const metadata = {
  title: "Works | Ariel Batoon",
  description: "A comprehensive archive of custom web platforms, mobile application suites, AI utilities, and systems architecture built by Ariel Batoon.",
};

export default function WorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <WorksArchive />
    </div>
  );
}
