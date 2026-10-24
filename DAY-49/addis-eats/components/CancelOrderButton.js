"use client";
// components/CancelOrderButton.js
// Two-step confirm (no window.confirm — it is not keyboard/screen-reader friendly
// on every device). The real rules live in cancelOrder() on the server.

import { useActionState, useEffect, useState } from "react";
import { cancelOrder } from "@/app/actions/orders";
import SubmitButton from "./SubmitButton";
import FormAlert from "./FormAlert";
import { btn } from "./styles";

export default function CancelOrderButton({ orderId, onCancelled }) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction] = useActionState(cancelOrder.bind(null, orderId), {});

  useEffect(() => {
    if (state?.ok) onCancelled?.();
  }, [state, onCancelled]);

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className={btn.danger}>
        Cancel order
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <FormAlert message={state?.error} />
      <p className="text-sm font-medium">Cancel this order? The kitchen has not started it yet.</p>
      <div className="flex flex-wrap gap-2">
        <SubmitButton variant="danger" pendingLabel="Cancelling…">Yes, cancel it</SubmitButton>
        <button type="button" onClick={() => setConfirming(false)} className={btn.secondary}>
          Keep my order
        </button>
      </div>
    </form>
  );
}
