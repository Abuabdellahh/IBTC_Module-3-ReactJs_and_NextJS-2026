"use client";
// components/CartClient.js
// Client Component — localStorage belongs to the browser.
// The cart state lives here; the server never needs to know about it
// until the user proceeds to checkout and places an order.

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartClient() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // localStorage unavailable (e.g. private browsing restrictions)
    }
  }, []);

  function removeItem(id) {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  const total = cart.reduce((sum, item) => sum + item.price * (item.qty ?? 1), 0);

  return (
    <div>
      {cart.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link
            href="/menu"
            className="mt-4 inline-block text-sm text-purple-600 hover:underline"
          >
            Browse the menu →
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.price} ETB</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
            <p className="font-bold text-gray-900">Total: {total} ETB</p>
            <Link
              href="/checkout"
              className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
