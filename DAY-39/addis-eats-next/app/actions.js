"use server";

import { revalidatePath } from "next/cache";
import { orderSchema } from "@/lib/schema";
import { dishes } from "@/lib/dishes";
import { orders } from "@/lib/orders";

// ─── placeOrder ──────────────────────────────────────────────────────────────
// Called by the checkout form via useActionState.
// Signature: (previousState, formData) because useActionState prepends previousState.

export async function placeOrder(previousState, formData) {
  const result = orderSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    dishId: formData.get("dishId"),
  });

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const dish = dishes.find((dish) => dish.id === result.data.dishId);

  if (!dish) {
    return {
      success: false,
      error: "Dish not found",
      fieldErrors: {},
    };
  }

  const order = {
    id: `ord-${Date.now()}`,
    name: result.data.name,
    phone: result.data.phone,
    dishId: dish.id,
    dishName: dish.name,
    total: dish.price,
    currency: "ETB",
    status: "active",
    // In a real app: userId: session.user.id
    userId: "demo-user",
  };

  orders.push(order);

  revalidatePath("/orders");

  return {
    success: true,
    orderId: order.id,
    error: "",
    fieldErrors: {},
  };
}

// ─── cancelOrder ─────────────────────────────────────────────────────────────
// Demonstrates server-side authentication + ownership checks.

export async function cancelOrder(orderId) {
  // In a real app, get the authenticated user from the session:
  // const user = await getCurrentUser();
  const user = { id: "demo-user" }; // simulated for this lesson

  if (!user) {
    return { error: "Not signed in" };
  }

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return { error: "Order not found" };
  }

  // ✅ Ownership check — the client never decides this
  if (order.userId !== user.id) {
    return { error: "You are not allowed to cancel this order" };
  }

  order.status = "cancelled";

  revalidatePath("/orders");

  return { success: true };
}
