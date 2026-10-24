// components/FormAlert.js — form-level error, announced by screen readers when it appears.

export default function FormAlert({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger">
      {message}
    </p>
  );
}
