import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import { formatEtb } from '../lib/format'
import Card from './Card'

/** Confirmation shown after a successful checkout. */
export default function Receipt(props) {
  checkProps(Receipt, props)
  const { order, onDismiss } = props

  return (
    <Card as="section" className="receipt">
      <h2 className="receipt__title">Order confirmed</h2>
      <p className="receipt__body">
        Thanks {order.name} — {order.items}{' '}
        {order.items === 1 ? 'dish' : 'dishes'} on the way to{' '}
        <strong>{order.area}</strong>. We sent a TeleBirr request for{' '}
        <strong>{formatEtb(order.total)}</strong> to {order.phone}.
      </p>
      <button type="button" className="receipt__dismiss" onClick={onDismiss}>
        Order something else
      </button>
    </Card>
  )
}

Receipt.propTypes = {
  order: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    items: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  onDismiss: PropTypes.func.isRequired,
}
