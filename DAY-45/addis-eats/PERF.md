# PERF.md — Addis Eats Performance Decisions

## Day 45 — Optimization Architecture

---

## Server Components First

The default choice for every component is a Server Component.
A Client Component is only introduced when the browser specifically needs it.

| Component | Type | Reason |
|-----------|------|--------|
| `app/page.js` | Server | Static dish list, no browser state |
| `app/menu/page.js` | Server | Initial dish grid, SEO-critical |
| `app/menu/[id]/page.js` | Server | Dish detail, SEO-critical |
| `app/orders/page.js` | Server | Scoped to session, no interaction |
| `app/kitchen/page.js` | Server | Staff data, no interaction |
| `app/checkout/page.js` | Server | Form + Server Action |
| `components/MenuSearch.js` | Client | Needs `useState` for search input |
| `components/OrderStatus.js` | Client | Needs SWR polling |
| `components/CartClient.js` | Client | Needs `localStorage` |

---

## SWR Patterns

### Debounce — 300ms

```js
// Without debounce: request on every keystroke
// With debounce: request only after 300ms of no typing

const debouncedQuery = useDebounce(query, 300);
```

### Null key — no request when empty

```js
useSWR(
  debouncedQuery ? `/api/dishes?q=${debouncedQuery}` : null,
  fetcher
);
```

When the search box is empty, SWR makes no request.

### keepPreviousData

```js
useSWR(key, fetcher, { keepPreviousData: true });
```

Previous results stay visible while new ones load.
Prevents an empty flash between searches.

### fallbackData — no loading flash

```js
useSWR(`/api/orders/${id}/status`, fetcher, {
  refreshInterval: 5000,
  fallbackData: initialOrder,  // from server render
});
```

The server provides the initial order.
SWR starts with that data immediately — no loading state on first render.

---

## Images

`next/image` is used for all application images.

Benefits:
- Automatic format conversion (WebP, AVIF)
- Responsive sizes
- Lazy loading by default
- Prevents layout shift (explicit width/height)

```js
import Image from "next/image";

<Image
  src={dish.image}
  alt={dish.name}
  width={600}
  height={400}
/>
```

Always provide meaningful `alt` text — required for accessibility and SEO.

---

## Fonts

`next/font` is used for custom fonts.

Benefits:
- Font files are downloaded at build time
- No external network request at runtime
- Zero layout shift (font is available immediately)
- CSS variable approach works with Tailwind

```js
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

<body className={geist.className}>
```

---

## Environment Variables

The API URL is stored in `.env.local`, not hard-coded.

```
API_URL=http://localhost:3000
```

Used as:
```js
const response = await fetch(`${process.env.API_URL}/dishes`);
```

Server-only secrets must never use the `NEXT_PUBLIC_` prefix.
`NEXT_PUBLIC_` variables are bundled into the browser JavaScript.

---

## Smallest Possible Client Boundary

```
app/menu/page.js          ← Server Component (metadata, dish grid)
    └── MenuSearch.js     ← Client Component (search input only)

app/cart/page.js          ← Server Component (shell)
    └── CartClient.js     ← Client Component (localStorage)

app/orders/[id]/page.js   ← Server Component (initial fetch, auth)
    └── OrderStatus.js    ← Client Component (SWR polling only)
```

The Client Component boundary is as small as possible.
The Server Component handles data fetching, auth, and rendering.
The Client Component handles only what requires the browser.

---

## Loading UI

`app/menu/loading.js` shows a skeleton while the menu renders.
`app/loading.js` shows a fallback for any other route.

Skeleton loaders prevent layout shift and communicate progress.

---

## Error Handling

`app/menu/error.js` catches errors in the menu route segment.
`notFound()` is called for missing dishes and orders.
`app/not-found.js` renders a proper 404 page.

---

## Production Build

```bash
npm run build   # verify no build errors
npm run start   # test the production bundle
```

The production build:
- Tree-shakes unused code
- Minifies JavaScript and CSS
- Pre-renders static pages
- Optimizes images at request time
