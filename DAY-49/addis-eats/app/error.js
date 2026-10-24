"use client";
// app/error.js — catches errors thrown while rendering any page below the root layout.
// Error boundaries must be Client Components (they use state to reset).

import Link from "next/link";
import { btn, card } from "@/components/styles";

export default function Error({ reset }) {
  return (
    <div role="alert" className={`${card} mx-auto max-w-lg p-8 text-center`}>
      <p className="text-4xl" aria-hidden="true">😕</p>
      <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted">
        We could not load this page. Your cart is safe — try again, or head back to the menu.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => reset()} className={btn.primary}>Try again</button>
        <Link href="/menu" className={btn.secondary}>Back to the menu</Link>
      </div>
    </div>
  );
}
