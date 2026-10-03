import Cart from "./Cart";

// Server Component shell — only the Cart component needs "use client"
export default function CartPage() {
  return (
    <section className="max-w-lg">
      <h1 className="mb-2 text-3xl font-bold">Cart</h1>
      <p className="mb-6 text-xs text-purple-600">
        ✦ TanStack Query · useQuery · invalidateQueries after mutation
      </p>
      <Cart />
    </section>
  );
}
