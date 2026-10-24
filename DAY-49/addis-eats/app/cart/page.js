// app/cart/page.js — static shell; the cart itself is client-side (localStorage).

import CartView from "@/components/CartView";

export const metadata = {
  title: "Your cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Your cart</h1>
      <CartView />
    </div>
  );
}
