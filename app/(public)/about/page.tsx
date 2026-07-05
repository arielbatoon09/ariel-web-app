import { AboutDetails } from "@/components/features/about/about-details";

export const metadata = {
  title: "About Me | Ariel Batoon",
  description: "Learn more about Ariel Batoon, a Full-Stack Engineer specializing in high-performance web systems, custom mobile applications, and reliable technical scoping.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <AboutDetails />
    </div>
  );
}
