// lib/session.js
// The only module that reads or writes the session cookie. Server Components,
// Server Actions and Route Handlers all ask this file "who is this?" — none of
// them read the cookie themselves, and none accept a user id from the browser.

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken, verifyToken } from "./auth/token.js";
import { SESSION_COOKIE, SESSION_MAX_AGE, resolveSessionSecret } from "./auth/config.js";

/** @returns {Promise<{ userId: string, name: string, role: "customer" | "staff" } | null>} */
export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const claims = verifyToken(token, resolveSessionSecret());
  if (!claims) return null;
  return { userId: claims.sub, name: claims.name, role: claims.role };
}

export async function createSession(user) {
  const token = signToken(
    { sub: user.id, name: user.name, role: user.role },
    resolveSessionSecret(),
    SESSION_MAX_AGE
  );
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, // not readable from JavaScript, so XSS cannot steal it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // not sent on cross-site POSTs
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** For pages: signed out → /signin?next=<this page>. */
export async function requireUser(returnTo) {
  const session = await getSession();
  if (!session) redirect(`/signin?next=${encodeURIComponent(returnTo)}`);
  return session;
}
