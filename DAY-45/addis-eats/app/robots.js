// app/robots.js — served at /robots.txt
// robots.txt is a crawling HINT, not a security mechanism.
// Private routes must be protected with authentication (see middleware.js).

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout/", "/orders/", "/kitchen/", "/cart/"],
    },
    sitemap: "https://addiseats.et/sitemap.xml",
  };
}
