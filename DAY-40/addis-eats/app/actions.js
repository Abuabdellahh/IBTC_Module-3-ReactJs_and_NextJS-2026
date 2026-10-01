"use server";

import { revalidatePath } from "next/cache";

// In-memory store — replace with a real DB in production
const orders = [];

export async function placeOrder(previousState, formData) {
  const name = formData.get("name")?.trim();
  const phone = formData.get("phone")?.trim();
  const dishId = formData.get("dishId")?.trim();

  const errors = {};

  if (!name || name.length < 2) {
    errors.name = "Name must contain at least 2 characters.";
  }

  if (!phone || !/^(09\d{8}|\+2519\d{8})$/.test(phone)) {
    errors.phone = "Enter a valid Ethiopian phone number (09... or +2519...).";
  }

  if (!dishId) {
    errors.dishId = "Please select a dish.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const order = {
    id: `ord-${Date.now()}`,
    name,
    phone,
    dishId,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);

  revalidatePath("/checkout");

  return { success: true, orderId: order.id };
}
