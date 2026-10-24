// app/checkout/page.js — Dynamic (reads the session).
// Layer 1: proxy.js · Layer 2: requireUser() here · Layer 3: placeOrder() itself.

import CheckoutForm from "@/components/CheckoutForm";
import { requireUser } from "@/lib/session";

export const metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const session = await requireUser("/checkout");

  return (
    <>
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Checkout</h1>
      <CheckoutForm customerName={session.name} />
    </>
  );
}
