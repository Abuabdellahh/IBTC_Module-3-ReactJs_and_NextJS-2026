"use client";

export default function Error({ error, reset }) {
  return (
    <section className="text-center py-12">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">Something went wrong.</h2>
      <p className="text-gray-500 mb-6 text-sm">{error?.message ?? "We could not load the menu."}</p>
      <button
        onClick={() => reset()}
        className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
      >
        Try Again
      </button>
    </section>
  );
}
