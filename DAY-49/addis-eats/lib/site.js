// lib/site.js
// The public origin. metadataBase, the sitemap and robots.txt all read it, so
// og:image is always an absolute URL (a relative one breaks share previews).

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl().replace(/\/$/, "");
export const SITE_NAME = "Addis Eats";
export const SITE_DESCRIPTION =
  "Order Doro Wat, Kitfo, Tibs and fasting platters from Addis Eats and follow your delivery live across Addis Ababa.";
