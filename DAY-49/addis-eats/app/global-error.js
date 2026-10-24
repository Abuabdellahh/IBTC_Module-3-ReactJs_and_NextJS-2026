"use client";
// app/global-error.js — last-resort boundary for errors in the root layout itself.
// It replaces the whole document, so it renders its own <html> and <body>.

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1rem", textAlign: "center" }}>
        <h1>Addis Eats is having trouble</h1>
        <p>Please try again in a moment.</p>
        <button type="button" onClick={() => reset()} style={{ minHeight: 44, padding: "0 1.25rem" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
