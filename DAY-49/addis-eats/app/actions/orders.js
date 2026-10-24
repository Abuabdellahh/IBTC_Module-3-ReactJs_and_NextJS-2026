"use server";
// app/actions/orders.js
// A Server Action is a public POST endpoint: anyone can call it from the
// console with any arguments, signed in or not. So each action re-checks,
// inside itself:
//   1. Authentication — getSession(), never a user id passed in
//   2. Authorization  — the record is scoped to session.userId (or role = staff)
//   3. Validity       — the change is allowed for the record's current state

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { createOrder, getOrderForUser, getOrderById, setOrderStatus } from "@/lib/db";
import { validateCheckout } from "@/lib/validation";
import { canTransition, customerCanCancel } from "@/lib/order-status";

const NOT_SIGNED_IN = "Your session has ended. Please sign in again.";

export async function placeOrder(_prevState, formData) {
  const session = await getSession(); // check 1
  if (!session) return { errors: { form: NOT_SIGNED_IN } };

  const { data, errors } = validateCheckout(formData); // prices come from lib/menu, not the form
  if (errors) {
    const values = Object.fromEntries(["phone", "address", "notes"].map((k) => [k, String(formData.get(k) ?? "")]));
    return { errors, values };
  }

  const order = await createOrder({ userId: session.userId, ...data }); // owner = session, idempotent on key

  revalidatePath("/orders");
  revalidatePath("/kitchen");
  redirect(`/orders/${order.id}?placed=1`);
}

export async function cancelOrder(orderId, _prevState, _formData) {
  const session = await getSession(); // check 1 — attack 1 (signed out) stops here
  if (!session) return { error: NOT_SIGNED_IN };

  // check 2 — attack 2 (someone else's order) stops here: the lookup is scoped
  // to session.userId, so another customer's order is simply "not found".
  const order = await getOrderForUser(String(orderId), session.userId);
  if (!order) return { error: "Order not found." };

  if (!customerCanCancel(order.status)) {
    return { error: "This order is already being prepared and can no longer be cancelled." };
  }

  await setOrderStatus(order.id, "Cancelled");
  revalidatePath("/orders");
  revalidatePath(`/orders/${order.id}`);
  revalidatePath("/kitchen");
  return { ok: true };
}

export async function advanceOrder(orderId, nextStatus, _prevState, _formData) {
  const session = await getSession(); // check 1
  if (!session) return { error: NOT_SIGNED_IN };

  // check 2 — role from the signed session, not from the UI hiding a button
  if (session.role !== "staff") return { error: "Only kitchen staff can update orders." };

  const order = await getOrderById(String(orderId));
  if (!order) return { error: "Order not found." };

  if (!canTransition(order.status, nextStatus)) {
    return { error: `An order that is ${order.status} cannot become ${nextStatus}.` };
  }

  await setOrderStatus(order.id, nextStatus);
  revalidatePath("/kitchen");
  revalidatePath(`/orders/${order.id}`);
  revalidatePath("/orders");
  return { ok: true };
}
