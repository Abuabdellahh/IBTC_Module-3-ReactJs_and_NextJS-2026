# PRESENTATION.md — The eight minutes

Present from the **deployed URL** (https://addis-eats-capstone-pink.vercel.app), not localhost. Rehearse once, aloud, with a timer.

**Before you start:** open these five files in tabs. Open two browser windows: one normal, one private.

| Have open | Be ready to explain |
| --- | --- |
| `app/menu/page.js` — **Server Component** | Why it isn't a client component: it only renders the catalogue, so it is prerendered at build time and ships no JavaScript of its own |
| `components/OrderStatusLive.js` — **Client Component** | Why it has to be one: it polls with SWR. It is seeded with the server's data (`fallbackData`), so there is no loading flash |
| `app/actions/orders.js` — **protected action** | The checks inside `cancelOrder` (session at line 38, ownership at line 42) and why the proxy isn't enough |
| `lib/db.js` — **data query** | `getOrderForUser(orderId, userId)`. The user id comes from the session, never the request. Someone else's order gives 404 |
| `components/AccountNav.js` + `PERF.md` — **something refactored** | Before (the DAY-45 version): the layout read the cookie, which made every page dynamic. After: a client account menu, so the menu is static. Then the CLS fix (0.172 → 0) |

## Script

| Min | Cover | Say / do |
| --- | --- | --- |
| 0–1 | **Who it is for** | "People in Addis who want home-style food delivered, and a kitchen that needs one list of orders." No code. |
| 1–3 | **Main flow, live** | Private window → Menu → add Doro Wat ×2 and Shiro → Cart → Checkout (signs you in) → use a wrong phone first to show the error → place the order. Then in the normal window, sign in as kitchen → **Start preparing**. The customer page changes within 5 s. |
| 3–5 | **One decision** | "The root layout doesn't read the cookie." Show the build table: `/menu` static, `/orders` dynamic. Reading cookies in the layout would have made the menu dynamic too, so the account menu is a small client component that asks `/api/session`. |
| 5–6 | **Three attacks** | Run `npm run verify:attacks` against the live URL, or show it live: (1) a copied cancel request in a private window gets a redirect, `proxy.js:23` / `orders.js:38`; (2) as Abebe, open `/orders/ord_sara_demo` and get not-found, `page.js:25`; (3) `/signin?next=https://example.com` ends up at `/menu`, `redirect.js:13`. |
| 6–7 | **PERF.md** | CLS 0.172 → 0. Cause: the header's height depended on the width of the account placeholder. Fix: the nav always gets its own row on phones. Performance 91 → 98. |
| 7–8 | **What was cut** | FUTURE.md #1: data lives in Vercel's Runtime Cache, not a database. Tell the story: the first deploy used memory, the live check showed 20 × 404 because Vercel splits routes into separate functions, and the fix touched only `lib/db.js`. A real database is Module 5. Then rate limiting and CSP, and why. |

## If something goes wrong

- **The site is down:** roll back in Vercel (promote the previous deployment) and say so calmly.
- **The network fails:** run `npm run build && npm start` locally and say why.
- **Orders vanished:** the Runtime Cache evicted the data (the demo accounts re-seed themselves). Say it is FUTURE.md #1 and place a new order.

## Likely questions

- *Why is the status card a client component?* It polls in the browser. The first render still comes from the server through `fallbackData`.
- *What if I call `cancelOrder` signed out?* The proxy redirects it. If the proxy were removed, line 38 returns an error. The check is in the action, not the button.
- *Why did you choose this rendering strategy?* Public pages don't depend on who is looking, so they are built once. Private pages do, so they render per request.
- *What would you do with another week?* A real database, then rate limiting, then CSP (FUTURE.md 1–3).
