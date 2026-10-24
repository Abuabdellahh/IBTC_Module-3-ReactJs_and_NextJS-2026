// lib/auth/redirect.js
// Attack 3 — the crafted return link: /signin?next=https://evil.example
//
// Only same-origin *paths* are allowed. A check like next.startsWith("/") is
// not enough: "//evil.example" and "/\evil.example" both start with "/" and
// browsers treat them as links to another site.

export function safeRedirect(next, fallback = "/") {
  if (typeof next !== "string" || next.length === 0 || next.length > 512) {
    return fallback;
  }
  if (!next.startsWith("/")) return fallback; // absolute URLs, javascript:, etc.
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback; // protocol-relative
  if (/[\u0000-\u001f\\]/.test(next)) return fallback; // control chars, backslashes

  // Final guard: resolve against a dummy origin and make sure it did not escape.
  try {
    const url = new URL(next, "http://same-origin.invalid");
    if (url.origin !== "http://same-origin.invalid") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
