# SEO.md — Addis Eats Metadata, Social Sharing & SEO Map

## Day 44 — Complete SEO Architecture

---

## File Responsibilities

| File | SEO Responsibility |
|------|--------------------|
| `app/layout.js` | Site-wide metadata: title template, description, metadataBase |
| `app/page.js` | Uses `title.default` — no export needed |
| `app/menu/page.js` | Static metadata + canonical URL + Open Graph |
| `app/menu/[id]/page.js` | `generateMetadata()` + JSON-LD structured data |
| `app/menu/[id]/opengraph-image.js` | Dynamic per-dish OG image (1200×630) |
| `app/opengraph-image.js` | Site-wide fallback OG image |
| `app/sitemap.js` | `/sitemap.xml` — generated from dish data |
| `app/robots.js` | `/robots.txt` — crawler rules + sitemap link |
| `app/cart/page.js` | `robots: { index: false }` — not indexed |
| `app/checkout/page.js` | `robots: { index: false }` — not indexed |

---

## Title Template Flow

```
Root layout:
  title.template = "%s · Addis Eats"
  title.default  = "Addis Eats — Ethiopian food delivery in Addis Ababa"

/              → "Addis Eats — Ethiopian food delivery in Addis Ababa"  (default)
/menu          → "Menu · Addis Eats"                                    (template)
/menu/kitfo    → "Kitfo · Addis Eats"                                   (template)
/menu/doro-wat → "Doro Wat · Addis Eats"                                (template)
/cart          → "Cart · Addis Eats"                                    (template)
/checkout      → "Checkout · Addis Eats"                                (template)
```

---

## metadataBase

```js
metadataBase: new URL("https://addiseats.et")
```

Resolves relative image paths to absolute URLs:
- `"/images/kitfo.jpg"` → `"https://addiseats.et/images/kitfo.jpg"`

Required for Open Graph images to work correctly on social platforms.

---

## Metadata Types Used

| Type | Where | Purpose |
|------|-------|---------|
| Static `export const metadata` | `/menu` | Known at build time |
| Dynamic `generateMetadata()` | `/menu/[id]` | Depends on dish data |
| File convention `opengraph-image.js` | `/menu/[id]` | Auto-wired OG image |
| File convention `opengraph-image.js` | `/` (root) | Site-wide fallback |
| File convention `sitemap.js` | root | `/sitemap.xml` |
| File convention `robots.js` | root | `/robots.txt` |

---

## Open Graph Image Sizes

All OG images use `1200 × 630` — the standard aspect ratio supported by:
- Telegram
- WhatsApp
- Facebook / Instagram
- Twitter / X
- LinkedIn

---

## JSON-LD Schema

Each dish page includes `MenuItem` structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "MenuItem",
  "name": "Kitfo",
  "description": "Minced beef mixed with mitmita and Ethiopian spices.",
  "offers": {
    "@type": "Offer",
    "price": 320,
    "priceCurrency": "ETB"
  }
}
```

**Rule:** JSON-LD must always match the visible page content.
Both are generated from the same `dish` object — they cannot contradict each other.

---

## Sitemap Coverage

| URL | Priority | Included? |
|-----|----------|-----------|
| `https://addiseats.et/` | 1.0 | ✅ |
| `https://addiseats.et/menu` | 0.8 | ✅ |
| `https://addiseats.et/menu/kitfo` | 0.7 | ✅ |
| `https://addiseats.et/menu/doro-wat` | 0.7 | ✅ |
| `https://addiseats.et/menu/tibs` | 0.7 | ✅ |
| `https://addiseats.et/menu/shiro` | 0.7 | ✅ |
| `https://addiseats.et/cart` | — | ❌ personal |
| `https://addiseats.et/checkout` | — | ❌ transactional |

New dishes added to `getDishes()` are **automatically** included in the sitemap.

---

## Robots Rules

```
User-Agent: *
Allow: /
Disallow: /cart
Disallow: /checkout

Sitemap: https://addiseats.et/sitemap.xml
```

**⚠️ Important:** `robots.txt` is a crawling hint, NOT a security mechanism.
Private pages must be protected with authentication (see Day 42).

---

## Canonical URLs

| Page | Canonical |
|------|-----------|
| `/menu` | `https://addiseats.et/menu` |
| `/menu/kitfo` | `https://addiseats.et/menu/kitfo` |
| `/menu/doro-wat` | `https://addiseats.et/menu/doro-wat` |

Canonical URLs prevent duplicate-content issues when the same page is
accessible via multiple URLs (e.g. `/menu?ref=telegram` vs `/menu`).

---

## Verification Checklist

- [ ] Browser tab shows `Kitfo · Addis Eats` on `/menu/kitfo`
- [ ] `<title>` tag present in generated HTML
- [ ] `<meta name="description">` present in generated HTML
- [ ] `<link rel="canonical">` present with correct absolute URL
- [ ] `<meta property="og:title">` present
- [ ] `<meta property="og:description">` present
- [ ] `<meta property="og:image">` present with absolute URL
- [ ] `/sitemap.xml` returns valid XML with all dish URLs
- [ ] `/robots.txt` contains disallow rules for `/cart` and `/checkout`
- [ ] `/menu/kitfo/opengraph-image` returns a 1200×630 PNG
- [ ] JSON-LD `<script type="application/ld+json">` present in dish page HTML
- [ ] JSON-LD price matches the visible price on the page

---

## Key Rules

1. **Metadata in Server Components only** — never `"use client"` + `export const metadata`
2. **Always `await params`** — `const { id } = await params` in current Next.js
3. **Same data source** — page content and metadata both use `getDish(id)`
4. **`metadataBase` required** — relative image paths won't resolve without it
5. **robots.txt ≠ security** — authentication protects private routes
6. **Sitemap = public pages only** — never include `/cart`, `/checkout`, `/account`
