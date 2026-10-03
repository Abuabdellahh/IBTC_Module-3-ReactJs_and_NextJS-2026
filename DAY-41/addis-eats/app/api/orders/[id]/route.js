import { orders } from "@/lib/orders";

export async function GET(request, { params }) {
  const { id } = await params;

  const order = orders[id];

  if (!order) {
    return Response.json({ message: "Order not found" }, { status: 404 });
  }

  return Response.json(order);
}
