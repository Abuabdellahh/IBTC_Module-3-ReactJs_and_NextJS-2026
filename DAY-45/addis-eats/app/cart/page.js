// app/cart/page.js
// Server Component shell — only CartClient needs "use client" (uses localStorage).
// robots: { index: false } — cart is personal, not for search engines.

import CartClient from "@/components/CartClient";

export const metadata = {
  title: "Cart",
  description: "Review your selected dishes before placing an order.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <main className="max-w-lg">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Your Cart</h1>
      <p className="mb-6 text-xs text-purple-600">
        ✦ Cart state lives in the browser — Server Component shell, Client Component cart
      </p>
      <CartClient />
    </main>
  );
}
