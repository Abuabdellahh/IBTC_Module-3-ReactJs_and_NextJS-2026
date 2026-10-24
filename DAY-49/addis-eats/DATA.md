# DATA.md — Data fetching, caching and revalidation

**Principle:** fetch on the server by default. A Client Component fetches only when the data must change while the user is looking at the page.

## Rendering strategy per route

Taken from the `npm run build` route table. Each strategy was chosen on purpose, not left at the default.

| Route | Strategy | Why |
| --- | --- | --- |
| `/` | ○ Static | Reads only the catalogue. Prerendered and served from the CDN. |
| `/menu` | ○ Static | Same. Search and filter run in the browser over the prerendered list. |
| `/menu/[id]` | ● SSG, 8 paths | `generateStaticParams()` builds one page per dish. `dynamicParams = false` makes unknown ids a static 404. |
| `/cart` | ○ Static shell | The cart lives in localStorage, so the server has nothing to render. |
| `/checkout`, `/orders`, `/orders/[id]`, `/kitchen` | ƒ Dynamic | They read the session cookie, and the data belongs to one person. Caching them would serve one user's orders to another. |
| `/signin`, `/signup` | ƒ Dynamic | They read `?next=` and redirect if already signed in. |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/manifest.webmanifest` | ○ Static | Generated once at build time. |

**The decision that keeps the public pages static:** the root layout does **not** call `cookies()`. Reading cookies there would make every route dynamic, including the menu. The header's personalised parts (cart count, account menu) are small Client Components instead, and they read localStorage and `/api/session`.

`cacheComponents` (Next 16's Partial Prerendering model) is deliberately **off** (`next.config.mjs`). The classic static/dynamic split is enough at this size and easier to reason about. Adopting it is in FUTURE.md.

## Every query

| Data | Where it runs | Key / source | Refresh rule | Reasoning |
| --- | --- | --- | --- | --- |
| Catalogue (`getDishes`, `getDish`) | Server, at **build time** | `lib/menu.js` | Rebuild on deploy | Changes only when the menu changes, so a static build costs nothing per request. |
| Menu search and filter | **Client**, in memory | `useDeferredValue(query)` | Every keystroke, no network | The whole list (8 dishes) is already in the HTML. A request per keystroke would only add latency. |
| Cart | **Client** (localStorage, `useSyncExternalStore`) | `addis-eats:cart:v1` | Instant; synced across tabs with the `storage` event | It is the visitor's private scratchpad, and the server never needs it before checkout. |
| Who is signed in (header) | **Client**, SWR | `/api/session`, `no-store` | On mount, on route change, on window focus | Keeps the layout static (see above). The response is `private, no-store`, so a CDN never caches it. |
| My orders (`listOrdersForUser`) | Server, per request | `session.userId` | `revalidatePath("/orders")` after place, cancel and advance | Personal data. The query is scoped by the session, never by a URL parameter. |
| One order, first paint | Server, per request | `getOrderForUser(id, session.userId)` | Per request | Server-rendered, so the page shows real data with no spinner. |
| One order, live status | **Client**, SWR | `/api/orders/[id]` | `refreshInterval` 5 s; stops at Delivered or Cancelled; `fallbackData` = the server's order | The status changes while the customer watches. Seeding SWR with the server data avoids a loading flash. |
| Kitchen queue (`listAllOrders`) | Server, per request | — (staff only) | `revalidatePath("/kitchen")` after every order action | Staff refresh by acting. Live polling of the queue is in FUTURE.md. |

## Writes (Server Actions)

| Action | Revalidates | Notes |
| --- | --- | --- |
| `placeOrder` | `/orders`, `/kitchen`, then redirects to `/orders/[id]?placed=1` | Re-prices from the catalogue. It is idempotent on `(userId, idempotencyKey)`, so a double submit returns the same order. |
| `cancelOrder` | `/orders`, `/orders/[id]`, `/kitchen` | Returns `{ ok }` or `{ error }`. The status card then calls SWR `mutate()`. |
| `advanceOrder` | `/kitchen`, `/orders`, `/orders/[id]` | The customer's open page picks up the change on its next poll (≤ 5 s). |

## Formatting

All money uses `Intl.NumberFormat("en-ET", { currency: "ETB" })`, for example **ETB 1,140.00**. All dates use the `Africa/Addis_Ababa` time zone (`lib/format.js`). Each formatter is created once at module load, not once per render.

## Storage

`lib/db.js` is an in-memory store. It resets when the server restarts and is not shared between serverless instances. That is acceptable for a frontend capstone, and it is the first item in FUTURE.md. Every read goes through functions that take the `userId`, so replacing the store with a database does not touch any page or action.
