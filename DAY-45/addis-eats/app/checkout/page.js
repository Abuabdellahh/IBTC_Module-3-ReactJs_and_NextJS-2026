// app/checkout/page.js
// Protected by: middleware (cookie check) + page-level getSession() + placeOrder() action.
// Three-layer protection: middleware → page → action.

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { placeOrder } from "@/app/actions";
import { getDishes } from "@/lib/dishes";

export const metadata = {
  title: "Checkout",
  description: "Complete your Addis Eats order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  // Layer 2 — page-level session check (middleware is layer 1)
  const session = await getSession();
  if (!session) redirect("/signin?next=/checkout");

  const dishes = getDishes();

  return (
    <main className="max-w-md">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Checkout</h1>
      <p className="mb-1 text-sm text-gray-500">
        Ordering as: <strong>{session.userId}</strong>
      </p>
      <p className="mb-6 text-xs text-purple-600">
        ✦ Protected — middleware + page + action (three layers)
      </p>

      <form
        action={placeOrder}
        className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="item" className="block text-sm font-medium text-gray-700">
            Select a dish
          </label>
          <select
            id="item" name="item"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {dishes.map((dish) => (
              <option key={dish.id} value={dish.name}>
                {dish.name} — {dish.price} ETB
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700"
        >
          Place Order
        </button>
      </form>
    </main>
  );
}
