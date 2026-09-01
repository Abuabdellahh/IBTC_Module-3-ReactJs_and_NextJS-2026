import PropTypes from 'prop-types'

/**
 * Runs a component's `propTypes` against the props it actually received.
 *
 * React 19 removed built-in propTypes checking: assigning `Component.propTypes`
 * still documents the contract, but React no longer validates it, so a wrong
 * prop passes silently. `PropTypes.checkPropTypes` is the supported way to run
 * the same validation ourselves — it logs the identical
 * "Warning: Failed prop type: …" message to console.error.
 *
 * Guarded by `import.meta.env.DEV`, so the whole thing drops out of the
 * production bundle.
 *
 * @param {Function} Component a component carrying a `propTypes` object
 * @param {object}   props     the props it was called with
 */
export function checkProps(Component, props) {
  if (import.meta.env.DEV && Component.propTypes) {
    PropTypes.checkPropTypes(Component.propTypes, props, 'prop', Component.name)
  }
}
