"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { placeOrder } from "@/app/actions";

const initialState = { success: false, errors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Placing Order..." : "Place Order"}
    </button>
  );
}

export default function CheckoutForm({ dishes, selectedDishId }) {
  const [state, formAction] = useActionState(placeOrder, initialState);

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Order Placed!</h3>
        <p className="text-green-700 text-sm">Order ID: <strong>{state.orderId}</strong></p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="e.g. Almaz Tadesse"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        {state.errors?.name && (
          <p role="alert" className="text-red-500 text-xs mt-1">{state.errors.name}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          required
          placeholder="09XXXXXXXX or +2519XXXXXXXX"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        {state.errors?.phone && (
          <p role="alert" className="text-red-500 text-xs mt-1">{state.errors.phone}</p>
        )}
      </div>

      {/* Dish */}
      <div>
        <label htmlFor="dishId" className="block text-sm font-medium text-gray-700 mb-1">
          Dish
        </label>
        <select
          id="dishId"
          name="dishId"
          defaultValue={selectedDishId ?? ""}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="">— select a dish —</option>
          {dishes.map((dish) => (
            <option key={dish.id} value={String(dish.id)}>
              {dish.emoji} {dish.name} — {dish.price} ETB
            </option>
          ))}
        </select>
        {state.errors?.dishId && (
          <p role="alert" className="text-red-500 text-xs mt-1">{state.errors.dishId}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
