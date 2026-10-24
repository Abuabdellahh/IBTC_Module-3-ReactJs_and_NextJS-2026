// proxy.js (Next.js 16 — formerly middleware.js)
// Layer 1 of 3: an early, optimistic gate for private pages. It redirects a
// visitor with no valid session cookie before any page work starts.
//
// What it proves: the request carries a cookie signed by this server that has not expired.
// What it does NOT prove: that this user may see or change a particular order.
// That is checked in the page (layer 2) and again inside every Server Action
// and Route Handler (layer 3). Proxy alone is never the security check:
// Server Actions can be called directly, without loading any page.

import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth/token.js";
import { SESSION_COOKIE, resolveSessionSecret } from "./lib/auth/config.js";

export function proxy(request) {
  let claims = null;
  try {
    claims = verifyToken(request.cookies.get(SESSION_COOKIE)?.value, resolveSessionSecret());
  } catch {
    claims = null; // misconfigured secret → treat everyone as signed out (fail closed)
  }

  if (!claims) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/kitchen/:path*"],
};
