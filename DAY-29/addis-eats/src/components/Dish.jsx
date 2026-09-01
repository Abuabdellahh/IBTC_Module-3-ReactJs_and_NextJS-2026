import { useState } from 'react'
import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import { formatEtb } from '../lib/format'
import Card from './Card'

/**
 * A single menu item.
 *
 * `count` is local state: how many of *this* dish are in the order. The dish
 * is the only thing that changes it, so it stays here rather than in a parent.
 * Every click also calls `onAdd(price)` so the order total — which is shared
 * by the whole page — can be kept where it belongs, up in `App`.
 */
export default function Dish(props) {
  checkProps(Dish, props)
  const { name, price, spicy, currency = 'ETB', description, onAdd } = props

  const [count, setCount] = useState(0)

  const handleAdd = () => {
    // Updater form: React batches state updates, so `count + 1` can go stale
    // if the button is clicked twice in the same tick.
    setCount((current) => current + 1)
    onAdd(price)
  }

  return (
    <Card as="li" className={count > 0 ? 'dish dish--ordered' : 'dish'}>
      <div className="dish__row">
        <h3 className="dish__name">
          {name}
          {/* Boolean() guards the guard: `spicy` is optional and often undefined,
              and a bare `{0 && …}` would print a stray 0. */}
          {Boolean(spicy) && (
            <span className="badge" title="Contains berbere or mitmita">
              Spicy
            </span>
          )}
        </h3>
        <span className="dish__dots" aria-hidden="true" />
        <span className="dish__price">
          {price} {currency}
        </span>
      </div>

      {description && <p className="dish__description">{description}</p>}

      <div className="dish__actions">
        {count > 0 && (
          <span className="dish__count">
            {count} × {formatEtb(price * count)}
          </span>
        )}
        <button
          type="button"
          className="dish__add"
          onClick={handleAdd}
          aria-label={`Add ${name} to the order`}
        >
          Add{count > 0 && ` · ${count}`}
        </button>
      </div>
    </Card>
  )
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  spicy: PropTypes.bool,
  currency: PropTypes.string,
  description: PropTypes.string,
  onAdd: PropTypes.func.isRequired,
}
