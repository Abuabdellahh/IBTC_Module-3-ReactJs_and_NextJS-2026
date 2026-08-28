import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'

/**
 * Category chips.
 *
 * Presentational and fully controlled: it owns no state, receives the selected
 * category from `Menu`, and reports clicks back through `onSelect`. Two
 * components rendering from the same state cannot disagree about which chip is
 * active — that is the point of lifting the state up.
 */
export default function CategoryBar(props) {
  checkProps(CategoryBar, props)
  const { categories, selected, onSelect, spicyOnly, onToggleSpicy } = props

  return (
    <div className="categories">
      <div className="chips" role="group" aria-label="Filter by category">
        {categories.map((category) => {
          const isSelected = category === selected
          return (
            <button
              key={category}
              type="button"
              className={isSelected ? 'chip chip--selected' : 'chip'}
              aria-pressed={isSelected}
              onClick={() => onSelect(category)}
            >
              {category}
            </button>
          )
        })}
      </div>

      <label className="switch">
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

CategoryBar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  spicyOnly: PropTypes.bool.isRequired,
  onToggleSpicy: PropTypes.func.isRequired,
}
