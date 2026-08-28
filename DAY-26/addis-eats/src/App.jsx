import Dish from './components/Dish'
import Header from './components/Header'
import { dishes } from './data/menu'

export default function App() {
  return (
    <div className="app">
      <Header />

      <main>
        <h2 className="menu__heading">Menu</h2>
        <ul className="menu">
          {dishes.map((dish) => (
            <Dish
              key={dish.id}
              name={dish.name}
              price={dish.price}
              description={dish.description}
            />
          ))}
        </ul>
      </main>

      <footer className="footer">Prices include VAT · Day 26</footer>
    </div>
  )
}
