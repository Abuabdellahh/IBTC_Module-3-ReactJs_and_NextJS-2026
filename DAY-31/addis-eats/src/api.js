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
