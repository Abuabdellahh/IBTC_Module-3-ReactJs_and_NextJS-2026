# Addis Eats — Data Strategy

## Decision Framework

Before writing any data request, answer:

1. Does the data need browser interaction? → No → Server Component
2. Does it need polling? → Yes → SWR `refreshInterval`
3. Does it change while typing? → Yes → debounce + dynamic key
4. Does it have multiple pages? → Yes → page in key
5. Does a write affect cached data? → Yes → `mutate()` / `invalidateQueries()`
6. Is initial data available on the server? → Yes → seed the client cache

---

## Home Page `/`

**Strategy:** Static Server Component

**Key:** none — reads `lib/dishes.js` directly

**Reason:** The initial menu list does not require browser interaction.
A Server Component reads the data source directly — no API round-trip needed.

---

## Menu Search `/menu` → `SearchBox`

**Strategy:** SWR + debounce (300 ms) + `keepPreviousData`

**Key:** `/api/dishes?q={term}` (or `/api/dishes` when empty)

**Reason:** The request depends on user typing.
Debouncing prevents a network request per keystroke.
`keepPreviousData` keeps the previous results visible while the new request is in-flight,
avoiding a flash of empty content between searches.

---

## Menu Pagination `/menu` → `PaginatedMenu`

**Strategy:** SWR + `keepPreviousData`

**Key:** `/api/dishes?page={page}`

**Reason:** The page number changes in the browser.
Each page is a separate cache entry so SWR can serve page 1 instantly
when the user navigates back from page 2.

---

## Menu + Add to Cart `/menu` → `TanStackMenu` + `AddToCartButton`

**Strategy:** TanStack Query `useQuery` + `useMutation`

**Key:** `["dishes"]`

**staleTime:** 2 minutes — menu data does not change frequently

**Reason:** Demonstrates TanStack Query as an alternative to SWR.
`useMutation` handles the POST and `invalidateQueries(["cart"])` ensures
the cart reflects the latest state after every successful add.

---

## Order Status `/orders/[id]`

**Strategy:** Server Component seeds initial data → SWR `fallbackData` + polling

**Key:** `/api/orders/${id}`

**Refresh:** every 5 seconds (`refreshInterval: 5000`)

**Reason:** Order status changes while the page is open (Pending → Preparing → Ready → Delivered).
The Server Component fetches the initial order so the page renders with real data immediately.
SWR takes over in the browser and polls for updates — no manual refresh needed.

Flow:
```
Server Component → getOrder(id) → initialOrder
  ↓
OrderStatus Client Component
  ↓
fallbackData: initialOrder   ← immediate display, no loading flash
  ↓
SWR polls /api/orders/${id} every 5 s
```

---

## Cart `/cart`

**Strategy:** TanStack Query `useQuery` + `invalidateQueries` after mutation

**Key:** `["cart"]`

**staleTime:** 0 — cart data should always be considered stale

**Reason:** The cart changes whenever a dish is added.
After every successful POST, `invalidateQueries(["cart"])` marks the cache
entry as stale and triggers an immediate re-fetch so the UI reflects the
latest cart state.

---

## staleTime vs gcTime

| Setting | Question it answers |
|---|---|
| `staleTime` | How long is the data considered fresh? |
| `gcTime` | How long does unused cached data stay in memory? |

Examples used in this project:

| Data | staleTime | Reason |
|---|---|---|
| Menu (TanStack) | 2 min | Menu rarely changes |
| Cart | 0 | Must always be fresh |
| Orders (SWR) | default | Overridden by polling |

---

## SWR vs TanStack Query — Quick Reference

| Concept | SWR | TanStack Query |
|---|---|---|
| Fetch hook | `useSWR(key, fetcher)` | `useQuery({ queryKey, queryFn })` |
| Polling | `refreshInterval` | `refetchInterval` |
| Initial data | `fallbackData` | `initialData` |
| Previous data | `keepPreviousData` | `placeholderData: keepPreviousData` |
| Mutation | `mutate()` | `useMutation` + `invalidateQueries` |
| Provider | optional | `QueryClientProvider` required |
| Conditional fetch | `null` key | `enabled: false` |
