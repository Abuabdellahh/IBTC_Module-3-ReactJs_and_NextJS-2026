/**
 * Static menu data.
 *
 * `id`      stable identifier — this is the React key, never the array index.
 * `spicy`   optional; omitted entirely on mild dishes, so `Dish` has to cope
 *           with an undefined prop.
 * `price`   Ethiopian Birr (ETB).
 */
export const dishes = [
  {
    id: 'doro-wat',
    name: 'Doro Wat',
    price: 420,
    category: 'Mains',
    spicy: true,
    description: 'Slow-simmered chicken in berbere sauce with a boiled egg.',
  },
  {
    id: 'kitfo',
    name: 'Kitfo',
    price: 380,
    category: 'Mains',
    spicy: true,
    description: 'Minced beef seasoned with mitmita and niter kibbeh.',
  },
  {
    id: 'awaze-tibs',
    name: 'Awaze Tibs',
    price: 450,
    category: 'Mains',
    spicy: true,
    description: 'Pan-seared lamb with rosemary, onion and awaze.',
  },
  {
    id: 'alicha-wat',
    name: 'Alicha Wat',
    price: 300,
    category: 'Mains',
    description: 'Mild turmeric stew for anyone avoiding berbere.',
  },
  {
    id: 'shiro',
    name: 'Shiro Wat',
    price: 210,
    category: 'Fasting',
    description: 'Ground chickpea stew served bubbling in a clay pot.',
  },
  {
    id: 'beyaynetu',
    name: 'Beyaynetu',
    price: 260,
    category: 'Fasting',
    description: 'A platter of seven vegetable stews on injera.',
  },
  {
    id: 'gomen',
    name: 'Gomen',
    price: 150,
    category: 'Fasting',
    description: 'Collard greens with garlic and ginger.',
  },
  {
    id: 'enkulal-firfir',
    name: 'Enkulal Firfir',
    price: 190,
    category: 'Breakfast',
    spicy: true,
    description: 'Scrambled eggs with tomato, onion and green chili.',
  },
  {
    id: 'ful',
    name: 'Ful Medames',
    price: 160,
    category: 'Breakfast',
    description: 'Stewed fava beans with yoghurt and a drizzle of oil.',
  },
  {
    id: 'chechebsa',
    name: 'Chechebsa',
    price: 140,
    category: 'Breakfast',
    description: 'Shredded flatbread tossed in berbere butter and honey.',
  },
]

/** Filter tabs, derived from the data so a new category needs no code change. */
export const categories = ['All', ...new Set(dishes.map((dish) => dish.category))]
