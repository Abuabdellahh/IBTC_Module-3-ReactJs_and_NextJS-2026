import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadDishes } from '../api'
import { useCart } from '../context/CartContext'
import CategoryBar from '../components/CategoryBar'
import DishList from '../components/DishList'
import ErrorBoundary from '../components/ErrorBoundary'

export default function MenuPage() {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [spicyOnly, setSpicyOnly] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'All'

  const searchRef = useRef(null)
  const [search, setSearch] = useState('')

  const { addToCart } = useCart()

  // Stable reference — Dish is wrapped in memo, so it only re-renders when its
  // own props change. Without useCallback, every CartContext update would give
  // DishList a new onAdd reference, busting the memo on every dish.
  const stableAddToCart = useCallback((price) => addToCart(price), [addToCart])

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    loadDishes(controller.signal)
      .then(setDishes)
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [category])

  const categories = useMemo(
    () => ['All', ...new Set(dishes.map((d) => d.category))],
    [dishes],
  )

  const visibleDishes = useMemo(
    () =>
      dishes.filter((dish) => {
        const matchesCategory = category === 'All' || dish.category === category
        const matchesSpicy = !spicyOnly || dish.spicy === true
        const matchesSearch =
          search.trim() === '' ||
          dish.name.toLowerCase().includes(search.toLowerCase())
        return matchesCategory && matchesSpicy && matchesSearch
      }),
    [dishes, category, spicyOnly, search],
  )

  const setCategory = (value) => {
    setSearchParams(value === 'All' ? {} : { category: value })
  }

  const resetFilters = () => {
    setSearchParams({})
    setSpicyOnly(false)
    setSearch('')
  }

  if (loading) return <p className="menu-status">Loading menu…</p>
  if (error) return <p className="menu-status menu-status--error">⚠ {error}</p>

  return (
    <section className="menu-section">
      <input
        ref={searchRef}
        className="search"
        type="search"
        placeholder="Search dishes…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search dishes"
      />

      <CategoryBar
        categories={categories}
        selected={category}
        onSelect={setCategory}
        spicyOnly={spicyOnly}
        onToggleSpicy={setSpicyOnly}
      />

      {/* Boundary around the list only — filters and search survive a dish crash */}
      <ErrorBoundary fallback="The dish list failed to render. Try refreshing.">
        <DishList
          dishes={visibleDishes}
          emptyMessage={
            spicyOnly
              ? `No spicy dishes under ${category}.`
              : `Nothing on the menu under ${category}.`
          }
          onResetFilters={resetFilters}
          onAdd={stableAddToCart}
        />
      </ErrorBoundary>
    </section>
  )
}
