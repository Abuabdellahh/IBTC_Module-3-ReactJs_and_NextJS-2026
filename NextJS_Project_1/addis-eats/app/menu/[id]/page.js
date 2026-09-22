import Link from 'next/link'
import { notFound } from 'next/navigation'
import { readFile } from 'fs/promises'
import { join } from 'path'
import AddToCartButton from './AddToCartButton'

async function getDish(id) {
  const raw = await readFile(join(process.cwd(), 'public', 'dishes.json'), 'utf8')
  const dishes = JSON.parse(raw)
  return dishes.find((d) => d.id === id) ?? null
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const dish = await getDish(id)
  return { title: dish ? `${dish.name} · Addis Eats` : 'Dish not found' }
}

export default async function DishPage({ params }) {
  const { id } = await params
  const dish = await getDish(id)

  if (!dish) notFound()

  return (
    <div className="dish-page">
      <Link href="/menu" className="dish-page__back">← Back to menu</Link>
      <div className="card">
        <div className="dish__row">
          <h2 className="dish__name">
            {dish.name}
            {dish.spicy && <span className="badge">Spicy</span>}
          </h2>
          <span className="dish__dots" aria-hidden="true" />
          <span className="dish__price">{dish.price} ETB</span>
        </div>
        {dish.description && (
          <p className="dish__description">{dish.description}</p>
        )}
        <p className="dish__description" style={{ marginTop: '0.5rem' }}>
          Category: <strong style={{ color: 'var(--text)' }}>{dish.category}</strong>
        </p>
        <div className="dish__actions">
          <AddToCartButton dish={dish} />
        </div>
      </div>
    </div>
  )
}
