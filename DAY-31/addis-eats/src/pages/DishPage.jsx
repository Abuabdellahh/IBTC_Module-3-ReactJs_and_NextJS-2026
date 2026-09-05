import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { loadDishes } from '../api'
import { useCart } from '../context/CartContext'
import { formatEtb } from '../lib/format'
import Card from '../components/Card'

export default function DishPage() {
  const { id } = useParams()
  const [dish, setDish] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const controller = new AbortController()

    loadDishes(controller.signal)
      .then((all) => {
        const found = all.find((d) => d.id === id)
        if (!found) throw new Error(`No dish found with id "${id}"`)
        setDish(found)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [id])

  if (loading) return <p className="menu-status">Loading…</p>
  if (error) return <p className="menu-status menu-status--error">⚠ {error}</p>

  return (
    <div className="dish-page">
      <Link to="/menu" className="dish-page__back">← Back to menu</Link>
      <Card className="dish-page__card">
        <div className="dish__row">
          <h2 className="dish__name">
            {dish.name}
            {dish.spicy && <span className="badge">Spicy</span>}
          </h2>
          <span className="dish__dots" aria-hidden="true" />
          <span className="dish__price">{formatEtb(dish.price)}</span>
        </div>
        {dish.description && <p className="dish__description">{dish.description}</p>}
        <div className="dish__actions">
          <button
            type="button"
            className="dish__add"
            onClick={() => addToCart(dish.price)}
          >
            Add to order
          </button>
        </div>
      </Card>
    </div>
  )
}
