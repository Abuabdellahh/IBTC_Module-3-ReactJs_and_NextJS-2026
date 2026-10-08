"use client";
// components/OrderStatus.js
// Client Component — polls order status every 5 seconds using SWR.
// fallbackData seeds SWR with the server-rendered initial order so there
// is no loading flash on first render.

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const STATUS_COLORS = {
  Preparing: "bg-yellow-100 text-yellow-700",
  Ready:     "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrderStatus({ orderId, initialOrder }) {
  const { data: order } = useSWR(
    `/api/orders/${orderId}/status`,
    fetcher,
    {
      refreshInterval: 5000,   // poll every 5 seconds
      fallbackData: initialOrder, // server data — no loading flash
    }
  );

  if (!order) return null;

  const colorClass = STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600";

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{order.item}</h2>
          <p className="text-sm text-gray-500">Order ID: {order.id}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}>
          {order.status}
        </span>
      </div>
      <p className="mt-3 text-xs text-purple-500">
        ✦ SWR polling every 5 s — server provided the initial status
      </p>
    </section>
  );
}
