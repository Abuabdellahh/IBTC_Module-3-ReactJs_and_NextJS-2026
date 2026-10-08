# Addis Eats — Day 45: Production-Ready Next.js

> **Module 3 — React & Next.js · IBT 2026**
> Integration day — all Week 9 concepts brought together into one complete application.

---

## What This Project Is

Day 45 is the integration and assessment day for Week 9.
It takes the Addis Eats application developed through Days 36–44 and brings every piece together into one application that is:

- **Working** — complete user flow from menu to order
- **Authenticated** — session-based sign-in/sign-out
- **Protected** — middleware + page + action (three layers)
- **Data-driven** — server rendering + SWR for interactive data
- **Optimized** — images, fonts, environment variables
- **SEO-ready** — metadata, Open Graph, sitemap, robots, JSON-LD
- **Documented** — DATA.md, AUTH.md, PERF.md, README.md
- **Production-buildable** — `npm run build` succeeds

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

```bash
# Verify the production build
npm run build
npm run start
```

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | user@example.com | password123 |
| Staff | staff@example.com | staffpass123 |

---

## Complete User Flow

```
/ (Home)
  ↓
/menu (Browse dishes — server-rendered + SWR search)
  ↓
/menu/[id] (Dish detail — generateMetadata + JSON-LD)
  ↓
/cart (localStorage cart — Client Component)
  ↓
/signin (if not signed in — middleware redirects here)
  ↓
/checkout (place order — Server Action)
  ↓
/orders (my orders — scoped to session)
  ↓
/orders/[id] (order detail — SWR polling every 5s)

Staff only:
/kitchen (all orders — staff role check)
```

---

## Project Structure

```
addis-eats/
│
├── app/
│   ├── layout.js              ← Site-wide metadata + auth-aware nav
│   ├── page.js                ← Homepage (server-rendered)
│   ├── loading.js             ← Root loading UI
│   ├── not-found.js           ← 404 page
│   ├── sitemap.js             ← /sitemap.xml (auto-generated)
│   ├── robots.js              ← /robots.txt
│   ├── globals.css
│   ├── actions.js             ← All Server Actions (placeOrder, cancelOrder, updateOrderStatus)
│   │
│   ├── menu/
│   │   ├── page.js            ← Server-rendered dish list + MenuSearch
│   │   ├── loading.js         ← Skeleton loading UI
│   │   ├── error.js           ← Error boundary (Client Component)
│   │   ├── useDebounce.js     ← 300ms debounce hook
│   │   └── [id]/
│   │       └── page.js        ← generateMetadata + JSON-LD + dish detail
│   │
│   ├── cart/
│   │   └── page.js            ← Server shell + CartClient
│   │
│   ├── signin/
│   │   └── page.js            ← Sign-in form with ?next= support
│   │
│   ├── checkout/
│   │   └── page.js            ← Protected + placeOrder Server Action
│   │
│   ├── orders/
│   │   ├── page.js            ← Protected + user-scoped orders
│   │   └── [id]/
│   │       └── page.js        ← Protected + ownership check + SWR polling
│   │
│   ├── kitchen/
│   │   └── page.js            ← Staff-only + updateOrderStatus
│   │
│   └── api/
│       ├── dishes/
│       │   └── route.js       ← GET /api/dishes?q= and ?page=
│       ├── orders/[id]/status/
│       │   └── route.js       ← GET /api/orders/:id/status (SWR polling)
│       ├── signin/
│       │   └── route.js       ← POST /api/signin
│       └── signout/
│           └── route.js       ← POST /api/signout
│
├── components/
│   ├── MenuSearch.js          ← SWR debounced search (Client Component)
│   ├── OrderStatus.js         ← SWR polling + fallbackData (Client Component)
│   └── CartClient.js          ← localStorage cart (Client Component)
│
├── lib/
│   ├── dishes.js              ← Dish data + getDishes, getDish, searchDishes, paginateDishes
│   ├── session.js             ← getSession() — single auth helper
│   └── orders.js              ← In-memory order store + helpers
│
├── public/
│   └── images/                ← Dish images
│
├── middleware.js              ← Early route protection for /checkout and /orders
│
├── .env.local                 ← Local environment (not committed)
├── .env.example               ← Template for environment variables
├── DATA.md                    ← Data-fetching architecture
├── AUTH.md                    ← Authentication & authorization map
├── PERF.md                    ← Performance decisions
└── README.md                  ← This file
```

---

## Routes

| Route | Public | Auth | Role | Indexed |
|-------|--------|------|------|---------|
| `/` | ✅ | — | — | ✅ |
| `/menu` | ✅ | — | — | ✅ |
| `/menu/[id]` | ✅ | — | — | ✅ |
| `/cart` | ✅ | — | — | ❌ |
| `/signin` | ✅ | — | — | ❌ |
| `/checkout` | ❌ | ✅ | any | ❌ |
| `/orders` | ❌ | ✅ | any | ❌ |
| `/orders/[id]` | ❌ | ✅ | any | ❌ |
| `/kitchen` | ❌ | ✅ | **staff** | ❌ |
| `/sitemap.xml` | ✅ | — | — | — |
| `/robots.txt` | ✅ | — | — | — |

---

## Key Concepts Demonstrated

### 1. Three Protection Layers

```
Middleware          → proves a session cookie exists (fast, early)
Page / getSession() → establishes real server-side identity
Server Action       → verifies identity + ownership before any change
```

### 2. Server Component / Client Component Boundary

