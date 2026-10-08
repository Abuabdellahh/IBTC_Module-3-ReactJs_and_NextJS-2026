"use server";
// app/actions.js
// All Server Actions for Addis Eats.
// Every action re-establishes identity via getSession() — the browser is
// NEVER trusted to supply a userId or role.
//
// Three-layer security model:
//   1. Authentication  — is anyone signed in?
//   2. Existence check — does the record exist?
//   3. Authorization   — does this user own / have permission for this record?

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { orders, getOrderById } from "@/lib/orders";

// ─── Place Order ─────────────────────────────────────────────────────────────

export async function placeOrder(formData) {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");

  const item = formData.get("item");
  if (!item) throw new Error("No item selected");

  const newOrder = {
    id: `ord-${Date.now()}`,
    userId: session.userId, // always from the session — never from the client
    item,
    status: "Preparing",
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  redirect("/orders");
}

// ─── Cancel Order ─────────────────────────────────────────────────────────────

export async function cancelOrder(orderId) {
  // Layer 1 — Authentication
  const session = await getSession();
  if (!session) throw new Error("Not signed in");

  // Layer 2 — Existence
  const order = getOrderById(orderId);
  if (!order) throw new Error("Order not found");

  // Layer 3 — Ownership: session.userId, never a client-supplied value
  if (order.userId !== session.userId) {
    throw new Error("You are not allowed to cancel this order");
  }

  order.status = "Cancelled";
  return { success: true };
}

// ─── Update Order Status (staff only) ────────────────────────────────────────

export async function updateOrderStatus(orderId, newStatus) {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");

  // Role check on the server — hiding the button in the UI is not enough
  if (session.role !== "staff") {
    throw new Error("Only staff can update order status");
  }

  const order = getOrderById(orderId);
  if (!order) throw new Error("Order not found");

  const validStatuses = ["Preparing", "Ready", "Delivered", "Cancelled"];
  if (!validStatuses.includes(newStatus)) throw new Error("Invalid status");

  order.status = newStatus;
  return { success: true };
}
