// app/layout.js — root layout. Static on purpose: no cookies, no headers.
// Anything personal (cart count, account menu) is a small Client Component
// inside SiteHeader, so /, /menu and /menu/[id] can be prerendered.

import { Geist } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });

export const metadata = {
  // Without metadataBase, og:image would be relative and share cards lose their picture.
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Ethiopian food, delivered`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_ET", url: "/" },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport = {
  themeColor: "#b3311d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-ink px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 outline-none sm:px-6 sm:py-12">
          {children}
        </main>
        <footer className="border-t border-line bg-surface">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-6 text-sm text-muted sm:px-6">
            <p>© {new Date().getFullYear()} Addis Eats · Bole, Addis Ababa</p>
            <p>IBT College · Module 3 capstone</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
