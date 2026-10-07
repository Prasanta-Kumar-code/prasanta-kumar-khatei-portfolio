import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { BackToTop } from "@/components/layout/back-to-top";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { MotionProvider } from "@/components/shared/motion-provider";
import { profile, siteOrigin } from "@/lib/data/profile";
import { allJsonLd } from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const title = `${profile.name} — ${profile.shortRole}`;
const description = profile.summary;

export const metadata: Metadata = {
  // Origin only, with no base path: Next.js already prefixes its own routes
  // and assets with `basePath`, so including it here double-prefixes them.
  metadataBase: new URL(siteOrigin),
  title: {
    default: title,
    template: `%s | ${profile.name}`,
  },
  description,
  keywords: [
    "Adobe Experience Manager",
    "AEM Developer",
    "AEM 6.5",
    "Senior AEM Developer",
    "React Developer",
    "Frontend Engineer",
    "Adobe Analytics",
    "Bangalore",
    "India",
    "AEM Consultant",
    "Headless CMS",
    "TypeScript",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  // Absolute for the same reason — a relative "/" would drop the base path.
  alternates: { canonical: `${profile.siteUrl}/` },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: profile.siteUrl,
    siteName: profile.name,
    title,
    description,
    images: [
      {
        url: `${profile.siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.shortRole}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${profile.siteUrl}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <MotionProvider>
            <a
              href="#main-content"
              className="focus-ring sr-only left-4 top-4 z-[100] rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:absolute"
            >
              Skip to main content
            </a>

            <Navbar />

            <main id="main-content" tabIndex={-1} className="relative isolate">
              {children}
            </main>

            <Footer />
            <BackToTop />
          </MotionProvider>
        </ThemeProvider>

        {allJsonLd.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </body>
    </html>
  );
}
