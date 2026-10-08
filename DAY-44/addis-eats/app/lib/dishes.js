// app/lib/dishes.js
// Single source of truth for all dish data.
// Used by: pages, generateMetadata(), opengraph-image.js, JSON-LD, sitemap.js
// In a real application these functions would query a database or CMS.

const dishes = [
  {
    id: "kitfo",
    name: "Kitfo",
    price: 320,
    summary: "Minced beef mixed with mitmita and Ethiopian spices.",
    category: "Traditional",
    image: "/images/kitfo.jpg",
  },
  {
    id: "doro-wat",
    name: "Doro Wat",
    price: 450,
    summary: "Spicy Ethiopian chicken stew served with injera.",
    category: "Traditional",
    image: "/images/doro-wat.jpg",
  },
  {
    id: "tibs",
    name: "Tibs",
    price: 380,
    summary: "Sautéed beef with onions, peppers and Ethiopian spices.",
    category: "Tibs",
    image: "/images/tibs.jpg",
  },
  {
    id: "shiro",
    name: "Shiro",
    price: 280,
    summary: "Traditional chickpea stew served with injera.",
    category: "Vegetarian",
    image: "/images/shiro.jpg",
  },
  {
    id: "chicken-tibs",
    name: "Chicken Tibs",
    price: 350,
    summary: "Tender chicken cooked with onions, tomatoes and spices.",
    category: "Tibs",
    image: "/images/chicken-tibs.jpg",
  },
  {
    id: "vegetable-pizza",
    name: "Vegetable Pizza",
    price: 500,
    summary: "Pizza topped with fresh vegetables and cheese.",
    category: "Pizza",
    image: "/images/vegetable-pizza.jpg",
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
