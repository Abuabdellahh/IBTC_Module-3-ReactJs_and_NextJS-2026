# Addis Eats — Day 27

Props, validation and rendering patterns.

Day 26 rendered a static list. Day 27 makes the menu **react to input**: a
`Dish` component with a validated prop contract and a currency default, a
conditional **Spicy** badge, a reusable `Card` wrapper, and a category filter
with a proper **empty state**.

Runs entirely in **Docker** — no Node.js or npm needed on your machine.

---

## Quick start

```bash
cd DAY-27/addis-eats
docker compose up            # http://localhost:5174
```

Day 26 stays on 5173/8086, so both days can run at the same time.

| Task                 | Command                                          | URL                   |
| -------------------- | ------------------------------------------------ | --------------------- |
| Dev server (HMR)     | `docker compose up`                              | http://localhost:5174 |
| Production (nginx)   | `docker compose --profile prod up --build prod`  | http://localhost:8087 |
| **PropTypes check**  | `docker compose run --rm web npm run check:props`| —                     |
| Stop everything      | `docker compose --profile prod down`             | —                     |

---

## What it renders

```
                    BOLE · ADDIS ABABA
                       Addis Eats
          Home-style Ethiopian cooking · 10 dishes

  ( All )  Mains   Fasting   Breakfast        ☐ Spicy only
  ─────────────────────────────────────────────────────────
   Doro Wat  [SPICY] ........................... 420 ETB
   Slow-simmered chicken in berbere sauce…

   Alicha Wat .................................. 300 ETB
   Mild turmeric stew for anyone avoiding berbere.
```

Pick **Fasting** + **Spicy only** and nothing matches — that is the empty
state, with a “Clear filters” button.

---

## 1. PropTypes + a default

`src/components/Dish.jsx`

```jsx
export default function Dish(props) {
  checkProps(Dish, props)
  const { name, price, spicy, currency = 'ETB', description } = props
  …
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,   // required
  price: PropTypes.number.isRequired,  // required
  spicy: PropTypes.bool,               // optional
  currency: PropTypes.string,          // optional, defaulted above
  description: PropTypes.string,
}
```

Two things about modern React that this exercise runs straight into:

**`defaultProps` is gone.** React 19 no longer reads `Dish.defaultProps` on
function components. Defaults are written as **default parameters** —
`currency = 'ETB'` in the destructuring — which is why there is no
`Dish.defaultProps` block here.

**React 19 no longer checks `propTypes` either.** Assigning
`Component.propTypes` still documents the contract, but React does not validate
it, so a wrong prop passes in total silence. `src/lib/checkProps.js` runs the
same validation explicitly with the supported `PropTypes.checkPropTypes` API:

```js
export function checkProps(Component, props) {
  if (import.meta.env.DEV && Component.propTypes) {
    PropTypes.checkPropTypes(Component.propTypes, props, 'prop', Component.name)
  }
}
```

You get the identical `Warning: Failed prop type: …` in the console, and the
`import.meta.env.DEV` guard keeps the validation out of the production build.
One `checkProps(X, props)` line sits at the top of every component that
declares `propTypes`.

> **Why `overrides` in package.json?** `prop-types@15` depends on `react-is@16`,
> which does not recognise React 19's element type — so `PropTypes.node` would
> reject perfectly valid `children`. `"overrides": { "react-is": "^19.2.0" }`
> resolves it. Without it, `Card` warns on every render. This was caught by the
> check script below, not by reading the docs.

### Verifying it — `npm run check:props`

Rather than clicking around and squinting at DevTools, `scripts/check-proptypes.mjs`
renders the app server-side while capturing `console.error`:

```
$ docker compose run --rm web npm run check:props

PASS  <App /> renders with no PropTypes warnings
PASS  invalid props rejected (2 warning(s)):
      Warning: Failed prop type: Invalid prop `price` of type `string` supplied to `Dish`, expected `number`.
      Warning: Failed prop type: Invalid prop `spicy` of type `string` supplied to `Dish`, expected `boolean`.
```

The second case renders `<Dish price="420" spicy="yes" />` **on purpose** — a
validation setup that never fires is indistinguishable from no validation at
all, so the test proves the wiring works. Exit code is non-zero on failure, so
it drops into CI as-is.

---

## 2. Conditional rendering with `&&`

```jsx
{Boolean(spicy) && <span className="badge">Spicy</span>}
```

