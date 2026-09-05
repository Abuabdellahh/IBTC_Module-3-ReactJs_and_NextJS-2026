# Addis Eats — Day 31

React Router. The Day 29 single-page app is split across real URLs: a shared
layout, a menu page, a page per dish, the category filter in the query string,
a cart that survives navigation, and a checkout behind a sign-in guard.

- **`BrowserRouter` + route table in `App`** — every screen is a `<Route>`
- **`Layout`** with header, nav and `<Outlet>` wraps every screen
- **`/menu`** fetches dishes; category lives in `?category=` via `useSearchParams`
- **`/menu/:id`** reads the id with `useParams` and shows one dish
- **`/checkout`** is guarded by `RequireAuth` — unauthenticated users are sent
  to `/signin` and returned after signing in
- **`CartContext`** keeps the order alive across navigation
- **`AuthContext`** holds the mock sign-in state
- **`*`** catch-all renders a 404 page

---

## Quick start

```bash
cd DAY-31/addis-eats
npm install
npm run dev          # http://localhost:5173
```

| Task               | Command                                         | URL                   |
| ------------------ | ----------------------------------------------- | --------------------- |
| Dev server (HMR)   | `npm run dev`                                   | http://localhost:5173 |
| Production build   | `npm run build`                                 | —                     |
| Preview build      | `npm run preview`                               | http://localhost:4173 |
| PropTypes check    | `npm run check:props`                           | —                     |
| Phone check        | `npm run check:phone`                           | —                     |
| All checks         | `npm run check`                                 | —                     |

---

## Route table

```
/                   Landing         index route — welcome + CTA link to /menu
/menu               MenuPage        dish list, category filter in query string
/menu/:id           DishPage        single dish detail, Add to cart
/checkout           CheckoutPage    guarded — requires sign-in
/signin             SignIn          signs in and redirects back to intended page
*                   NotFound        404 catch-all
```

All routes are nested inside `Layout`, which renders the shared header, nav
and `<Outlet />`.

---

## How the cart survives navigation

`CartContext` wraps the whole app in `main.jsx`. Any component can call
`useCart()` to read `{ cart, addToCart, clearCart }` — the values never reset
when the URL changes because the context lives above the router.

```jsx
// main.jsx
<BrowserRouter>
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
</BrowserRouter>
```

The nav badge updates live:

```jsx
<NavLink to="/checkout">
  Checkout {cart.items > 0 && <span className="nav__badge">{cart.items}</span>}
</NavLink>
```

---

## Category filter in the query string

`MenuPage` reads and writes `?category=` with `useSearchParams` instead of
`useState`. The filter is now part of the URL — shareable, bookmarkable, and
the browser back button works.

```jsx
const [searchParams, setSearchParams] = useSearchParams()
const category = searchParams.get('category') ?? 'All'

const setCategory = (value) => {
  setSearchParams(value === 'All' ? {} : { category: value })
}
```

The fetch effect re-runs when `category` changes (it is in the dependency
array), and the `AbortController` cleanup cancels the previous request.

---

## `menu/:id` and `useParams`

Each dish name in the list is a `<Link to={`/menu/${id}`}>`. `DishPage` reads
the id and finds the matching dish:

```jsx
const { id } = useParams()

loadDishes(signal).then((all) => {
  const found = all.find((d) => d.id === id)
  if (!found) throw new Error(`No dish found with id "${id}"`)
  setDish(found)
})
```

---

## `RequireAuth` and the redirect-back pattern

```jsx
// RequireAuth.jsx
const { user } = useAuth()
const location = useLocation()

if (!user) {
  return <Navigate to="/signin" state={{ from: location }} replace />
}
return children
```

`SignIn` reads `location.state.from` and navigates there after a successful
sign-in, so the user lands exactly where they were trying to go:

```jsx
const from = location.state?.from?.pathname ?? '/menu'
signIn(name.trim())
navigate(from, { replace: true })
```

---

## Project structure

```
addis-eats/
├── public/
│   └── dishes.json            mock API endpoint — 10 dishes
├── scripts/
│   ├── check-proptypes.mjs    PropTypes smoke test
│   └── check-telebirr.mjs     phone validation unit checks
└── src/
    ├── main.jsx               BrowserRouter + AuthProvider + CartProvider
    ├── App.jsx                route table only
    ├── index.css
    ├── api.js                 loadDishes — fetch + res.ok check
    ├── context/
    │   ├── CartContext.jsx    cart state shared across all routes
    │   └── AuthContext.jsx    mock sign-in / sign-out
    ├── pages/
    │   ├── Landing.jsx        /
    │   ├── MenuPage.jsx       /menu  — useSearchParams for category
    │   ├── DishPage.jsx       /menu/:id  — useParams
    │   ├── CheckoutPage.jsx   /checkout  — guarded
    │   ├── SignIn.jsx         /signin  — redirect-back pattern
    │   └── NotFound.jsx       *
    ├── components/
    │   ├── Layout.jsx         header + nav + Outlet
    │   ├── RequireAuth.jsx    auth guard
    │   ├── CategoryBar.jsx    filter chips — controlled
    │   ├── DishList.jsx       maps dishes → Dish, or EmptyState
    │   ├── Dish.jsx           dish card with Link to /menu/:id
    │   ├── OrderSummary.jsx   running total
    │   ├── DeliveryForm.jsx   controlled form + TeleBirr validation
    │   ├── Receipt.jsx        post-checkout confirmation
    │   ├── EmptyState.jsx
    │   ├── Card.jsx
    │   └── Header.jsx
    ├── lib/
    │   ├── telebirr.js        normalise / validate / toInternational
    │   ├── format.js          formatEtb
    │   └── checkProps.js      dev-only PropTypes runner
    └── data/
        └── areas.js           delivery areas
```

---

## Troubleshooting

**Checkout redirects to `/signin` even when signed in** — make sure
`AuthProvider` wraps the app above `BrowserRouter` in `main.jsx`.

**Cart empties on navigation** — `CartProvider` must be above `<App />` (and
therefore above `<Routes>`), not inside a page component.

**`?category=` not reflected in chips** — `CategoryBar` must receive `selected`
from `searchParams.get('category')`, not from a separate `useState`.

**`/menu/doro-wat` shows "No dish found"** — the id in the URL must match the
`id` field in `dishes.json` exactly.

> **Note on React 19:** React 19 no longer validates `propTypes` on function
> components, so `src/lib/checkProps.js` runs `PropTypes.checkPropTypes`
> explicitly behind an `import.meta.env.DEV` guard. `package.json` pins
> `react-is` to v19 via `overrides` because `prop-types@15` ships
> `react-is@16`, which does not recognise React 19 elements.
