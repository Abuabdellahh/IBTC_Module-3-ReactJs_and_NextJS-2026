# Addis Eats — Next.js

**Day 39 · Module 3 · IBT Cohort 2026**
Topic: API Routes & Route Handlers

A full-stack Ethiopian food ordering app built with the **Next.js 15 App Router**.
Both the frontend UI and the backend API live inside one Next.js project.

---

## What This Project Covers

| Concept | Where to find it |
|---|---|
| Route Handler — GET all | `app/api/dishes/route.js` |
| Route Handler — GET one (dynamic) | `app/api/dishes/[id]/route.js` |
| Route Handler — POST with validation | `app/api/orders/route.js` |
| Query string filtering | `GET /api/dishes?category=Ethiopian` |
| Dynamic route params (`await params`) | `app/api/dishes/[id]/route.js` |
| Zod schema (shared) | `lib/schema.js` |
| Server Function — placeOrder | `app/actions.js` |
| Server Function — cancelOrder | `app/actions.js` |
| `useActionState` — form state from server | `app/checkout/checkout-form.js` |
| `useFormStatus` — pending state | `app/checkout/submit-button.js` |
| `revalidatePath` — cache revalidation | `app/actions.js` |
| Server-side ownership check | `cancelOrder()` in `app/actions.js` |
| Environment variables | `.env.local` |

---

## Project Structure

```
addis-eats-next/
│
├── app/
│   ├── api/
│   │   ├── dishes/
│   │   │   ├── route.js          ← GET /api/dishes
│   │   │   └── [id]/
│   │   │       └── route.js      ← GET /api/dishes/[id]
│   │   └── orders/
│   │       └── route.js          ← POST /api/orders
│   │
│   ├── checkout/
│   │   ├── page.js               ← /checkout (Server Component)
│   │   ├── checkout-form.js      ← Client Component, useActionState
│   │   └── submit-button.js      ← Client Component, useFormStatus
│   │
│   ├── menu/
│   │   └── page.js               ← /menu (Server Component)
│   │
│   ├── orders/
│   │   ├── page.js               ← /orders (Server Component)
│   │   └── cancel-button.js      ← Client Component, calls cancelOrder()
│   │
│   ├── actions.js                ← "use server" — placeOrder, cancelOrder
│   ├── layout.js                 ← Root layout with nav
│   └── page.js                   ← / (Home, Server Component)
│
├── lib/
│   ├── dishes.js                 ← Dish data (replace with DB later)
│   ├── orders.js                 ← In-memory order store
│   └── schema.js                 ← Zod validation schema (shared)
│
├── .env.local                    ← Secret env vars (never commit)
├── jsconfig.json                 ← @/ path alias
├── next.config.mjs
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### GET /api/dishes
Returns all dishes.

```bash
curl http://localhost:3000/api/dishes
```

### GET /api/dishes?category=Ethiopian
Returns only dishes in the given category.

```bash
curl "http://localhost:3000/api/dishes?category=Ethiopian"
```

### GET /api/dishes/[id]
Returns one dish. Returns `404` if not found.

```bash
curl http://localhost:3000/api/dishes/1
curl http://localhost:3000/api/dishes/999   # → 404
```

### POST /api/orders
Creates an order. Validates with Zod.

```bash
# Valid request → 201
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"Abebe","phone":"0912345678","dishId":"1"}'

# Invalid phone → 422
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"Abebe","phone":"123","dishId":"1"}'
```

---

## Pages

| URL | Description |
|---|---|
| `/` | Home — lists all dishes (Server Component) |
| `/menu` | Full menu with links to checkout |
| `/checkout` | Order form — Server Function + validation errors + pending state |
| `/orders` | All placed orders with cancel button |

---

## Key Concepts Demonstrated

### Route Handler vs Server Function

| | Route Handler | Server Function |
|---|---|---|
| File | `route.js` | `actions.js` with `"use server"` |
| Used by | Any HTTP client (mobile, curl, external app) | Your own app's UI |
| Called via | `fetch()` | `<form action={fn}>` or `useTransition` |
| Returns | `Response` object | Plain JS value |

### Server-Side Validation
The Zod schema in `lib/schema.js` is used in **both** the Route Handler and the Server Function. Browser validation improves UX; server validation is the actual enforcement.

### Ownership Check in cancelOrder
```js
// The client never decides this — the server does
if (order.userId !== user.id) {
  return { error: "You are not allowed to cancel this order" };
}
```
Hiding a button in the UI is not security. The server must always verify ownership.

### useActionState
Connects the value returned by a Server Function back to the form:
```js
const [state, formAction] = useActionState(placeOrder, initialState);
// state.fieldErrors → show inline validation errors
// state.success     → show success message
```

### useFormStatus
Shows pending state while the Server Function is running:
```js
const { pending } = useFormStatus();
// pending = true  → "Sending..."
// pending = false → "Place Order"
```

### revalidatePath
After writing data, tells Next.js to refresh the affected route:
```js
orders.push(order);
revalidatePath("/orders");
```

---

## Environment Variables

```bash
# .env.local — never commit this file

# Server-only (no NEXT_PUBLIC_ prefix)
DATABASE_URL=postgres://...
TELEBIRR_SECRET=<your-secret>

# Safe to expose to the browser
NEXT_PUBLIC_MAP_KEY=<your-map-key>
```

Variables **without** `NEXT_PUBLIC_` are server-only.
Variables **with** `NEXT_PUBLIC_` are bundled into client code — never put secrets there.

---

## Tech Stack

- [Next.js 15](https://nextjs.org/) — App Router
- [React 19](https://react.dev/) — `useActionState`, `useFormStatus`
- [Zod](https://zod.dev/) — schema validation

---

## Next Steps (after this lesson)

- Replace `lib/orders.js` in-memory array with a real database (PostgreSQL, MongoDB, etc.)
- Add real authentication (NextAuth.js / Clerk) and replace the `demo-user` stub in `cancelOrder`
- Add Tailwind CSS for styling
- Add `loading.js` files for streaming UI
- Add `error.js` files for error boundaries
