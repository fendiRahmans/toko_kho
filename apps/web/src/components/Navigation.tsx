import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import { Home, Package, Tag, Info, LogOut } from 'lucide-react'

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? 'block text-blue-600 bg-blue-50 py-2 px-3 rounded-md font-medium'
      : 'block text-gray-600 hover:text-gray-800 py-2'
  }

  return (
    <div className="w-64 backdrop-blur-md bg-white/10 border border-white/10 shadow-lg min-h-screen flex flex-col">
      <div className="p-4 flex flex-col flex-1">
        <Link to="/home" className="text-xl font-bold text-gray-800 block mb-8">
          Toko Kho
        </Link>
        <div className="space-y-4">
          <Link to="/home" className={getLinkClass('/home')}>
            <div className="flex items-center space-x-2">
              <Home size={18} />
              <span>Home</span>
            </div>
          </Link>
          <Link to="/products" className={getLinkClass('/products')}>
            <div className="flex items-center space-x-2">
              <Package size={18} />
              <span>Products</span>
            </div>
          </Link>
          <Link to="/categories" className={getLinkClass('/categories')}>
            <div className="flex items-center space-x-2">
              <Tag size={18} />
              <span>Categories</span>
            </div>
          </Link>
          <Link to="/about" className={getLinkClass('/about')}>
            <div className="flex items-center space-x-2">
              <Info size={18} />
              <span>About</span>
            </div>
          </Link>
        </div>
        <div className="mt-auto pt-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="block text-gray-600 hover:text-gray-800 py-2 w-full text-left"
            >
              <div className="flex items-center space-x-2">
                <LogOut size={18} />
                <span>Logout</span>
              </div>
            </button>
          ) : (
            <Link to="/" className={getLinkClass('/')}>
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navigation