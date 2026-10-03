import SearchBox from "./SearchBox";
import PaginatedMenu from "./PaginatedMenu";
import TanStackMenu from "./TanStackMenu";

export default function MenuPage() {
  return (
    <div className="space-y-16">
      {/* ── Section 1: Debounced search (SWR) ─────────────────────────── */}
      <section>
        <h2 className="mb-1 text-2xl font-bold">Search Menu</h2>
        <p className="mb-6 text-sm text-gray-500">
          SWR · debounced 300 ms · keepPreviousData
        </p>
        <SearchBox />
      </section>

      {/* ── Section 2: Pagination (SWR) ───────────────────────────────── */}
      <section>
        <h2 className="mb-1 text-2xl font-bold">Paginated Menu</h2>
        <p className="mb-6 text-sm text-gray-500">
          SWR · page in key · keepPreviousData
        </p>
        <PaginatedMenu />
      </section>

      {/* ── Section 3: TanStack Query + Add to Cart ───────────────────── */}
      <section>
        <h2 className="mb-1 text-2xl font-bold">Menu + Add to Cart</h2>
        <p className="mb-6 text-sm text-gray-500">
          TanStack Query · useMutation · invalidateQueries
        </p>
        <TanStackMenu />
      </section>
    </div>
  );
}
