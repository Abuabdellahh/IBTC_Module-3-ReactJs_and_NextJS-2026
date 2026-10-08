// app/orders/page.js
// Protected: middleware catches unauthenticated requests first.
// The page also calls getSession() itself — the page-level check is the real
// authorization boundary, not just the middleware cookie check.

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrdersForCurrentUser, cancelOrder } from "./actions";

export default async function OrdersPage() {
  // Layer 2 — Page-level authentication check
  const session = await getSession();
  if (!session) redirect("/signin?next=/orders");

  // Data is scoped to the authenticated user — never from URL params
  const userOrders = await getOrdersForCurrentUser();

  return (
    <main>
      <h1 className="mb-2 text-3xl font-bold">My Orders</h1>
      <p className="mb-1 text-sm text-gray-500">
        Signed in as: <strong>{session.userId}</strong> · Role:{" "}
        <span className="text-purple-600">{session.role}</span>
      </p>
      <p className="mb-6 text-xs text-purple-600">
        ✦ Data is scoped to your session — you cannot see other users&apos; orders
      </p>

      {userOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {userOrders.map((order) => (
            <li key={order.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{order.item}</h2>
                  <p className="text-sm text-gray-500">
                    Order ID: {order.id} · Status:{" "}
                    <span
                      className={
                        order.status === "Cancelled"
                          ? "text-red-500"
                          : "text-green-600"
                      }
                    >
                      {order.status}
                    </span>
                  </p>
                </div>

                {order.status !== "Cancelled" && (
                  <form
                    action={async () => {
                      "use server";
                      await cancelOrder(order.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
