# Addis Eats — Day 28

State, props and events. The Day 27 menu was a display; this one takes an
order.

- **`count` state in `Dish`** with an **Add** button
- **category state lifted into `Menu`**, shared by `CategoryBar` and `DishList`
- **category chips rendered from an array**, the selected one highlighted
- **a running order total in ETB**
- **a controlled TeleBirr delivery form** on one state object, with validation
  that keeps the pay button disabled until the number is real

Runs entirely in **Docker** — no Node.js or npm needed on your machine.

---

## Quick start

```bash
cd DAY-28/addis-eats
docker compose up            # http://localhost:5175
```

Days 26 (5173) and 27 (5174) keep their ports, so all three can run at once.

| Task                | Command                                          | URL                   |
| ------------------- | ------------------------------------------------ | --------------------- |
| Dev server (HMR)    | `docker compose up`                              | http://localhost:5175 |
| Production (nginx)  | `docker compose --profile prod up --build prod`  | http://localhost:8088 |
| **All checks**      | `docker compose run --rm web npm run check`      | —                     |
| Lint                | `docker compose run --rm web npm run lint`       | —                     |
| Stop everything     | `docker compose --profile prod down`             | —                     |

---

## Where state lives

```
App                       order: { items, total }   ← shared by the whole page
│                         receipt, menuVersion
├── Header
├── Menu                  category, spicyOnly       ← lifted: two children need it
│   ├── CategoryBar       (none — controlled)
│   └── DishList          (none — presentational)
│       └── Dish          count                     ← nobody else's business
├── OrderSummary          (none — reads the total)
└── DeliveryForm          form: { name, phone, area }, touched
```

The rule this layout follows: **state belongs at the lowest node that still
covers everyone who needs it.**

- `count` is only ever read and changed by one dish, so it stays inside `Dish`.
- `category` is set by `CategoryBar` and read by `DishList` — so it moves up to
  their closest common parent, `Menu`. If each child kept its own copy they
  could disagree about which chip is active.
- `order.total` shows up in `OrderSummary` and gates `DeliveryForm`, both
  outside `Menu` — so it lives in `App`.

---

## 1. `count` state and the Add button

`src/components/Dish.jsx`

```jsx
const [count, setCount] = useState(0)

const handleAdd = () => {
  setCount((current) => current + 1)   // updater form, not count + 1
  onAdd(price)                         // tell the parent so the total can move
}
```

**Why `setCount(current => current + 1)` and not `setCount(count + 1)`?**
`count` is a value captured when the component rendered. React batches updates,
so two clicks in the same tick both read the same stale `count` and the second
overwrites the first — you press Add twice and the number goes up by one. The
updater form is handed the latest value, so it always composes.

The dish keeps its own count *and* reports the price upward. That is a
deliberate trade: two places track the order, and they only stay in step
because `Dish` is the sole thing that adds. The moment you want to edit
quantities from a cart, `count` has to be lifted into `App` alongside the
total. `App` handles the one case that already crosses that line — **Clear
order** — with a key:

```jsx
<Menu key={menuVersion} onAdd={addToOrder} />
```

Changing a component's key changes its **identity**: React discards the old
tree and mounts a fresh one, so every `Dish` starts again at `count = 0`. It is
the supported way to reset state you do not own.

---

## 2. Lifting the category state

`src/components/Menu.jsx` owns it; both children receive it as props.

```jsx
const [category, setCategory] = useState('All')

<CategoryBar categories={categories} selected={category} onSelect={setCategory} … />
<DishList dishes={visibleDishes} … />
```

`CategoryBar` holds no state at all — it renders what it is told and calls
`onSelect` on a click. **Data flows down, events flow up.**

The visible list is derived on every render, never stored:

```js
const visibleDishes = useMemo(
  () => dishes.filter((dish) => {
    const matchesCategory = category === 'All' || dish.category === category
    const matchesSpicy = !spicyOnly || dish.spicy === true
    return matchesCategory && matchesSpicy
  }),
  [category, spicyOnly],
)
```

A `filteredDishes` state would be a second source of truth that can drift out
of sync. Recomputing cannot.

---

## 3. Chips from an array

```jsx
{categories.map((category) => {
  const isSelected = category === selected
  return (
    <button
      key={category}
      className={isSelected ? 'chip chip--selected' : 'chip'}
      aria-pressed={isSelected}
      onClick={() => onSelect(category)}
    >
      {category}
    </button>
  )
})}
```

The highlight is derived from state, not toggled by hand — there is no
`activeChip` to forget to clear, so two chips can never look selected at once.
`aria-pressed` carries the same fact to screen readers, which a CSS class alone
does not.

The array itself comes from the data (`src/data/menu.js`):

```js
export const categories = ['All', ...new Set(dishes.map((d) => d.category))]
```

Add a dish in a new category and its chip appears. No JSX changes.

---

## 4. The running total

`App` keeps one object so the two numbers move together:

```jsx
const [order, setOrder] = useState({ items: 0, total: 0 })

const addToOrder = (price) => {
  setOrder((current) => ({
    items: current.items + 1,
    total: current.total + price,
  }))
}
```

A **new object** every time — mutating `current.total` in place would leave the
reference unchanged, React would compare old and new, see the same object, and
skip the re-render.

Formatting lives in `src/lib/format.js`, so "1,220.00 ETB" is written once:

