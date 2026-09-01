/**
 * Fetches dishes from the public JSON endpoint.
 * Throws a clear message when the response is not OK.
 *
 * @param {string} category  - 'All' or a specific category name
 * @param {AbortSignal} signal - passed straight to fetch for cleanup
 */
export async function loadDishes(category, signal) {
  const res = await fetch('/dishes.json', { signal })

  if (!res.ok) {
    throw new Error(`Failed to load menu (${res.status} ${res.statusText})`)
  }

  const all = await res.json()
  return category === 'All' ? all : all.filter((d) => d.category === category)
}
