const dishes = [
  {
    id: 1,
    name: "Kitfo",
    price: 350,
    category: "traditional",
    description: "A traditional Ethiopian dish made with minced beef seasoned with mitmita and niter kibbeh.",
    emoji: "🥩",
  },
  {
    id: 2,
    name: "Doro Wot",
    price: 400,
    category: "traditional",
    description: "A rich and spicy Ethiopian chicken stew slow-cooked in berbere sauce, served with injera.",
    emoji: "🍗",
  },
  {
    id: 3,
    name: "Shiro",
    price: 250,
    category: "vegetarian",
    description: "A smooth and flavorful chickpea flour stew seasoned with garlic, onion, and spices.",
    emoji: "🫘",
  },
  {
    id: 4,
    name: "Chechebsa",
    price: 220,
    category: "traditional",
    description: "Pieces of flatbread torn and mixed with spiced clarified butter and berbere.",
    emoji: "🫓",
  },
  {
    id: 5,
    name: "Tibs",
    price: 380,
    category: "traditional",
    description: "Sautéed beef or lamb with onions, tomatoes, and jalapeños in a hot skillet.",
    emoji: "🥘",
  },
  {
    id: 6,
    name: "Misir Wot",
    price: 200,
    category: "vegetarian",
    description: "Red lentils slow-cooked in a spiced berbere sauce — a fasting-day favourite.",
    emoji: "🍲",
  },
  {
    id: 7,
    name: "Burger",
    price: 180,
    category: "fast-food",
    description: "A juicy beef patty with fresh vegetables and house sauce in a toasted bun.",
    emoji: "🍔",
  },
  {
    id: 8,
    name: "Club Sandwich",
    price: 160,
    category: "fast-food",
    description: "Triple-decker sandwich with chicken, egg, lettuce, tomato, and mayo.",
    emoji: "🥪",
  },
];

export async function getDishes() {
  return dishes;
}

export async function getDishById(id) {
  return dishes.find((dish) => dish.id === Number(id)) ?? null;
}

export default dishes;
