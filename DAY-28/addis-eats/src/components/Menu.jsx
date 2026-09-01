import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import { loadDishes } from '../api'
import CategoryBar from './CategoryBar'
import DishList from './DishList'

const CATEGORIES = ['All', 'Mains', 'Fasting', 'Breakfast']

export default function Menu(props) {
  checkProps(Menu, props)
  const { onAdd, onDishCount } = props

  const [category, setCategory] = useState('All')
  const [spicyOnly, setSpicyOnly] = useState(false)
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const searchRef = useRef(null)
  const [search, setSearch] = useState('')

  // Auto-focus the search input on mount
  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  // Fetch (and re-fetch) whenever category changes; abort the previous request
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    loadDishes(category, controller.signal)
      .then((data) => {
        setDishes(data)
        onDishCount(data.length)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [category, onDishCount])

  const visibleDishes = useMemo(
    () =>
      dishes.filter((dish) => {
        const matchesSpicy = !spicyOnly || dish.spicy === true
        const matchesSearch =
          search.trim() === '' ||
          dish.name.toLowerCase().includes(search.toLowerCase())
        return matchesSpicy && matchesSearch
      }),
    [dishes, spicyOnly, search],
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
        categories={CATEGORIES}
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
  onDishCount: PropTypes.func.isRequired,
}
