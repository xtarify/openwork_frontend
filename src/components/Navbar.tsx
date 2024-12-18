// src/components/Navbar.tsx
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="logo">OpenWork</div>
        <nav className="menu">
          <Link to="/">Inicio</Link>
          <button className="secondary-btn login-btn" onClick={() => alert('Coming soon!')}>
            Login
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
