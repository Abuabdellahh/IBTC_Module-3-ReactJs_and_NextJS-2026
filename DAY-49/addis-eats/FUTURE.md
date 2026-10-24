# FUTURE.md — What was cut, and why

Triage used the Day 49 test: *if it were removed, could someone still complete the main task, ordering food and following it?* If yes, it was not a Must.

## Must (done)

1. **The main flow end to end:** menu → cart → checkout → live order status. Verified in a real browser with a brand-new account.
2. **Authentication with all three attacks refused,** checked inside every write. Verified by `npm run verify:attacks`.
3. **Empty, loading and error states on every screen.** A new account sees a helpful screen everywhere, never a blank one.

## Should (done)

Kitchen dashboard with stats, sign-up, metadata and share card, sitemap and robots, the keyboard and screen-reader pass, and PERF.md numbers.

## Cut, in priority order, with the reason

| # | Item | Why it was cut | What it would take |
| --- | --- | --- | --- |
| 1 | **A real database** | Module 5 covers databases. The in-memory store is enough to demonstrate every frontend concept. **Known limitation:** orders and new accounts reset when the server restarts, and they aren't shared between Vercel instances. Sessions survive, because the cookie is signed rather than looked up. | Replace `lib/db.js` with Postgres (e.g. Neon) behind the same functions. Nothing else changes. |
| 2 | **Rate limiting on sign-in and sign-up** | Needs shared storage (#1) to count attempts across instances. | Upstash or a Postgres table, keyed by IP and email, at 5 attempts per 15 minutes. |
| 3 | **Content-Security-Policy header** | A strict CSP needs per-request nonces, which makes every page dynamic and would undo the static menu. It needs careful testing that this session did not have time for. | Next's nonce-based CSP guide, measured against PERF.md. |
| 4 | **Session revocation** | Signed cookies cannot be revoked before they expire (7 days). Signing out deletes the cookie, but a stolen copy would still work. | Store a session id in the database (#1) and check it in `getSession()`. |
| 5 | **Live kitchen queue** | Staff currently see new orders when they act or reload. Customers already get live status. | SWR polling on a `/api/kitchen` endpoint, or Server-Sent Events as in Day 47. |
| 6 | **Real dish photos** | Emoji artwork costs 0 kB and causes no layout shift. Photos need sourcing and licensing. | `next/image` with `sizes`, AVIF, and each image under 150 kB. |
| 7 | **Dark theme** | A "Could": nobody would notice it missing. | Tokens are already centralised in `app/globals.css`. Add a `prefers-color-scheme: dark` block. |
| 8 | **Amharic translation** | Real value for users in Addis, but a large change to every string. | `next-intl` with `/am` routes. |
| 9 | **Payments (telebirr / Chapa)** | Cash on delivery completes the flow. Payments need a backend and webhooks (Module 4). | Chapa checkout plus a webhook route handler. |
| 10 | **Cache Components / PPR** | Next 16's default model. The classic static/dynamic split was simpler to explain at this size. | `cacheComponents: true`, then move session reads behind `<Suspense>`. |
| 11 | **End-to-end tests in CI** | The flow was verified with a scripted browser run this session, but not committed as a test suite. | Playwright tests for the main flow and the battery, run on every push. |

## Refactors noted, not done today

- `AdvanceOrderButton` and `CancelOrderButton` share a pattern (action → inline error). It could become one `<ActionButton>` if a third appears.
- The status-step UI could show timestamps for each step once orders store a history (#1).

## From peer review and the presentation (Day 50)

_Add anything the reviewer or the assessors raise here. Do not fix it on the day._
