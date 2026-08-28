import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import Card from './Card'

/** A single menu item. */
export default function Dish(props) {
  checkProps(Dish, props)

  // `currency` gets its default here. React 19 ignores `Dish.defaultProps` on
  // function components, so a default parameter is how defaults are written.
  const { name, price, spicy, currency = 'ETB', description } = props

  return (
    <Card as="li" className="dish">
      <div className="dish__row">
        <h3 className="dish__name">
          {name}
          {/*
            `spicy` is optional, so most dishes pass `undefined`. Boolean()
            guards the render: with a bare `{value && …}` a falsy non-boolean
            leaks into the output — React skips undefined/null/false but
            happily prints `0` and `''`.
          */}
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
    </Card>
  )
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  spicy: PropTypes.bool,
  currency: PropTypes.string,
  description: PropTypes.string,
}
