import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'
import { isValidTelebirr, toInternational } from '../lib/telebirr'
import { formatEtb } from '../lib/format'
import { areas } from '../data/areas'
import Card from './Card'

const EMPTY_FORM = { name: '', phone: '', area: '', notes: '' }

/**
 * Pure validation: form values in, errors out.
 * Notes is optional — no rule for it.
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

export default function DeliveryForm(props) {
  checkProps(DeliveryForm, props)
  const { orderTotal, itemCount, onSubmit, defaultName } = props

  const [form, setForm] = useState({ ...EMPTY_FORM, name: defaultName ?? '' })
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  // Refs for focusing the first bad field on a failed request
  const fieldRefs = {
    name: useRef(null),
    phone: useRef(null),
    area: useRef(null),
  }

  const errors = validate(form)
  const isValid = Object.keys(errors).length === 0
  const hasOrder = itemCount > 0

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((c) => ({ ...c, [name]: value }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((c) => ({ ...c, [name]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid || !hasOrder || submitting) return

    setSubmitting(true)
    setServerError(null)

    try {
      await onSubmit({
        name: form.name.trim(),
        phone: toInternational(form.phone),
        area: form.area,
        notes: form.notes.trim(),
        total: orderTotal,
        items: itemCount,
      })
      setForm(EMPTY_FORM)
      setTouched({})
    } catch (err) {
      setServerError(err.message)
      // Focus the first bad field so keyboard/screen-reader users land somewhere useful
      const firstBadField = ['name', 'phone', 'area'].find((f) => errors[f])
      if (firstBadField) {
        setTouched({ name: true, phone: true, area: true })
        fieldRefs[firstBadField]?.current?.focus()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const errorFor = (field) => (touched[field] ? errors[field] : undefined)

  return (
    <Card as="section" className="delivery">
      <h2 className="delivery__title">Delivery</h2>
      <p className="delivery__hint">
        We confirm every order over TeleBirr before the rider leaves.
      </p>

      {serverError && (
        <p className="delivery__server-error" role="alert">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Field label="Name" error={errorFor('name')} htmlFor="name">
          <input
            ref={fieldRefs.name}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Selam Tesfaye"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errorFor('name'))}
            aria-describedby={errorFor('name') ? 'name-error' : undefined}
          />
        </Field>

        <Field label="TeleBirr number" error={errorFor('phone')} htmlFor="phone">
          <input
            ref={fieldRefs.phone}
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
            aria-describedby={errorFor('phone') ? 'phone-error' : undefined}
          />
        </Field>

        <Field label="Delivery area" error={errorFor('area')} htmlFor="area">
          <select
            ref={fieldRefs.area}
            id="area"
            name="area"
            value={form.area}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errorFor('area'))}
            aria-describedby={errorFor('area') ? 'area-error' : undefined}
          >
            <option value="">Select an area…</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Notes (optional)" htmlFor="notes">
          <input
            id="notes"
            name="notes"
            type="text"
            placeholder="Gate code, landmark, allergies…"
            value={form.notes}
            onChange={handleChange}
          />
        </Field>

        <button
          type="submit"
          className="delivery__submit"
          disabled={!isValid || !hasOrder || submitting}
        >
          {submitting
            ? 'Placing order…'
            : `Pay ${formatEtb(orderTotal)} with TeleBirr`}
        </button>

        {!hasOrder && (
          <p className="delivery__blocked">Add a dish to the order first.</p>
        )}
        {hasOrder && !isValid && !submitting && (
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
  defaultName: PropTypes.string,
}

function Field({ label, htmlFor, error, children }) {
  return (
    <div className={error ? 'field field--invalid' : 'field'}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="field__error" role="alert">
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
