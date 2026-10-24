// lib/auth/config.js
// Shared by proxy.js and lib/session.js so the two can never disagree about
// the cookie name or the secret.

export const SESSION_COOKIE = "ae_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const DEV_SECRET = "dev-only-insecure-secret-change-me-0000";

export function resolveSessionSecret(env = process.env) {
  const secret = env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (env.NODE_ENV === "production") {
    // Fail closed: without a real secret, anyone could sign their own cookie.
    throw new Error("SESSION_SECRET must be set (32+ characters) in production.");
  }
  return DEV_SECRET;
}
