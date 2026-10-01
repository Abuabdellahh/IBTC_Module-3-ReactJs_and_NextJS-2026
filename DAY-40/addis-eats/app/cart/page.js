import CartClient from "@/components/CartClient";

export default function CartPage() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>
      <CartClient />
    </section>
  );
}
