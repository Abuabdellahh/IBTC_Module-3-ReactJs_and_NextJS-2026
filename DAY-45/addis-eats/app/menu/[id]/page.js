// app/menu/[id]/page.js
// Dynamic route — /menu/kitfo, /menu/doro-wat, etc.
// generateMetadata() produces per-dish title, description, canonical URL and OG.
// JSON-LD structured data is generated from the same dish object as the page.

import { notFound } from "next/navigation";
import Link from "next/link";
import { getDish } from "@/lib/dishes";

// ─── Dynamic Metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return { title: "Dish not found", description: "The requested dish could not be found." };
  }

  return {
    title: dish.name,
    description: `${dish.name} — ${dish.price} ETB. ${dish.description}`,
    alternates: { canonical: `/menu/${dish.id}` },
    openGraph: {
      title: `${dish.name} | Addis Eats`,
      description: `${dish.name} — ${dish.price} ETB. ${dish.description}`,
      images: [dish.image],
      type: "website",
    },
  };
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) notFound();

  // JSON-LD generated from the same dish object — always matches visible content
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/menu" className="text-sm text-purple-600 hover:underline">
        ← Back to menu
      </Link>

      <article className="mt-6 max-w-lg rounded-xl border bg-white p-8 shadow-sm">
        <span className="text-xs font-medium uppercase tracking-wide text-purple-400">
          {dish.category}
        </span>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">{dish.name}</h1>
        <p className="mt-4 text-gray-600">{dish.description}</p>
        <p className="mt-6 text-2xl font-bold text-purple-700">{dish.price} ETB</p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/cart"
            className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Add to Cart
          </Link>
          <Link
            href="/checkout"
            className="rounded-lg border px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Checkout
          </Link>
        </div>
      </article>
    </main>
  );
}
