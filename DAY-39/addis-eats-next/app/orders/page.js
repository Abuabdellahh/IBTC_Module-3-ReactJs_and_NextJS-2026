import { orders } from "@/lib/orders";
import CancelButton from "./cancel-button";
import Link from "next/link";

export default function OrdersPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Orders</h1>

      <Link href="/checkout">+ Place a new order</Link>

      {orders.length === 0 && (
        <p style={{ marginTop: "1rem" }}>No orders yet.</p>
      )}

      {orders.map((order) => (
        <article
          key={order.id}
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #eee",
            opacity: order.status === "cancelled" ? 0.5 : 1,
          }}
        >
          <h2>{order.name}</h2>
          <p>Dish: {order.dishName}</p>
          <p>Phone: {order.phone}</p>
          <p>Total: {order.total} {order.currency}</p>
          <p>Status: <strong>{order.status}</strong></p>

          {order.status === "active" && (
            <CancelButton orderId={order.id} />
          )}
        </article>
      ))}
    </main>
  );
}
