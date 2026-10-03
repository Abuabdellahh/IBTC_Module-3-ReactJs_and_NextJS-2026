export async function addToCart(dish) {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dish),
  });

  if (!response.ok) {
    throw new Error("Failed to add dish to cart");
  }

  return response.json();
}
