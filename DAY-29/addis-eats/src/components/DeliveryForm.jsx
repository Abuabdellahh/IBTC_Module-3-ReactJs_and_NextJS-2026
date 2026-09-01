import { useState } from 'react'
import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import { isValidTelebirr, toInternational } from '../lib/telebirr'
import { areas } from '../data/areas'
import Card from './Card'

const EMPTY_FORM = { name: '', phone: '', area: '' }

/**
 * Pure validation: form values in, errors out. Keeping it outside the
 * component means the rules can be read — and tested — on their own, and the
 * component never has to store an `errors` state that could go stale.
 */
function validate({ name, phone, area }) {
  const errors = {}

  if (name.trim().length < 2) {
    errors.name = 'Enter the name we should ask for at the door.'
  }
  if (!isValidTelebirr(phone)) {
    errors.phone = 'TeleBirr numbers look like 0912 345 678 or +251912345678.'
  }
  if (!area) {
    errors.area = 'Choose a delivery area.'
  }

  return errors
}

/**
 * Controlled delivery form.
 *
 * Every input reads its value from `form` and writes back through
 * `handleChange` — React state is the single source of truth, and the DOM only
 * reflects it. One state object plus one handler keyed by the input's `name`
 * scales to a fourth field without a fourth `useState`.
 */
export default function DeliveryForm(props) {
  checkProps(DeliveryForm, props)
  const { orderTotal, itemCount, onSubmit } = props

  const [form, setForm] = useState(EMPTY_FORM)
  // Which fields the user has left — so errors appear on blur, not while they
  // are still halfway through typing their phone number.
  const [touched, setTouched] = useState({})

  const errors = validate(form)
  const isValid = Object.keys(errors).length === 0
  const hasOrder = itemCount > 0

  const handleChange = (event) => {
    const { name, value } = event.target
    // Copy the object rather than mutating it: React compares by reference and
    // would skip the re-render if we edited `form` in place.
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((current) => ({ ...current, [name]: true }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isValid || !hasOrder) return

    onSubmit({
      name: form.name.trim(),
      // Hand on the canonical +2519… form, never the raw input.
      phone: toInternational(form.phone),
      area: form.area,
      total: orderTotal,
      items: itemCount,
    })

    setForm(EMPTY_FORM)
    setTouched({})
  }

  /** Show an error only once the field has been visited. */
  const errorFor = (field) => (touched[field] ? errors[field] : undefined)

  return (
    <Card as="section" className="delivery">
      <h2 className="delivery__title">Delivery</h2>
      <p className="delivery__hint">
        We confirm every order over TeleBirr before the rider leaves.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Field label="Name" error={errorFor('name')} htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Selam Tesfaye"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errorFor('name'))}
          />
        </Field>

        <Field label="TeleBirr number" error={errorFor('phone')} htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0912 345 678"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errorFor('phone'))}
          />
        </Field>

        <Field label="Area" error={errorFor('area')} htmlFor="area">
          <select
            id="area"
            name="area"
            value={form.area}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errorFor('area'))}
          >
            <option value="">Select an area…</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </Field>

        <button type="submit" className="delivery__submit" disabled={!isValid || !hasOrder}>
          Pay with TeleBirr
        </button>

        {/* Say *why* the button is dead — a disabled control with no
            explanation is a dead end for the user. */}
        {!hasOrder && (
          <p className="delivery__blocked">Add a dish to the order first.</p>
        )}
        {hasOrder && !isValid && (
          <p className="delivery__blocked">
            Fill in your name, a valid TeleBirr number and an area.
          </p>
        )}
      </form>
    </Card>
  )
}

DeliveryForm.propTypes = {
  orderTotal: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

/** Label + control + error message, so the three inputs stay consistent. */
function Field(props) {
  checkProps(Field, props)
  const { label, htmlFor, error, children } = props

  return (
    <div className={error ? 'field field--invalid' : 'field'}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  htmlFor: PropTypes.string.isRequired,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
}
