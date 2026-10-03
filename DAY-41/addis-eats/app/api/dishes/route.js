import { dishes } from "@/lib/dishes";

const PAGE_SIZE = 3;

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const filtered = query
    ? dishes.filter((d) => d.name.toLowerCase().includes(query))
    : dishes;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const data = filtered.slice(start, start + PAGE_SIZE);

  return Response.json({
    data,
    page,
    pageSize: PAGE_SIZE,
    total: filtered.length,
    totalPages,
  });
}
