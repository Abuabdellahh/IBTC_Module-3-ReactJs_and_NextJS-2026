"use client";

import { cancelOrder } from "@/app/actions";
import { useTransition } from "react";

export default function CancelButton({ orderId }) {
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelOrder(orderId);
      if (result.error) {
        alert(result.error);
      }
    });
  }

  return (
    <button onClick={handleCancel} disabled={isPending} style={{ color: "red" }}>
      {isPending ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}
