# 🍽 Addis Eats

> **Day 40 · Module 3 · IBT Frontend Cohort 2026**
> Next.js Foundations Project — bringing together every concept from the week into one complete, production-ready application.

A full-stack Ethiopian food-ordering app built entirely with the **Next.js 15 App Router** — no separate backend, no separate frontend. One codebase, one `npm run build`.

---

## ✨ Live Features

| Page | What you can do |
|---|---|
| **Home** `/` | Landing page with feature highlights |
| **Menu** `/menu` | Browse all 8 dishes; filter by category |
| **Dish Detail** `/menu/[id]` | View description, price, and order directly |
| **Cart** `/cart` | Add/remove items, adjust quantities, see running total |
| **Checkout** `/checkout` | Place an order with real server-side validation |

---

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Dev server
npm run dev
# → http://localhost:3000

# 3. Production build (required for final verification)
npm run build
npm run start
```

---

## 🗂 Project Structure

```
addis-eats/
│
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout — header, nav, footer (Server)
│   ├── page.js                   # / Home (Static Server Component)
│   ├── not-found.js              # Global 404 — triggered by notFound()
│   ├── actions.js                # "use server" — placeOrder Server Action
│   ├── globals.css               # Tailwind CSS v4 entry point
│   │
│   ├── menu/
│   │   ├── layout.js             # Nested layout — category sidebar (Server)
│   │   ├── page.js               # /menu — fetches & filters dishes (Server)
│   │   ├── loading.js            # Skeleton shown while route loads
│   │   ├── error.js              # Error boundary with reset button (Client ⚡)
│   │   └── [id]/
│   │       └── page.js           # /menu/[id] — dish detail + generateStaticParams
│   │
│   ├── cart/
│   │   └── page.js               # /cart — Server shell → CartClient
│   │
│   ├── checkout/
│   │   └── page.js               # /checkout — passes dishes to CheckoutForm
│   │
│   └── api/
│       ├── dishes/
│       │   └── route.js          # GET /api/dishes — for external HTTP clients
│       └── orders/
│           └── route.js          # POST /api/orders — for external HTTP clients
│
├── components/
│   ├── CartClient.jsx            # Interactive cart state (Client ⚡)
│   └── CheckoutForm.jsx          # useActionState + useFormStatus (Client ⚡)
│
├── lib/
│   └── dishes.js                 # getDishes() / getDishById() — swap for DB later
│
├── STRATEGY.md                   # Why each route uses its rendering approach
├── BOUNDARY.md                   # Every Server/Client decision explained
└── README.md
```

---

## 🏗 Architecture at a Glance

```
Browser
  │
  ├── GET /menu          → Server Component → getDishes() → HTML
  ├── GET /menu/3        → Static HTML (pre-rendered at build time)
  ├── POST checkout form → Server Action → validate → create order
  ├── GET /api/dishes    → Route Handler → JSON  (for mobile / external)
  └── POST /api/orders   → Route Handler → JSON  (for mobile / external)
```

### Server / Client split

```
RootLayout          Server  — shared nav, metadata
HomePage            Server  — static content
MenuLayout          Server  — category sidebar links
MenuPage            Server  — fetches dishes directly, no API needed
DishPage            Server  — async params, generateStaticParams
loading.js          Server  — Tailwind skeleton (Suspense boundary)
error.js            Client ⚡ — needs onClick + reset()
CartPage            Server  — shell only
  └── CartClient    Client ⚡ — useState for quantities
CheckoutPage        Server  — passes dish list as prop
  └── CheckoutForm  Client ⚡ — useActionState + useFormStatus