```js
export function formatEtb(amount) {
  return `${amount.toLocaleString('en-ET', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`
}
```

---

## 5 & 6. The controlled TeleBirr form

`src/components/DeliveryForm.jsx` — three fields, **one** state object, **one**
change handler:

```jsx
const [form, setForm] = useState({ name: '', phone: '', area: '' })

const handleChange = (event) => {
  const { name, value } = event.target
  setForm((current) => ({ ...current, [name]: value }))
}
```

The computed key `[name]` matches each input's `name` attribute, so a fourth
field needs no fourth `useState` and no fourth handler. Every input is
**controlled** — `value={form.phone}` plus `onChange` — so React state is the
single source of truth and the DOM only ever mirrors it.

Validation is a plain function outside the component, so it can be read and
tested on its own, and there is no `errors` state to fall out of date:

```js
function validate({ name, phone, area }) { … }

const errors = validate(form)          // recomputed every render
const isValid = Object.keys(errors).length === 0
```

```jsx
<button type="submit" disabled={!isValid || !hasOrder}>Pay with TeleBirr</button>
```

Three details that matter more than the regex:

- **Errors appear on blur, not while typing.** A `touched` map records which
  fields the user has left, so `09` is not screamed at halfway through a phone
  number.
- **The disabled button explains itself.** "Add a dish to the order first" —
  a dead control with no reason is a dead end.
- **`noValidate`** hands validation to React rather than letting the browser
  fight it with its own bubbles.

### The number rule — `src/lib/telebirr.js`

```js
const TELEBIRR_PATTERN = /^(?:\+?251|0)([97]\d{8})$/
```

Ethiopian mobile numbers are 9 digits after the country code and begin with 9
or 7. Spaces, dashes and brackets are stripped first, so `0912 345 678`,
`091-234-5678`, `+251912345678` and `251912345678` are all the same subscriber
— **normalise input, do not demand a format.** `toInternational()` returns the
canonical `+2519…` form that gets submitted; the raw text never leaves the
input.

---

## Verifying it

Three check scripts, no test framework:

```bash
docker compose run --rm web npm run check
```

| Script                        | What it proves                                              |
| ----------------------------- | ----------------------------------------------------------- |
| `check:props`                 | `<App />` renders with zero PropTypes warnings, and deliberately invalid props *do* warn |
| `check:phone`                 | 6 valid TeleBirr formats accepted, 7 invalid rejected, normalisation correct |
| `check:ui`                    | the app driven in jsdom: Add, filter, type, submit           |

`check:ui` is the interesting one — it renders the real `<App />` into a jsdom
document and clicks through it:

```
PASS  one dish -> 420.00 ETB
PASS  same dish twice -> 840.00 ETB
PASS  total survives filtering
PASS  empty state shown
PASS  still disabled on invalid number
PASS  enabled once name + phone + area valid
PASS  receipt has the +251 number
PASS  dish counts reset too
```

42 checks in total, all passing. Every script exits non-zero on failure, so
they drop into CI unchanged.

> **Note on React 19** (carried over from Day 27): React 19 no longer validates
> `propTypes` or reads `defaultProps` on function components, so
> `src/lib/checkProps.js` runs `PropTypes.checkPropTypes` explicitly behind an
> `import.meta.env.DEV` guard. `package.json` also pins `react-is` to v19 via
> `overrides`, because `prop-types@15` ships `react-is@16`, which does not
> recognise React 19 elements and makes `PropTypes.node` reject valid children.

---

## Project structure

```
addis-eats/
├── docker-compose.yml         dev (5175) + prod (8088), project addis-eats-day28
├── Dockerfile                 deps → dev / build → prod (nginx)
├── scripts/
│   ├── check-proptypes.mjs    console.error assertions
│   ├── check-telebirr.mjs     phone rules
│   └── check-interactions.mjs jsdom click-through
└── src/
    ├── App.jsx                order total, receipt, clear-via-key
    ├── index.css
    ├── components/
    │   ├── Menu.jsx           owns the category state
    │   ├── CategoryBar.jsx    chips from an array, selected one highlighted
    │   ├── DishList.jsx       maps dishes, or shows the empty state
    │   ├── Dish.jsx           count state + Add button
    │   ├── OrderSummary.jsx   running total in ETB
    │   ├── DeliveryForm.jsx   one state object + validation
    │   ├── Receipt.jsx        post-checkout confirmation
    │   ├── EmptyState.jsx
    │   ├── Header.jsx
    │   └── Card.jsx           wrapper that renders children
    ├── lib/
    │   ├── telebirr.js        normalise / validate / toInternational
    │   ├── format.js          formatEtb
    │   └── checkProps.js      dev-only PropTypes runner
    └── data/
        ├── menu.js            10 dishes + derived categories
        └── areas.js           delivery areas
```

---

## Troubleshooting

**Add does nothing / total stays 0** — `Dish` must call both `setCount` and
`onAdd(price)`; `onAdd` has to be threaded `App → Menu → DishList → Dish`.

**Counts do not reset on "Clear order"** — the `key={menuVersion}` on `<Menu />`
is what discards the dishes' local state.

**Pay button never enables** — you need a dish in the order *and* all three
fields valid. Run `npm run check:phone` to see which formats are accepted.

**`port is already allocated`** — Day 26 uses 5173/8086, Day 27 uses 5174/8087,
Day 28 uses 5175/8088. Change the left-hand side of the mapping in
`docker-compose.yml` if something else holds one.
