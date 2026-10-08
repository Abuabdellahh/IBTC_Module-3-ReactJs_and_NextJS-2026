// app/sitemap.js
// Next.js file convention — automatically served at /sitemap.xml
//
// Generated from getDishes() so adding a new dish automatically adds its URL.
// Private routes (/cart, /checkout) are intentionally excluded — they have
// no value for search engine discovery.

import { getDishes } from "./lib/dishes";

export default function sitemap() {
  const dishes = getDishes();

  return [
    {
      url: "https://addiseats.et/",
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: "https://addiseats.et/menu",
      lastModified: new Date(),
      priority: 0.8,
    },
    // Each dish page is generated from data — no manual maintenance needed
    ...dishes.map((dish) => ({
      url: `https://addiseats.et/menu/${dish.id}`,
      lastModified: new Date(),
      priority: 0.7,
    })),
  ];
}