```

> **The rule:** `"use client"` only when the component actually needs `useState`, `useEffect`, browser event handlers, or a hook that requires client context. Everything else stays on the server.

---

## 🔑 Key Concepts Demonstrated

### 1 — App Router file conventions
```
app/menu/page.js          →  /menu
app/menu/[id]/page.js     →  /menu/1, /menu/2, /menu/8
app/menu/layout.js        →  wraps every /menu/* route
app/menu/loading.js       →  shown by Suspense while route loads
app/menu/error.js         →  shown when the route throws
app/not-found.js          →  shown when notFound() is called
app/api/orders/route.js   →  POST /api/orders
```

### 2 — Nested layouts
```
RootLayout  (app/layout.js)
  └── MenuLayout  (app/menu/layout.js)
        ├── MenuPage       /menu
        └── DishPage       /menu/[id]
```

### 3 — Server Components fetch data directly
```js
// app/menu/page.js — no fetch(), no useEffect, no API call
export default async function MenuPage({ searchParams }) {
  const { category } = await searchParams;
  const dishes = await getDishes();          // direct data access
  // ...
}
```
No `/api/dishes` round-trip needed from the UI — the Server Component reads the data source directly.

### 4 — Dynamic params are async (Next.js 15)
```js
export default async function DishPage({ params }) {
  const { id } = await params;   // ← must await in Next.js 15
  const dish = await getDishById(id);
}
```

### 5 — generateStaticParams — pre-render at build time
```js
export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((dish) => ({ id: String(dish.id) }));
}
// Result: /menu/1 … /menu/8 are static HTML files
```

### 6 — Server Action — form mutation without fetch()
```js
// app/actions.js
"use server";
export async function placeOrder(previousState, formData) {
  // validate → create order → revalidatePath → return result
}

// components/CheckoutForm.jsx
const [state, formAction] = useActionState(placeOrder, initialState);
<form action={formAction}>   // ← no manual fetch() needed
```

### 7 — useFormStatus — pending state inside the form
```js
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? "Placing Order..." : "Place Order"}
    </button>
  );
}
```

### 8 — Client boundary kept minimal
```
CartPage (Server Component)          ← no "use client"
  └── CartClient (Client Component)  ← "use client" only here
```
The entire page is not made a Client Component just because one part needs interactivity.

### 9 — Route Handlers for external clients
The UI never calls `/api/dishes` — it reads data directly in Server Components.
The Route Handlers exist for **external callers** (mobile apps, webhooks, third-party services).

### 10 — Server-side validation
```js
// Both the Server Action and the Route Handler validate independently.
// Browser validation = good UX.
// Server validation = actual enforcement.
if (!phone || !/^(09\d{8}|\+2519\d{8})$/.test(phone)) {
  errors.phone = "Enter a valid Ethiopian phone number.";
}
```

---

## 🍽 The Menu (8 dishes)

| # | Dish | Category | Price |
|---|---|---|---|
| 1 | 🥩 Kitfo | Traditional | 350 ETB |
| 2 | 🍗 Doro Wot | Traditional | 400 ETB |
| 3 | 🫘 Shiro | Vegetarian | 250 ETB |
| 4 | 🫓 Chechebsa | Traditional | 220 ETB |
| 5 | 🥘 Tibs | Traditional | 380 ETB |
| 6 | 🍲 Misir Wot | Vegetarian | 200 ETB |
| 7 | 🍔 Burger | Fast Food | 180 ETB |
| 8 | 🥪 Club Sandwich | Fast Food | 160 ETB |

---

## 🌐 API Endpoints

These endpoints exist for external HTTP clients. The Next.js UI does **not** call them.

### `GET /api/dishes`
Returns all dishes.
```bash
curl http://localhost:3000/api/dishes
```

### `GET /api/dishes?category=vegetarian`
Returns dishes filtered by category (`traditional` | `vegetarian` | `fast-food`).
```bash
curl "http://localhost:3000/api/dishes?category=vegetarian"
```

### `POST /api/orders`
Creates an order. Validates `name` and `phone`.

```bash
# ✅ Valid — returns 201
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"Almaz Tadesse","phone":"0912345678"}'

# ❌ Invalid phone — returns 422
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"A","phone":"0912"}'
```

**Success response `201`**
```json
{
  "id": "ord-1727000000000",
  "name": "Almaz Tadesse",
  "phone": "0912345678",
  "createdAt": "2026-01-01T12:00:00.000Z"
}
```

**Validation error `422`**
```json
{
  "error": "Validation failed",
  "fieldErrors": {
    "name": "Name must contain at least 2 characters.",
    "phone": "Enter a valid Ethiopian phone number (09... or +2519...)."
  }
}
```

---

## 🧪 Testing Failure Cases

**Unknown dish ID → custom 404**
```
http://localhost:3000/menu/99999
```

**Simulate slow loading → skeleton UI**
Add to `lib/dishes.js` temporarily:
```js
await new Promise((r) => setTimeout(r, 3000));
```
Visit `/menu` — the animated skeleton appears.

**Simulate error → error boundary**
Add to `lib/dishes.js` temporarily:
```js
throw new Error("Database connection failed");
```
Visit `/menu` — the error boundary appears with a "Try Again" button.

**Invalid checkout → inline server errors**
Submit the form with `Name: A` and `Phone: 0912`.
Both fields are rejected by the Server Action and errors appear inline.

**JavaScript disabled → form still works**
Disable JS in DevTools → Network tab → submit the checkout form.
Server Actions support progressive enhancement — the form submits and the server responds without client JS.

---

## 🏭 Production Build Output

```
Route (app)                    Size     First Load JS
┌ ○ /                          172 B    106 kB
├ ○ /_not-found                133 B    103 kB
├ ƒ /api/dishes                133 B    103 kB
├ ƒ /api/orders                133 B    103 kB
├ ○ /cart                      989 B    107 kB
├ ƒ /checkout                  1.3 kB   104 kB
├ ƒ /menu                      172 B    106 kB
└ ● /menu/[id]                 172 B    106 kB
    ├ /menu/1  …  /menu/8      (8 static pages)

○ Static    ●  SSG (generateStaticParams)    ƒ Dynamic
```

17 pages total. Zero build errors.

---

## 🛠 Tech Stack

| Tool | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15 | App Router, Server Components, Server Actions |
| [React](https://react.dev/) | 19 | `useActionState`, `useFormStatus` |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first styling |

---

## 📄 Documentation

| File | Contents |
|---|---|
| [`STRATEGY.md`](./STRATEGY.md) | Rendering decision for every route with reasoning |
| [`BOUNDARY.md`](./BOUNDARY.md) | Every Server/Client Component decision explained |

---

## 🔮 Next Steps

- Replace `lib/dishes.js` array with a real database (PostgreSQL via Prisma, or MongoDB)
- Add authentication with [NextAuth.js](https://next-auth.js.org/) or [Clerk](https://clerk.com/)
- Persist cart state with `localStorage` or a server-side session
- Add image support with `next/image` for each dish
- Deploy to [Vercel](https://vercel.com/) with `git push`
