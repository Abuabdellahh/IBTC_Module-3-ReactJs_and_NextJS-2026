// app/api/orders/[id]/status/route.js
// GET /api/orders/:id/status
// Used by the OrderStatus Client Component for SWR polling every 5 seconds.
// Returns the current status of a single order.

import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/orders";

export async function GET(request, { params }) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
