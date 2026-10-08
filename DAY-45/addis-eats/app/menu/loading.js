// app/menu/loading.js — shown while the menu page is rendering
export default function MenuLoading() {
  return (
    <main>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Menu</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border bg-white p-5 shadow-sm">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="mt-2 h-5 w-32 rounded bg-gray-200" />
            <div className="mt-2 h-3 w-full rounded bg-gray-100" />
            <div className="mt-3 h-5 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </main>
  );
}
