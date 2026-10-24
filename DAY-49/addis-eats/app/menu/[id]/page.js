// app/menu/[id]/page.js — one page per dish, all prerendered at build time
// (generateStaticParams). dynamicParams = false: an unknown id is a 404
// straight from the CDN instead of a server render.

import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import DishTile from "@/components/DishTile";
import { card } from "@/components/styles";
import { formatETB } from "@/lib/format";
import { getDish, getDishes } from "@/lib/menu";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getDishes().map((dish) => ({ id: dish.id }));
}

export async function generateMetadata({ params }) {
  const dish = getDish((await params).id);
  if (!dish) return {};
  const description = `${dish.description} ${formatETB(dish.price)}.`;
  return {
    title: dish.name,
    description,
    alternates: { canonical: `/menu/${dish.id}` },
    openGraph: { title: `${dish.name} | Addis Eats`, description, url: `/menu/${dish.id}` },
  };
}

export default async function DishPage({ params }) {
  const dish = getDish((await params).id);
  if (!dish) notFound();

  // Structured data built from the same object as the visible page, so they cannot disagree.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    url: `${SITE_URL}/menu/${dish.id}`,
    offers: { "@type": "Offer", price: dish.price, priceCurrency: "ETB" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so a dish description can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <Link href="/menu" className="font-semibold text-brand-700 underline">← Back to the menu</Link>
      </nav>

      <article className={`${card} grid gap-8 p-6 md:grid-cols-2 md:p-8`}>
        <DishTile emoji={dish.emoji} size="lg" />
        <div className="flex flex-col">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{dish.category}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{dish.name}</h1>
          <p className="mt-4 text-lg text-muted">{dish.description}</p>
          <p className="mt-6 text-2xl font-bold">{formatETB(dish.price)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton dishId={dish.id} dishName={dish.name} />
            <Link href="/cart" className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-brand-700 underline">
              View cart
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
