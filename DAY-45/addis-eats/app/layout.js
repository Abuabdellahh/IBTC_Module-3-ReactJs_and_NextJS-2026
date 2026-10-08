// app/layout.js
// Root layout — site-wide metadata + auth-aware navigation.
//
// title.template  → child pages supply %s → "Kitfo | Addis Eats"
// title.default   → used by homepage
// metadataBase    → resolves relative OG image paths to absolute URLs

import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/session";

export const metadata = {
  title: {
    default: "Addis Eats",
    template: "%s | Addis Eats",
  },
  description:
    "Order delicious Ethiopian food from Addis Eats. Kitfo, Doro Wat, Tibs and more delivered across Addis Ababa.",
  metadataBase: new URL("https://addiseats.et"),
  openGraph: {
    siteName: "Addis Eats",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold text-purple-700">
              🍽 Addis Eats
            </Link>

            <nav className="flex items-center gap-5 text-sm font-medium">
              <Link href="/" className="hover:text-purple-600">Home</Link>
              <Link href="/menu" className="hover:text-purple-600">Menu</Link>
              <Link href="/cart" className="hover:text-purple-600">Cart</Link>

              {session && (
                <>
                  <Link href="/orders" className="hover:text-purple-600">Orders</Link>
                  <Link href="/checkout" className="hover:text-purple-600">Checkout</Link>
                </>
              )}

              {/* Kitchen link is a UI convenience — server enforces the role check */}
              {session?.role === "staff" && (
                <Link href="/kitchen" className="hover:text-purple-600">Kitchen</Link>
              )}

              {session ? (
                <form action="/api/signout" method="post">
                  <button
                    type="submit"
                    className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
                  >
                    Sign out
                  </button>
                </form>
              ) : (
                <Link
                  href="/signin"
                  className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
                >
                  Sign in
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>

        <footer className="mt-16 border-t py-6 text-center text-sm text-gray-400">
          © 2026 Addis Eats — Day 45 · Production-Ready Next.js
        </footer>
      </body>
    </html>
  );
}
