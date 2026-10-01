import { NextRequest } from "next/server";
import { dishes } from "@/lib/dishes";

export function GET(request) {
  const category = request.nextUrl.searchParams.get("category");

  const result = category
    ? dishes.filter((dish) => dish.category === category)
    : dishes;

  return Response.json(result);
}
