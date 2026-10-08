// app/menu/page.js
// Static metadata — title is known at build time, no data needed.
// title: "Menu" → template produces "Menu · Addis Eats" in the browser tab.
// alternates.canonical → tells search engines the preferred URL for this page.

import Link from "next/link";
import { getDishes } from "../lib/dishes";

export const metadata = {
  title: "Menu",
  description:
    "Explore Doro Wat, Tibs, Kitfo, Shiro and other Ethiopian dishes available from Addis Eats.",
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    title: "Menu · Addis Eats",
    description:
      "Explore Doro Wat, Tibs, Kitfo, Shiro and other Ethiopian dishes available from Addis Eats.",
    type: "website",
  },
};

export default function MenuPage() {
  const dishes = getDishes();

  return (
    <main>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Addis Eats Menu</h1>
      <p className="mb-8 text-gray-600">
        Explore Ethiopian dishes available for delivery across Addis Ababa.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <article
            key={dish.id}
            className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-purple-400">
              {dish.category}
            </span>
            <h2 className="mt-1 text-lg font-semibold text-gray-900">{dish.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{dish.summary}</p>
            <p className="mt-3 font-bold text-purple-700">{dish.price} ETB</p>
            <Link
              href={`/menu/${dish.id}`}
              className="mt-3 inline-block text-sm text-purple-600 hover:underline"
            >
              View details →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
