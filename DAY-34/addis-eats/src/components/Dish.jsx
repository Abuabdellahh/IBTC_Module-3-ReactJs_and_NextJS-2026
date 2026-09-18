import { memo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import { formatEtb } from '../lib/format'
import Card from './Card'
import DishModal from './DishModal'

/**
 * Wrapped in memo: the only props that should trigger a re-render are the
 * dish data itself and onAdd. Without memo, every addToCart call re-renders
 * the entire list because CartContext updates cause MenuPage to re-render,
 * which creates a new onAdd reference — even though the dishes are unchanged.
 */
const Dish = memo(function Dish(props) {
  checkProps(Dish, props)
  const { id, name, price, spicy, currency = 'ETB', description, onAdd } = props

  const [count, setCount] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const viewBtnRef = useRef(null)

  const handleAdd = () => {
    setCount((c) => c + 1)
    onAdd(price)
  }

  // Dish data object passed to the modal — stable shape, no extra state
  const dish = { id, name, price, spicy, description }

  return (
    <>
      <Card as="li" className={count > 0 ? 'dish dish--ordered' : 'dish'}>
        <div className="dish__row">
          <h3 className="dish__name">
            <button
              ref={viewBtnRef}
              type="button"
              className="dish__link"
              onClick={() => setModalOpen(true)}
              aria-haspopup="dialog"
            >
              {name}
            </button>
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

      {modalOpen && (
        <DishModal
          dish={dish}
          onClose={() => setModalOpen(false)}
          triggerRef={viewBtnRef}
        />
      )}
    </>
  )
})

Dish.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  spicy: PropTypes.bool,
  currency: PropTypes.string,
  description: PropTypes.string,
  onAdd: PropTypes.func.isRequired,
}

export default Dish
