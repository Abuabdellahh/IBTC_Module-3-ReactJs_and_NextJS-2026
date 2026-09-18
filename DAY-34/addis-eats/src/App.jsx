import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Landing from './pages/Landing'
import MenuPage from './pages/MenuPage'
import SignIn from './pages/SignIn'
import NotFound from './pages/NotFound'

// Heavy screens are code-split: their JS is only fetched when the user
// navigates to them, keeping the initial bundle small.
const DishPage = lazy(() => import('./pages/DishPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))

function RouteSkeleton() {
  return <p className="menu-status">Loading…</p>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="menu" element={<MenuPage />} />

        <Route
          path="menu/:id"
          element={
            <Suspense fallback={<RouteSkeleton />}>
              <DishPage />
            </Suspense>
          }
        />

        <Route
          path="checkout"
          element={
            <RequireAuth>
              <Suspense fallback={<RouteSkeleton />}>
                <CheckoutPage />
              </Suspense>
            </RequireAuth>
          }
        />

        <Route path="signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
