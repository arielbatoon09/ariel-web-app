import "@/styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/context/theme-provider";
import { CookiesBanner } from "@/components/common/cookies-banner";
import { QueryProvider } from "@/components/context/query-provider";
import { OG_IMAGE, SITE_TAGLINE, SITE_URL, DEFAULT_META_DESCRIPTION } from "@/constants/seo";

import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
  },
  title: {
    default: `Ariel Batoon — ${SITE_TAGLINE}`,
    template: "%s",
  },

  description: DEFAULT_META_DESCRIPTION,

  keywords: [
    "Ariel Batoon",
    "Software Engineer",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "React Native Developer",
    "Frontend Developer",
    "Backend Developer",
    "Freelance Developer",
    "SaaS Developer",
    "Web Developer Philippines",
    "Software Engineer Cebu",
    "Cebu Developer",
    "Philippines Developer",
  ],

  authors: [
    {
      name: "Ariel Batoon",
      url: SITE_URL,
    },
  ],

  creator: "Ariel Batoon",
  publisher: "Ariel Batoon",

  openGraph: {
    type: "website",
    locale: "en_PH",
    url: SITE_URL,
    siteName: "Ariel Batoon",
    title: `Ariel Batoon — ${SITE_TAGLINE}`,
    description: DEFAULT_META_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Ariel Batoon - Full-Stack Software Engineer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `Ariel Batoon — ${SITE_TAGLINE}`,
    description: DEFAULT_META_DESCRIPTION,
    creator: "@arielbatoon",
    images: [OG_IMAGE],
  },

  icons: {
    icon: [
      {
        url: "/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon/favicon.ico",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", fontMono.variable, "font-sans", geistSans.variable)}>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Analytics />
              <Toaster />
              <CookiesBanner />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
