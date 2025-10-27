import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true
}) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // If route is for unauthenticated users (login/register) and user is authenticated
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute