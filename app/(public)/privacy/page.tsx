import Link from "next/link";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { JsonLd } from "@/components/common/json-ld";
import { webPageJsonLd, absoluteCanonical, absoluteTitle } from "@/constants/seo";

export const metadata = {
  title: absoluteTitle("Privacy Policy | Ariel Batoon Software Engineer"),
  description: "How Ariel Batoon collects, uses, and protects personal data on this website and related software services.",
  alternates: {
    canonical: absoluteCanonical("/privacy"),
  },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: "Privacy Policy",
          description: metadata.description,
          path: "/privacy",
        })}
      />
      <Section id="privacy-policy" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
        <div className="space-y-12">
          <SectionHeading label="Legal" title="Privacy Policy" description="Last updated: July 6, 2026" />

          <div className="max-w-3xl border-t border-dashed border-neutral-300 pt-8 dark:border-neutral-700">
            <div className="prose prose-neutral dark:prose-invert space-y-8 font-sans text-sm leading-relaxed text-muted-foreground">
              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">1. Introduction</h2>
                <p>
                  Welcome to the website of Ariel Batoon (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We respect your privacy and are
                  committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when
                  you visit our website at{" "}
                  <Link href="https://www.arielbatoon.com" className="text-foreground underline underline-offset-4 hover:text-neutral-500">
                    www.arielbatoon.com
                  </Link>{" "}
                  and utilize our freelance software engineering and consultancy services.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">2. Information We Collect</h2>
                <p>We may collect and process the following types of personal information:</p>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    <strong>Identity & Contact Information:</strong> Name, email address, phone number, and company name when you submit forms,
                    contact us, or initiate a consultation.
                  </li>
                  <li>
                    <strong>Usage & Technical Data:</strong> IP address, browser type, operating system, and details about your interaction with our
                    site collected through cookies.
                  </li>
                  <li>
                    <strong>Communication Logs:</strong> The content of messages and feedback you share with us through email or contact forms.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">3. How We Use Your Information</h2>
                <p>We use the information we collect for the following purposes:</p>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>To provide, operate, and maintain our website and consultancy services.</li>
                  <li>To communicate with you, process inquiries, and manage project requests.</li>
                  <li>To optimize website performance and user experience using analytical tools.</li>
                  <li>To comply with legal obligations or defend our legal rights.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">4. Third-Party Integrations</h2>
                <p>Our website utilizes third-party tools to facilitate analytics and scheduling:</p>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    <strong>Vercel Analytics:</strong> Helps measure website traffic and performance.
                  </li>
                </ul>
                <p>These third parties have their own privacy policies governing their collection and storage of user data.</p>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">5. Data Retention & Security</h2>
                <p>
                  We retain personal data only as long as necessary to fulfill the purposes outlined in this policy or to satisfy legal, accounting,
                  or reporting requirements. We implement appropriate technical and organizational measures to safeguard your information from
                  unauthorized access, loss, or alteration.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">6. Your Data Rights</h2>
                <p>
                  Depending on your location, you may have rights under applicable privacy laws (such as GDPR, CCPA, or the Philippine Data Privacy
                  Act of 2012), including:
                </p>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>The right to request access to or copies of your personal data.</li>
                  <li>The right to request rectification of inaccurate information.</li>
                  <li>The right to request erasure of your data under certain conditions.</li>
                  <li>The right to object to or restrict processing.</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at{" "}
                  <Link href="mailto:hello@arielbatoon.com" className="text-foreground underline underline-offset-4 hover:text-neutral-500">
                    hello@arielbatoon.com
                  </Link>
                  .
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">7. Changes to this Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. Any changes will be posted on this page with the updated date at the top. We
                  encourage you to review this page periodically to stay informed.
                </p>
              </section>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
