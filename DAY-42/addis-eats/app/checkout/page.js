// app/checkout/page.js
// Protected by middleware AND by a server-side session check.

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { placeOrder } from "@/app/orders/actions";

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/checkout");

  return (
    <main className="max-w-md">
      <h1 className="mb-2 text-3xl font-bold">Checkout</h1>
      <p className="mb-6 text-xs text-purple-600">
        ✦ Protected route — session verified server-side
      </p>

      <p className="mb-4 text-sm text-gray-600">
        Placing order as: <strong>{session.userId}</strong>
      </p>

      <form
        action={async (formData) => {
          "use server";
          const item = formData.get("item");
          await placeOrder(item);
          redirect("/orders");
        }}
        className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="item" className="block text-sm font-medium text-gray-700">
            Item
          </label>
          <select
            id="item"
            name="item"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>Doro Wot</option>
            <option>Tibs</option>
            <option>Kitfo</option>
            <option>Shiro</option>
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
