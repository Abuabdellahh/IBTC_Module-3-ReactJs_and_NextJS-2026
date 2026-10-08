// app/menu/[id]/page.js
// Dynamic route — handles /menu/kitfo, /menu/doro-wat, /menu/tibs, etc.
//
// generateMetadata() runs on the server and produces:
//   • Page title  →  "Kitfo · Addis Eats"
//   • Description →  "Kitfo — 320 ETB. Minced beef mixed with..."
//   • Canonical   →  https://addiseats.et/menu/kitfo
//   • Open Graph  →  title, description, image
//
// The page component produces:
//   • Visible HTML content
//   • JSON-LD structured data (MenuItem schema)
//
// Both generateMetadata() and the page component use the same getDish() call
// so the visible content and the metadata always agree.

import { notFound } from "next/navigation";
import Link from "next/link";
import { getDish } from "../../lib/dishes";

// ─── Dynamic Metadata ────────────────────────────────────────────────────────
// Next.js calls this before rendering the page.
// params is a Promise in current Next.js — always await it.

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return {
      title: "Dish not found",
      description: "The requested dish could not be found on Addis Eats.",
    };
  }

  return {
    // title.template in layout.js turns "Kitfo" → "Kitfo · Addis Eats"
    title: dish.name,

    // Unique, useful description — generated from real dish data
    description: `${dish.name} — ${dish.price} ETB. ${dish.summary}`,

    // Canonical URL — tells search engines the preferred URL for this dish
    alternates: {
      canonical: `/menu/${dish.id}`,
    },

    // Open Graph — controls how this URL looks when shared on social platforms
    openGraph: {
      title: `${dish.name} · Addis Eats`,
      description: `${dish.name} — ${dish.price} ETB. ${dish.summary}`,
      // metadataBase in layout.js resolves this to https://addiseats.et/images/kitfo.jpg
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

  // JSON-LD structured data — generated from the same dish object as the page.
  // This ensures the structured data always matches what is visible on the page.
  // Schema.org MenuItem type communicates to search engines what this page represents.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.summary,
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
    },
  };

  return (
    <main>
      {/* JSON-LD injected into the page — not visible to users, read by search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/menu" className="text-sm text-purple-600 hover:underline">
        ← Back to menu
      </Link>

      {/* Semantic article element — communicates this is a self-contained content item */}
      <article className="mt-6 max-w-lg rounded-xl border bg-white p-8 shadow-sm">
        <span className="text-xs font-medium uppercase tracking-wide text-purple-400">
          {dish.category}
        </span>

        {/* h1 matches the page title — consistent signal to search engines */}
        <h1 className="mt-1 text-3xl font-bold text-gray-900">{dish.name}</h1>

        <p className="mt-4 text-gray-600">{dish.summary}</p>

        <p className="mt-6 text-2xl font-bold text-purple-700">{dish.price} ETB</p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/cart"
            className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Add to Cart
          </Link>
          <Link
            href="/menu"
            className="rounded-lg border px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Menu
          </Link>
        </div>
      </article>

      {/* Verification hint — visible in dev, helps students confirm JSON-LD is present */}
      <details className="mt-8 max-w-lg rounded-lg border bg-gray-50 p-4 text-xs text-gray-500">
        <summary className="cursor-pointer font-medium text-purple-600">
          🔍 View JSON-LD structured data (dev helper)
        </summary>
        <pre className="mt-3 overflow-auto whitespace-pre-wrap text-gray-700">
          {JSON.stringify(jsonLd, null, 2)}
        </pre>
      </details>
    </main>
  );
}
