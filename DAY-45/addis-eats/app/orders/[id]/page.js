// app/orders/[id]/page.js
// Protected — session check + ownership check.
// Server fetches the initial order; OrderStatus (Client Component) polls via SWR.

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getOrderById } from "@/lib/orders";
import OrderStatus from "@/components/OrderStatus";

export const metadata = {
  title: "Order Details",
  robots: { index: false, follow: false },
};

export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) redirect(`/signin?next=/orders/${id}`);

  const order = getOrderById(id);
  if (!order) notFound();

  // Ownership check — server-side, not just a hidden button
  if (order.userId !== session.userId && session.role !== "staff") {
    return (
      <main className="max-w-md">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-700">Forbidden</h1>
          <p className="mt-2 text-sm text-red-600">
            You do not have permission to view this order.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-lg">
      <Link href="/orders" className="text-sm text-purple-600 hover:underline">
        ← Back to orders
      </Link>

      <h1 className="mt-4 mb-6 text-3xl font-bold text-gray-900">Order Details</h1>

      {/* Server provides initialOrder — no loading flash on first render */}
      <OrderStatus orderId={order.id} initialOrder={order} />
    </main>
  );
}
