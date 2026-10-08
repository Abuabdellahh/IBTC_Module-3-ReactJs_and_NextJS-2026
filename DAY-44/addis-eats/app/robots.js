// app/robots.js
// Next.js file convention — automatically served at /robots.txt
//
// IMPORTANT: robots.txt is a crawling hint, NOT a security mechanism.
// /cart and /checkout must be protected by authentication in the application.
// Listing them here only tells compliant crawlers not to index them.

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Exclude personal/transactional pages from crawling
      disallow: ["/cart", "/checkout"],
    },
    sitemap: "https://addiseats.et/sitemap.xml",
  };
}
