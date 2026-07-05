import { PublicFooter } from "@/components/common/public-footer";
import { PublicHeader } from "@/components/common/public-header";
import { SmoothScrollProvider } from "@/components/common/smooth-scroll-provider";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScrollProvider>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </SmoothScrollProvider>
  );
}
