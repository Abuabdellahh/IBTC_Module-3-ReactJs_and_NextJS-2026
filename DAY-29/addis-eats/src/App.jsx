import { useState } from 'react'
import DeliveryForm from './components/DeliveryForm'
import Header from './components/Header'
import Menu from './components/Menu'
import OrderSummary from './components/OrderSummary'
import Receipt from './components/Receipt'

const EMPTY_ORDER = { items: 0, total: 0 }

export default function App() {
  const [order, setOrder] = useState(EMPTY_ORDER)
  const [receipt, setReceipt] = useState(null)

  const addToOrder = (price) => {
    setOrder((current) => ({
      items: current.items + 1,
      total: current.total + price,
    }))
  }

  const clearOrder = () => setOrder(EMPTY_ORDER)

  const placeOrder = (details) => {
    setReceipt(details)
    clearOrder()
  }

  return (
    <div className="app">
      <Header />

      <main>
        <Menu onAdd={addToOrder} />

        <OrderSummary items={order.items} total={order.total} onClear={clearOrder} />

        {receipt ? (
          <Receipt order={receipt} onDismiss={() => setReceipt(null)} />
        ) : (
          <DeliveryForm
            orderTotal={order.total}
            itemCount={order.items}
            onSubmit={placeOrder}
          />
        )}
      </main>

      <footer className="footer">Prices include VAT · Day 29</footer>
    </div>
  )
}
