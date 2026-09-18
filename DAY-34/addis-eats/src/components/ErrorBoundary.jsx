import { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Catches render errors inside its subtree and shows a scoped fallback.
 * The rest of the page is unaffected because each boundary is independent.
 *
 * Usage:
 *   <ErrorBoundary fallback="Menu failed to load.">
 *     <Menu />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack)
    }
  }

  render() {
    if (this.state.error) {
      return (
        <p className="boundary-error" role="alert">
          {this.props.fallback ?? 'Something went wrong.'}
        </p>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.string,
}
