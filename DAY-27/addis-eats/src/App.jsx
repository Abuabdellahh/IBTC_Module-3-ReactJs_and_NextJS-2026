import { useMemo, useState } from 'react'
import CategoryFilter from './components/CategoryFilter'
import Dish from './components/Dish'
import EmptyState from './components/EmptyState'
import Header from './components/Header'
import { categories, dishes } from './data/menu'

export default function App() {
  const [category, setCategory] = useState('All')
  const [spicyOnly, setSpicyOnly] = useState(false)

  // Derived state: recompute from the filters rather than storing a second
  // copy of the list that could drift out of sync.
  const visibleDishes = useMemo(
    () =>
      dishes.filter((dish) => {
        const matchesCategory = category === 'All' || dish.category === category
        const matchesSpicy = !spicyOnly || dish.spicy === true
        return matchesCategory && matchesSpicy
      }),
    [category, spicyOnly],
  )

  const emptyMessage = spicyOnly
    ? `No spicy dishes under ${category}.`
    : `Nothing on the menu under ${category}.`

  const resetFilters = () => {
    setCategory('All')
    setSpicyOnly(false)
  }

  return (
    <div className="app">
      <Header count={dishes.length} />

      <main>
        <CategoryFilter
          categories={categories}
          active={category}
          onSelect={setCategory}
          spicyOnly={spicyOnly}
          onToggleSpicy={setSpicyOnly}
        />

        {visibleDishes.length > 0 ? (
          <ul className="menu">
            {visibleDishes.map((dish) => (
              <Dish
                key={dish.id}
                name={dish.name}
                price={dish.price}
                spicy={dish.spicy}
                description={dish.description}
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            message={emptyMessage}
            onReset={resetFilters}
          />
        )}
      </main>

      <footer className="footer">Prices include VAT · Day 27</footer>
    </div>
  )
}
