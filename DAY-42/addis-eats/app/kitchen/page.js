// app/kitchen/page.js
// Protected by session check AND a server-side role check.
// Hiding the nav link for non-staff is a UI convenience only — the server
// enforces the real authorization boundary here.

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// All orders visible to staff (in production this would be a DB query)
const allOrders = [
  { id: "ord-1", userId: "demo-user-1",  item: "Doro Wot", status: "Preparing" },
  { id: "ord-2", userId: "demo-user-2",  item: "Tibs",     status: "Delivered" },
  { id: "ord-3", userId: "demo-staff-1", item: "Kitfo",    status: "Ready"     },
];

export default async function KitchenPage() {
  // Step 1 — Authentication
  const session = await getSession();
  if (!session) redirect("/signin?next=/kitchen");

  // Step 2 — Authorization: staff role required
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

  return (
    <main>
      <h1 className="mb-2 text-3xl font-bold">Kitchen</h1>
      <p className="mb-1 text-sm text-gray-500">
        Signed in as: <strong>{session.userId}</strong> · Role:{" "}
        <span className="text-purple-600">{session.role}</span>
      </p>
      <p className="mb-6 text-xs text-purple-600">
        ✦ Staff-only route — role verified server-side
      </p>

      <ul className="space-y-4">
        {allOrders.map((order) => (
          <li key={order.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{order.item}</h2>
                <p className="text-sm text-gray-500">
                  Order: {order.id} · Customer: {order.userId}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  order.status === "Preparing"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Ready"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
