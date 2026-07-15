import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";

export const metadata = {
  title: "Cookies Policy | Ariel Batoon - Software Engineer",
  description: "Cookies Policy for Ariel Batoon's website. Understand what cookies we use and how to manage them. Last updated July 6, 2026.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiesPage() {
  return (
    <Section id="cookies-policy" containerClassName="pt-6 md:pt-10 pb-12 md:pb-16" showTopLine={false} showBottomLine={true}>
      <div className="space-y-12">
        <SectionHeading label="Legal" title="Cookies Policy" description="Last updated: July 6, 2026" />

        <div className="max-w-3xl border-t border-dashed border-neutral-300 pt-8 dark:border-neutral-700">
          <div className="prose prose-neutral dark:prose-invert space-y-8 font-sans text-sm leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">1. What Are Cookies</h2>
              <p>
                Cookies are small text files stored on your computer or mobile device when you visit websites. They are widely used to make websites
                work, or work more efficiently, as well as to provide information to the owners of the site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">2. How We Use Cookies</h2>
              <p>We use cookies to enhance your experience when using our site. Specifically, cookies allow us to:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Remember your interface preference settings (such as light or dark theme choice).</li>
                <li>Support interactive chat features (via Crisp Chat) so you can communicate with us easily.</li>
                <li>Analyze website traffic and behavior patterns to help improve our content and performance.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">3. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-1 text-xs font-bold text-foreground">Essential / Strictly Necessary Cookies</h3>
                  <p>
                    These cookies are essential for the operation of the site, enabling page navigation, layout configurations, and fundamental
                    security protections. The website cannot function correctly without these.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-xs font-bold text-foreground">Functionality Cookies</h3>
                  <p>
                    These cookies are used to recognize you and remember your preferences when you return to our website (for example, whether you
                    have configured dark mode or closed notifications).
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-xs font-bold text-foreground">Analytical & Performance Cookies</h3>
                  <p>
                    These allow us to track visitor counts and see how users navigate around the site. This helps us optimize performance, ensuring
                    that visitors can easily find the content they are seeking.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">4. Third-Party Cookies</h2>
              <p>
                Please note that third parties (such as live chat providers or scheduling services) may also place cookies on your device. We do not
                control these cookies. Third-party tools on our website include:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <strong>Crisp Chat:</strong> Set cookies to enable persistence in chat sessions so that your conversation history is preserved
                  during your visits.
                </li>
                <li>
                  <strong>Cal.com:</strong> May set cookies when rendering inline booking pages to manage session booking states.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">5. How to Control and Delete Cookies</h2>
              <p>
                You can manage or decline non-essential cookies via our built-in consent banner. Additionally, most web browsers allow you to control
                cookies through their settings. You can configure your browser to block all cookies or to alert you when a cookie is placed.
              </p>
              <p>
                Please note that if you choose to disable cookies, some features of this website (such as the interactive live chat support or theme
                toggle memory) may not function as intended.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Section>
  );
}
