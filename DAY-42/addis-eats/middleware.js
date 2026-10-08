// proxy.js  (Next.js middleware — must live at the project root beside /app)
// Early checkpoint: if no session cookie exists, redirect to /signin before
// any page work begins.

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

// Only run this middleware on protected routes.
// Public routes (/menu, /signin, static assets) are intentionally excluded.
export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*"],
};
