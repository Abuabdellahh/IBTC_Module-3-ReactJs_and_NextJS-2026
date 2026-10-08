// app/loading.js — shown while any route segment is loading
export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-sm text-gray-400 animate-pulse">Loading…</p>
    </div>
  );
}
