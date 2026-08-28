import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'

/**
 * Controlled filter bar. It owns no state — the active category and the spicy
 * toggle live in App, and this component only reports clicks upward.
 */
export default function CategoryFilter(props) {
  checkProps(CategoryFilter, props)
  const { categories, active, onSelect, spicyOnly, onToggleSpicy } = props

  return (
    <div className="filter">
      <div className="filter__tabs" role="group" aria-label="Filter by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="filter__tab"
            aria-pressed={category === active}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <label className="filter__switch">
        <input
          type="checkbox"
          checked={spicyOnly}
          onChange={(event) => onToggleSpicy(event.target.checked)}
        />
        Spicy only
      </label>
    </div>
  )
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  active: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  spicyOnly: PropTypes.bool.isRequired,
  onToggleSpicy: PropTypes.func.isRequired,
}
