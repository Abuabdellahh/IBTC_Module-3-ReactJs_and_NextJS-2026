# AUTH.md — Addis Eats Authentication & Authorization Map

## Day 42 — Protection Summary

### Route Protection Table

| Route / Action         | Public? | Middleware | Page/Action Check | Role Required |
|------------------------|---------|------------|-------------------|---------------|
| `/`                    | ✅ Yes  | —          | —                 | —             |
| `/menu`                | ✅ Yes  | —          | —                 | —             |
| `/menu/[id]`           | ✅ Yes  | —          | —                 | —             |
| `/signin`              | ✅ Yes  | —          | —                 | —             |
| `/checkout`            | ❌ No   | ✅ Yes     | ✅ `getSession()` | customer/staff|
| `/orders`              | ❌ No   | ✅ Yes     | ✅ `getSession()` | customer/staff|
| `/kitchen`             | ❌ No   | —          | ✅ `getSession()` | **staff only**|
| `cancelOrder()`        | ❌ No   | —          | ✅ auth + ownership | —           |
| `placeOrder()`         | ❌ No   | —          | ✅ `getSession()` | customer/staff|
| `getOrdersForCurrentUser()` | ❌ No | —     | ✅ `getSession()` | —             |
| `POST /api/signin`     | ✅ Yes  | —          | validates credentials | —         |
| `POST /api/signout`    | ✅ Yes  | —          | deletes session cookie | —        |

---

## Three Protection Layers

### Layer 1 — Middleware (`middleware.js`)
- Runs before any page work begins
- Checks: does a `session` cookie exist?
- If not → redirect to `/signin?next=<original-path>`
- Covers: `/checkout/:path*`, `/orders/:path*`
- **What it proves:** a session cookie appears to exist (fast, early check)

### Layer 2 — Page / Layout (`getSession()`)
- Runs inside the Server Component
- Calls `getSession()` to establish the real authenticated identity
- If no session → `redirect("/signin?next=...")`
- If wrong role → renders Forbidden UI
- **What it proves:** the current server-side session can access this screen

### Layer 3 — Server Action / Route Handler
- Every mutation re-calls `getSession()` independently
- Checks authentication, then ownership (`order.userId === session.userId`)
- The browser is **never** trusted to supply a userId
- **What it proves:** the current user is authorized to perform this specific operation

---

## Security Rules Applied

1. **Never trust client-supplied IDs** — always use `session.userId` from the server
2. **httpOnly cookies** — session token is not readable by browser JavaScript
3. **Open redirect prevention** — `next` param validated with `startsWith("/")`
4. **Role is server-enforced** — hiding a nav link is UI only, not security
5. **Secrets never in `NEXT_PUBLIC_*`** — all auth logic is server-side only
6. **Passwords never stored in plain text** — demo only; production uses bcrypt/Argon2

---

## Demo Credentials

| User           | Email                | Password       | Role     | userId        |
|----------------|----------------------|----------------|----------|---------------|
| Customer       | user@example.com     | password123    | customer | demo-user-1   |
| Staff          | staff@example.com    | staffpass123   | staff    | demo-staff-1  |

---

## Security Tests

| Test | Action | Expected Result |
|------|--------|-----------------|
| 1 | Visit `/orders` while signed out | Redirect to `/signin?next=/orders` |
| 2 | Call `cancelOrder("ord-1")` while signed out | Error: "Not signed in" |
| 3 | Sign in as `demo-user-1`, call `cancelOrder("ord-2")` | Error: "You are not allowed to cancel this order" |
| 4 | Sign in as customer, visit `/kitchen` | Forbidden page |
| 5 | Sign in as staff, visit `/kitchen` | Kitchen page with all orders |
| 6 | Visit `/signin?next=https://example.com` | Redirects to `/` (not external site) |
