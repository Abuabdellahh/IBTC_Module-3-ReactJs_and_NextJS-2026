"use client";
// components/SubmitButton.js
// Disabled while the form's action is pending — the first defence against a
// double submit. (The second is the idempotency key checked on the server.)

import { useFormStatus } from "react-dom";
import { btn } from "./styles";

export default function SubmitButton({ children, pendingLabel, variant = "primary", className = "" }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-disabled={pending} className={`${btn[variant]} ${className}`}>
      {pending ? pendingLabel : children}
    </button>
  );
}
