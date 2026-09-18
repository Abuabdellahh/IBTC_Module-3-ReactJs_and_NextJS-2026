import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import { formatEtb } from '../lib/format'
import Card from './Card'

export default function Dish(props) {
  checkProps(Dish, props)
  const { id, name, price, spicy, currency = 'ETB', description, onAdd } = props

  const [count, setCount] = useState(0)

  const handleAdd = () => {
    setCount((c) => c + 1)
    onAdd(price)
  }

  return (
    <Card as="li" className={count > 0 ? 'dish dish--ordered' : 'dish'}>
      <div className="dish__row">
        <h3 className="dish__name">
          <Link to={`/menu/${id}`} className="dish__link">
            {name}
          </Link>
          {Boolean(spicy) && (
            <span className="badge" title="Contains berbere or mitmita">Spicy</span>
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
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  spicy: PropTypes.bool,
  currency: PropTypes.string,
  description: PropTypes.string,
  onAdd: PropTypes.func.isRequired,
}
