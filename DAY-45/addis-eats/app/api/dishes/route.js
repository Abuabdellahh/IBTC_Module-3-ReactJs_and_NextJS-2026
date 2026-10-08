// app/api/dishes/route.js
// GET /api/dishes          → all dishes (paginated)
// GET /api/dishes?q=tibs   → search results
// GET /api/dishes?page=2   → page 2

import { NextResponse } from "next/server";
import { searchDishes, paginateDishes } from "@/lib/dishes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q    = searchParams.get("q")    ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  if (q) {
    const results = searchDishes(q);
    return NextResponse.json(results);
  }

  const result = paginateDishes(page, 4);
  return NextResponse.json(result);
}
