import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Addis Eats",
  description: "Order delicious food in Addis Ababa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-amber-50 text-gray-800">
        <header className="bg-amber-600 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-90">
              🍽 Addis Eats
            </Link>

            <nav className="flex gap-6 text-sm font-medium">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/menu" className="hover:underline">Menu</Link>
              <Link href="/cart" className="hover:underline">Cart</Link>
              <Link href="/checkout" className="hover:underline">Checkout</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-amber-200 mt-16 py-6 text-center text-sm text-gray-500">
          © 2026 Addis Eats — Addis Ababa, Ethiopia
        </footer>
      </body>
    </html>
  );
}
