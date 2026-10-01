import { dishes } from "@/lib/dishes";
import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Addis Eats</h1>
      <p>Welcome to Addis Eats — authentic Ethiopian food delivered to your door.</p>

      <h2>Today's Menu</h2>

      {dishes.map((dish) => (
        <article key={dish.id} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #eee" }}>
          <h3>{dish.name}</h3>
          <p>{dish.category}</p>
          <p>{dish.price} ETB</p>
          <Link href={`/menu`}>View Menu</Link>
        </article>
      ))}

      <p style={{ marginTop: "2rem" }}>
        <Link href="/checkout">Go to Checkout →</Link>
      </p>
    </main>
  );
}
