import AppRoutes from './routes'
import { AuthProvider } from './contexts/auth'
import { Toaster } from 'sonner'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="bottom-right" />
    </AuthProvider>
  )
}

export default App
