# Addis Eats — Day 44: Metadata, Social Sharing & SEO

> **Module 3 — React & Next.js · IBT 2026**
> Built on top of the Addis Eats application from previous days.

---

## What This Project Covers

This project adds a complete SEO and social-sharing foundation to the Addis Eats Next.js application. Every concept is implemented step by step, from basic page titles all the way to dynamic Open Graph images and JSON-LD structured data.

| Topic | Implemented |
|-------|-------------|
| Site-wide metadata (title template, description) | ✅ |
| `metadataBase` for absolute URL resolution | ✅ |
| Static metadata on `/menu` | ✅ |
| Dynamic `generateMetadata()` on `/menu/[id]` | ✅ |
| Canonical URLs | ✅ |
| Site-wide Open Graph image | ✅ |
| Per-dish dynamic Open Graph image (1200×630) | ✅ |
| JSON-LD structured data (`MenuItem` schema) | ✅ |
| `sitemap.js` → `/sitemap.xml` | ✅ |
| `robots.js` → `/robots.txt` | ✅ |
| Semantic HTML throughout | ✅ |
| Server Component / Client Component separation | ✅ |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
├── layout.js                    ← Site-wide metadata + title template
├── page.js                      ← Homepage (uses title.default)
├── opengraph-image.js           ← Site-wide OG image (1200×630)
├── sitemap.js                   ← /sitemap.xml — generated from dish data
├── robots.js                    ← /robots.txt — crawler rules
├── globals.css
│
├── lib/
│   └── dishes.js                ← Single source of truth for all dish data
│
├── menu/
│   ├── page.js                  ← Static metadata + canonical URL
│   └── [id]/
│       ├── page.js              ← generateMetadata() + JSON-LD
│       └── opengraph-image.js   ← Dynamic per-dish OG image
│
├── cart/
│   └── page.js                  ← robots: { index: false }
│
└── checkout/
    └── page.js                  ← robots: { index: false }
```

---

## Routes

| Route | Public | Auth Required | Indexed |
|-------|--------|---------------|---------|
| `/` | ✅ | No | ✅ |
| `/menu` | ✅ | No | ✅ |
| `/menu/kitfo` | ✅ | No | ✅ |
| `/menu/doro-wat` | ✅ | No | ✅ |
| `/menu/tibs` | ✅ | No | ✅ |
| `/menu/shiro` | ✅ | No | ✅ |
| `/cart` | ✅ | No | ❌ |
| `/checkout` | ✅ | No | ❌ |
| `/sitemap.xml` | ✅ | No | — |
| `/robots.txt` | ✅ | No | — |

---

## Key Concepts

### 1. Title Template

Defined once in `app/layout.js`:

```js
title: {
  template: "%s · Addis Eats",
  default: "Addis Eats — Ethiopian food delivery in Addis Ababa",
}
```

Child pages supply only their own title:

```js
// app/menu/page.js
export const metadata = { title: "Menu" };
// → "Menu · Addis Eats"
```

Dynamic pages use `generateMetadata()`:

```js
// app/menu/[id]/page.js
export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  return { title: dish.name };
  // → "Kitfo · Addis Eats"
}
```

---

### 2. metadataBase

```js
metadataBase: new URL("https://addiseats.et")
```

Converts relative image paths to absolute URLs so Open Graph images work on social platforms:

```
"/images/kitfo.jpg"  →  "https://addiseats.et/images/kitfo.jpg"
```

---

### 3. Static vs Dynamic Metadata

| Approach | When to use | Example |
|----------|-------------|---------|
| `export const metadata = {}` | Title known at build time | `/menu` |
| `export async function generateMetadata()` | Title depends on data | `/menu/[id]` |

---

### 4. await params (Current Next.js)

In current Next.js, `params` is a Promise. Always await it:

```js
// ✅ Correct
export async function generateMetadata({ params }) {
  const { id } = await params;
}

