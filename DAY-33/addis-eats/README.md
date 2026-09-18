# Addis Eats — Day 33

Controlled checkout form. The delivery form gains a fourth field (notes),
async submission with a submitting flag, full accessibility wiring, and
graceful error recovery when the payment request fails.

- **Four fields, one state object** — `{ name, phone, area, notes }` via a
  single `useState`; one `handleChange` keyed by `name` scales to any number
  of fields
- **`validate(form)` is a pure function** — errors are derived on every render,
  never stored; the function lives outside the component so it can be read and
  tested in isolation
- **Blur-gated errors** — `touched` tracks which fields have been left;
  `errorFor(field)` returns the message only after the user has visited that
  field, so errors never flash while someone is still typing
- **Full accessibility** — every control has a `<label>`, `aria-invalid`,
  `aria-describedby` pointing to its stamped error `<p id="…-error">`, and
  `role="alert"` on each error paragraph
- **`submitting` flag** — set before the `await`, cleared in `finally`;
  the button is `disabled` while true, preventing double-sends; the label
  shows `Pay {ETB total} with TeleBirr` at rest and `Placing order…` in flight
- **Failed-request recovery** — a `role="alert"` server-error banner explains
  what went wrong; all field values are preserved; the first invalid field
  receives focus so keyboard and screen-reader users land somewhere actionable
- **`placeOrder` in `api.js`** — simulates a 900 ms round-trip and randomly
  throws ~20 % of the time so the error path is exercisable without a real
  backend

---

## Quick start

```bash
cd DAY-33/addis-eats
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
| All checks       | `npm run check`       | —                     |

---

## Checkout form design

### One state object

```jsx
const EMPTY_FORM = { name: '', phone: '', area: '', notes: '' }
const [form, setForm] = useState({ ...EMPTY_FORM, name: defaultName ?? '' })

const handleChange = (e) => {
  const { name, value } = e.target
  setForm((c) => ({ ...c, [name]: value }))
}
```

A single handler works for every input because each one carries its own `name`
attribute. Adding a fifth field requires zero changes to the handler.

### Pure validation

```jsx
function validate({ name, phone, area }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Enter the name we should ask for at the door.'
  if (!isValidTelebirr(phone)) errors.phone = 'TeleBirr numbers look like 0912 345 678 or +251912345678.'
  if (!area) errors.area = 'Choose a delivery area.'
  return errors
}

// Inside the component — derived, never stored:
const errors = validate(form)
const isValid = Object.keys(errors).length === 0
```

### Blur-gated errors

```jsx
const [touched, setTouched] = useState({})

const handleBlur = (e) => setTouched((c) => ({ ...c, [e.target.name]: true }))

const errorFor = (field) => (touched[field] ? errors[field] : undefined)
```

### Accessibility wiring

```jsx
<label htmlFor="phone">TeleBirr number</label>
<input
  id="phone"
  name="phone"
  aria-invalid={Boolean(errorFor('phone'))}
  aria-describedby={errorFor('phone') ? 'phone-error' : undefined}
  ...
/>
{errorFor('phone') && (
  <p id="phone-error" role="alert">{errorFor('phone')}</p>
)}
```

### Submitting flag + ETB total in button

```jsx
const [submitting, setSubmitting] = useState(false)

<button type="submit" disabled={!isValid || !hasOrder || submitting}>
  {submitting ? 'Placing order…' : `Pay ${formatEtb(orderTotal)} with TeleBirr`}
</button>
```

### Failed-request recovery

```jsx
try {
  await onSubmit({ ... })
  setForm(EMPTY_FORM)
  setTouched({})
} catch (err) {
  setServerError(err.message)           // banner with role="alert"
  setTouched({ name: true, phone: true, area: true })
  const firstBad = ['name', 'phone', 'area'].find((f) => errors[f])
  if (firstBad) fieldRefs[firstBad].current?.focus()
} finally {
  setSubmitting(false)
}
```

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
    ├── api.js                 loadDishes + placeOrder (simulated async)
    ├── context/
    │   ├── CartContext.jsx    cart state shared across all routes
    │   └── AuthContext.jsx    mock sign-in / sign-out
    ├── pages/
    │   ├── Landing.jsx        /
    │   ├── MenuPage.jsx       /menu  — useSearchParams for category
    │   ├── DishPage.jsx       /menu/:id  — useParams
    │   ├── CheckoutPage.jsx   /checkout  — async submit, error propagation
    │   ├── SignIn.jsx         /signin  — redirect-back pattern
    │   └── NotFound.jsx       *
    ├── components/
    │   ├── Layout.jsx         header + nav + Outlet
    │   ├── RequireAuth.jsx    auth guard
    │   ├── CategoryBar.jsx    filter chips — controlled
    │   ├── DishList.jsx       maps dishes → Dish, or EmptyState
    │   ├── Dish.jsx           dish card with Link to /menu/:id
    │   ├── OrderSummary.jsx   running total
    │   ├── DeliveryForm.jsx   4-field form, pure validate, submitting flag
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

**Button stays disabled after filling all fields** — check that `itemCount`
is greater than 0; the button requires both a valid form and a non-empty cart.

**Error banner appears but focus does not move** — confirm that `fieldRefs`
refs are attached to the actual `<input>`/`<select>` elements via the `ref`
prop, not to the wrapper `<div>`.

> **Note on React 19:** React 19 no longer validates `propTypes` on function
> components, so `src/lib/checkProps.js` runs `PropTypes.checkPropTypes`
> explicitly behind an `import.meta.env.DEV` guard. `package.json` pins
> `react-is` to v19 via `overrides` because `prop-types@15` ships
> `react-is@16`, which does not recognise React 19 elements.
