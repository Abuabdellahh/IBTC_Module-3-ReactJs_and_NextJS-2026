"use client";
// components/AddToCartButton.js
// Client Component because it responds to a click and writes to localStorage.

import { useEffect, useState } from "react";
import { addToCart } from "@/lib/cart-store";
import { btn } from "./styles";

export default function AddToCartButton({ dishId, dishName, className = "" }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(timer); // cleanup: no timer outlives the component
  }, [added]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          addToCart(dishId);
          setAdded(true);
        }}
        className={`${btn.primary} ${className}`}
      >
        {added ? "Added ✓" : "Add to cart"}
        <span className="sr-only"> — {dishName}</span>
      </button>
      <span role="status" className="sr-only">
        {added ? `${dishName} added to your cart` : ""}
      </span>
    </>
  );
}
