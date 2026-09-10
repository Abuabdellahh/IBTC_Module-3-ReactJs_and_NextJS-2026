# 🎓 CampusConnect — Student Community Portal

A React application for exploring campus clubs, events, announcements, and student resources.

## 🚀 Quick Start

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

### Without Docker
```bash
npm install
npm run dev
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Sticky nav with mobile menu & theme toggle
│   ├── Footer.jsx
│   ├── ClubCard.jsx      # Reusable club card with favorite toggle
│   ├── EventCard.jsx     # Reusable event card with favorite toggle
│   ├── Loader.jsx        # Spinner component
│   └── ErrorMessage.jsx  # Error display component
├── context/
│   └── AppContext.jsx     # Context API — favorites + theme
├── data/
│   ├── clubs.js          # Local JSON data (8 clubs)
│   ├── events.js         # Local JSON data (6 events)
│   └── resources.js      # Local JSON data (6 resources)
├── pages/
│   ├── Home.jsx          # Hero, quick links, featured events & clubs
│   ├── Clubs.jsx         # Club list with search & category filter
│   ├── ClubDetails.jsx   # Dynamic route /clubs/:id
│   ├── Events.jsx        # Event list with search & category filter
│   ├── EventDetails.jsx  # Dynamic route /events/:id
│   ├── Resources.jsx     # Resources by category
│   ├── About.jsx         # About page + contact form
│   └── NotFound.jsx      # 404 page
├── App.jsx               # BrowserRouter + Routes
└── main.jsx
```

---

## ✅ React Concepts Demonstrated

| Concept | Where |
|---|---|
| JSX | All components |
| Components & Props | ClubCard, EventCard, Loader, ErrorMessage |
| Component composition | App → Navbar + Pages + Footer |
| useState | Search, filters, form, loading, theme |
| useEffect | Simulated data fetching with loading state |
| Event handling | Search input, filter buttons, form submit |
| Conditional rendering | Loading/error/empty states |
| Rendering lists + map() + key | Clubs, Events, Resources pages |
| Controlled inputs | Search fields, contact form |
| Search/filter | Clubs page, Events page |
| useParams | ClubDetails, EventDetails |
| useNavigate | NotFound, ClubDetails, EventDetails |
| NavLink / Link | Navbar, Footer, cards |
| Dynamic routes | /clubs/:id, /events/:id |
| 404 route | `path="*"` → NotFound |
| Context API (Bonus) | AppContext — favorites + dark/light theme |

---

## 🐳 Docker Files

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build → Node builder + Nginx server |
| `Dockerfile.dev` | Dev server with hot reload |
| `docker-compose.yml` | Production on :3000, dev on :5173 (profile: dev) |
| `nginx.conf` | SPA fallback + gzip + asset caching |

---

## 🌐 Routes

```
/               Home
/clubs          Club list
/clubs/:id      Club details
/events         Event list
/events/:id     Event details
/resources      Student resources
/about          About + contact form
*               404 Not Found
```
