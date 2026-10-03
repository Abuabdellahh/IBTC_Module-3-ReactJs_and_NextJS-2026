export async function fetcher(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
