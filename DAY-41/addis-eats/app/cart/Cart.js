"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchCart() {
  const res = await fetch("/api/cart");
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export default function Cart() {
  const queryClient = useQueryClient();

  const { data, error, isPending } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    // Cart data can become stale immediately — always show the latest
    staleTime: 0,
  });

  if (isPending) return <p className="text-sm text-gray-500">Loading cart...</p>;
  if (error) return <p className="text-sm text-red-600">Could not load cart.</p>;

  async function handleAddDemo() {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Date.now(), name: "Special Tibs", price: 480 }),
    });

    // Invalidate so TanStack Query re-fetches the cart
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Your Cart</h2>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">
          Your cart is empty. Add dishes from the{" "}
          <a href="/menu" className="text-purple-600 underline">
            menu
          </a>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {data.map((dish, i) => (
            <li
              key={`${dish.id}-${i}`}
              className="flex items-center justify-between rounded-lg border bg-white p-4 text-sm"
            >
              <span className="font-medium">{dish.name}</span>
              {dish.price && (
                <span className="text-purple-700 font-semibold">
                  {dish.price} ETB
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={handleAddDemo}
        className="mt-6 rounded-lg bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-700"
      >
        + Add Special Tibs (demo)
      </button>

      <p className="mt-3 text-xs text-gray-400">
        After the POST, invalidateQueries(["cart"]) triggers a re-fetch.
      </p>
    </div>
  );
}
