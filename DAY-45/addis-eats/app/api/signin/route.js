// app/api/signin/route.js
// Validates credentials, creates the session cookie, redirects.
// IMPORTANT: Demo only — real apps must hash passwords (bcrypt / Argon2).

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const USERS = [
  { email: "user@example.com",  password: "password123",  userId: "demo-user-1" },
  { email: "staff@example.com", password: "staffpass123", userId: "demo-staff-1" },
];

export async function POST(request) {
  const formData = await request.formData();
  const email    = formData.get("email");
  const password = formData.get("password");
  const next     = formData.get("next") || "/";

  const user = USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("error", "invalid");
    if (typeof next === "string" && next.startsWith("/")) {
      url.searchParams.set("next", next);
    }
    return NextResponse.redirect(url);
  }

  // Validate next — prevent open redirects
  const safeNext = typeof next === "string" && next.startsWith("/") ? next : "/";

  const cookieStore = await cookies();
  cookieStore.set("session", user.userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.redirect(new URL(safeNext, request.url));
}
