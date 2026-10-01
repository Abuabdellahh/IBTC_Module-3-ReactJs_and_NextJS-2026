"use client";

import { useState } from "react";
import Link from "next/link";

const INITIAL_CART = [
  { id: 1, name: "Kitfo", price: 350, quantity: 1, emoji: "🥩" },
  { id: 2, name: "Doro Wot", price: 400, quantity: 1, emoji: "🍗" },
];

export default function CartClient() {
  const [cart, setCart] = useState(INITIAL_CART);

  function increment(id) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decrement(id) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🛒</div>
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link
          href="/menu"
          className="text-amber-600 hover:underline font-medium"
        >
          Browse the menu →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3 mb-6">
        {cart.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-xl p-4 border border-amber-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.price} ETB each</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => decrement(item.id)}
                className="w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-100 font-bold text-gray-600"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => increment(item.id)}
                className="w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-100 font-bold text-gray-600"
              >
                +
              </button>
              <span className="w-20 text-right font-semibold text-amber-700">
                {item.price * item.quantity} ETB
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-center justify-between">
        <span className="font-bold text-gray-800 text-lg">Total</span>
        <span className="font-bold text-amber-700 text-xl">{total} ETB</span>
      </div>

      <Link
        href="/checkout"
        className="mt-4 block text-center bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors"
      >
        Proceed to Checkout →
      </Link>
    </div>
  );
}
