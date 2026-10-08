// app/kitchen/page.js
// Protected by session check AND server-side staff role check.
// Hiding the nav link for non-staff is a UI convenience only.
// The server enforces the real authorization boundary here.

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllOrders } from "@/lib/orders";
import { updateOrderStatus } from "@/app/actions";

export const metadata = {
  title: "Kitchen",
  robots: { index: false, follow: false },
};

const STATUS_COLORS = {
  Preparing: "bg-yellow-100 text-yellow-700",
  Ready:     "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default async function KitchenPage() {
  // Layer 1 — Authentication
  const session = await getSession();
  if (!session) redirect("/signin?next=/kitchen");

  // Layer 2 — Authorization: staff role required (server-side)
  if (session.role !== "staff") {
    return (
      <main className="max-w-md">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-2xl font-bold text-red-700">Forbidden</h1>
          <p className="mt-2 text-sm text-red-600">
            This page is available only to staff members.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Signed in as: {session.userId} · Role: {session.role}
          </p>
        </div>
      </main>
    );
  }

  const allOrders = getAllOrders();

  return (
    <main>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Kitchen</h1>
      <p className="mb-1 text-sm text-gray-500">
        Signed in as: <strong>{session.userId}</strong> ·{" "}
        <span className="text-purple-600">{session.role}</span>
      </p>
      <p className="mb-6 text-xs text-purple-600">
        ✦ Staff-only — role verified server-side
      </p>

      <ul className="space-y-4">
        {allOrders.map((order) => (
          <li key={order.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{order.item}</h2>
                <p className="text-sm text-gray-500">
                  ID: {order.id} · Customer: {order.userId}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>

                {/* Status update — action checks staff role server-side */}
                <form action={updateOrderStatus.bind(null, order.id, "Ready")}>
                  <button
                    type="submit"
                    className="rounded-lg border px-3 py-1 text-xs text-blue-600 hover:bg-blue-50"
                  >
                    Mark Ready
                  </button>
                </form>
                <form action={updateOrderStatus.bind(null, order.id, "Delivered")}>
                  <button
                    type="submit"
                    className="rounded-lg border px-3 py-1 text-xs text-green-600 hover:bg-green-50"
                  >
                    Mark Delivered
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