// ❌ Old pattern — do not use
export function generateMetadata({ params }) {
  const id = params.id;
}
```

This applies to `generateMetadata()`, page components, and `opengraph-image.js`.

---

### 5. Open Graph Images

Two levels of OG images:

**Site-wide** (`app/opengraph-image.js`):
- Used by the homepage and any page without a specific image
- Static — same image every time

**Per-dish** (`app/menu/[id]/opengraph-image.js`):
- Generated dynamically from dish data using `next/og`
- Every dish gets its own branded preview card
- Size: `1200 × 630` (standard social media aspect ratio)

```js
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  return new ImageResponse(<div>...</div>);
}
```

Preview a generated image at:
```
http://localhost:3000/menu/kitfo/opengraph-image
```

---

### 6. JSON-LD Structured Data

Each dish page includes `MenuItem` schema from Schema.org:

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

**Rule:** JSON-LD is always generated from the same `dish` object as the visible page — they can never contradict each other.

The dish page includes a collapsible dev helper to inspect the generated JSON-LD directly in the browser.

---

### 7. Sitemap

`app/sitemap.js` is a Next.js file convention that generates `/sitemap.xml` automatically.

It uses `getDishes()` so adding a new dish to the data file automatically adds its URL to the sitemap — no manual maintenance needed.

```
http://localhost:3000/sitemap.xml
```

---

### 8. Robots

`app/robots.js` generates `/robots.txt`:

```
User-Agent: *
Allow: /
Disallow: /cart
Disallow: /checkout

Sitemap: https://addiseats.et/sitemap.xml
```

```
http://localhost:3000/robots.txt
```

> ⚠️ `robots.txt` is a crawling hint, **not** a security mechanism. Private pages must be protected with authentication (see Day 42).

---

## Verification Steps

### Step 1 — Page title
Open `/menu/kitfo`. The browser tab should show:
```
Kitfo · Addis Eats
```

### Step 2 — View generated HTML
Open DevTools → Elements. Look for:
```html
<title>Kitfo · Addis Eats</title>
<meta name="description" content="Kitfo — 320 ETB. Minced beef...">
<link rel="canonical" href="https://addiseats.et/menu/kitfo">
<meta property="og:title" content="Kitfo · Addis Eats">
<meta property="og:image" content="https://addiseats.et/...">
```

### Step 3 — Sitemap
```
http://localhost:3000/sitemap.xml
```
Should list `/`, `/menu`, and all dish URLs.

### Step 4 — Robots
```
http://localhost:3000/robots.txt
```
Should show disallow rules for `/cart` and `/checkout`.

### Step 5 — Dynamic OG image
```
http://localhost:3000/menu/kitfo/opengraph-image
```
Should return a 1200×630 PNG with the dish name and price.

### Step 6 — JSON-LD
Open `/menu/kitfo`. Expand the "View JSON-LD structured data" section at the bottom of the page to confirm the structured data matches the visible content.

---

## Data Flow for `/menu/kitfo`

```
Request: /menu/kitfo
         ↓
Next.js identifies [id] = "kitfo"
         ↓
getDish("kitfo")  ←── single source of truth
         ↓
    ┌────┴────────────────────┐
    ↓                         ↓
Page component          generateMetadata()
    ↓                         ↓
Visible content:        Title: "Kitfo · Addis Eats"
  h1: Kitfo             Description: "Kitfo — 320 ETB..."
  320 ETB               Canonical: /menu/kitfo
  Summary               Open Graph: title + description + image
  JSON-LD                    ↓
                       opengraph-image.js
                             ↓
                       1200×630 PNG with dish name + price
```

---

## Common Mistakes to Avoid

| Mistake | Why it fails | Correct approach |
|---------|-------------|------------------|
| `"use client"` + `export const metadata` | Metadata only works in Server Components | Keep page as Server Component, extract interactive parts to a Client Component |
| `params.id` without await | `params` is a Promise in current Next.js | `const { id } = await params` |
| Hard-coding metadata per dish | Doesn't scale, easy to get out of sync | `generateMetadata()` from `getDish(id)` |
| Metadata description ≠ page content | Contradictory signals | Generate both from the same data object |
| Treating `robots.txt` as security | Compliant crawlers only — users can still visit | Use authentication for private routes |
| Private URLs in sitemap | Exposes internal structure | Sitemap = public, discoverable pages only |
| Missing `metadataBase` | OG image URLs are relative, won't work on social platforms | Set `metadataBase` in root layout |

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^15.0.0 | Framework — App Router, Metadata API, `next/og` |
| `react` | ^19.0.0 | UI library |
| `react-dom` | ^19.0.0 | DOM renderer |
| `tailwindcss` | ^4.0.0 | Utility CSS |

---

## Related Days

| Day | Topic |
|-----|-------|
| Day 39 | Next.js App Router fundamentals |
| Day 40 | Server Components & Client Components |
| Day 41 | Data fetching with SWR & TanStack Query |
| Day 42 | Authentication & Authorization |
| **Day 44** | **Metadata, Social Sharing & SEO** ← you are here |
