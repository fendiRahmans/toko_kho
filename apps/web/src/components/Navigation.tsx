import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/auth'

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/home" className="text-xl font-bold text-gray-800">
            Toko Kho
          </Link>
          <div className="space-x-4">
            <Link to="/home" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-800">
              Products
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-800">
              About
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            ) : (
              <Link to="/" className="text-gray-600 hover:text-gray-800">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation