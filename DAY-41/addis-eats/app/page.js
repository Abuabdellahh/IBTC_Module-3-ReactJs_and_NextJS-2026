import Link from "next/link";
import { dishes } from "@/lib/dishes";

// Server Component — reads data directly, no useEffect, no fetch()
export default function HomePage() {
  return (
    <section>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Addis Eats</h1>
        <p className="mt-2 text-gray-500">
          Ethiopian food delivered to your door.
        </p>
        <p className="mt-1 text-xs text-purple-600">
          ✦ This page is a Server Component — data is read directly, no browser fetch needed.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <article
            key={dish.id}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{dish.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{dish.description}</p>
            <p className="mt-3 font-bold text-purple-700">{dish.price} ETB</p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <Link
          href="/menu"
          className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-purple-700">🔍 Search Menu</h3>
          <p className="mt-1 text-sm text-gray-500">
            Debounced search + pagination with SWR
          </p>
        </Link>

        <Link
          href="/orders/1001"
          className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-purple-700">📦 Live Order Status</h3>
          <p className="mt-1 text-sm text-gray-500">
            Server seed + SWR polling every 5 s
          </p>
        </Link>

        <Link
          href="/cart"
          className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-purple-700">🛒 Cart</h3>
          <p className="mt-1 text-sm text-gray-500">
            TanStack Query mutation + cache invalidation
          </p>
        </Link>
      </div>
    </section>
  );
}
