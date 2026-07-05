import "@/styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/context/theme-provider";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  metadataBase: new URL("https://arielbatoon.com"),
  title: {
    default: "Ariel Batoon | Freelance Software Engineer & Web Developer in Cebu",
    template: "%s | Ariel Batoon - Software Engineer Cebu",
  },
  description: "Ariel Batoon is a premium freelance Software Engineer and Full-Stack Web Developer based in Cebu City, Philippines. Building high-performance SaaS, MVPs, and custom mobile apps for local and global clients.",
  keywords: [
    "Web Development Cebu",
    "AI Developer Cebu",
    "Mobile App Developer Cebu",
    "SaaS Developer Cebu",
    "Software Engineer Cebu",
    "Web Developer Cebu",
    "Freelance Developer Philippines",
    "React Developer Cebu",
    "Next.js Developer Cebu",
    "Ariel Batoon",
    "Cebu Web Design",
    "Startup MVP Developer",
  ],
  authors: [{ name: "Ariel Batoon", url: "https://arielbatoon.com" }],
  creator: "Ariel Batoon",
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://arielbatoon.com",
    title: "Ariel Batoon | Premium Software Engineer & Web Developer in Cebu",
    description: "Premium software engineering, custom SaaS platforms, and mobile apps built in Cebu City for global brands.",
    siteName: "Ariel Batoon Portfolio",
  },
  other: {
    "geo.region": "PH-7",
    "geo.placename": "Cebu City",
    "geo.position": "10.3157;123.8854",
    "ICBM": "10.3157, 123.8854",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

import { CrispChat } from "@/components/common/crisp-chat";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", fontMono.variable, "font-sans", geistSans.variable)}>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster />
            <CrispChat />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
