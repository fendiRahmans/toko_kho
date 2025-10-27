import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Products from '../pages/Products'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProtectedRoute from '../components/ProtectedRoute'
import PublicLayout from '../components/PublicLayout'
import PrivateLayout from '../components/PrivateLayout'

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute requireAuth={false}>
            <PublicLayout>
              <Login />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute requireAuth={false}>
            <PublicLayout>
              <Register />
            </PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <Home />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <Products />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <PrivateLayout>
              <About />
            </PrivateLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes