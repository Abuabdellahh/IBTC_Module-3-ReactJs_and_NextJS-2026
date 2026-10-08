// app/page.js
// Homepage — no metadata export needed here.
// Next.js uses title.default from the root layout:
//   "Addis Eats — Ethiopian food delivery in Addis Ababa"

import Link from "next/link";
import { getDishes } from "./lib/dishes";

export default function HomePage() {
  const dishes = getDishes();

  return (
    <main>
      {/* Semantic heading — communicates page purpose to browsers and crawlers */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Addis Eats</h1>
        <p className="mt-3 max-w-xl text-lg text-gray-600">
          Discover Ethiopian dishes from kitchens across Addis Ababa.
          Order Kitfo, Doro Wat, Tibs and more — delivered to your door.
        </p>
        <p className="mt-2 text-xs text-purple-600">
          ✦ Day 44 — Metadata, Social Sharing &amp; SEO
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
        >
          Browse the Menu →
        </Link>
      </section>

      {/* Featured dishes — server-rendered, crawlable content */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Featured Dishes</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <article
              key={dish.id}
              className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-purple-400">
                {dish.category}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">{dish.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{dish.summary}</p>
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
    </main>
  );
}
