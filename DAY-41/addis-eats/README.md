# 🍽 Addis Eats — Data Fetching

> **Day 41 · Module 3 · IBT Frontend Cohort 2026**
> Data Fetching with SWR and TanStack Query

A full-stack Next.js 15 application that demonstrates every client-side data-fetching pattern taught in Day 41 — server-first rendering, SWR, TanStack Query, debounced search, pagination, polling, and mutation-driven cache invalidation.

---

## ✨ What This App Demonstrates

| Feature | Route | Library | Pattern |
|---|---|---|---|
| Static server render | `/` | Server Component | Direct data access — no fetch |
| Debounced search | `/menu` | SWR | Dynamic key + `keepPreviousData` |
| Pagination | `/menu` | SWR | Page in key + `keepPreviousData` |
| Menu + Add to Cart | `/menu` | TanStack Query | `useQuery` + `useMutation` |
| Live order status | `/orders/[id]` | SWR | `fallbackData` + `refreshInterval` |
| Cart | `/cart` | TanStack Query | `useQuery` + `invalidateQueries` |

---

## 🚀 Quick Start

```bash
npm install
npm run dev      # → http://localhost:3000
npm run build    # production build (8 routes, 0 errors)
npm run start
```

---

## 🗂 Project Structure

```
addis-eats-data-fetching/
│
├── app/
│   ├── layout.js                   # Root layout — nav + QueryClientProvider
│   ├── page.js                     # / Home — static Server Component
│   ├── providers.js                # TanStack QueryClientProvider (Client)
│   ├── globals.css                 # Tailwind CSS v4
│   │
│   ├── menu/
│   │   ├── page.js                 # /menu — three sections in one page
│   │   ├── DishCard.js             # Shared presentational component
│   │   ├── SearchBox.js            # SWR debounced search (Client ⚡)
│   │   ├── PaginatedMenu.js        # SWR pagination (Client ⚡)
│   │   ├── TanStackMenu.js         # TanStack Query menu (Client ⚡)
│   │   ├── AddToCartButton.js      # TanStack useMutation (Client ⚡)
│   │   └── useDebounce.js          # Generic debounce hook (Client ⚡)
│   │
│   ├── orders/
│   │   └── [id]/
│   │       ├── page.js             # Server Component — fetches initial order
│   │       └── OrderStatus.js      # SWR fallbackData + polling (Client ⚡)
│   │
│   ├── cart/
│   │   ├── page.js                 # Server Component shell
│   │   └── Cart.js                 # TanStack Query cart (Client ⚡)
│   │
│   └── api/
│       ├── dishes/route.js         # GET /api/dishes — search + pagination
│       ├── orders/[id]/route.js    # GET /api/orders/[id]
│       └── cart/route.js           # GET + POST /api/cart
│
├── lib/
│   ├── dishes.js                   # Dish data (8 dishes, 5 categories)
│   ├── orders.js                   # In-memory order store
│   ├── orders-api.js               # Server-side getOrder() helper
│   ├── cart.js                     # In-memory cart store
│   ├── cart-api.js                 # Client-side addToCart() helper
│   └── fetcher.js                  # Shared SWR fetcher function
│
├── DATA.md                         # Every data strategy decision explained
└── README.md
```

---

## 🏗 Architecture

### The first question is always:

```
Does this data need to be fetched in the browser?
        │
        ├── No  → Server Component (direct data access)
        │
        └── Yes → Does it need polling / search / pagination?
                        │
                        ├── SWR   (smaller API, great for focused use cases)
                        └── TanStack Query (larger API, complex cache management)
```

### Server / Client split

```
RootLayout          Server  — nav, metadata
HomePage            Server  — reads lib/dishes.js directly, no fetch()
MenuPage            Server  — shell only, delegates to Client Components
  ├── SearchBox     Client ⚡ — useState + useSWR + useDebounce
  ├── PaginatedMenu Client ⚡ — useState + useSWR
  └── TanStackMenu  Client ⚡ — useQuery + AddToCartButton
        └── AddToCartButton  Client ⚡ — useMutation + invalidateQueries
OrderPage           Server  — fetches initialOrder, passes to OrderStatus
  └── OrderStatus   Client ⚡ — useSWR(fallbackData + refreshInterval)
CartPage            Server  — shell only
  └── Cart          Client ⚡ — useQuery + invalidateQueries
```

---

## 🔑 Key Concepts

### 1 — Server Components need no client library

```js
// app/page.js — no useEffect, no fetch(), no loading state
import { dishes } from "@/lib/dishes";

export default function HomePage() {
  return dishes.map((dish) => <DishCard key={dish.id} dish={dish} />);
}
```

### 2 — SWR key identifies cached data

```js
// Same key = same cache entry, shared across components
useSWR("/api/dishes", fetcher);

// Different key = different cache entry
useSWR("/api/dishes?q=tibs", fetcher);
useSWR("/api/dishes?page=2", fetcher);
```

### 3 — Debounced search — one request per pause, not per keystroke

```js
const debouncedTerm = useDebounce(term, 300);

const key = debouncedTerm
  ? `/api/dishes?q=${encodeURIComponent(debouncedTerm)}`
  : "/api/dishes";

const { data } = useSWR(key, fetcher, { keepPreviousData: true });
```

`keepPreviousData: true` keeps the previous results visible while the new
request is in-flight — no flash of empty content between searches.

