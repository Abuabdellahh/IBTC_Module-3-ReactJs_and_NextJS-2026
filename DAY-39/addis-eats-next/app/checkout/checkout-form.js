"use client";

import { useActionState } from "react";
import { placeOrder } from "@/app/actions";
import SubmitButton from "./submit-button";

const initialState = {
  success: false,
  error: "",
  fieldErrors: {},
};

export default function CheckoutForm({ dishes, selectedDishId }) {
  const [state, formAction] = useActionState(placeOrder, initialState);

  if (state.success) {
    return (
      <div style={{ padding: "1rem", background: "#d4edda", borderRadius: "4px" }}>
        <p>✅ Order placed! ID: <strong>{state.orderId}</strong></p>
        <a href="/orders">View all orders →</a>
      </div>
    );
  }

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
      {/* Name */}
      <div>
        <label htmlFor="name">Name</label>
        <br />
        <input id="name" name="name" required style={{ width: "100%", padding: "0.5rem" }} />
        {state.fieldErrors?.name && (
          <p role="alert" style={{ color: "red", margin: "0.25rem 0 0" }}>
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone">Phone (09... or +2519...)</label>
        <br />
        <input id="phone" name="phone" required style={{ width: "100%", padding: "0.5rem" }} />
        {state.fieldErrors?.phone && (
          <p role="alert" style={{ color: "red", margin: "0.25rem 0 0" }}>
            {state.fieldErrors.phone[0]}
          </p>
        )}
      </div>

      {/* Dish selector */}
      <div>
        <label htmlFor="dishId">Dish</label>
        <br />
        <select id="dishId" name="dishId" defaultValue={selectedDishId || ""} style={{ width: "100%", padding: "0.5rem" }}>
          <option value="">— select a dish —</option>
          {dishes.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.name} — {dish.price} ETB
            </option>
          ))}
        </select>
        {state.fieldErrors?.dishId && (
          <p role="alert" style={{ color: "red", margin: "0.25rem 0 0" }}>
            {state.fieldErrors.dishId[0]}
          </p>
        )}
      </div>

      {/* General error */}
      {state.error && !Object.keys(state.fieldErrors).length && (
        <p role="alert" style={{ color: "red" }}>{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
