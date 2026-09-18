import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Landing from './pages/Landing'
import MenuPage from './pages/MenuPage'
import DishPage from './pages/DishPage'
import CheckoutPage from './pages/CheckoutPage'
import SignIn from './pages/SignIn'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="menu/:id" element={<DishPage />} />
        <Route
          path="checkout"
          element={
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          }
        />
        <Route path="signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