```
Server Component  → initial data, auth, SEO, metadata
Client Component  → useState, useEffect, localStorage, SWR
```

The Client Component boundary is as small as possible.

### 3. SWR Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| Debounce 300ms | MenuSearch | No request per keystroke |
| null key | MenuSearch | No request when search is empty |
| keepPreviousData | MenuSearch | No empty flash between searches |
| fallbackData | OrderStatus | Server data seeds SWR — no loading flash |
| refreshInterval 5000 | OrderStatus | Polls every 5 seconds |

### 4. Data Scoping

```js
// WRONG — trusts the browser
getOrders(request.searchParams.userId)

// CORRECT — trusts the server session
const session = await getSession();
getOrders(session.userId)
```

### 5. Open Redirect Protection

```js
// Validates the ?next= parameter before redirecting
const safeNext = typeof next === "string" && next.startsWith("/") ? next : "/";
```

### 6. Dynamic Metadata

```js
export async function generateMetadata({ params }) {
  const { id } = await params;          // await params — current Next.js
  const dish = await getDish(id);
  return {
    title: dish.name,                   // → "Kitfo | Addis Eats"
    description: `${dish.name} — ${dish.price} ETB. ${dish.description}`,
    alternates: { canonical: `/menu/${dish.id}` },
    openGraph: { title: `${dish.name} | Addis Eats`, images: [dish.image] },
  };
}
```

### 7. JSON-LD Structured Data

```js
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MenuItem",
  name: dish.name,
  description: dish.description,
  offers: { "@type": "Offer", price: dish.price, priceCurrency: "ETB" },
};
```

Generated from the same `dish` object as the page — always matches visible content.

---

## Verification Checklist

### Application
- [ ] `/` loads and shows featured dishes
- [ ] `/menu` shows all dishes + search works
- [ ] `/menu/kitfo` shows dish detail with correct browser tab title
- [ ] `/cart` shows cart (empty or with items)
- [ ] `/checkout` redirects to `/signin` when signed out
- [ ] Sign in as customer → redirected back to `/checkout`
- [ ] Place order → redirected to `/orders`
- [ ] `/orders` shows only the signed-in user's orders
- [ ] `/orders/ord-1` shows order detail with status polling
- [ ] Cancel order works; cancelling another user's order fails
- [ ] `/kitchen` shows Forbidden for customer
- [ ] `/kitchen` shows all orders for staff
- [ ] Sign out → session cleared → `/orders` redirects to sign-in

### Data Fetching
- [ ] Menu search debounces (check Network tab — no request per keystroke)
- [ ] Empty search makes no request
- [ ] Previous search results stay visible while new ones load
- [ ] Order status polls every ~5 seconds (check Network tab)
- [ ] No loading flash on order detail page (fallbackData works)

### Authentication & Authorization
- [ ] `/checkout` protected by middleware
- [ ] `/orders` protected by middleware
- [ ] Pages call `getSession()` independently
- [ ] `cancelOrder` checks ownership server-side
- [ ] `/kitchen` checks staff role server-side
- [ ] `/signin?next=https://example.com` redirects to `/` not external site

### SEO
- [ ] Browser tab: `Kitfo | Addis Eats` on `/menu/kitfo`
- [ ] `<meta name="description">` present in HTML
- [ ] `<link rel="canonical">` present on dish pages
- [ ] `<meta property="og:title">` present
- [ ] `/sitemap.xml` lists all dish URLs
- [ ] `/robots.txt` disallows `/checkout/`, `/orders/`, `/kitchen/`
- [ ] JSON-LD `<script type="application/ld+json">` present on dish pages

### Production Build
- [ ] `npm run build` completes without errors
- [ ] `npm run start` serves the production application
- [ ] Main flow works in production mode

---

## Week 9 Integration Map

| Day | Concept | Where in this project |
|-----|---------|----------------------|
| Day 36 | Routing & layouts | `app/` directory structure |
| Day 37 | Server rendering | `app/menu/page.js`, `app/page.js` |
| Day 38 | Server/Client Components | `components/MenuSearch.js`, `CartClient.js` |
| Day 39 | Route Handlers & Server Actions | `app/api/`, `app/actions.js` |
| Day 40 | Architecture & boundaries | `lib/`, `components/`, `app/` separation |
| Day 41 | SWR & client-side data | `MenuSearch.js`, `OrderStatus.js` |
| Day 42 | Middleware & authentication | `middleware.js`, `lib/session.js` |
| Day 43 | Optimization | `next/image`, `next/font`, `.env.local` |
| Day 44 | Metadata & SEO | `app/layout.js`, `generateMetadata()`, `sitemap.js`, `robots.js` |
| **Day 45** | **Integration** | **This project** |

---

## What "Production-Ready" Means Here

For this course, production-ready means the application demonstrates that the concepts from Week 9 have been brought together correctly.

It does **not** require:
- Prisma or PostgreSQL
- Docker
- OAuth providers
- Payment gateways
- Enterprise RBAC

It **does** require:
- Correct architecture
- Authentication & authorization
- Data fetching (server + SWR)
- Optimization
- SEO
- Error handling
- Documentation
- Successful production build

---

## Documentation

| File | Contents |
|------|----------|
| `DATA.md` | Data-fetching architecture, SWR patterns, API routes |
| `AUTH.md` | Session cookie, three protection layers, route table, security tests |
| `PERF.md` | Server/Client split, SWR patterns, images, fonts, environment |
| `README.md` | This file |
