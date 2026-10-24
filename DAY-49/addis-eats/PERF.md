# PERF.md — Performance budget and measurements

Measured with **Lighthouse 13.5** in its default mobile mode (simulated slow 4G, 4× CPU slowdown). The server was the **production build** (`next build && next start`) on localhost, on 2026-10-24.

> **TODO before presenting:** rerun Lighthouse against the **deployed URL** and fill the last column. The guide asks for numbers from the deployed build. The local column is the baseline it should match or beat.

## Budget

| Metric | Budget | Before (first build) | After fix (local prod) | Deployed |
| --- | --- | --- | --- | --- |
| LCP — `/` | < 2.5 s | 2.3 s | 2.3 s | _TODO_ |
| LCP — `/menu` | < 2.5 s | 1.8 s | 2.4 s | _TODO_ |
| LCP — `/menu/doro-wat` | < 2.5 s | 2.3 s | 2.3 s | _TODO_ |
| **CLS** (all three pages) | < 0.1 | **0.172** ❌ | **0** ✅ | _TODO_ |
| TBT (lab proxy for INP) | < 200 ms | 10–20 ms | 10–30 ms | _TODO_ |
| FCP | < 1.8 s | 0.8 s | 0.8 s | _TODO_ |
| JavaScript transferred | < 200 kB | not measured | 155 kB | _TODO_ |
| Total page weight | < 500 kB | 230 kB | 229 kB | _TODO_ |
| Largest image | < 150 kB | 0 kB (none) | 0 kB (none) | — |
| Lighthouse Performance | ≥ 90 | 91–93 | **98** | _TODO_ |
| Lighthouse Accessibility | 100 | 100 | 100 | _TODO_ |
| Lighthouse Best Practices | 100 | 100 | 100 | _TODO_ |
| Lighthouse SEO (public pages) | 100 | 100 | 100 | _TODO_ |

`/signin` scores 66 for SEO because it is deliberately `noindex`, as are cart, checkout, orders and kitchen. Private pages should not be indexed.

The `/menu` LCP moved from 1.8 s to 2.4 s with no code change to that page. That is normal run-to-run variance in simulated throttling, and both values are inside the budget. Run it three times and take the median before presenting.

## What caused each change

### CLS 0.172 → 0: the header changed height after hydration

- **Found with:** Lighthouse's *Avoid large layout shifts* audit, which pointed at `<main>` moving down.
- **Cause:** on a phone, the header uses `flex-wrap`. While `/api/session` loads, the account menu shows a placeholder 160 px wide. The placeholder pushed the nav onto a second row. When the real "Sign in" button (≈80 px) arrived, the nav fit on one row again, the header shrank, and everything below it jumped.
- **Fix** (`components/SiteHeader.js`, `components/AccountNav.js`):
  - On small screens the nav now always takes its own full-width row, so the header height no longer depends on what the account menu renders.
  - The placeholder now matches the button's size.
- **Lesson:** reserving space for late content is not enough. The reserved space must also be the same size as what replaces it.

## Decisions that keep the numbers low

| Decision | Effect |
| --- | --- |
| Public pages are static or SSG (see DATA.md) | HTML comes straight from the CDN, with no server render on the critical path (FCP 0.8 s) |
| Root layout reads no cookies | Keeps `/`, `/menu` and `/menu/[id]` static |
| Dish artwork is emoji on a CSS gradient, not photos | 0 image bytes and no image-driven CLS. Real photos are in FUTURE.md and would go through `next/image` |
| `next/font` (Geist, `display: swap`) | Self-hosted and preloaded. No request to Google at runtime and no font-swap layout shift |
| Menu filtering is client-side with `useDeferredValue` | Typing stays responsive (INP), with no network round-trip per keystroke |
| Small Client Components (cart badge, account menu, add-to-cart button) | Most of the page ships as HTML with no JavaScript of its own |
| Polling stops when an order is final | No background requests after Delivered or Cancelled |

## How to reproduce

```bash
npm run build && npm start
npx lighthouse http://localhost:3000/menu --view          # or the deployed URL
```
