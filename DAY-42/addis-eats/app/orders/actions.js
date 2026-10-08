"use server";
// app/orders/actions.js
// Server Actions — run on the server only.
// Every action re-establishes identity via getSession().
// The browser is NEVER trusted to supply the userId.

import { getSession } from "@/lib/session";

// In-memory store — replace with a real DB in production
const orders = [
  { id: "ord-1", userId: "demo-user-1", item: "Doro Wot",  status: "Preparing" },
  { id: "ord-2", userId: "demo-user-2", item: "Tibs",      status: "Delivered" },
  { id: "ord-3", userId: "demo-staff-1", item: "Kitfo",    status: "Ready"     },
];

export async function cancelOrder(orderId) {
  // Layer 1 — Authentication: who is making this request?
  const session = await getSession();
  if (!session) throw new Error("Not signed in");

  // Layer 2 — Does the order exist?
  const order = orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found");

  // Layer 3 — Authorization: does this user OWN the order?
  // We use session.userId — never a userId supplied by the browser.
  if (order.userId !== session.userId) {
    throw new Error("You are not allowed to cancel this order");
  }

  // Only now perform the operation (would update DB in production)
  order.status = "Cancelled";

  return { success: true, orderId };
}

export async function placeOrder(item) {
  // Authentication check inside the action — not just on the page
  const session = await getSession();
  if (!session) throw new Error("Not signed in");

  const newOrder = {
    id: `ord-${Date.now()}`,
    userId: session.userId,   // always from the session, never from the client
    item,
    status: "Preparing",
  };

  orders.push(newOrder);
  return { success: true, order: newOrder };
}

// Scoped query — returns only the signed-in user's orders
export async function getOrdersForCurrentUser() {
  const session = await getSession();
  if (!session) return [];
  return orders.filter((o) => o.userId === session.userId);
}
