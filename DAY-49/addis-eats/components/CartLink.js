"use client";
// components/CartLink.js — the header cart link with a live item count.

import Link from "next/link";
import { useCart } from "@/lib/cart-store";

export default function CartLink() {
  const { items, hydrated } = useCart();
  const count = items.reduce((sum, line) => sum + line.qty, 0);

  return (
    <Link href="/cart" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-brand-50">
      Cart
      <span
        className="inline-flex min-w-6 justify-center rounded-full bg-brand-600 px-1.5 py-0.5 text-xs font-bold text-white"
        aria-label={`${count} ${count === 1 ? "item" : "items"} in cart`}
      >
        {hydrated ? count : "·"}
      </span>
    </Link>
  );
}
