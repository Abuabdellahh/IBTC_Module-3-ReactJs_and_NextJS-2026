# Addis Eats — Next.js App Router

Home-style Ethiopian cooking · Bole, Addis Ababa

A full migration of the Addis Eats React/Vite app into **Next.js 15 App Router**, where routing disappears entirely into the file system.

---

## Route table

| URL | File | Type |
|-----|------|------|
| `/` | `app/page.js` | Static |
| `/menu` | `app/menu/page.js` | Static (server component, reads `dishes.json` at build time) |
| `/menu/[id]` | `app/menu/[id]/page.js` | Dynamic (server-rendered on demand) |
| `/cart` | `app/cart/page.js` | Static shell (client component) |
| `/checkout` | `app/checkout/page.js` | Static shell (client component) |
| `/*` (any unknown URL) | `app/not-found.js` | Rendered by Next.js for unmatched routes |

---

## App Router file conventions used

| File | Segment | Purpose |
|------|---------|---------|
| `app/layout.js` | Root | Shell: `<html>`, header, nav, `CartProvider` |
| `app/not-found.js` | Root | 404 — reached by bad URL **and** by `notFound()` in `[id]/page.js` |
| `app/menu/loading.js` | `/menu` | Streaming skeleton shown while the server component fetches |
| `app/menu/error.js` | `/menu` | Error boundary (`"use client"`) shown on thrown errors |

---

## Colocated components (not routable)

These files live inside `app/menu/` but are **not** routes because they are not named `page.js`:

| File | Role |
|------|------|
| `app/menu/CartContext.js` | React context + `CartProvider` / `useCart` hook |
| `app/menu/CartBadge.js` | Live item count in the nav |
| `app/menu/DishList.jsx` | Renders the filtered list of dishes with add-to-cart |
| `app/menu/MenuFilters.jsx` | Client-side search / category / spicy filter UI |
| `app/menu/[id]/AddToCartButton.js` | Client button on the dish detail page |

---

## Key requirements met

- **Five routes** as folders, each with a default-export `page.js`
- **Dynamic `/menu/[id]`** reads `params` from props — no `useParams()` hook
- **`loading.js`** on the menu segment — visible when you throttle the connection (Network → Slow 3G in DevTools)
- **`error.js`** on the menu segment — `"use client"`, receives `error` and `reset` props
- **`not-found.js`** — triggered by typing an unknown URL **and** by `notFound()` when a dish id is not in the data
- **All navigation uses `next/link`** — zero plain `<a>` tags between internal routes

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — prints the full route table
```

### Verify each requirement

```
# loading.js  — DevTools → Network → Throttle → Slow 3G, then visit /menu
# error.js    — temporarily throw in app/menu/page.js, visit /menu
# not-found   — visit /menu/does-not-exist  (notFound() fires)
#             — visit /anything-unknown     (Next.js catches it)
```

---

## Build output

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ○ /checkout
├ ○ /menu
└ ƒ /menu/[id]
```

`DishList.jsx` is unreachable as a URL even though it sits inside `app/` — only files named `page.js` become routes.

---

## Stack

- **Next.js 15** (App Router, Turbopack)
- **React 19**
- Plain CSS (no Tailwind, no CSS Modules)
- No external UI libraries
