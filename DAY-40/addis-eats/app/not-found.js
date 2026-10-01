import Link from "next/link";

export default function NotFound() {
  return (
    <section className="text-center py-20">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-3xl font-bold text-gray-700 mb-3">Page Not Found</h2>
      <p className="text-gray-500 mb-8">
        Sorry, the page you requested does not exist.
      </p>
      <Link
        href="/menu"
        className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
      >
        Return to Menu
      </Link>
    </section>
  );
}
