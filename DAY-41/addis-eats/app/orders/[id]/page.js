import { getOrder } from "@/lib/orders-api";
import OrderStatus from "./OrderStatus";

export default async function OrderPage({ params }) {
  const { id } = await params;

  // Server fetches the initial order — the Client Component has data immediately
  const initialOrder = await getOrder(id);

  if (!initialOrder) {
    return (
      <section>
        <h1 className="text-2xl font-bold text-gray-700">Order not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          No order exists with ID <strong>{id}</strong>.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-md">
      <h1 className="mb-6 text-3xl font-bold">Order Status</h1>

      <p className="mb-4 text-xs text-purple-600">
        ✦ Server Component fetched the initial order.
        SWR takes over in the browser and polls every 5 s.
      </p>

      {/* initialOrder seeds SWR's fallbackData — no loading flash on first render */}
      <OrderStatus id={id} initialOrder={initialOrder} />
    </section>
  );
}
