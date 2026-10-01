import { getDishes } from "@/lib/dishes";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage({ searchParams }) {
  const dishes = await getDishes();
  const { dishId } = await searchParams;

  return (
    <section className="max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
        <CheckoutForm dishes={dishes} selectedDishId={dishId} />
      </div>
    </section>
  );
}
