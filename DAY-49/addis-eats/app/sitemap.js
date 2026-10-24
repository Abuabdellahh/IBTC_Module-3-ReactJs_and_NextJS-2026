// app/sitemap.js → /sitemap.xml — public routes only, generated from the catalogue.

import { getDishes } from "@/lib/menu";
import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/menu`, changeFrequency: "weekly", priority: 0.9 },
    ...getDishes().map((dish) => ({
      url: `${SITE_URL}/menu/${dish.id}`,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
    { url: `${SITE_URL}/signup`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
