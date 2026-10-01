# Server / Client Boundary

## RootLayout  →  app/layout.js

**Server Component**

Provides shared HTML structure, metadata, header, nav, and footer.
No interactivity required — stays on the server.

## HomePage  →  app/page.js

**Server Component**

Static marketing content. No state, no events, no browser APIs.

## NotFound  →  app/not-found.js

**Server Component**

Static error page. Rendered by Next.js when `notFound()` is called.

## MenuLayout  →  app/menu/layout.js

**Server Component**

Renders the category sidebar with `<Link>` elements.
No interactivity required.

## MenuPage  →  app/menu/page.js

**Server Component**

Reads `searchParams` and fetches dishes directly.
No state or browser APIs needed.

## Loading  →  app/menu/loading.js

**Server Component**

Skeleton UI shown by Next.js Suspense while the menu route loads.

## Error  →  app/menu/error.js

**Client Component  ← "use client"**

Needs `onClick` on the "Try Again" button and access to the `reset()`
function provided by Next.js error boundaries.
This is the correct reason to use `"use client"`.

## DishPage  →  app/menu/[id]/page.js

**Server Component**

Reads `params.id` (async), fetches the dish, calls `notFound()` if
missing. No interactivity required.

## CartPage  →  app/cart/page.js

**Server Component**

Shell page. Delegates all interactivity to `CartClient`.

## CartClient  →  components/CartClient.jsx

**Client Component  ← "use client"**

Manages quantity state with `useState`. Handles increment/decrement
button clicks. This is the correct reason to use `"use client"`.

The client boundary is kept as small as possible — only this component
is a Client Component, not the entire cart page.

## CheckoutPage  →  app/checkout/page.js

**Server Component**

Fetches the dish list and passes it as a prop to `CheckoutForm`.
The page itself has no interactivity.

## CheckoutForm  →  components/CheckoutForm.jsx

**Client Component  ← "use client"**

Uses `useActionState` (React) and `useFormStatus` (react-dom).
Both hooks require a Client Component context.

## SubmitButton  (inside CheckoutForm)

**Client Component  ← inherits from CheckoutForm**

Uses `useFormStatus` to read the form's pending state.
Must be a child of the `<form>` element to work correctly.

---

## The Rule Applied Throughout This Project

> Add `"use client"` only when the component actually needs:
> - `useState` / `useReducer`
> - `useEffect`
> - Browser event handlers (`onClick`, `onChange`, etc.)
> - Browser-only APIs
> - React hooks that require a client context (`useFormStatus`, `useActionState`)

Every other component stays on the server.
