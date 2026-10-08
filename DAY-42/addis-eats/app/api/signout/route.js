// app/api/signout/route.js
// Deletes the session cookie and redirects to the home page.

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.redirect(new URL("/", request.url));
}
