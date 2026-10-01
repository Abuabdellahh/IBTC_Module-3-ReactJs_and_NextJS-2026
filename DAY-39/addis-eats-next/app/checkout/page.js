import { dishes } from "@/lib/dishes";
import CheckoutForm from "./checkout-form";

export default function CheckoutPage({ searchParams }) {
  const dishId = searchParams?.dishId ?? "";

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Checkout</h1>
      <CheckoutForm dishes={dishes} selectedDishId={dishId} />
    </main>
  );
}
