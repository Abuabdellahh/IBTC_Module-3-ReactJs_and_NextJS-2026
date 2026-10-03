import "./globals.css";
import Link from "next/link";
import Providers from "./providers";

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food ordering — data fetching with SWR and TanStack Query",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Providers>
          <header className="border-b bg-white shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-xl font-bold text-purple-700">
                🍽 Addis Eats
              </Link>

              <nav className="flex gap-6 text-sm font-medium">
                <Link href="/" className="hover:text-purple-600">Home</Link>
                <Link href="/menu" className="hover:text-purple-600">Menu</Link>
                <Link href="/orders/1001" className="hover:text-purple-600">Order #1001</Link>
                <Link href="/orders/1002" className="hover:text-purple-600">Order #1002</Link>
                <Link href="/cart" className="hover:text-purple-600">Cart</Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>

          <footer className="mt-16 border-t py-6 text-center text-sm text-gray-400">
            © 2026 Addis Eats — Day 41 · SWR & TanStack Query
          </footer>
        </Providers>
      </body>
    </html>
  );
}
