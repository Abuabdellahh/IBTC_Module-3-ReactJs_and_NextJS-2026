// app/orders/[id]/page.js — Dynamic.
// The id in the URL is only a *search term*: the lookup is scoped to the
// signed-in customer, so changing the id to someone else's order gives a
// 404 — the same answer as an id that does not exist.

import Link from "next/link";
import { notFound } from "next/navigation";
import ClearCart from "@/components/ClearCart";
import OrderStatusLive from "@/components/OrderStatusLive";
import { card } from "@/components/styles";
import { getOrderById, getOrderForUser } from "@/lib/db";
import { formatDateTime, formatETB, formatOrderRef } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata = {
  title: "Order details",
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params, searchParams }) {
  const { id } = await params;
  const { placed } = await searchParams;
  const session = await requireUser(`/orders/${id}`);

  const order = session.role === "staff" ? getOrderById(id) : getOrderForUser(id, session.userId);
  if (!order) notFound();

  const justPlaced = placed === "1" && order.userId === session.userId;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {justPlaced && <ClearCart />}

      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href={session.role === "staff" ? "/kitchen" : "/orders"} className="font-semibold text-brand-700 underline">
          ← {session.role === "staff" ? "Back to the kitchen" : "All my orders"}
        </Link>
      </nav>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Order {formatOrderRef(order.id)}</h1>
        <p className="mt-1 text-muted">Placed {formatDateTime(order.createdAt)}</p>
      </div>

      {justPlaced && (
        <p role="status" className="rounded-xl border border-success/30 bg-success-bg px-4 py-3 font-medium text-success">
          Thank you — your order is in. We will call {order.phone} when the rider arrives.
        </p>
      )}

      <OrderStatusLive
        initialOrder={{ id: order.id, status: order.status, total: order.total, createdAt: order.createdAt }}
        canCancel={order.userId === session.userId}
      />

      <section aria-labelledby="items-heading" className={`${card} p-6`}>
        <h2 id="items-heading" className="text-lg font-bold">What you ordered</h2>
        <table className="mt-4 w-full text-sm">
          <caption className="sr-only">Items in order {formatOrderRef(order.id)}</caption>
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th scope="col" className="py-2 font-medium">Dish</th>
              <th scope="col" className="py-2 text-right font-medium">Qty</th>
              <th scope="col" className="py-2 text-right font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((line) => (
              <tr key={line.dishId} className="border-b border-line">
                <td className="py-2">{line.name}</td>
                <td className="py-2 text-right">{line.qty}</td>
                <td className="py-2 text-right">{formatETB(line.unitPrice * line.qty)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={2} className="pt-3 text-left">Total</th>
              <td className="pt-3 text-right font-bold">{formatETB(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      <section aria-labelledby="delivery-heading" className={`${card} p-6`}>
        <h2 id="delivery-heading" className="text-lg font-bold">Delivery</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="text-muted">Address</dt>
          <dd>{order.address}</dd>
          <dt className="text-muted">Phone</dt>
          <dd>{order.phone}</dd>
          {order.notes && (
            <>
              <dt className="text-muted">Notes</dt>
              <dd>{order.notes}</dd>
            </>
          )}
        </dl>
      </section>
    </div>
  );
}
