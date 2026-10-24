export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading the kitchen dashboard">
      <div className="h-9 w-40 animate-pulse rounded bg-line" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-line/60" />
        ))}
      </div>
      <div className="mt-10 h-64 animate-pulse rounded-2xl bg-line/60" />
    </div>
  );
}
