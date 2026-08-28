import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'

/**
 * Generic surface that renders whatever it wraps.
 *
 * `children` is the prop React fills with the JSX between the tags — it is
 * what makes a wrapper reusable: Card owns padding and borders and knows
 * nothing about menu items.
 */
export default function Card(props) {
  checkProps(Card, props)
  const { children, as: Tag = 'div', className = '' } = props

  return <Tag className={`card ${className}`.trim()}>{children}</Tag>
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  /** Element to render as — `li` inside a list, `div` anywhere else. */
  as: PropTypes.string,
  className: PropTypes.string,
}
