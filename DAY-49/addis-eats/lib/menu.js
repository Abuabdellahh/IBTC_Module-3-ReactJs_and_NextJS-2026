// lib/menu.js
// The catalogue — the single source of truth for dish data and prices.
// Read by Server Components (pages, metadata, sitemap, JSON-LD), by the cart
// in the browser (names for display), and by placeOrder(), which re-prices
// every line from here rather than trusting a price sent by the browser.

export const CATEGORIES = ["Traditional", "Tibs", "Vegetarian", "Fasting", "Drinks"];

const DISHES = [
  {
    id: "doro-wat",
    name: "Doro Wat",
    price: 450,
    category: "Traditional",
    emoji: "🍗",
    description: "Slow-simmered chicken stew in berbere and niter kibbeh, served with a boiled egg and injera.",
  },
  {
    id: "kitfo",
    name: "Kitfo",
    price: 420,
    category: "Traditional",
    emoji: "🥩",
    description: "Minced beef seasoned with mitmita and spiced butter, with ayib and gomen on the side.",
  },
  {
    id: "beef-tibs",
    name: "Beef Tibs",
    price: 380,
    category: "Tibs",
    emoji: "🍖",
    description: "Cubes of beef sautéed with onion, rosemary and green chilli, served sizzling.",
  },
  {
    id: "chicken-tibs",
    name: "Chicken Tibs",
    price: 350,
    category: "Tibs",
    emoji: "🍳",
    description: "Tender chicken pan-fried with tomato, onion and awaze.",
  },
  {
    id: "shiro",
    name: "Shiro",
    price: 240,
    category: "Fasting",
    emoji: "🥣",
    description: "Silky ground chickpea stew with garlic and berbere — a fasting-day favourite.",
  },
  {
    id: "beyaynetu",
    name: "Beyaynetu",
    price: 320,
    category: "Fasting",
    emoji: "🫓",
    description: "A platter of misir, kik alicha, gomen and atkilt on a full round of injera.",
  },
  {
    id: "misir-wat",
    name: "Misir Wat",
    price: 260,
    category: "Vegetarian",
    emoji: "🍲",
    description: "Red lentils cooked down with berbere, onion and ginger.",
  },
  {
    id: "buna",
    name: "Buna (Coffee)",
    price: 90,
    category: "Drinks",
    emoji: "☕",
    description: "Freshly roasted Ethiopian coffee, brewed in a jebena.",
  },
];

export function getDishes() {
  return DISHES;
}

export function getDish(id) {
  return DISHES.find((dish) => dish.id === id) ?? null;
}
