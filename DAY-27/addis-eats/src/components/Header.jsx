import PropTypes from 'prop-types'
import { checkProps } from '../lib/checkProps'

/** Restaurant banner shown above the menu. */
export default function Header(props) {
  checkProps(Header, props)
  const { count } = props

  return (
    <header className="header">
      <p className="header__eyebrow">Bole · Addis Ababa</p>
      <h1 className="header__title">Addis Eats</h1>
      <p className="header__tagline">
        Home-style Ethiopian cooking · {count} dishes on the menu
      </p>
    </header>
  )
}

Header.propTypes = {
  count: PropTypes.number.isRequired,
}
