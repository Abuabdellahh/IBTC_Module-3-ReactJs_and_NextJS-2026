import MenuFilters from './MenuFilters'

async function getDishes() {
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
