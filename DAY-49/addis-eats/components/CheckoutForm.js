"use client";
// components/CheckoutForm.js
// Client Component because it reads the cart from localStorage and shows
// validation errors returned by the action (useActionState).
//
// Double-submit protection, in two layers:
//   1. the submit button is disabled while the action is pending
//   2. every attempt carries an idempotency key; the server returns the
//      existing order if it sees the same key twice
//
// Only dish ids and quantities are sent. Prices are recomputed on the server.

import { useActionState, useState } from "react";
import { placeOrder } from "@/app/actions/orders";
import { formatETB } from "@/lib/format";
import { useCartLines, CartSkeleton } from "./CartView";
import EmptyState from "./EmptyState";
import FieldError from "./FieldError";
import FormAlert from "./FormAlert";
import SubmitButton from "./SubmitButton";
import { card, field } from "./styles";

export default function CheckoutForm({ customerName }) {
  const { lines, total, hydrated } = useCartLines();
  const [state, formAction] = useActionState(placeOrder, {});
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const errors = state?.errors ?? {};
  const values = state?.values ?? {};

  if (!hydrated) return <CartSkeleton />;

  if (lines.length === 0) {
    return (
      <EmptyState icon="🧺" title="Nothing to check out yet" actionHref="/menu" actionLabel="Browse the menu">
        Your cart is empty. Add dishes from the menu, then come back here.
      </EmptyState>
    );
  }

  const items = JSON.stringify(lines.map(({ id, qty }) => ({ id, qty })));
  const describedBy = (name, hint) => [errors[name] && `${name}-error`, hint].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <form action={formAction} className={`${card} space-y-5 p-6`} noValidate>
        <p className="text-sm text-muted">
          Ordering as <strong className="text-ink">{customerName}</strong>
        </p>

        <FormAlert message={errors.form || errors.items} />

        <input type="hidden" name="items" value={items} />
        <input type="hidden" name="idempotencyKey" value={idempotencyKey} />

        <div>
          <label htmlFor="phone" className={field.label}>Mobile number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            defaultValue={values.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone", "phone-hint")}
            className={field.input}
          />
          <p id="phone-hint" className={field.hint}>The rider calls this number on arrival.</p>
          <FieldError id="phone-error" message={errors.phone} />
        </div>

        <div>
          <label htmlFor="address" className={field.label}>Delivery address</label>
          <textarea
            id="address"
            name="address"
            rows={3}
            autoComplete="street-address"
            required
            defaultValue={values.address}
            aria-invalid={Boolean(errors.address)}
            aria-describedby={describedBy("address")}
            className={field.textarea}
            placeholder="Sub-city, street and a landmark"
          />
          <FieldError id="address-error" message={errors.address} />
        </div>

        <div>
          <label htmlFor="notes" className={field.label}>
            Notes for the kitchen <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            maxLength={200}
            defaultValue={values.notes}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={describedBy("notes")}
            className={field.textarea}
          />
          <FieldError id="notes-error" message={errors.notes} />
        </div>

        <SubmitButton pendingLabel="Placing your order…" className="w-full">
          Place order · {formatETB(total)}
        </SubmitButton>
      </form>

      <aside aria-labelledby="summary-heading" className={`${card} h-fit p-6`}>
        <h2 id="summary-heading" className="text-lg font-bold">Order summary</h2>
        <ul className="mt-4 divide-y divide-line">
          {lines.map(({ id, qty, dish }) => (
            <li key={id} className="flex justify-between gap-4 py-2 text-sm">
              <span>{qty} × {dish.name}</span>
              <span className="font-semibold">{formatETB(dish.price * qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-line pt-4 font-bold">
          <span>Total</span>
          <span>{formatETB(total)}</span>
        </p>
        <p className="mt-2 text-xs text-muted">Pay the rider in cash or with telebirr on delivery.</p>
      </aside>
    </div>
  );
}
