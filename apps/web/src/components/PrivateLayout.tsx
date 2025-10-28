import React from 'react'
import Navigation from './Navigation'
import Topbar from './Topbar'

interface PrivateLayoutProps {
  children: React.ReactNode
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074')" }}>
      <Navigation />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default PrivateLayout