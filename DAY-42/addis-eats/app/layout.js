// app/layout.js
import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food — Day 42 · Authentication & Authorization",
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

            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-purple-600">Home</Link>
              <Link href="/menu" className="hover:text-purple-600">Menu</Link>
              <Link href="/orders" className="hover:text-purple-600">Orders</Link>
              <Link href="/checkout" className="hover:text-purple-600">Checkout</Link>

              {session?.role === "staff" && (
                <Link href="/kitchen" className="hover:text-purple-600">Kitchen</Link>
              )}

              {session ? (
                <form action="/api/signout" method="post">
                  <button
                    type="submit"
                    className="rounded bg-purple-600 px-3 py-1 text-white hover:bg-purple-700"
                  >
                    Sign out ({session.userId})
                  </button>
                </form>
              ) : (
                <Link
                  href="/signin"
                  className="rounded bg-purple-600 px-3 py-1 text-white hover:bg-purple-700"
                >
                  Sign in
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>

        <footer className="mt-16 border-t py-6 text-center text-sm text-gray-400">
          © 2026 Addis Eats — Day 42 · Authentication &amp; Authorization
        </footer>
      </body>
    </html>
  );
}
