// app/layout.js
// Root layout — defines site-wide metadata inherited by every page.
//
// title.template  → child pages supply %s, Next.js appends " · Addis Eats"
// title.default   → used when a child page supplies no title (e.g. homepage)
// metadataBase    → resolves relative image paths to absolute URLs for OG tags

import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: {
    template: "%s · Addis Eats",
    default: "Addis Eats — Ethiopian food delivery in Addis Ababa",
  },
  description:
    "Discover Ethiopian dishes from kitchens across Addis Ababa. Order Kitfo, Doro Wat, Tibs and more.",
  metadataBase: new URL("https://addiseats.et"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold text-purple-700">
              🍽 Addis Eats
            </Link>
            <nav className="flex gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-purple-600">Home</Link>
              <Link href="/menu" className="hover:text-purple-600">Menu</Link>
              <Link href="/cart" className="hover:text-purple-600">Cart</Link>
              <Link href="/checkout" className="hover:text-purple-600">Checkout</Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>

        <footer className="mt-16 border-t py-6 text-center text-sm text-gray-400">
          © 2026 Addis Eats — Day 44 · Metadata, Social Sharing &amp; SEO
        </footer>
      </body>
    </html>
  );
}
