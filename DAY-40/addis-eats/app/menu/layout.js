import Link from "next/link";

const categories = [
  { slug: "traditional", label: "🍲 Traditional" },
  { slug: "vegetarian", label: "🥗 Vegetarian" },
  { slug: "fast-food", label: "🍔 Fast Food" },
];

export default function MenuLayout({ children }) {
  return (
    <div className="flex gap-8">
      <aside className="w-48 shrink-0">
        <h3 className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wider">
          Categories
        </h3>

        <nav className="flex flex-col gap-1">
          <Link
            href="/menu"
            className="px-3 py-2 rounded-lg text-sm hover:bg-amber-100 text-gray-700 transition-colors"
          >
            All Dishes
          </Link>

          {categories.map(({ slug, label }) => (
            <Link
              key={slug}
              href={`/menu?category=${slug}`}
              className="px-3 py-2 rounded-lg text-sm hover:bg-amber-100 text-gray-700 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}
