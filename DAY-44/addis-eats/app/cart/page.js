// app/cart/page.js
// Cart is a personal, transactional page.
// It has metadata for the browser tab but is excluded from sitemap and robots.

export const metadata = {
  title: "Cart",
  description: "Review your selected dishes before placing an order.",
  // No canonical — this page should not be indexed
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <main className="max-w-lg">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Your Cart</h1>
      <p className="mb-6 text-sm text-gray-500">
        Review your selected dishes before placing an order.
      </p>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-gray-500">Your cart is empty.</p>
        <a
          href="/menu"
          className="mt-4 inline-block text-sm text-purple-600 hover:underline"
        >
          Browse the menu →
        </a>
      </div>
    </main>
  );
}
