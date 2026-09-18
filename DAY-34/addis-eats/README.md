# Addis Eats — Day 34

Hardening: error boundaries, lazy-loaded routes, one fixed re-render, and a
dish detail modal rendered through a portal.

- **`ErrorBoundary`** wraps the dish list and the nav cart badge separately —
  a crash in one subtree shows a scoped fallback; the rest of the page survives
- **`DishPage` and `CheckoutPage` are lazy-loaded** behind `Suspense` — their
  JS chunks are only fetched when the user navigates to those routes
- **`Dish` is wrapped in `memo`** and `addToCart` is stabilised with
  `useCallback` in `MenuPage` — adding a dish no longer re-renders every other
  dish card in the list
- **`DishModal`** uses `createPortal` to render into `document.body`, closes
  on Escape, and returns focus to the trigger button on exit

---

## Quick start

```bash
cd DAY-34/addis-eats
npm install
npm run dev          # http://localhost:5173
```

| Task             | Command               | URL                   |
| ---------------- | --------------------- | --------------------- |
| Dev server (HMR) | `npm run dev`         | http://localhost:5173 |
| Production build | `npm run build`       | —                     |
| Preview build    | `npm run preview`     | http://localhost:4173 |
| PropTypes check  | `npm run check:props` | —                     |
| Phone check      | `npm run check:phone` | —                     |

---

## Error boundaries

`ErrorBoundary` is a class component — only class components can implement
`getDerivedStateFromError`, which is what React calls during the render phase
to switch to the fallback UI.

```jsx
// MenuPage.jsx
<ErrorBoundary fallback="The dish list failed to render. Try refreshing.">
  <DishList ... />
</ErrorBoundary>

// Layout.jsx
<ErrorBoundary fallback="Checkout">
  <NavLink to="/checkout">Checkout {cart.items > 0 && ...}</NavLink>
</ErrorBoundary>
```

Each boundary is independent: a crash inside `DishList` shows its fallback
while the search bar, category chips, and nav remain fully functional.

To verify: temporarily throw inside any `Dish` render — only that boundary's
fallback appears; the rest of the screen is unaffected.

---

## Lazy loading

```jsx
// App.jsx
const DishPage     = lazy(() => import('./pages/DishPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))

<Route path="menu/:id" element={
  <Suspense fallback={<RouteSkeleton />}>
    <DishPage />
  </Suspense>
} />
```

`lazy` + dynamic `import()` tells the bundler to split those modules into
separate chunks. The `Suspense` fallback (`Loading…`) is shown while the chunk
downloads. `Landing` and `MenuPage` are kept in the main bundle because they
are on the critical path.

---

## Fixing the unnecessary re-render

**Root cause (found via Profiler):** every time `addToCart` is called,
`CartContext` updates, which causes `MenuPage` to re-render. `MenuPage` creates
a new `addToCart` arrow function on every render. `DishList` receives it as
`onAdd` and passes it down to every `Dish`. Without `memo`, all 10 dish cards
re-render even though their data is unchanged.

**Fix — two parts:**

```jsx
// MenuPage.jsx — stabilise the callback reference
const stableAddToCart = useCallback((price) => addToCart(price), [addToCart])

// Dish.jsx — skip re-render when props are reference-equal
const Dish = memo(function Dish(props) { ... })
```

`useCallback` returns the same function reference as long as `addToCart` from
context is stable. `memo` then skips re-rendering any `Dish` whose props
haven't changed. After the fix, clicking "Add" on one dish re-renders only
that dish (its `count` changed) — the other nine are skipped.

---

## Dish modal with createPortal

```jsx
// DishModal.jsx
export default function DishModal({ dish, onClose, triggerRef }) {
  const dialogRef = useRef(null)

  useEffect(() => { dialogRef.current?.focus() }, [])          // focus on open
  useEffect(() => () => triggerRef?.current?.focus(), [triggerRef]) // return on close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(<div className="modal-backdrop" ...>...</div>, document.body)
}
```

`createPortal` renders the backdrop and dialog as a direct child of
`document.body`, so it sits above all other stacking contexts regardless of
where in the component tree `DishModal` is used. The `triggerRef` is the dish
name button; focus returns to it when the modal unmounts.

---

## Project structure

```
addis-eats/
├── public/
│   └── dishes.json
├── scripts/
│   ├── check-proptypes.mjs
│   └── check-telebirr.mjs
└── src/
    ├── main.jsx
    ├── App.jsx                lazy splits for DishPage + CheckoutPage
    ├── index.css
    ├── api.js
    ├── context/
    │   ├── CartContext.jsx
    │   └── AuthContext.jsx
    ├── pages/
    │   ├── Landing.jsx
    │   ├── MenuPage.jsx       useCallback stabilises onAdd; ErrorBoundary around list
    │   ├── DishPage.jsx       lazy-loaded
    │   ├── CheckoutPage.jsx   lazy-loaded
    │   ├── SignIn.jsx
    │   └── NotFound.jsx
    ├── components/
    │   ├── ErrorBoundary.jsx  NEW — class component, scoped fallback
    │   ├── DishModal.jsx      NEW — createPortal, Escape, focus return
    │   ├── Dish.jsx           memo + modal trigger button
    │   ├── Layout.jsx         ErrorBoundary around cart badge
    │   ├── DishList.jsx
    │   ├── CategoryBar.jsx
    │   ├── OrderSummary.jsx
    │   ├── DeliveryForm.jsx
    │   ├── Receipt.jsx
    │   ├── EmptyState.jsx
    │   ├── Card.jsx
    │   └── Header.jsx
    ├── lib/
    │   ├── telebirr.js
    │   ├── format.js
    │   └── checkProps.js
    └── data/
        └── areas.js
```

---

## Troubleshooting

**Modal does not close on Escape** — confirm the `keydown` listener is attached
to `document`, not the dialog element; the dialog needs `tabIndex={-1}` and
must receive focus for keyboard events to fire on it.

**`memo` has no effect** — check that `onAdd` is wrapped in `useCallback`.
If the parent passes a new function reference on every render, `memo` will
always see changed props and re-render anyway.

**Lazy chunk never loads** — make sure the dynamic `import()` path is a static
string literal; bundlers cannot analyse computed paths.

> **Note on React 19:** `propTypes` are no longer validated automatically.
> `src/lib/checkProps.js` runs `PropTypes.checkPropTypes` explicitly behind an
> `import.meta.env.DEV` guard.
