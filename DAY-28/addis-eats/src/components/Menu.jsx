import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import { categories, dishes } from '../data/menu'
import CategoryBar from './CategoryBar'
import DishList from './DishList'

/**
 * Owns the filter state.
 *
 * `CategoryBar` needs to know which chip is selected and `DishList` needs to
 * know what to show — so the state lives in their closest common parent and
 * travels down as props. Neither child keeps its own copy, so they cannot
 * disagree.
 */
export default function Menu(props) {
  checkProps(Menu, props)
  const { onAdd } = props

  const [category, setCategory] = useState('All')
  const [spicyOnly, setSpicyOnly] = useState(false)

  // Derived, not stored: recomputed from the filters, so it can never drift
  // out of sync the way a second piece of state would.
  const visibleDishes = useMemo(
    () =>
      dishes.filter((dish) => {
        const matchesCategory = category === 'All' || dish.category === category
        const matchesSpicy = !spicyOnly || dish.spicy === true
        return matchesCategory && matchesSpicy
      }),
    [category, spicyOnly],
  )

  const resetFilters = () => {
    setCategory('All')
    setSpicyOnly(false)
  }

  return (
    <section className="menu-section">
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
