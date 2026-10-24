// app/robots.js → /robots.txt
// A crawling hint, not security: the private routes are protected by
// proxy.js, the page checks and the actions — robots.txt just keeps them out of search.

import { SITE_URL } from "@/lib/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cart", "/checkout", "/orders", "/kitchen", "/signin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
