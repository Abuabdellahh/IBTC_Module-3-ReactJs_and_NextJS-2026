# Rendering Strategy

## /  (Home)

**Static — Server Component**

The home page contains only static marketing content.
No data fetching is required, so it pre-renders at build time.

## /menu  (Menu list)

**Dynamic — Server Component**

The page reads an optional `?category=` query parameter and fetches
dishes directly from `lib/dishes.js` on the server.

No API layer is needed here because the Server Component can access
the data source directly. Adding a `GET /api/dishes` call in between
would be an unnecessary round-trip.

## /menu/[id]  (Dish detail)

**Statically pre-rendered — Server Component**

`generateStaticParams()` provides all known dish IDs at build time.
Next.js pre-renders each dish page as a static HTML file.

Unknown IDs fall through to `notFound()`, which renders the custom
not-found page.

## /cart

**Client-side interactive — Client Component (CartClient)**

The cart holds browser-specific state (quantities, additions, removals).
This state cannot live on the server because it belongs to the user's
current session in the browser.

The page shell (`app/cart/page.js`) remains a Server Component.
Only `components/CartClient.jsx` carries the `"use client"` directive,
keeping the client boundary as small as possible.

## /checkout

**Server Component + Server Action**

The page itself is a Server Component that passes the dish list to
`CheckoutForm`. The form uses a Server Action (`placeOrder`) so the
mutation runs on the server without a manually written `fetch()` call.

`useActionState` connects the server's validation errors back to the
form. `useFormStatus` drives the pending state of the submit button.

## /api/dishes  (Route Handler)

**Dynamic — Route Handler**

Exists for external HTTP clients (mobile apps, third-party integrations).
The Next.js UI itself does not call this endpoint — it reads dishes
directly in Server Components.

## /api/orders  (Route Handler)

**Dynamic — Route Handler**

Provides a `POST` endpoint for external clients that need to place
orders over HTTP (e.g. a mobile app or a payment webhook).
The Next.js checkout form uses the Server Action instead.
