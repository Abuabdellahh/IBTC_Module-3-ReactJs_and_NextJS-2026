"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800",
  Preparing: "bg-blue-100 text-blue-800",
  Ready: "bg-green-100 text-green-800",
  Delivered: "bg-gray-100 text-gray-600",
};

export default function OrderStatus({ id, initialOrder }) {
  const { data, error } = useSWR(
    `/api/orders/${id}`,
    fetcher,
    {
      // Server-rendered order is immediately available — no loading flash
      fallbackData: initialOrder,
      // Poll every 5 seconds so status updates without a manual refresh
      refreshInterval: 5000,
    }
  );

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        Could not load the order.
      </p>
    );
  }

  const statusClass =
    STATUS_COLORS[data.status] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-xs text-gray-400">Order #{data.id}</p>

      <div className="mt-3 flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClass}`}
        >
          {data.status}
        </span>
      </div>

      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="text-gray-500">Customer</dt>
          <dd className="font-medium">{data.customer}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-gray-500">Total</dt>
          <dd className="font-medium">{data.total} ETB</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-gray-400">
        ↻ Automatically refreshes every 5 seconds
      </p>
    </div>
  );
}
