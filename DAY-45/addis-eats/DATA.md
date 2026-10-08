# DATA.md — Addis Eats Data Architecture

## Day 45 — Data Fetching Strategy

---

## Principle

> Use the server for initial data. Use SWR only where browser interaction requires it.

---

## Server Data (Server Components)

| Route | Data source | Why server? |
|-------|-------------|-------------|
| `/` | `getDishes()` | Static list, no browser state needed |
| `/menu` | `getDishes()` | Initial dish grid, crawlable content |
| `/menu/[id]` | `getDish(id)` | SEO-critical, server-rendered |
| `/orders` | `getOrdersForUser(session.userId)` | Scoped to session, no client state |
| `/orders/[id]` | `getOrderById(id)` | Initial order for SWR fallbackData |
| `/kitchen` | `getAllOrders()` | Staff-only, server-rendered |
| `/checkout` | `getDishes()` | Dish list for the order form |

---

## SWR (Client Components)

### Menu Search — `components/MenuSearch.js`

```
User types
    ↓
useDebounce (300ms)
    ↓
debouncedQuery changes
    ↓
SWR key: /api/dishes?q=<query>
    ↓
GET /api/dishes?q=<query>
    ↓
Results rendered
```

- **null key when empty** — no request when the search box is empty
- **keepPreviousData: true** — previous results stay visible while new ones load
- **300ms debounce** — prevents a request per keystroke

### Order Status Polling — `components/OrderStatus.js`

```
Server renders initial order
    ↓
OrderStatus receives initialOrder as fallbackData
    ↓
SWR polls /api/orders/:id/status every 5 seconds
    ↓
UI updates when status changes
```

- **fallbackData** — server-rendered data seeds SWR; no loading flash on first render
- **refreshInterval: 5000** — polls every 5 seconds

---

## API Route Handlers

| Endpoint | Method | Used by |
|----------|--------|---------|
| `/api/dishes` | GET | MenuSearch (SWR) |
| `/api/dishes?q=<query>` | GET | MenuSearch search |
| `/api/dishes?page=<n>` | GET | Pagination |
| `/api/orders/:id/status` | GET | OrderStatus polling |
| `/api/signin` | POST | Sign-in form |
| `/api/signout` | POST | Sign-out button |

---

## Server Actions

| Action | File | Auth check |
|--------|------|------------|
| `placeOrder` | `app/actions.js` | Session required |
| `cancelOrder` | `app/actions.js` | Session + ownership |
| `updateOrderStatus` | `app/actions.js` | Session + staff role |

---

## Cart

Cart state lives in `localStorage` (browser only).

- Managed by `CartClient` (Client Component)
- Server never reads cart state directly
- On checkout, the user selects a dish from the server-rendered form

---

## Why This Architecture

```
Server Component
    ↓
Initial data (fast, SEO-friendly, no client JS)
    +
Client Component
    ↓
Interactive updates (search, polling, cart)
```

Server rendering provides the initial data.
SWR handles interactive browser-side updates.
The two approaches complement each other.
