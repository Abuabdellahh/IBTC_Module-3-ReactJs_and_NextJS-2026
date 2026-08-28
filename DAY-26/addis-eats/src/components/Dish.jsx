/**
 * A single menu item.
 *
 * @param {string} name        Dish name.
 * @param {number} price       Price in ETB.
 * @param {string} description Optional one-line description.
 */
export default function Dish({ name, price, description }) {
  return (
    <li className="dish">
      <div className="dish__row">
        <h3 className="dish__name">{name}</h3>
        <span className="dish__dots" aria-hidden="true" />
        <span className="dish__price">{price} ETB</span>
      </div>
      {description && <p className="dish__description">{description}</p>}
    </li>
  )
}
