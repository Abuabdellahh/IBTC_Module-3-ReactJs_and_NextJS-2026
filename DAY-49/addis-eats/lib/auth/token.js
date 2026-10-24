// lib/auth/token.js
// Signed session token: base64url(JSON payload) + "." + base64url(HMAC-SHA256).
//
// Why signed and not just a user id: a cookie that says "demo-staff-1" can be
// typed into DevTools by anyone. A signed cookie cannot be changed without the
// server's SESSION_SECRET, so editing the role or the user id breaks the
// signature and verifyToken() returns null.
//
// Pure module (no Next.js imports) so it can be unit-tested with `node --test`
// and used from proxy.js.

import { createHmac, timingSafeEqual } from "node:crypto";

const encode = (value) => Buffer.from(value).toString("base64url");
const decode = (value) => Buffer.from(value, "base64url").toString("utf8");

function hmac(data, secret) {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

/**
 * @param {{ sub: string, name: string, role: "customer" | "staff" }} claims
 * @param {string} secret
 * @param {number} maxAgeSeconds
 */
export function signToken(claims, secret, maxAgeSeconds, now = Date.now()) {
  const payload = encode(
    JSON.stringify({ ...claims, exp: Math.floor(now / 1000) + maxAgeSeconds })
  );
  return `${payload}.${hmac(payload, secret)}`;
}

/** Returns the claims, or null for anything forged, tampered, malformed or expired. */
export function verifyToken(token, secret, now = Date.now()) {
  if (typeof token !== "string" || !secret) return null;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) return null;

  const expected = Buffer.from(hmac(payload, secret));
  const actual = Buffer.from(signature);
  // Constant-time compare — a plain === leaks how many characters matched.
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  try {
    const claims = JSON.parse(decode(payload));
    if (typeof claims.exp !== "number" || claims.exp * 1000 <= now) return null;
    if (typeof claims.sub !== "string") return null;
    if (claims.role !== "customer" && claims.role !== "staff") return null;
    return claims;
  } catch {
    return null;
  }
}
