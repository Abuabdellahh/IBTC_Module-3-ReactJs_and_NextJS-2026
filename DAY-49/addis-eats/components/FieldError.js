// components/FieldError.js — an error tied to its input via aria-describedby.

import { field } from "./styles";

export default function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className={field.error}>
      {message}
    </p>
  );
}
