import AppRoutes from './routes'
import { AuthProvider } from './contexts/auth'
import { Toaster } from 'sonner'
import './App.css'
import { TooltipProvider } from './components/ui/tooltip'

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <AppRoutes />
        <Toaster position="bottom-right" />
      </TooltipProvider>
    </AuthProvider>
  )
}

export default App
