"use client";
// components/MenuSearch.js
// Client Component — needs useState for the search input.
// Uses SWR with a 300ms debounce so requests are not sent per keystroke.
// null SWR key when the search is empty → no unnecessary request.
// keepPreviousData → previous results stay visible while new ones load.

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useDebounce } from "@/app/menu/useDebounce";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function MenuSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useSWR(
    debouncedQuery
      ? `/api/dishes?q=${encodeURIComponent(debouncedQuery)}`
      : null,
    fetcher,
    { keepPreviousData: true }
  );

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xl font-bold text-gray-800">Search Dishes</h2>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or category…"
        className="w-full max-w-md rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {isLoading && (
        <p className="mt-3 text-sm text-gray-400 animate-pulse">Searching…</p>
      )}

      {data && data.length === 0 && (
        <p className="mt-3 text-sm text-gray-500">No dishes found for &quot;{query}&quot;.</p>
      )}

      {data && data.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((dish) => (
            <article
              key={dish.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-purple-400">
                {dish.category}
              </span>
              <h3 className="mt-1 font-semibold text-gray-900">{dish.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{dish.description}</p>
              <p className="mt-2 font-bold text-purple-700">{dish.price} ETB</p>
              <Link
                href={`/menu/${dish.id}`}
                className="mt-2 inline-block text-sm text-purple-600 hover:underline"
              >
                View →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
