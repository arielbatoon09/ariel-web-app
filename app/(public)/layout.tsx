import { PublicFooter } from "@/components/common/public-footer";
import { PublicHeader } from "@/components/common/public-header";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </>
  );
}