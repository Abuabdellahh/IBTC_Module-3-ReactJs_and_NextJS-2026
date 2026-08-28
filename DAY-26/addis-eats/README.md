# Addis Eats — Day 26

A static restaurant menu built with **Vite + React**, running entirely in
**Docker**. No Node.js or npm is required on your machine — the container owns
the toolchain.

The goal of this day is the React fundamentals: **components**, **props**, and
rendering a **list with `map` + `key`**.

---

## What it renders

```
┌──────────────────────────────────────┐
│           BOLE · ADDIS ABABA         │   ← Header component
│              Addis Eats              │
│  Home-style Ethiopian cooking…       │
├──────────────────────────────────────┤
│  MENU                                │
│  Doro Wat ................. 420 ETB  │   ← Dish component (×6, from map)
│  Kitfo .................... 380 ETB  │
│  Shiro Wat ................ 210 ETB  │
│  …                                   │
└──────────────────────────────────────┘
```

---

## Quick start

```bash
cd DAY-26/addis-eats
docker compose up
```

Open **http://localhost:5173** — edits to `src/` hot-reload in the browser.

Stop with `Ctrl+C`, or:

```bash
docker compose down
```

### Production build (nginx)

```bash
docker compose --profile prod up --build prod
```

Open **http://localhost:8086** — this serves the minified `dist/` bundle from
nginx, the same artifact you would deploy.

---

## Project structure

```
addis-eats/
├── docker-compose.yml      # dev service (5173) + prod service (8086)
├── Dockerfile              # multi-stage: deps → dev / build → prod
├── nginx.conf              # static file server for the prod stage
├── index.html              # Vite entry point
├── package.json
└── src/
    ├── main.jsx            # mounts <App /> into #root
    ├── App.jsx             # composes Header + the mapped Dish list
    ├── index.css           # all styling (plain CSS, BEM-ish class names)
    ├── components/
    │   ├── Header.jsx      # restaurant banner
    │   └── Dish.jsx        # one menu item — takes name / price props
    └── data/
        └── menu.js         # the dishes array
```

---

## The three ideas being practised

### 1. A component is just a function returning JSX

`src/components/Header.jsx`

```jsx
export default function Header() {
  return (
    <header className="header">
      <h1 className="header__title">Addis Eats</h1>
      …
    </header>
  )
}
```

### 2. Props make a component reusable

`src/components/Dish.jsx` knows nothing about the menu — it renders whatever
`name` and `price` it is handed, so one component covers every row.

```jsx
export default function Dish({ name, price, description }) {
  return (
    <li className="dish">
      <h3 className="dish__name">{name}</h3>
      <span className="dish__price">{price} ETB</span>
      …
    </li>
  )
}
```

### 3. `map` turns data into elements — and every item needs a `key`

`src/App.jsx`

```jsx
{dishes.map((dish) => (
  <Dish
    key={dish.id}
    name={dish.name}
    price={dish.price}
    description={dish.description}
  />
))}
```

`key` is how React matches an element to the same item across re-renders. We
use `dish.id` — a stable value that belongs to the data — **not** the array
index, which shifts the moment a dish is added, removed or reordered.

Adding a dish means adding one object to `src/data/menu.js`. No JSX changes.

---

## How the Docker setup works

`Dockerfile` has four stages, so dev and prod share one dependency install:

| Stage   | Base            | Purpose                                        |
| ------- | --------------- | ---------------------------------------------- |
| `deps`  | `node:22-alpine`| `npm ci` from the committed lockfile           |
| `dev`   | `node:22-alpine`| `npm run dev` — Vite dev server with HMR       |
| `build` | `node:22-alpine`| `npm run build` → static assets in `/app/dist` |
| `prod`  | `nginx:alpine`  | serves `dist/` — no Node in the final image    |

`docker-compose.yml` wires this up:

- **`web`** (default) builds `target: dev`, publishes `5173`, and bind-mounts
  the source so saving a file reloads the browser.
- The anonymous `/app/node_modules` volume shadows the bind mount, keeping the
  container's Linux-built dependencies instead of an empty host folder.
- **`prod`** sits behind the `prod` profile, so a plain `docker compose up`
  never starts it.

Two details worth knowing:

- **`:z` on the bind mount** relabels the directory for SELinux hosts
  (Fedora, RHEL). Without it the container gets `EACCES` on `package.json`.
  It is a no-op on other systems.
- **`server.host: true` and polling** in `vite.config.js`. Vite binds to
  `localhost` by default, which is unreachable from outside the container, and
  file-change events do not always cross a bind mount — so we listen on all
  interfaces and poll for changes.

---

## Common commands

| Task                     | Command                                          |
| ------------------------ | ------------------------------------------------ |
| Start dev server         | `docker compose up`                              |
| Rebuild after dep change | `docker compose up --build`                      |
| Shell inside the container | `docker compose exec web sh`                   |
| Add a package            | `docker compose exec web npm install <pkg>`      |
| Production preview       | `docker compose --profile prod up --build prod`  |
| Stop and clean up        | `docker compose --profile prod down`             |

> After `npm install <pkg>` inside the container, rerun `docker compose up
> --build` so the change lands in the image.

---

## Troubleshooting

**`port is already allocated`** — something else holds 5173 or 8086. Change the
left-hand side of the port mapping in `docker-compose.yml`, e.g. `"5174:5173"`.

**`EACCES: /app/package.json`** — the `:z` flag on the bind mount is missing;
see the SELinux note above.

**Changes not reloading** — confirm you ran the `web` service (not `prod`); the
prod image is a fixed build with no watcher.
