import { MediaHeader } from "@/components/features/dashboard/media/media-header";
import { MediaUploadSection } from "@/components/features/dashboard/media/media-upload-section";
import { MediaFilters } from "@/components/features/dashboard/media/media-filters";
import { MediaContent } from "@/components/features/dashboard/media/media-content";

export const metadata = {
  title: "Media Library | Admin",
  description: "Centralized asset management for all uploaded media files.",
};

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <MediaHeader />
      <MediaUploadSection />
      <MediaFilters />
      <MediaContent />
    </div>
  );
}
