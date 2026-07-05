'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">
        <Image
          src="/logo.png"
          alt="Kwazar Bowling Club"
          width={80}
          height={80}
          style={{objectFit: 'contain'}}
        />
      </a>

      {/* Hamburger button - only on mobile */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Navigation links */}
      <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <a href="/" onClick={() => setMenuOpen(false)}>Strona główna</a>
        <a href="/about" onClick={() => setMenuOpen(false)}>O nas</a>
        <a href="/reservations" onClick={() => setMenuOpen(false)}>Rezerwacje</a>
        <a href="/contact" onClick={() => setMenuOpen(false)}>Kontakt</a>
      </div>
    </nav>
  )
}