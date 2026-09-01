import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import { formatEtb } from '../lib/format'
import Card from './Card'

/** Running order total, in Birr. */
export default function OrderSummary(props) {
  checkProps(OrderSummary, props)
  const { items, total, onClear } = props

  return (
    <Card className="summary">
      <div className="summary__line">
        <span className="summary__label">
          {items === 0
            ? 'No dishes yet'
            : `${items} ${items === 1 ? 'dish' : 'dishes'} in your order`}
        </span>
        <strong className="summary__total">{formatEtb(total)}</strong>
      </div>

      {items > 0 && (
        <button type="button" className="summary__clear" onClick={onClear}>
          Clear order
        </button>
      )}
    </Card>
  )
}

OrderSummary.propTypes = {
  items: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onClear: PropTypes.func.isRequired,
}
