# AUTH.md — Authentication and data handling

## The session

- After sign-in or sign-up, `createSession()` (`lib/session.js`) sets an `ae_session` cookie. Its flags are `httpOnly`, `secure` in production, `sameSite=lax`, and a 7-day expiry.
- The cookie holds `{ sub, name, role, exp }` plus an **HMAC-SHA256 signature** made with `SESSION_SECRET` (`lib/auth/token.js`). Changing any character, such as the role, breaks the signature. `verifyToken()` then returns `null`, and the request counts as signed out. Signatures are compared in constant time (`lib/auth/token.js:43`).
- Passwords are stored as **scrypt** hashes with a per-user salt (`lib/auth/password.js`).
- Sign-up always creates a `customer`, never staff (`lib/db.js:75`).
- Every server file gets the user from `getSession()`. **No action, page or handler accepts a user id or role from the browser.**

## Three layers, and what each one proves

| Layer | Where | What it proves | What it does NOT prove |
| --- | --- | --- | --- |
| 1. Proxy | `proxy.js:23` | The request carries a cookie this server signed, and it hasn't expired. Without one, it redirects to `/signin?next=…` before any rendering. | That this user may see or change a *particular* record |
| 2. Page | `requireUser()` in `lib/session.js:42`, plus a scoped query in each page | The page renders only for a signed-in user, and only with *their* data | Anything about Server Actions. They are separate POST endpoints and can be called without loading the page |
| 3. Action / Route Handler | `app/actions/orders.js`, `app/api/orders/[id]/route.js` | **The actual security boundary.** Each write repeats the session check, the ownership or role check and the state check inside itself | — |

Layer 1 is only an optimisation: if it disappeared, layers 2 and 3 would still refuse every attack below.

## Every private route and action

| Route / action | Who | Checks inside it |
| --- | --- | --- |
| `/checkout` | signed in | proxy; `requireUser("/checkout")` |
| `/orders` | signed in | proxy; `requireUser`; `listOrdersForUser(session.userId)` |
| `/orders/[id]` | owner or staff | proxy; `requireUser`; `getOrderForUser(id, session.userId)` → `notFound()` (`app/orders/[id]/page.js:25`) |
| `/kitchen` | staff | proxy; `requireUser`; `session.role !== "staff"` → refusal screen, no data (`app/kitchen/page.js:32`) |
| `GET /api/orders/[id]` | owner or staff | no session → 401 (`route.js:13`); another person's order → 404 (`route.js:19`) |
| `GET /api/session` | anyone | returns only `{ name, role }` for the signed-in user |
| `placeOrder()` | signed in | session (`orders.js:21`); validates input and **re-prices from `lib/menu.js`** (the browser sends only ids and quantities); the owner is `session.userId`; the idempotency key blocks duplicates |
| `cancelOrder(id)` | owner | session (`orders.js:38`); ownership-scoped lookup (`orders.js:42`); only while `Placed` (`orders.js:45`) |
| `advanceOrder(id, status)` | staff | session (`orders.js:58`); role (`orders.js:61`); allowed transition (`orders.js:66`) |

Another customer's order returns **404, not 403**: the scoped query cannot tell "doesn't exist" from "not yours". That stops an attacker from probing which order ids exist.

## The three attacks, and the line that stops each one

### 1. Signed out, from the console

How to show it live:

1. Sign in as Abebe and place an order (a new order starts as `Placed`).
2. With the DevTools Network tab open, press **Cancel order → Yes, cancel it**.
3. Right-click the POST → **Copy as fetch**.
4. Paste it into the console of a **private window**, where you are signed out.

The same Server Action is now called with no session:

- **Refused:** `proxy.js:23` redirects to `/signin`.
- **If the proxy were bypassed:** `app/actions/orders.js:38` (`if (!session) return { error: … }`) stops it.
- `GET /api/orders/:id` signed out returns **401** (`app/api/orders/[id]/route.js:13`).

### 2. Signed in as someone else

Sign in as **abebe@example.com**, then target Sara's order `ord_sara_demo`:

- Calling `cancelOrder("ord_sara_demo")` returns *"Order not found."* The line that stops it is `app/actions/orders.js:42`: `getOrderForUser(orderId, session.userId)`.
- Calling `advanceOrder("ord_sara_demo", "Delivered")` returns *"Only kitchen staff can update orders."* (`app/actions/orders.js:61`).
- **Changing the id in the private URL** to `/orders/ord_sara_demo` shows the not-found page with none of Sara's data (`app/orders/[id]/page.js:25`).
- Editing the cookie's role to `staff` in DevTools breaks the signature, so the request is treated as signed out (`lib/auth/token.js:43`).

### 3. A crafted return link

`/signin?next=https://example.com`, `//example.com`, `/\example.com` and `javascript:alert(1)` all end up at **/menu** after sign-in.

- The line that stops it is `lib/auth/redirect.js:13`. A bare `startsWith("/")` check is not enough, because `//evil.com` passes it.
- It is applied twice: once to the hidden form field (`app/signin/page.js:16`), and again in the action (`app/actions/auth.js:24`), because the form value can be edited before it is posted.

## Verifying it

```bash
npm test                                                     # 22 unit tests, including every redirect and token attack
npm run build && npm start &                                 # or use the deployed URL
BASE_URL=http://localhost:3000 SESSION_SECRET=… npm run verify:attacks
```

Last run against the local production build (`next start`): **22 checks, all refused**. The output is in the table below.

| Check | Result |
| --- | --- |
| Signed out: `/orders`, `/checkout`, `/kitchen`, `/orders/:id` | 307 → `/signin?next=…` |
| Signed out: `GET /api/orders/:id` | 401 |
| Signed out: `cancelOrder()` / `advanceOrder()` called directly | 307 → `/signin` (proxy) |
| Forged plain-id cookie / role edited to staff | 401, and the proxy redirects |
| `?next=` with an external URL, `//`, `/\` or `javascript:` | the hidden field is `/menu` |
| Abebe → Sara's order: API / page / cancel / advance | 404 / not-found / "Order not found" / "Only kitchen staff" |
| Sara's order afterwards | still `Placed` |

**Deployed:** _TODO: run `npm run verify:attacks` with `BASE_URL` set to the live URL and paste the last line here._

## Also checked

- **Secrets in the bundle:** the only `NEXT_PUBLIC_` variable is the site URL. `SESSION_SECRET` is read only in server files. `lib/session.js` and `lib/db.js` import `server-only`, so the build fails if a Client Component imports them.
- **Secrets in git history:** `.env*` is git-ignored (except `.env.example`, which holds no values).
- **Security headers** (`next.config.mjs`): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and no `X-Powered-By`.
- **CSRF:** Server Actions accept only same-origin POSTs (Next.js compares `Origin` with `Host`), and the cookie is `sameSite=lax`.
