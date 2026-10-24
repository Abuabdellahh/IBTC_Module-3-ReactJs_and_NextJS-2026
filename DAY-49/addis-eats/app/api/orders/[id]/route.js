// GET /api/orders/:id — polled by the live status card on the order page.
// Same checks as the page: signed in, and the order is yours (or you are staff).
// Someone else's order returns 404, not 403, so ids cannot be probed.

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getOrderForUser, getOrderById } from "@/lib/db";

const noStore = { "Cache-Control": "private, no-store" };

export async function GET(_request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401, headers: noStore });
  }

  const { id } = await params;
  const order =
    session.role === "staff" ? await getOrderById(id) : await getOrderForUser(id, session.userId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404, headers: noStore });
  }

  const { id: orderId, status, total, createdAt } = order;
  return NextResponse.json({ id: orderId, status, total, createdAt }, { headers: noStore });
}
