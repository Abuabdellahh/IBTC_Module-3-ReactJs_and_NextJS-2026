"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import DishCard from "./DishCard";

export default function PaginatedMenu() {
  const [page, setPage] = useState(1);

  // Page number is part of the key — each page is a separate cache entry
  const { data, error, isLoading } = useSWR(
    `/api/dishes?page=${page}`,
    fetcher,
    { keepPreviousData: true }
  );

  if (error) return <p className="text-sm text-red-600">Could not load the menu.</p>;
  if (isLoading && !data) return <p className="text-sm text-gray-500">Loading menu...</p>;

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
        >
          ← Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {data?.page} of {data?.totalPages}
        </span>

        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={page === data?.totalPages}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
