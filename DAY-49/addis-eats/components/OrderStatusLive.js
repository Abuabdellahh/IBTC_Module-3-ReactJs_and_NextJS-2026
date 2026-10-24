"use client";
// components/OrderStatusLive.js
// Client Component because it polls. The page (a Server Component) passes the
// order it already loaded as fallbackData, so the first paint has real data
// and no loading flash. Polling stops once the order is Delivered/Cancelled.

import useSWR from "swr";
import { isFinal, customerCanCancel } from "@/lib/order-status";
import CancelOrderButton from "./CancelOrderButton";
import StatusBadge from "./StatusBadge";
import { card } from "./styles";

const STEPS = ["Placed", "Preparing", "Ready", "Delivered"];

async function fetcher(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(res.status === 401 ? "Your session has ended." : "Could not refresh this order.");
  return res.json();
}

export default function OrderStatusLive({ initialOrder, canCancel }) {
  const { data: order, error, mutate } = useSWR(`/api/orders/${initialOrder.id}`, fetcher, {
    fallbackData: initialOrder,
    // SWR passes its *cache* here, which is empty until the first poll (fallbackData
    // is not cached) — so only stop when we have fetched a final status.
    refreshInterval: (latest) => (latest && isFinal(latest.status) ? 0 : 5000),
  });

  const status = order?.status ?? initialOrder.status;
  const currentStep = STEPS.indexOf(status);

  return (
    <section aria-labelledby="status-heading" className={`${card} p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="status-heading" className="text-lg font-bold">Order status</h2>
        <StatusBadge status={status} />
      </div>

      {status === "Cancelled" ? (
        <p className="mt-4 text-muted">This order was cancelled.</p>
      ) : (
        <ol className="mt-6 grid grid-cols-4 gap-2" aria-label="Progress">
          {STEPS.map((step, index) => {
            const done = index <= currentStep;
            return (
              <li key={step} aria-current={index === currentStep ? "step" : undefined} className="text-center">
                <span className={`block h-2 rounded-full ${done ? "bg-brand-600" : "bg-line"}`} />
                <span className={`mt-2 block text-xs sm:text-sm ${done ? "font-semibold text-ink" : "text-muted"}`}>
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <p role="status" className="mt-4 text-sm text-muted">
        {error ? error.message : isFinal(status) ? "" : "Updates automatically every few seconds."}
      </p>

      {canCancel && customerCanCancel(status) && (
        <div className="mt-6 border-t border-line pt-6">
          <CancelOrderButton orderId={initialOrder.id} onCancelled={mutate} />
        </div>
      )}
    </section>
  );
}
