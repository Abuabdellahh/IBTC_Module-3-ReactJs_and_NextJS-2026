import { getDishes } from "@/lib/dishes";

export async function GET(request) {
  const category = request.nextUrl.searchParams.get("category");
  const all = await getDishes();

  const result = category
    ? all.filter((d) => d.category === category)
    : all;

  return Response.json(result);
}
