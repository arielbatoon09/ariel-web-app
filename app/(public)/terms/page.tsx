import Link from "next/link";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { JsonLd } from "@/components/common/json-ld";
import { webPageJsonLd } from "@/constants/seo";

export const metadata = {
  title: "Terms and Conditions | Ariel Batoon - Software Engineer",
  description: "Terms and conditions for visiting the Ariel Batoon website and booking services. Last updated July 6, 2026.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: "Terms and Conditions",
          description: metadata.description,
          path: "/terms",
        })}
      />
      <Section id="terms-conditions" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
        <div className="space-y-12">
          <SectionHeading label="Legal" title="Terms and Conditions" description="Last updated: July 6, 2026" />

          <div className="max-w-3xl border-t border-dashed border-neutral-300 pt-8 dark:border-neutral-700">
            <div className="prose prose-neutral dark:prose-invert space-y-8 font-sans text-sm leading-relaxed text-muted-foreground">
              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">1. Agreement to Terms</h2>
                <p>
                  By accessing or using our website at{" "}
                  <Link href="https://arielbatoon.com" className="text-foreground underline underline-offset-4 hover:text-neutral-500">
                    arielbatoon.com
                  </Link>
                  , you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all of these terms, please do
                  not access or use the site.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">2. Services and Consultations</h2>
                <p>
                  The information provided on this website is for general information purposes only and outlines our freelance software development,
                  system design, and technical consultancy services. Any proposal, timeline, estimation, or scope discussed during discovery calls
                  booked via Cal.com is subject to formal bilateral agreements and is not legally binding until a final written contract is signed by
                  both parties.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">3. Intellectual Property Rights</h2>
                <p>
                  Unless otherwise indicated, all content on this site—including but not limited to source code, databases, functionality, software,
                  website designs, audio, video, text, photographs, and graphics—is our proprietary property or licensed to us, and is protected by
                  copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">4. Prohibited Activities</h2>
                <p>You may not use this website for any purpose that is unlawful or prohibited by these terms. You agree not to:</p>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Attempt to bypass, disable, or interfere with security-related features of the site.</li>
                  <li>
                    Systematically retrieve data or other content from the site to create or compile a collection, database, or directory without
                    written permission from us.
                  </li>
                  <li>Use the website in a manner inconsistent with any applicable laws, regulations, or third-party usage guidelines.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">5. Limitation of Liability</h2>
                <p>
                  In no event will we be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or
                  punitive damages arising from your use of the website or services outlined herein, even if we have been advised of the possibility
                  of such damages.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">6. Governing Law</h2>
                <p>
                  These Terms and Conditions and your use of the website are governed by and construed in accordance with the laws of the Republic of
                  the Philippines, without regard to its conflict of law principles.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">7. Contact Us</h2>
                <p>
                  If you have any questions or concerns regarding these Terms and Conditions, please contact us by email at{" "}
                  <Link href="mailto:hello@arielbatoon.com" className="text-foreground underline underline-offset-4 hover:text-neutral-500">
                    hello@arielbatoon.com
                  </Link>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
