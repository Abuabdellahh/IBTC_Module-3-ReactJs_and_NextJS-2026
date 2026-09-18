import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { formatEtb } from '../lib/format'

/**
 * Dish detail modal rendered through a portal into document.body.
 *
 * - Escape closes it
 * - Focus moves to the dialog on open and returns to `triggerRef` on close
 * - Clicking the backdrop also closes it
 */
export default function DishModal({ dish, onClose, triggerRef }) {
  const dialogRef = useRef(null)

  // Move focus into the dialog when it opens
  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  // Return focus to the trigger button when the modal unmounts
  useEffect(() => {
    return () => {
      triggerRef?.current?.focus()
    }
  }, [triggerRef])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={dish.name}
        tabIndex={-1}
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="modal__title">{dish.name}</h2>

        {dish.spicy && (
          <span className="badge" title="Contains berbere or mitmita">
            Spicy
          </span>
        )}

        {dish.description && (
          <p className="modal__description">{dish.description}</p>
        )}

        <p className="modal__price">{formatEtb(dish.price)}</p>
      </div>
    </div>,
    document.body,
  )
}

DishModal.propTypes = {
  dish: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    spicy: PropTypes.bool,
    description: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  triggerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
}
