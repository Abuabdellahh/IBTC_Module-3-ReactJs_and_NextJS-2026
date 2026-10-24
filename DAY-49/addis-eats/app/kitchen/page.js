// app/kitchen/page.js — staff dashboard. Dynamic.
// The role comes from the signed session. A customer who types /kitchen gets
// a refusal from this check — not merely a missing nav link.

import Link from "next/link";
import AdvanceOrderButton from "@/components/AdvanceOrderButton";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { card } from "@/components/styles";
import { listAllOrders } from "@/lib/db";
import { formatDateTime, formatETB, formatOrderRef } from "@/lib/format";
import { isFinal, nextStatuses } from "@/lib/order-status";
import { requireUser } from "@/lib/session";

export const metadata = {
  title: "Kitchen",
  robots: { index: false, follow: false },
};

function Stat({ label, value }) {
  return (
    <div className={`${card} p-5`}>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-2xl font-extrabold">{value}</dd>
    </div>
  );
}

export default async function KitchenPage() {
  const session = await requireUser("/kitchen");

  if (session.role !== "staff") {
    return (
      <div className="mx-auto max-w-lg">
        <EmptyState icon="🔒" title="Kitchen staff only" actionHref="/orders" actionLabel="Go to my orders">
          You are signed in as a customer, so this page is not available to you.
        </EmptyState>
      </div>
    );
  }

  const orders = await listAllOrders();
  const active = orders.filter((o) => !isFinal(o.status));
  const billable = orders.filter((o) => o.status !== "Cancelled");
  const revenue = billable.reduce((sum, o) => sum + o.total, 0);
  const average = billable.length ? revenue / billable.length : 0;

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight">Kitchen</h1>
      <p className="mt-2 text-muted">Every order, newest first. Customers see each change within five seconds.</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active orders" value={active.length} />
        <Stat label="Waiting to start" value={orders.filter((o) => o.status === "Placed").length} />
        <Stat label="Revenue (excl. cancelled)" value={formatETB(revenue)} />
        <Stat label="Average order" value={formatETB(average)} />
      </dl>

      <section aria-labelledby="queue-heading" className="mt-10">
        <h2 id="queue-heading" className="text-xl font-bold">Order queue</h2>

        {orders.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon="🍳" title="No orders yet">New orders appear here as soon as customers check out.</EmptyState>
          </div>
        ) : (
          <div className={`${card} mt-4 overflow-x-auto`}>
            <table className="w-full min-w-[44rem] text-sm">
              <caption className="sr-only">All orders with their status and available actions</caption>
              <thead className="bg-canvas text-left text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Order</th>
                  <th scope="col" className="px-4 py-3 font-medium">Customer</th>
                  <th scope="col" className="px-4 py-3 font-medium">Items</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Total</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((order) => {
                  const ref = formatOrderRef(order.id);
                  return (
                    <tr key={order.id} className="align-top">
                      <td className="px-4 py-3">
                        <Link href={`/orders/${order.id}`} className="font-semibold text-brand-700 underline">{ref}</Link>
                        <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">{order.customerName}</td>
                      <td className="px-4 py-3">
                        {order.lines.map((l) => `${l.qty}× ${l.name}`).join(", ")}
                        {order.notes && <p className="mt-1 text-xs text-muted">“{order.notes}”</p>}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{formatETB(order.total)}</td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {nextStatuses(order.status).map((next) => (
                            <AdvanceOrderButton key={next} orderId={order.id} nextStatus={next} orderRef={ref} />
                          ))}
                          {isFinal(order.status) && <span className="text-xs text-muted">Done</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
