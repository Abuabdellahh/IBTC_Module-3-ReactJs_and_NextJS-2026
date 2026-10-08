// app/page.js  — Public home page, no authentication required
import Link from "next/link";
import { dishes } from "@/lib/dishes";

export default function HomePage() {
  return (
    <main>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Addis Eats</h1>
        <p className="mt-2 text-gray-500">Ethiopian food delivered to your door.</p>
        <p className="mt-1 text-xs text-purple-600">
          ✦ Day 42 — Authentication &amp; Authorization
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <article key={dish.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">{dish.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{dish.description}</p>
            <p className="mt-3 font-bold text-purple-700">{dish.price} ETB</p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <Link href="/menu" className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-purple-700">🔍 View Menu</h3>
          <p className="mt-1 text-sm text-gray-500">Public — no sign-in needed</p>
        </Link>

        <Link href="/orders" className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-purple-700">📦 My Orders</h3>
          <p className="mt-1 text-sm text-gray-500">Private — requires sign-in</p>
        </Link>

        <Link href="/kitchen" className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-purple-700">👨‍🍳 Kitchen</h3>
          <p className="mt-1 text-sm text-gray-500">Staff only — role required</p>
        </Link>
      </div>
    </main>
  );
}
