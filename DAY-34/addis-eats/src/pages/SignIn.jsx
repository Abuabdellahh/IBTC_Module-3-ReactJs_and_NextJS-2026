import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'

export default function SignIn() {
  const [name, setName] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname ?? '/menu'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim().length < 2) return
    signIn(name.trim())
    navigate(from, { replace: true })
  }

  return (
    <Card as="section" className="signin">
      <h2 className="delivery__title">Sign in to checkout</h2>
      <p className="delivery__hint">Just your name — no password needed.</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__label" htmlFor="signin-name">Name</label>
          <input
            id="signin-name"
            type="text"
            autoFocus
            autoComplete="name"
            placeholder="Selam Tesfaye"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit" className="delivery__submit" disabled={name.trim().length < 2}>
          Continue
        </button>
      </form>
    </Card>
  )
}
