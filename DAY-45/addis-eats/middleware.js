// middleware.js — must live at the project root beside /app
// Early checkpoint: if no session cookie exists, redirect to /signin before
// any page work begins.
//
// What middleware proves: a session cookie APPEARS to exist (fast, early check).
// What middleware does NOT prove: the user owns a specific order.
// Ownership is verified inside Server Actions (see app/actions.js).

import { NextResponse } from "next/server";

export function middleware(request) {
  const session = request.cookies.get("session");

  if (!session) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only run on protected routes — public routes are intentionally excluded.
export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*"],
};
