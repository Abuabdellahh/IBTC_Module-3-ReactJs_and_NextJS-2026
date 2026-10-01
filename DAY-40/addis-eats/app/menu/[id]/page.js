import Link from "next/link";
import { notFound } from "next/navigation";
import { getDishById, getDishes } from "@/lib/dishes";

export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((dish) => ({ id: String(dish.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDishById(id);
  if (!dish) return { title: "Dish Not Found" };
  return { title: `${dish.name} — Addis Eats` };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDishById(id);

  if (!dish) notFound();

  return (
    <article className="max-w-lg">
      <Link href="/menu" className="text-sm text-amber-600 hover:underline mb-6 inline-block">
        ← Back to Menu
      </Link>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100">
        <div className="text-6xl mb-4">{dish.emoji}</div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">{dish.name}</h2>

        <span className="inline-block text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full mb-4 capitalize">
          {dish.category}
        </span>

        <p className="text-gray-600 mb-6">{dish.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-amber-700">{dish.price} ETB</span>

          <Link
            href={`/checkout?dishId=${dish.id}`}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Order Now
          </Link>
        </div>
      </div>
    </article>
  );
}
