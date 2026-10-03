export default function DishCard({ dish }) {
  return (
    <article className="rounded-xl border bg-white p-5 shadow-sm">
      <span className="inline-block rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600">
        {dish.category}
      </span>
      <h2 className="mt-2 text-lg font-semibold">{dish.name}</h2>
      <p className="mt-1 text-sm text-gray-500">{dish.description}</p>
      <p className="mt-3 font-bold text-purple-700">{dish.price} ETB</p>
    </article>
  );
}
