// lib/dishes.js
// Single source of truth for all dish data.
// Used by: pages, generateMetadata(), opengraph-image.js, JSON-LD, sitemap.js
// In a real application these functions would query a database or CMS.

const dishes = [
  {
    id: "kitfo",
    name: "Kitfo",
    price: 320,
    description: "Minced beef mixed with mitmita and Ethiopian spices.",
    category: "Traditional",
    image: "/images/kitfo.jpg",
  },
  {
    id: "doro-wat",
    name: "Doro Wat",
    price: 450,
    description: "Spicy Ethiopian chicken stew served with injera.",
    category: "Traditional",
    image: "/images/doro-wat.jpg",
  },
  {
    id: "tibs",
    name: "Tibs",
    price: 380,
    description: "Sautéed beef with onions, peppers and Ethiopian spices.",
    category: "Tibs",
    image: "/images/tibs.jpg",
  },
  {
    id: "shiro",
    name: "Shiro",
    price: 280,
    description: "Traditional chickpea stew served with injera.",
    category: "Vegetarian",
    image: "/images/shiro.jpg",
  },
  {
    id: "chicken-tibs",
    name: "Chicken Tibs",
    price: 350,
    description: "Tender chicken cooked with onions, tomatoes and spices.",
    category: "Tibs",
    image: "/images/chicken-tibs.jpg",
  },
  {
    id: "vegetable-pizza",
    name: "Vegetable Pizza",
    price: 500,
    description: "Pizza topped with fresh vegetables and cheese.",
    category: "Pizza",
    image: "/images/vegetable-pizza.jpg",
  },
  {
    id: "beef-tibs",
    name: "Beef Tibs",
    price: 520,
    description: "Tender beef cooked with Ethiopian spices.",
    category: "Tibs",
    image: "/images/beef-tibs.jpg",
  },
  {
    id: "special-burger",
    name: "Special Burger",
    price: 400,
    description: "Beef burger with cheese and fresh vegetables.",
    category: "Burger",
    image: "/images/special-burger.jpg",
  },
];

// Synchronous — used where async is not needed (sitemap, page lists)
export function getDishes() {
  return dishes;
}

// Async — mirrors a real DB call; used in generateMetadata() and page components
export async function getDish(id) {
  return dishes.find((dish) => dish.id === id) ?? null;
}

// Search — filters by name or category (used by /api/dishes route handler)
export function searchDishes(query) {
  const q = query.toLowerCase();
  return dishes.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
  );
}

// Paginate — returns one page of results (used by /api/dishes route handler)
export function paginateDishes(page = 1, perPage = 4) {
  const start = (page - 1) * perPage;
  return {
    dishes: dishes.slice(start, start + perPage),
    total: dishes.length,
    page,
    perPage,
    totalPages: Math.ceil(dishes.length / perPage),
  };
}
