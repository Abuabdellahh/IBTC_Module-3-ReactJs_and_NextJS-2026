// app/api/signin/route.js
// Server-side only. Validates credentials, creates the session cookie, redirects.
// IMPORTANT: Demo only — real apps must hash passwords (bcrypt / Argon2).

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Demo users — never store plain-text passwords in production
const USERS = [
  { email: "user@example.com",  password: "password123",  userId: "demo-user-1" },
  { email: "staff@example.com", password: "staffpass123", userId: "demo-staff-1" },
];

export async function POST(request) {
  const formData = await request.formData();

  const email    = formData.get("email");
  const password = formData.get("password");
  const next     = formData.get("next") || "/";

  // 1. Validate credentials
  const user = USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    // Return to sign-in with an error flag
    const url = new URL("/signin", request.url);
    url.searchParams.set("error", "invalid");
    if (typeof next === "string" && next.startsWith("/")) {
      url.searchParams.set("next", next);
    }
    return NextResponse.redirect(url);
  }

  // 2. Validate the redirect destination — prevent open redirects
  const safeNext =
    typeof next === "string" && next.startsWith("/") ? next : "/";

  // 3. Create the session cookie
  const cookieStore = await cookies();
  cookieStore.set("session", user.userId, {
    httpOnly: true,                                    // not readable by JS
    secure: process.env.NODE_ENV === "production",     // HTTPS only in prod
    sameSite: "lax",                                   // CSRF protection
    maxAge: 60 * 60 * 24 * 7,                         // 7 days
    path: "/",
  });

  // 4. Redirect to the original destination
  return NextResponse.redirect(new URL(safeNext, request.url));
}
