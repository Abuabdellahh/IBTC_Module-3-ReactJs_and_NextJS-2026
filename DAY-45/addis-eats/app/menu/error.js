"use client";
// app/menu/error.js — shown when the menu page throws an error
// Must be a Client Component — Next.js error boundaries require it.

export default function MenuError({ error, reset }) {
  return (
    <main className="max-w-md">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-700">Something went wrong</h1>
        <p className="mt-2 text-sm text-red-600">
          {error?.message ?? "The menu could not be loaded."}
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
