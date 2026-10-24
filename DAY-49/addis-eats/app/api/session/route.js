// GET /api/session — who is signed in, for the client-side account menu.
// Returning this from an endpoint (instead of reading the cookie in the root
// layout) is what keeps the public pages static: a layout that reads cookies
// makes every route under it dynamic.

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  return NextResponse.json(
    { user: session ? { name: session.name, role: session.role } : null },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
