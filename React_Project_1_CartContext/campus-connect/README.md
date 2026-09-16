# 🍛 Addis Eats — Ethiopian Restaurant Cart App

A React + Zustand application for browsing and ordering authentic Ethiopian dishes, built as a hands-on demonstration of global state management with a Zustand store, context splitting, narrow selectors, and persistence across page refreshes.

---

## 🚀 Quick Start

### Without Docker
```bash
npm install
npm run dev
```
Open → http://localhost:5173

### With Docker (Production)
```bash
docker compose up --build
```
Open → http://localhost:3000

### With Docker (Dev — hot reload)
```bash
docker compose --profile dev up campus-connect-dev
```
Open → http://localhost:5173

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky nav — cart count (narrow selector), auth, theme
│   ├── Footer.jsx
│   ├── Loader.jsx
│   └── ErrorMessage.jsx
├── context/
│   ├── AuthContext.jsx     # useAuth hook — throws without AuthProvider
│   ├── CartContext.jsx     # useCart hook — throws without CartProvider
│   └── ThemeContext.jsx    # useTheme hook — throws without ThemeProvider
├── store/
│   └── cartStore.js        # Zustand store: items, addItem, remove, clear + persist
├── data/
│   └── dishes.js           # 6 Addis Eats menu items
├── pages/
│   ├── Home.jsx            # Hero banner + featured dishes with narrow selectors
│   ├── Menu.jsx            # Full menu — DishCard uses one selector at a time
│   ├── Cart.jsx            # Cart page — items, remove, clear, total
│   └── NotFound.jsx        # 404 page
├── App.jsx                 # ThemeProvider > AuthProvider > CartProvider > Routes
└── main.jsx
```

---

## 🧠 State Architecture

### Zustand Cart Store (`src/store/cartStore.js`)
- `items` — array of `{ ...dish, qty }`
- `addItem(dish)` — increments qty if already in cart, otherwise appends
- `remove(id)` — removes item by id
- `clear()` — empties the cart
- `persist` middleware — survives a full page refresh via `localStorage` key `addis-eats-cart`

### Split Contexts
| Context | Responsibility |
|---|---|
| `ThemeContext` | `theme`, `toggleTheme` |
| `AuthContext` | `user`, `login`, `logout` |
| `CartContext` | Provider guard — throws if `useCart` called outside |

### Narrow Selectors
Every consumer subscribes to exactly one value, preventing unnecessary re-renders:

```js
// Only re-renders when cart count changes
const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));

// Only re-renders when this dish's inCart status changes
const inCart = useCartStore((s) => s.items.some((i) => i.id === dish.id));

// Action reference — never causes a re-render
const addItem = useCartStore((s) => s.addItem);
```

---

## ✅ React & Zustand Concepts Demonstrated

| Concept | Where |
|---|---|
| Zustand store | `store/cartStore.js` |
| `persist` middleware | `cartStore.js` → `localStorage` |
| Narrow selectors | `Menu.jsx`, `Cart.jsx`, `Home.jsx`, `Navbar.jsx` |
| Context splitting | `ThemeContext`, `AuthContext`, `CartContext` |
| `useCart` hook (throws without provider) | `CartContext.jsx` |
| `useAuth` hook (throws without provider) | `AuthContext.jsx` |
| `useTheme` hook (throws without provider) | `ThemeContext.jsx` |
| Auth guard on cart actions | `Menu.jsx`, `Home.jsx` |
| `useParams` / `useNavigate` | `NotFound.jsx` |
| `NavLink` / `Link` | `Navbar.jsx`, pages |
| Conditional rendering | Cart empty state, auth guard |
| Dark / light theme | `ThemeContext` + CSS variables |

---

## 🌐 Routes

```
/        Home — hero + featured dishes
/menu    Full menu — add dishes to cart
/cart    Cart — review order, remove items, clear, place order
*        404 Not Found
```

---

## 🐳 Docker Files

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build → Node builder + Nginx server |
| `Dockerfile.dev` | Dev server with hot reload |
| `docker-compose.yml` | Production on :3000, dev on :5173 (profile: dev) |
| `nginx.conf` | SPA fallback + gzip + asset caching |

---

## 🔍 Re-render Audit (DevTools)

Open React DevTools → Highlight updates on re-render, then:

1. Add **Doro Wat** → only `DishCard` for Doro Wat + `Navbar` cart count re-render
2. Add **Tibs** → only `DishCard` for Tibs + `Navbar` re-render
3. Add **Shiro** → same — all other `DishCard` components stay silent

This is the narrow selector pattern in action: each component subscribes to the minimum slice of state it needs.
