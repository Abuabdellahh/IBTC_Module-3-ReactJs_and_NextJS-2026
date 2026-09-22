import MenuFilters from './MenuFilters'

async function getDishes() {
  // In Next.js App Router we fetch from the public folder via absolute URL.
  // During build/SSR we read the file directly for reliability.
  const { readFile } = await import('fs/promises')
  const { join } = await import('path')
  const raw = await readFile(join(process.cwd(), 'public', 'dishes.json'), 'utf8')
  return JSON.parse(raw)
}

export const metadata = { title: 'Menu · Addis Eats' }

export default async function MenuPage() {
  const dishes = await getDishes()
  return (
    <section className="menu-section">
      <MenuFilters dishes={dishes} />
    </section>
  )
}
