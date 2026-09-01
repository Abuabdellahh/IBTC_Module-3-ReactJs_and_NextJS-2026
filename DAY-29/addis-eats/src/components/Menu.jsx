import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import { loadDishes } from '../api'
import CategoryBar from './CategoryBar'
import DishList from './DishList'

export default function Menu(props) {
  checkProps(Menu, props)
  const { onAdd } = props

  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [category, setCategory] = useState('All')
  const [spicyOnly, setSpicyOnly] = useState(false)
  const [search, setSearch] = useState('')

  const searchRef = useRef(null)

  // Auto-focus the search input on mount
  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  // Fetch all dishes once; re-run if category changes so the effect
  // dependency array stays honest — filtering happens client-side below.
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

  // Derived — never stored, so it can never drift out of sync
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

  const resetFilters = () => {
    setCategory('All')
    setSpicyOnly(false)
    setSearch('')
  }

  if (loading) {
    return <p className="menu-status">Loading menu…</p>
  }

  if (error) {
    return <p className="menu-status menu-status--error">⚠ {error}</p>
  }

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

      <DishList
        dishes={visibleDishes}
        emptyMessage={
          spicyOnly
            ? `No spicy dishes under ${category}.`
            : `Nothing on the menu under ${category}.`
        }
        onResetFilters={resetFilters}
        onAdd={onAdd}
      />
    </section>
  )
}

Menu.propTypes = {
  onAdd: PropTypes.func.isRequired,
}
