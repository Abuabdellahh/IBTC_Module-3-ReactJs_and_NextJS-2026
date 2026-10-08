// app/page.js — Public homepage, server-rendered
// Uses title.default from layout: "Addis Eats"

import Link from "next/link";
import { getDishes } from "@/lib/dishes";

export default function HomePage() {
  const dishes = getDishes();

  return (
    <main>
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Addis Eats</h1>
        <p className="mt-3 max-w-xl text-lg text-gray-600">
          Discover Ethiopian dishes from kitchens across Addis Ababa.
          Order Kitfo, Doro Wat, Tibs and more — delivered to your door.
        </p>
        <p className="mt-2 text-xs text-purple-600">
          ✦ Day 45 — Production-Ready Next.js Integration
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/menu"
            className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Browse Menu →
          </Link>
          <Link
            href="/signin"
            className="rounded-lg border px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Featured Dishes</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.slice(0, 6).map((dish) => (
            <article
              key={dish.id}
              className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-purple-400">
                {dish.category}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">{dish.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{dish.description}</p>
              <p className="mt-3 font-bold text-purple-700">{dish.price} ETB</p>
              <Link
                href={`/menu/${dish.id}`}
                className="mt-3 inline-block text-sm text-purple-600 hover:underline"
              >
                View dish →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-purple-700">🔍 Search Menu</h3>
          <p className="mt-1 text-sm text-gray-500">
            Debounced SWR search — no request per keystroke
          </p>
          <Link href="/menu" className="mt-3 inline-block text-sm text-purple-600 hover:underline">
            Open menu →
          </Link>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-purple-700">📦 Live Order Status</h3>
          <p className="mt-1 text-sm text-gray-500">
            Server initial data + SWR polling every 5 s
          </p>
          <Link href="/orders" className="mt-3 inline-block text-sm text-purple-600 hover:underline">
            View orders →
          </Link>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-purple-700">🔒 Secure Checkout</h3>
          <p className="mt-1 text-sm text-gray-500">
            Middleware + page + action — three protection layers
          </p>
          <Link href="/checkout" className="mt-3 inline-block text-sm text-purple-600 hover:underline">
            Checkout →
          </Link>
        </div>
      </section>
    </main>
  );
}
