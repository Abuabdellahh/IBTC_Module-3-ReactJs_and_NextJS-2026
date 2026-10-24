// app/not-found.js — unknown URLs, unknown dishes, and orders that are not yours.

import Link from "next/link";
import { btn, card } from "@/components/styles";

export const metadata = { title: "Not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className={`${card} mx-auto max-w-lg p-8 text-center`}>
      <p className="text-5xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">We could not find that page</h1>
      <p className="mt-2 text-muted">The link may be old, or the order may belong to a different account.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/menu" className={btn.primary}>Browse the menu</Link>
        <Link href="/orders" className={btn.secondary}>My orders</Link>
      </div>
    </div>
  );
}
