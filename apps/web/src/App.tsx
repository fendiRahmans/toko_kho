import { useLocation } from 'react-router-dom'
import AppRoutes from './routes'
import Navigation from './components/Navigation'
import { AuthProvider } from './contexts/auth'
import { Toaster } from 'sonner'
import './App.css'

function App() {
  const location = useLocation()

  // Don't show navigation on login page
  const showNavigation = location.pathname !== '/' && location.pathname !== '/register'

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {showNavigation && <Navigation />}

        {/* Routes */}
        <AppRoutes />
      </div>
      <Toaster position="bottom-right" />
    </AuthProvider>
  )
}

export default App