`spicy` is optional — most dishes never pass it, so it arrives as `undefined`.
`Boolean()` is the guard the brief asks for, and it matters because **`&&`
returns the left-hand value when it is falsy, and React renders some falsy
values**:

| `value`               | `{value && <Badge />}` renders |
| --------------------- | ------------------------------ |
| `undefined` / `null`  | nothing ✅                      |
| `false`               | nothing ✅                      |
| `0`                   | **`0`** — a stray zero on screen ❌ |
| `''`                  | nothing, but still not a boolean |

`{dishes.length && <List />}` is the classic bug: an empty menu prints a bare
`0`. Either coerce with `Boolean(…)` / `!!`, or compare explicitly
(`dishes.length > 0 ? … : …`), which is what `App.jsx` does for the list.

---

## 3. `Card` — a wrapper that renders `children`

```jsx
export default function Card({ children, as: Tag = 'div', className = '' }) {
  return <Tag className={`card ${className}`.trim()}>{children}</Tag>
}
```

`children` is the prop React fills with whatever sits between the tags. `Card`
owns the surface (background, border, radius) and knows nothing about menus, so
both `Dish` and `EmptyState` reuse it. The `as` prop lets it render an `<li>`
inside the menu list and a `<div>` everywhere else — valid HTML without a
second component.

---

## 4. Filtering + the empty state

State lives in `App`; `CategoryFilter` is fully controlled and only reports
clicks upward.

```jsx
const visibleDishes = useMemo(
  () =>
    dishes.filter((dish) => {
      const matchesCategory = category === 'All' || dish.category === category
      const matchesSpicy = !spicyOnly || dish.spicy === true
      return matchesCategory && matchesSpicy
    }),
  [category, spicyOnly],
)

{visibleDishes.length > 0 ? (
  <ul className="menu">
    {visibleDishes.map((dish) => (
      <Dish key={dish.id} name={dish.name} price={dish.price} spicy={dish.spicy} … />
    ))}
  </ul>
) : (
  <EmptyState message={emptyMessage} onReset={resetFilters} />
)}
```

The filtered list is **derived**, not stored. Keeping a second `filteredDishes`
piece of state would mean two sources of truth that can drift apart; recomputing
from `dishes + filters` cannot.

`key={dish.id}` stays a stable id from the data. This matters far more once a
list is filtered: with `key={index}`, filtering shifts every index, and React
reuses the wrong DOM node — you get the previous row's scroll position, input
text or animation state on a different dish.

Categories come from the data too:

```js
export const categories = ['All', ...new Set(dishes.map((d) => d.category))]
```

Adding a dish in a new category adds a tab automatically. No JSX changes.

---

## Project structure

```
addis-eats/
├── docker-compose.yml       dev (5174) + prod (8087), project name addis-eats-day27
├── Dockerfile               deps → dev / build → prod (nginx)
├── scripts/
│   └── check-proptypes.mjs  renders the app and asserts on console.error
└── src/
    ├── App.jsx              filter state, derived list, empty-state branch
    ├── index.css
    ├── lib/
    │   └── checkProps.js    dev-only PropTypes.checkPropTypes runner
    ├── components/
    │   ├── Card.jsx         wrapper — renders children
    │   ├── CategoryFilter.jsx  controlled tabs + "spicy only" switch
    │   ├── Dish.jsx         propTypes, currency default, spicy badge
    │   ├── EmptyState.jsx   shown when no dish matches
    │   └── Header.jsx
    └── data/
        └── menu.js          10 dishes + derived category list
```

---

## Docker notes

Same four-stage build as Day 26 (`deps → dev / build → prod`), with two
differences:

- **`name: addis-eats-day27`** at the top of `docker-compose.yml`. Both days
  live in a folder called `addis-eats`, and Compose derives its project name
  from the directory — without an explicit name the two days would share
  networks and images.
- **Ports shifted** to 5174/8087 so Day 26 can keep running.

The `:z` flag on the bind mount is still required on SELinux hosts (Fedora,
RHEL); without it the container gets `EACCES` on `package.json`.

---

## Troubleshooting

**No PropTypes warnings even with bad props** — check the component calls
`checkProps(Component, props)`. On React 19 the `propTypes` object alone does
nothing.

**`Invalid prop children supplied to Card`** — the `react-is` override is
missing from `package.json`; run `docker compose up --build` after restoring it.

**`port is already allocated`** — Day 26 is on 5173/8086 and Day 27 on
5174/8087. Anything else on those ports, change the left-hand side of the
mapping in `docker-compose.yml`.
