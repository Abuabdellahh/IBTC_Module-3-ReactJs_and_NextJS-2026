"use client";
// components/ClearCart.js — rendered on the order page right after checkout.
// The order now exists on the server, so the browser's copy of the cart is done.

import { useEffect } from "react";
import { clearCart } from "@/lib/cart-store";

export default function ClearCart() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
