import Link from "next/link";

export default function HomePage() {
  return (
    <section className="text-center py-16">
      <h2 className="text-4xl font-bold text-amber-700 mb-4">
        Welcome to Addis Eats
      </h2>

      <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
        Discover authentic Ethiopian cuisine and order your favourite dishes
        delivered straight to your door in Addis Ababa.
      </p>

      <Link
        href="/menu"
        className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
      >
        View Menu →
      </Link>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
        {[
          { emoji: "🍽", title: "Authentic Recipes", body: "Traditional Ethiopian dishes prepared with the finest spices." },
          { emoji: "⚡", title: "Fast Delivery", body: "Hot food at your door within 30 minutes across Addis Ababa." },
          { emoji: "💳", title: "Easy Payment", body: "Pay with Telebirr, CBE Birr, or cash on delivery." },
        ].map(({ emoji, title, body }) => (
          <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
            <div className="text-3xl mb-3">{emoji}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
