// app/sitemap.js — served at /sitemap.xml
// Generated from getDishes() so new dishes are automatically included.
// Private routes (/cart, /checkout, /orders, /kitchen) are excluded.

import { getDishes } from "@/lib/dishes";

export default function sitemap() {
  const dishes = getDishes();

  return [
    { url: "https://addiseats.et/",    lastModified: new Date(), priority: 1.0 },
    { url: "https://addiseats.et/menu", lastModified: new Date(), priority: 0.8 },
    ...dishes.map((dish) => ({
      url: `https://addiseats.et/menu/${dish.id}`,
      lastModified: new Date(),
      priority: 0.7,
    })),
  ];
}
