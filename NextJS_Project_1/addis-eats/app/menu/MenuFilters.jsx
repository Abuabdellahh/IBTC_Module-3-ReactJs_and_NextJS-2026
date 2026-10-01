'use client'

import { useState, useMemo } from 'react'
import DishList from './DishList'

export default function MenuFilters({ dishes }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [spicyOnly, setSpicyOnly] = useState(false)

  const categories = useMemo(
    () => ['All', ...new Set(dishes.map((d) => d.category))],
    [dishes],
  )

  const visible = useMemo(
    () =>
      dishes.filter((d) => {
        const matchCat = category === 'All' || d.category === category
        const matchSpicy = !spicyOnly || d.spicy === true
        const matchSearch =
          search.trim() === '' ||
          d.name.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSpicy && matchSearch
      }),
    [dishes, category, spicyOnly, search],
  )

  return (
    <>
      <input
        className="search"
        type="search"
        placeholder="Search dishes…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search dishes"
        autoFocus
      />

      <div className="categories">
        <div className="chips" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={cat === category ? 'chip chip--selected' : 'chip'}
              aria-pressed={cat === category}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <label className="switch" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--muted)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={spicyOnly}
            onChange={(e) => setSpicyOnly(e.target.checked)}
            style={{ accentColor: 'var(--accent)' }}
          />
          Spicy only
        </label>
      </div>

      <DishList dishes={visible} />
    </>
  )
}
