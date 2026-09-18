/** Fetches all dishes from the mock API endpoint.
 *
 * Throws a descriptive error when the response is not OK so callers
 * can surface it directly in the UI without inspecting status codes.
 *
 * @param {AbortSignal} signal - passed to fetch so the caller can cancel
 * @returns {Promise<Array>}
 */
export async function loadDishes(signal) {
  const res = await fetch('/dishes.json', { signal })

  if (!res.ok) {
    throw new Error(`Failed to load menu (${res.status} ${res.statusText})`)
  }

  return res.json()
}

/**
 * Simulates placing an order. In production this would POST to a real endpoint.
 * Randomly fails ~20 % of the time so the error path can be exercised.
 *
 * @param {object} order
 * @returns {Promise<object>} the confirmed order
 */
export async function placeOrder(order) {
  await new Promise((r) => setTimeout(r, 900))

  if (Math.random() < 0.2) {
    throw new Error('Payment gateway timed out — please try again.')
  }

  return order
}
