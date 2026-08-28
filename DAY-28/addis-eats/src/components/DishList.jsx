import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import Dish from './Dish'
import EmptyState from './EmptyState'

/** Renders the dishes it is given, or an empty state when there are none. */
export default function DishList(props) {
  checkProps(DishList, props)
  const { dishes, emptyMessage, onResetFilters, onAdd } = props

  if (dishes.length === 0) {
    return <EmptyState message={emptyMessage} onReset={onResetFilters} />
  }

  return (
    <ul className="menu">
      {dishes.map((dish) => (
        // `dish.id` — a stable id from the data, never the array index. Under a
        // filter the indexes shift, and React would hand a dish the previous
        // row's local `count`.
        <Dish
          key={dish.id}
          name={dish.name}
          price={dish.price}
          spicy={dish.spicy}
          description={dish.description}
          onAdd={onAdd}
        />
      ))}
    </ul>
  )
}

DishList.propTypes = {
  dishes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      spicy: PropTypes.bool,
      description: PropTypes.string,
    }),
  ).isRequired,
  emptyMessage: PropTypes.string.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
}
