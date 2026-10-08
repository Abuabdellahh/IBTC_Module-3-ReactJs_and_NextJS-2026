# AUTH.md — Addis Eats Authentication & Authorization

## Day 45 — Security Architecture

---

## Core Principle

> Authentication answers: **Who are you?**
> Authorization answers: **What are you allowed to do?**

---

## Session Cookie

```js
cookieStore.set("session", userId, {
  httpOnly: true,   // not readable by browser JavaScript
  secure: true,     // HTTPS only in production
  sameSite: "lax",  // CSRF protection
  maxAge: 60 * 60 * 24 * 7,  // 7 days
  path: "/",
});
```

Session tokens are **never** stored in `localStorage` — JavaScript on the page can read it.

---

## Three Protection Layers

```
Layer 1 — Middleware (middleware.js)
    ↓
Fast early redirect — proves a cookie EXISTS

Layer 2 — Page / Layout (getSession())
    ↓
Establishes real server-side identity

Layer 3 — Server Action / Route Handler (getSession() again)
    ↓
Verifies identity + ownership before any data change
```

---

## Route Protection Table

| Route / Action | Public | Middleware | Page Check | Role | Ownership |
|----------------|--------|------------|------------|------|-----------|
| `/` | ✅ | — | — | — | — |
| `/menu` | ✅ | — | — | — | — |
| `/menu/[id]` | ✅ | — | — | — | — |
| `/cart` | ✅ | — | — | — | — |
| `/signin` | ✅ | — | — | — | — |
| `/checkout` | ❌ | ✅ | ✅ | any | — |
| `/orders` | ❌ | ✅ | ✅ | any | scoped query |
| `/orders/[id]` | ❌ | ✅ | ✅ | any | ✅ |
| `/kitchen` | ❌ | — | ✅ | **staff** | — |
| `placeOrder()` | ❌ | — | — | any | session.userId |
| `cancelOrder()` | ❌ | — | — | any | ✅ |
| `updateOrderStatus()` | ❌ | — | — | **staff** | — |

---

## Demo Credentials

| User | Email | Password | userId | Role |
|------|-------|----------|--------|------|
| Customer | user@example.com | password123 | demo-user-1 | customer |
| Staff | staff@example.com | staffpass123 | demo-staff-1 | staff |

---

## Open Redirect Protection

```js
// Unsafe
redirect(next);

// Safe — validated before use
const safeNext = typeof next === "string" && next.startsWith("/") ? next : "/";
```

Test: `/signin?next=https://example.com` must NOT redirect to the external site.

---

## Ownership Check Pattern

```js
// WRONG — trusts the browser
const userId = formData.get("userId");
await getOrders(userId);

// CORRECT — trusts the server session
const session = await getSession();
await getOrders(session.userId);
```

---

## Security Tests

| Test | Action | Expected |
|------|--------|----------|
| 1 | Visit `/orders` signed out | Redirect to `/signin?next=/orders` |
| 2 | Visit `/checkout` signed out | Redirect to `/signin?next=/checkout` |
| 3 | Call `cancelOrder("ord-3")` as demo-user-1 | Error: not allowed |
| 4 | Visit `/kitchen` as customer | Forbidden page |
| 5 | Visit `/kitchen` as staff | Kitchen page |
| 6 | `/signin?next=https://example.com` | Redirects to `/` |

---

## What Middleware Does NOT Do

Middleware proves a cookie exists.
It does NOT prove the user owns a specific order.
Ownership is verified inside Server Actions.
