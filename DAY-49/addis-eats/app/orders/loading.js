// Shown while a private orders page renders on the server.
export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl" aria-busy="true" aria-label="Loading orders">
      <div className="h-9 w-48 animate-pulse rounded bg-line" />
      <div className="mt-8 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-line/60" />
        ))}
      </div>
    </div>
  );
}
