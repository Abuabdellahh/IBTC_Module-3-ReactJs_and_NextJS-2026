"use client";
// components/CartView.js — the cart. Client Component: it reads localStorage.

import Link from "next/link";
import { useCart, setQuantity } from "@/lib/cart-store";
import { getDish } from "@/lib/menu";
import { formatETB } from "@/lib/format";
import { MAX_QTY } from "@/lib/validation";
import EmptyState from "./EmptyState";
import { btn, card } from "./styles";

/** Joins cart lines ({ id, qty }) with catalogue data, dropping dishes that no longer exist. */
export function useCartLines() {
  const { items, hydrated } = useCart();
  const lines = items
    .map((item) => ({ ...item, dish: getDish(item.id) }))
    .filter((line) => line.dish);
  const total = lines.reduce((sum, line) => sum + line.dish.price * line.qty, 0);
  return { lines, total, hydrated };
}

export function CartSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your cart" className="space-y-3">
      {[0, 1].map((i) => (
        <div key={i} className={`${card} h-24 animate-pulse bg-line/40`} />
      ))}
    </div>
  );
}

export default function CartView() {
  const { lines, total, hydrated } = useCartLines();

  if (!hydrated) return <CartSkeleton />;

  if (lines.length === 0) {
    return (
      <EmptyState icon="🧺" title="Your cart is empty" actionHref="/menu" actionLabel="Browse the menu">
        Add a dish or two from the menu and it will wait for you here.
      </EmptyState>
    );
  }

  return (
    <>
      <ul className="space-y-3">
        {lines.map(({ id, qty, dish }) => (
          <li key={id} className={`${card} flex flex-wrap items-center justify-between gap-4 p-4`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">{dish.emoji}</span>
              <div>
                <p className="font-semibold">{dish.name}</p>
                <p className="text-sm text-muted">{formatETB(dish.price)} each</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(id, qty - 1)}
                className={btn.secondary + " w-11 px-0"}
                aria-label={qty === 1 ? `Remove ${dish.name}` : `One fewer ${dish.name}`}
              >
                −
              </button>
              <span className="w-8 text-center font-semibold" aria-label={`Quantity ${qty}`}>{qty}</span>
              <button
                type="button"
                onClick={() => setQuantity(id, qty + 1)}
                disabled={qty >= MAX_QTY}
                className={btn.secondary + " w-11 px-0"}
                aria-label={`One more ${dish.name}`}
              >
                +
              </button>
              <p className="w-28 text-right font-bold">{formatETB(dish.price * qty)}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className={`${card} mt-6 flex flex-wrap items-center justify-between gap-4 p-4`}>
        <p className="text-lg">
          Total <strong className="ml-2">{formatETB(total)}</strong>
        </p>
        <Link href="/checkout" className={btn.primary}>
          Go to checkout
        </Link>
      </div>
    </>
  );
}
