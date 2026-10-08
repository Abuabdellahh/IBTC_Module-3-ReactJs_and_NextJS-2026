// app/menu/page.js  — Public, no authentication required
import Link from "next/link";
import { dishes } from "@/lib/dishes";

export default function MenuPage() {
  return (
    <main>
      <h1 className="mb-2 text-3xl font-bold">Menu</h1>
      <p className="mb-6 text-xs text-purple-600">
        ✦ Public route — anyone can browse without signing in
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <article key={dish.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-purple-400">
              {dish.category}
            </span>
            <h2 className="mt-1 text-lg font-semibold">{dish.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{dish.description}</p>
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
