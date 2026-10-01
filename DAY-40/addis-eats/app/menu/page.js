import Link from "next/link";
import { getDishes } from "@/lib/dishes";

export default async function MenuPage({ searchParams }) {
  const { category } = await searchParams;
  const allDishes = await getDishes();

  const dishes = category
    ? allDishes.filter((d) => d.category === category)
    : allDishes;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {category
          ? `${category.charAt(0).toUpperCase() + category.slice(1)} Dishes`
          : "Our Menu"}
      </h2>

      {dishes.length === 0 && (
        <p className="text-gray-500">No dishes found in this category.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dishes.map((dish) => (
          <article
            key={dish.id}
            className="bg-white rounded-xl p-5 shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-2">{dish.emoji}</div>
            <h3 className="text-lg font-semibold text-gray-800">{dish.name}</h3>
            <p className="text-sm text-gray-500 mt-1 mb-3 line-clamp-2">{dish.description}</p>

            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-700">{dish.price} ETB</span>
              <Link
                href={`/menu/${dish.id}`}
                className="text-sm bg-amber-600 text-white px-4 py-1.5 rounded-lg hover:bg-amber-700 transition-colors"
              >
                View →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
