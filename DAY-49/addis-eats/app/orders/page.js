// app/orders/page.js — Dynamic. The list is queried with session.userId,
// so there is no parameter anyone could change to see another customer's orders.

import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { card } from "@/components/styles";
import { listOrdersForUser } from "@/lib/db";
import { formatDateTime, formatETB, formatOrderRef } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata = {
  title: "My orders",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const session = await requireUser("/orders");
  const orders = listOrdersForUser(session.userId);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight">My orders</h1>
      <p className="mt-2 mb-8 text-muted">Signed in as {session.name}.</p>

      {orders.length === 0 ? (
        <EmptyState icon="🛵" title="No orders yet" actionHref="/menu" actionLabel="Order your first meal">
          When you place an order it appears here, and you can follow it live.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className={`${card} flex flex-wrap items-center justify-between gap-4 p-5 hover:border-brand-600`}
              >
                <div>
                  <p className="font-bold">
                    Order {formatOrderRef(order.id)}
                    <span className="sr-only">, {order.status}</span>
                  </p>
                  <p className="text-sm text-muted">
                    {formatDateTime(order.createdAt)} · {order.lines.reduce((n, l) => n + l.qty, 0)} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{formatETB(order.total)}</span>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
