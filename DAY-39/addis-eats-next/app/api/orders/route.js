import { orderSchema } from "@/lib/schema";
import { dishes } from "@/lib/dishes";
import { orders } from "@/lib/orders";

export async function POST(request) {
  const body = await request.json();

  const result = orderSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        error: "Validation failed",
        fieldErrors: result.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const dish = dishes.find((dish) => dish.id === result.data.dishId);

  if (!dish) {
    return Response.json({ error: "Dish not found" }, { status: 404 });
  }

  const order = {
    id: `ord-${Date.now()}`,
    name: result.data.name,
    phone: result.data.phone,
    dishId: dish.id,
    dishName: dish.name,
    total: dish.price,
    currency: "ETB",
    status: "active",
    userId: null, // set from auth session in a real app
  };

  orders.push(order);

  return Response.json(order, { status: 201 });
}
