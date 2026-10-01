export default function Loading() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Loading Menu...</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 border border-amber-100 animate-pulse"
          >
            <div className="h-8 w-8 bg-amber-100 rounded mb-3" />
            <div className="h-4 bg-amber-100 rounded w-2/3 mb-2" />
            <div className="h-3 bg-amber-50 rounded w-full mb-1" />
            <div className="h-3 bg-amber-50 rounded w-4/5" />
          </div>
        ))}
      </div>
    </section>
  );
}
