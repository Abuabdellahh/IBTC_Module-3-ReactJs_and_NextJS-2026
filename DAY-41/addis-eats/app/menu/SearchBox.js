"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useDebounce } from "./useDebounce";
import DishCard from "./DishCard";

export default function SearchBox() {
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebounce(term, 300);

  // Key changes only after the debounce delay — no request per keystroke
  const key = debouncedTerm
    ? `/api/dishes?q=${encodeURIComponent(debouncedTerm)}`
    : "/api/dishes";

  const { data, error, isLoading } = useSWR(key, fetcher, {
    // Keep previous results visible while the new request is in-flight
    keepPreviousData: true,
  });

  return (
    <section>
      <div className="mb-6">
        <label htmlFor="search" className="mb-2 block text-sm font-medium">
          Search dishes
        </label>
        <input
          id="search"
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Try: tibs, kitfo, shiro..."
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">Could not load dishes.</p>
      )}

      {isLoading && !data && (
        <p className="text-sm text-gray-500">Loading dishes...</p>
      )}

      {data && (
        <>
          {data.data.length === 0 ? (
            <p className="text-sm text-gray-500">No dishes found.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
