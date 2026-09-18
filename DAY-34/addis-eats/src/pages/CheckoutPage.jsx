import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { placeOrder as apiPlaceOrder } from '../api'
import OrderSummary from '../components/OrderSummary'
import DeliveryForm from '../components/DeliveryForm'
import Receipt from '../components/Receipt'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const [receipt, setReceipt] = useState(null)
  const navigate = useNavigate()

  // onSubmit is async: throws on failure so DeliveryForm can handle the error
  const handleSubmit = async (details) => {
    const confirmed = await apiPlaceOrder(details)
    setReceipt(confirmed)
    clearCart()
  }

  const dismiss = () => {
    setReceipt(null)
    navigate('/menu')
  }

  return (
    <>
      <OrderSummary items={cart.items} total={cart.total} onClear={clearCart} />

      {receipt ? (
        <Receipt order={receipt} onDismiss={dismiss} />
      ) : (
        <DeliveryForm
          orderTotal={cart.total}
          itemCount={cart.items}
          onSubmit={handleSubmit}
          defaultName={user?.name ?? ''}
        />
      )}
    </>
  )
}
