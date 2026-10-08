// app/orders/page.js
// Protected by middleware (layer 1) + page-level getSession() (layer 2).
// Data is scoped to session.userId — never from URL params or form fields.

import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getOrdersForUser } from "@/lib/orders";
import { cancelOrder } from "@/app/actions";

export const metadata = {
  title: "My Orders",
  description: "View and manage your Addis Eats orders.",
  robots: { index: false, follow: false },
};

const STATUS_COLORS = {
  Preparing: "text-yellow-600",
  Ready:     "text-blue-600",
  Delivered: "text-green-600",
  Cancelled: "text-red-500",
};

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/orders");

  // Scoped query — session.userId, never a client-supplied value
  const userOrders = getOrdersForUser(session.userId);

  return (
    <main>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">My Orders</h1>
      <p className="mb-1 text-sm text-gray-500">
        Signed in as: <strong>{session.userId}</strong> ·{" "}
        <span className="text-purple-600">{session.role}</span>
      </p>
      <p className="mb-6 text-xs text-purple-600">
        ✦ Data scoped to your session — you cannot see other users&apos; orders
      </p>

      {userOrders.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
          <p className="text-gray-500">No orders yet.</p>
          <Link href="/checkout" className="mt-3 inline-block text-sm text-purple-600 hover:underline">
            Place an order →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {userOrders.map((order) => (
            <li key={order.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{order.item}</h2>
                  <p className="text-sm text-gray-500">
                    ID: {order.id} · Status:{" "}
                    <span className={STATUS_COLORS[order.status] ?? "text-gray-600"}>
                      {order.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/orders/${order.id}`}
                    className="rounded-lg border px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Details
                  </Link>
                  {order.status !== "Cancelled" && order.status !== "Delivered" && (
                    <form action={cancelOrder.bind(null, order.id)}>
                      <button
                        type="submit"
                        className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
