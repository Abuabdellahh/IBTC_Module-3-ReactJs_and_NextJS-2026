import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="landing">
      <p className="landing__intro">
        Fresh injera, slow-simmered wats, and the best kitfo in Bole — delivered
        to your door.
      </p>
      <Link to="/menu" className="landing__cta">
        See the menu
      </Link>
    </div>
  )
}
