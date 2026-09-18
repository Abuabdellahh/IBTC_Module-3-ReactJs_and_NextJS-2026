import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import Card from './Card'

/** Shown when a filter combination matches no dishes. */
export default function EmptyState(props) {
  checkProps(EmptyState, props)
  const { message, onReset } = props

  return (
    <Card className="empty">
      <p className="empty__message">{message}</p>
      <button type="button" className="empty__reset" onClick={onReset}>
        Clear filters
      </button>
    </Card>
  )
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
}
