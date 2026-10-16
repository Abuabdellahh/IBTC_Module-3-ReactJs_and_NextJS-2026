# Addis Eats — Next.js App Router

Home-style Ethiopian cooking · Bole, Addis Ababa

A full migration of the Addis Eats React/Vite app into **Next.js 15 App Router**, extended with React event handling, keyboard/touch accessibility, production preparation, and Vercel deployment readiness.

---

## Route table

| URL | File | Type | Day |
|-----|------|------|-----|
| `/` | `app/page.js` | Static | 47 |
| `/menu` | `app/menu/page.js` | Static (server component) | 47 |
| `/menu/[id]` | `app/menu/[id]/page.js` | Dynamic (SSR) | 47 |
| `/cart` | `app/cart/page.js` | Static shell (client) | 47 |
| `/checkout` | `app/checkout/page.js` | Static shell (client) | 47–48 |
| `/events-demo` | `app/events-demo/page.js` | Static | 48 |
| `/events-demo/form` | `app/events-demo/form/page.js` | Static | 48 |
| `/events-demo/propagation` | `app/events-demo/propagation/page.js` | Static | 48 |
| `/events-demo/counter` | `app/events-demo/counter/page.js` | Static | 48 |
| `/events-demo/keyboard` | `app/events-demo/keyboard/page.js` | Static | 48 |
| `/events-demo/browser` | `app/events-demo/browser/page.js` | Static | 48 |
| `/events-demo/config` | `app/events-demo/config/page.js` | Static | 48 |
| `/*` (unmatched) | `app/not-found.js` | — | 47 |

---

## App Router convention files

| File | Segment | Purpose |
|------|---------|---------|
| `app/layout.js` | Root | Shell, header, nav, `CartProvider`, `metadataBase` |
| `app/not-found.js` | Root | 404 — bad URL **and** `notFound()` calls |
| `app/menu/loading.js` | `/menu` | Streaming skeleton while server component fetches |
| `app/menu/error.js` | `/menu` | `"use client"` error boundary with retry |

---

## Colocated components (inside `app/` but not routable)

| File | Role |
|------|------|
| `app/menu/CartContext.js` | `CartProvider` + `useCart` hook |
| `app/menu/CartBadge.js` | Live item count in the nav |
| `app/menu/DishList.jsx` | Filtered dish list with add-to-cart |
| `app/menu/MenuFilters.jsx` | Search / category / spicy filter UI |
| `app/menu/[id]/AddToCartButton.js` | Client button on the dish detail page |

---

## Reusable components

| File | Role |
|------|------|
| `components/OrderForm.js` | Phone input form with pending state and duplicate-submission guard |

---

## Day 48 — Event handling topics demonstrated

| Route | Concept |
|-------|---------|
| `/` | `onClick` handler, passing a function reference (not a call) |
| `/events-demo` | `event.target` vs `event.currentTarget` vs `event.nativeEvent` |
| `/events-demo/form` | `onSubmit` + `event.preventDefault()` — no page reload |
| `/events-demo/propagation` | `event.stopPropagation()` — Add button vs card click |
| `/events-demo/counter` | Functional updater `setCount(prev => prev + 1)` — stale-state safety |
| `/events-demo/keyboard` | `onKeyDown` + `event.key` — Escape, Enter, ArrowDown |
| `/events-demo/browser` | `window` inside `useEffect` with resize listener cleanup |
| `/events-demo/config` | `process.env.NEXT_PUBLIC_SITE_URL` — public env var display |
| `/checkout` | `OrderForm` — pending state, disabled button, `try/catch/finally` |

---

## Checkout form — duplicate-submission prevention

`components/OrderForm.js` demonstrates the client-side pattern:

```js
if (pending) return          // early return guard
setPending(true)
try {
  await saveDemoOrder(phone)
} catch {
  setMessage('Unable to place the order. Try again.')
} finally {
  setPending(false)          // always re-enables the button
}
```

The button is `disabled={pending}` and its label changes to "Placing order…".

> **Important:** this is client-side protection only. A real order endpoint must also enforce idempotency on the server (e.g. a unique key per submission checked against the database).

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public (client bundle) | Canonical URL for `metadataBase` and absolute links |
| `DATABASE_URL` | Server only | Database connection string |
| `SESSION_SECRET` | Server only | Session token signing key |
| `PAYMENT_SECRET_KEY` | Server only | Payment provider secret (use test key for preview) |

**Rules:**
- Never commit `.env.local`
- Never prefix secrets with `NEXT_PUBLIC_`
- `NEXT_PUBLIC_` changes require a new build to take effect

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run build                # production build — prints full route table
npm run start                # serve the production build locally
```

---

## Build output

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ○ /checkout
├ ○ /events-demo
├ ○ /events-demo/browser
├ ○ /events-demo/config
├ ○ /events-demo/counter
├ ○ /events-demo/form
├ ○ /events-demo/keyboard
├ ○ /events-demo/propagation
├ ○ /menu
└ ƒ /menu/[id]
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repository at [vercel.com](https://vercel.com)
3. Add every variable from `.env.example` under the correct environment (Development / Preview / Production)
4. Deploy — Vercel detects Next.js automatically

**Preview deployments** get a unique URL per branch. Use test payment keys and non-production data in preview environments.

---

## Accessibility checklist

- [ ] Tab reaches every interactive control
- [ ] Enter / Space activates buttons
- [ ] Enter submits forms
- [ ] Focus outline is always visible
- [ ] Escape closes dialogs where appropriate
- [ ] No action is hover-only
- [ ] Tested on a real phone

---

## Stack

- **Next.js 15** (App Router, Turbopack)
- **React 19**
- Plain CSS (no Tailwind, no CSS Modules)
- No external UI libraries