### 4 — Pagination — page number lives in the key

```js
const [page, setPage] = useState(1);

// /api/dishes?page=1, /api/dishes?page=2 → separate cache entries
const { data } = useSWR(`/api/dishes?page=${page}`, fetcher, {
  keepPreviousData: true,
});
```

### 5 — Server seed + SWR polling — best of both worlds

```
Server Component → getOrder(id) → initialOrder
  ↓
OrderStatus Client Component
  ↓
fallbackData: initialOrder   ← page renders with real data, no loading flash
  ↓
SWR polls /api/orders/${id} every 5 s
```

```js
const { data } = useSWR(`/api/orders/${id}`, fetcher, {
  fallbackData: initialOrder,   // immediate display from server
  refreshInterval: 5000,        // poll every 5 seconds
});
```

### 6 — TanStack Query mutation + cache invalidation

```js
const mutation = useMutation({
  mutationFn: addToCart,
  onSuccess: () => {
    // Mark ["cart"] as stale → triggers immediate re-fetch
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  },
});

<button onClick={() => mutation.mutate(dish)} disabled={mutation.isPending}>
  {mutation.isPending ? "Adding..." : "Add to Cart"}
</button>
```

### 7 — staleTime vs gcTime

| Setting | Question | Example |
|---|---|---|
| `staleTime` | How long is the data **fresh**? | Menu: 2 min, Cart: 0 |
| `gcTime` | How long does **unused** cache stay in memory? | Default: 5 min |

```js
useQuery({
  queryKey: ["dishes"],
  queryFn: fetchDishes,
  staleTime: 2 * 60 * 1000,  // fresh for 2 minutes
  // gcTime defaults to 5 minutes
});
```

### 8 — Conditional fetching

```js
// SWR — null key = do not fetch
useSWR(search ? `/api/dishes?q=${search}` : null, fetcher);

// TanStack Query — enabled flag
useQuery({ queryKey: ["orders", id], queryFn: getOrder, enabled: Boolean(id) });
```

---

## 🌐 API Endpoints

### `GET /api/dishes`
Returns paginated dishes. Supports search and pagination.

```bash
# All dishes (page 1, 3 per page)
curl http://localhost:3000/api/dishes

# Search
curl "http://localhost:3000/api/dishes?q=tibs"

# Paginate
curl "http://localhost:3000/api/dishes?page=2"

# Combine
curl "http://localhost:3000/api/dishes?q=tibs&page=1"
```

**Response shape**
```json
{
  "data": [...],
  "page": 1,
  "pageSize": 3,
  "total": 8,
  "totalPages": 3
}
```

### `GET /api/orders/[id]`
Returns one order or `404`.

```bash
curl http://localhost:3000/api/orders/1001
curl http://localhost:3000/api/orders/9999   # → 404
```

### `GET /api/cart` / `POST /api/cart`
Read and add to the in-memory cart.

```bash
curl http://localhost:3000/api/cart

curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"Chicken Tibs","price":450}'
```

---

## 🧪 Verifying Each Feature

### Debounced search
1. Open `/menu` → DevTools → Network tab
2. Type `t`, `i`, `b`, `s` quickly
3. Only **one** request fires after you stop — not four

### Polling
1. Open `/orders/1001` → Network tab
2. Watch `/api/orders/1001` repeat every **5 seconds** automatically

### Pagination
1. Open `/menu` → click **Next**
2. Network shows `?page=2` — a different request and cache entry from `?page=1`
3. Click **Previous** — page 1 loads instantly from cache (no new request)

### Mutation + invalidation
1. Open `/cart` → click **+ Add Special Tibs**
2. Network shows `POST /api/cart` followed immediately by `GET /api/cart`
3. The cart list updates without a manual refresh

---

## 🏭 Production Build

```
Route (app)                    Size     First Load JS
┌ ○ /                          162 B    106 kB
├ ○ /_not-found                995 B    104 kB
├ ƒ /api/cart                  130 B    103 kB
├ ƒ /api/dishes                130 B    103 kB
├ ƒ /api/orders/[id]           130 B    103 kB
├ ○ /cart                      959 B    112 kB
├ ○ /menu                     3.45 kB   120 kB
└ ƒ /orders/[id]               848 B    109 kB

○ Static    ƒ Dynamic
```

8 routes · 0 errors · 0 warnings

---

## 🛠 Tech Stack

| Tool | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15 | App Router, Server Components, Route Handlers |
| [React](https://react.dev/) | 19 | UI, hooks |
| [SWR](https://swr.vercel.app/) | 2 | Search, polling, pagination |
| [TanStack Query](https://tanstack.com/query) | 5 | Mutations, cart, complex cache |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Styling |

---

## 📄 Documentation

| File | Contents |
|---|---|
| [`DATA.md`](./DATA.md) | Every data strategy decision with key, staleTime, and reasoning |

---

## 🔮 Next Steps

- Replace in-memory `lib/orders.js` and `lib/cart.js` with a real database
- Add TanStack Query Devtools (`@tanstack/react-query-devtools`) for cache inspection
- Implement infinite scroll with SWR `useSWRInfinite` or TanStack Query `useInfiniteQuery`
- Add optimistic updates to the cart mutation for instant UI feedback
- Deploy to [Vercel](https://vercel.com/) — zero config with Next.js
