import "@/styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/context/theme-provider";

import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  metadataBase: new URL("https://www.arielbatoon.com"),
  robots: {
    index: true,
    follow: true,
  },
  title: {
    default: "Ariel Batoon — Software Engineer",
    template: "Ariel Batoon — %s",
  },

  description:
    "Full-Stack Software Engineer and Indie Builder based in Cebu, Philippines. Building scalable AI-powered MVPs, web, and mobile apps worldwide.",

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
      url: "https://arielbatoon.com",
    },
  ],

  creator: "Ariel Batoon",

  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://arielbatoon.com",
    siteName: "Ariel Batoon",
    title: "Ariel Batoon | Full-Stack Software Engineer & Indie Builder",
    description:
      "Full-Stack Software Engineer and Indie Builder based in Cebu, Philippines. Building scalable AI-powered MVPs, web, and mobile apps worldwide.",
    images: [
      {
        url: "https://pub-b7ccab85e4b540fcaab7ba577789da5d.r2.dev/ariel-web-app/manual/ariel-batoon-banner-logo.png",
        width: 1200,
        height: 630,
        alt: "Ariel Batoon - Full-Stack Software Engineer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ariel Batoon | Full-Stack Software Engineer & Indie Builder",
    description:
      "Full-Stack Software Engineer and Indie Builder based in Cebu, Philippines. Building scalable AI-powered MVPs, web, and mobile apps worldwide.",
    creator: "@arielbatoon",
    images: ["https://pub-b7ccab85e4b540fcaab7ba577789da5d.r2.dev/ariel-web-app/manual/ariel-batoon-banner-logo.png"],
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

import { CrispChat } from "@/components/common/crisp-chat";
import { CookiesBanner } from "@/components/common/cookies-banner";
import { QueryProvider } from "@/components/context/query-provider";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", fontMono.variable, "font-sans", geistSans.variable)}>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Analytics />
              <Toaster />
              <CrispChat />
              <CookiesBanner />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
