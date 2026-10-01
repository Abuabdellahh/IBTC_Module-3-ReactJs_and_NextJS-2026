import { dishes } from "@/lib/dishes";
import Link from "next/link";

export default function MenuPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Menu</h1>

      {dishes.map((dish) => (
        <article key={dish.id} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #eee" }}>
          <h2>{dish.name}</h2>
          <p>Category: {dish.category}</p>
          <p>Price: {dish.price} ETB</p>
          <Link href={`/checkout?dishId=${dish.id}`}>Order this dish</Link>
        </article>
      ))}
    </main>
  );
}
