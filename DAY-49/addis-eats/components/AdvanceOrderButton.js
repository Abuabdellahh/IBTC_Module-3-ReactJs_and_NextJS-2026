"use client";
// components/AdvanceOrderButton.js — one kitchen action ("Mark Ready", …).
// advanceOrder() re-checks the staff role and the allowed transition itself.

import { useActionState } from "react";
import { advanceOrder } from "@/app/actions/orders";
import SubmitButton from "./SubmitButton";

const LABELS = {
  Preparing: "Start preparing",
  Ready: "Mark ready",
  Delivered: "Mark delivered",
  Cancelled: "Cancel",
};

export default function AdvanceOrderButton({ orderId, nextStatus, orderRef }) {
  const [state, formAction] = useActionState(advanceOrder.bind(null, orderId, nextStatus), {});

  return (
    <form action={formAction}>
      <SubmitButton
        variant={nextStatus === "Cancelled" ? "danger" : "secondary"}
        pendingLabel="Saving…"
        className="min-h-10 px-3 text-xs"
      >
        {LABELS[nextStatus]}
        <span className="sr-only"> for order {orderRef}</span>
      </SubmitButton>
      {state?.error && <p role="alert" className="mt-1 text-xs text-danger">{state.error}</p>}
    </form>
  );
}
