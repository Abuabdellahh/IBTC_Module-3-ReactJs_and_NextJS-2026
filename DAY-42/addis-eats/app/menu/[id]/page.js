// app/menu/[id]/page.js  — Public, no authentication required
import { dishes } from "@/lib/dishes";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MenuItemPage({ params }) {
  const { id } = await params;
  const dish = dishes.find((d) => d.id === Number(id));

  if (!dish) notFound();

  return (
    <main className="max-w-md">
      <Link href="/menu" className="text-sm text-purple-600 hover:underline">
        ← Back to menu
      </Link>

      <article className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <span className="text-xs font-medium uppercase tracking-wide text-purple-400">
          {dish.category}
        </span>
        <h1 className="mt-1 text-3xl font-bold">{dish.name}</h1>
        <p className="mt-3 text-gray-600">{dish.description}</p>
        <p className="mt-4 text-2xl font-bold text-purple-700">{dish.price} ETB</p>
      </article>
    </main>
  );
}
