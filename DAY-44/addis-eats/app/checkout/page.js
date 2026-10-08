// app/checkout/page.js
// Checkout is a transactional page — excluded from sitemap and robots.
// robots: { index: false } reinforces the robots.txt disallow rule.
// NOTE: robots metadata is not a security mechanism — real protection
// requires authentication (see Day 42).

export const metadata = {
  title: "Checkout",
  description: "Complete your Addis Eats order.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <main className="max-w-lg">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Checkout</h1>
      <p className="mb-6 text-sm text-gray-500">
        Complete your order below.
      </p>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-gray-500">No items in your cart yet.</p>
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
