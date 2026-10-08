// lib/session.js
// Single helper used by every server component, action, and route handler.
// Returns { userId, role } or null when nobody is signed in.
//
// IMPORTANT: Demo only — real apps use a proper auth library (NextAuth, Lucia, etc.)
// and store hashed passwords. Never store plain-text passwords in production.

import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;

  if (!userId) return null;

  return {
    userId,
    role: userId === "demo-staff-1" ? "staff" : "customer",
  };
}
