"use client";

import { useQuery } from "@tanstack/react-query";
import DishCard from "./DishCard";
import AddToCartButton from "./AddToCartButton";

async function fetchDishes() {
  const res = await fetch("/api/dishes");
  if (!res.ok) throw new Error("Failed to fetch dishes");
  return res.json();
}

export default function TanStackMenu() {
  const { data, error, isPending } = useQuery({
    queryKey: ["dishes"],
    queryFn: fetchDishes,
    // Override the global 30 s default — menu data can stay fresh for 2 minutes
    staleTime: 2 * 60 * 1000,
  });

  if (isPending) return <p className="text-sm text-gray-500">Loading menu...</p>;
  if (error) return <p className="text-sm text-red-600">Could not load menu.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.data.map((dish) => (
        <div key={dish.id}>
          <DishCard dish={dish} />
          <AddToCartButton dish={dish} />
        </div>
      ))}
    </div>
  );
}
